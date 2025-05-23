import React, { useState, useRef } from "react";
import { Form, Row, Col, Button, Container, Card, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import InputMask from "react-input-mask";
import Webcam from "react-webcam";
import { apiRequestWithToken } from "../../utils/api";
import { toast } from "react-toastify";
import { useLoading } from "@/context/LoadingContext";

// Sessão: Estado Inicial
const initialAppointmentData = {
  client_id: "",
  user_id: "",
  date: "",
  time: "",
  procedure: "",
  notes: "",
  before_photo: "",
  after_photo: "",
  products_used: "",
  price: "",
  status: "completed",
};

const AppointmentsForm = ({ isEditMode = false, isViewMode = false }) => {
  // Sessão: States
  const [appointmentData, setAppointmentData] = useState(initialAppointmentData);
  const [errors, setErrors] = useState({});
  const [showWebcam, setShowWebcam] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [afterPhotoPreview, setAfterPhotoPreview] = useState("");
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const afterFileInputRef = useRef(null);
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const { id } = useParams();

  // Sessão: Dados de Selects
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  // Sessão: Carregamento de Dados
  React.useEffect(() => {
    // Carregar clientes
    apiRequestWithToken("GET", "/clients?limit=1000&status=active").then((res) => {
      setClients(res?.data || []);
    });
    // Carregar usuários (ajuste para acessar res.data)
    apiRequestWithToken("GET", "/users?limit=1000&status=active").then((res) => {
      setUsers(res?.data || []);
    });
    // Se for edição, carregar dados do atendimento
    if (isEditMode || isViewMode) {
      apiRequestWithToken("GET", `/appointments/${id}`).then((res) => {
        setAppointmentData({
          ...res,
          products_used: Array.isArray(res.products_used)
            ? res.products_used.join(", ")
            : res.products_used || "",
        });
        setPhotoPreview(res.before_photo || "");
        setAfterPhotoPreview(res.after_photo || "");
      });
    }
  }, [id, isEditMode, isViewMode]);

  // Sessão: Handlers de Formulário
  const handleInputChange = async (e) => {
    const { name, value, type } = e.target;

    // Se selecionar cliente, buscar foto inicial
    if (name === "client_id" && value) {
      try {
        setIsLoading(true);
        const res = await apiRequestWithToken("GET", `/clients/${value}`);
        // Supondo que a foto inicial esteja em res.before_photo ou res.photo
        const beforePhoto = res.before_photo || res.photo || "";
        setPhotoPreview(beforePhoto || "/default-avatar.png");
        setAppointmentData((prev) => ({
          ...prev,
          [name]: value,
          before_photo: beforePhoto,
        }));
      } catch {
        setPhotoPreview("/default-avatar.png");
        setAppointmentData((prev) => ({
          ...prev,
          [name]: value,
          before_photo: "",
        }));
      } finally {
        setIsLoading(false);
      }
    } else {
      setAppointmentData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? e.target.checked : value,
      }));
    }
  };

  const handlePhotoChange = (e, type = "before") => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "before") {
        setPhotoPreview(url);
      } else {
        setAfterPhotoPreview(url);
      }
      setAppointmentData((prev) => ({
        ...prev,
        [`${type}_photo`]: file,
      }));
    }
  };

  const handleCapturePhoto = (type = "before") => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${type}_photo.jpg`, { type: "image/jpeg" });
        if (type === "before") {
          setPhotoPreview(imageSrc);
        } else {
          setAfterPhotoPreview(imageSrc);
        }
        setAppointmentData((prev) => ({
          ...prev,
          [`${type}_photo`]: file,
        }));
        setShowWebcam(false);
      });
  };

  // Sessão: Validação
  const validateForm = () => {
    const newErrors = {};
    if (!appointmentData.client_id) newErrors.client_id = "Cliente obrigatório";
    if (!appointmentData.user_id) newErrors.user_id = "Profissional obrigatório";
    if (!appointmentData.date) newErrors.date = "Data obrigatória";
    if (!appointmentData.procedure) newErrors.procedure = "Procedimento obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sessão: Submit
  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);

      // products_used pode ser string separada por vírgula ou array
      let productsUsed = appointmentData.products_used;
      if (typeof productsUsed === "string" && productsUsed.trim() !== "") {
        try {
          productsUsed = JSON.stringify(
            productsUsed.split(",").map((p) => p.trim()).filter(Boolean)
          );
        } catch {
          productsUsed = "[]";
        }
      }

      const formData = new FormData();
      Object.entries(appointmentData).forEach(([key, value]) => {
        if (key === "products_used") {
          formData.append("products_used", productsUsed);
        } else if (
          (key === "before_photo" || key === "after_photo") &&
          value instanceof File
        ) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (isEditMode) {
        formData.append("_method", "PUT");
        await apiRequestWithToken(
          "POST",
          `/appointments/${id}`,
          formData,
          setIsLoading,
          true
        );
        toast.success("Atendimento atualizado com sucesso!");
      } else {
        await apiRequestWithToken(
          "POST",
          `/appointments`,
          formData,
          setIsLoading,
          true
        );
        toast.success("Atendimento cadastrado com sucesso!");
        setAppointmentData(initialAppointmentData);
        setPhotoPreview("");
        setAfterPhotoPreview("");
      }
      navigate("/appointments");
    } catch (error) {
      toast.error("Erro ao salvar os dados do atendimento.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sessão: Navegação
  const handleBack = () => navigate("/appointments");

  // Sessão: Renderização
  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          {/* Sessão: Título */}
          <h1 className="mb-4 text-primary">
            {isViewMode
              ? "Visualizar Atendimento"
              : isEditMode
              ? "Editar Atendimento"
              : "Cadastrar Atendimento"}
          </h1>
          <Form>
            {/* Sessão: Dados Principais */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="client_id">
                  <Form.Label>Cliente</Form.Label>
                  <Form.Select
                    name="client_id"
                    value={appointmentData.client_id}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.client_id}
                  >
                    <option value="">Selecione</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.client_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="user_id">
                  <Form.Label>Profissional</Form.Label>
                  <Form.Select
                    name="user_id"
                    value={appointmentData.user_id}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.user_id}
                  >
                    <option value="">Selecione</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.user_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="date">
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={appointmentData.date}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="time">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={appointmentData.time}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Sessão: Procedimento e Produtos */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="procedure">
                  <Form.Label>Procedimento</Form.Label>
                  <Form.Control
                    type="text"
                    name="procedure"
                    value={appointmentData.procedure}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.procedure}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.procedure}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="products_used">
                  <Form.Label>Produtos Utilizados</Form.Label>
                  <Form.Control
                    type="text"
                    name="products_used"
                    value={appointmentData.products_used}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    placeholder="Separe por vírgula"
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Sessão: Observações, Valor e Status */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="notes">
                  <Form.Label>Observações</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={appointmentData.notes}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="price">
                  <Form.Label>Valor Cobrado (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={appointmentData.price}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={appointmentData.status}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  >
                    <option value="scheduled">Agendado</option>
                    <option value="completed">Concluído</option>
                    <option value="canceled">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {/* Sessão: Fotos Antes e Depois */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="before_photo">
                  <Form.Label>Foto Antes</Form.Label>
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={photoPreview || "/default-avatar.png"}
                      alt="Antes"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        marginRight: 10,
                      }}
                    />
                    {!isViewMode && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={(e) => handlePhotoChange(e, "before")}
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => fileInputRef.current.click()}
                          className="me-2"
                        >
                          Selecionar Foto
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => setShowWebcam("before")}
                        >
                          Tirar com Câmera
                        </Button>
                      </>
                    )}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="after_photo">
                  <Form.Label>Foto Depois</Form.Label>
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={afterPhotoPreview || "/default-avatar.png"}
                      alt="Depois"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        marginRight: 10,
                      }}
                    />
                    {!isViewMode && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={afterFileInputRef}
                          onChange={(e) => handlePhotoChange(e, "after")}
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => afterFileInputRef.current.click()}
                          className="me-2"
                        >
                          Selecionar Foto
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => setShowWebcam("after")}
                        >
                          Tirar com Câmera
                        </Button>
                      </>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {/* Sessão: Botões */}
            <Row className="justify-content-end row-spacing">
              <Col xs="auto">
                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="form-button btn-outline-secondary"
                  onClick={handleBack}
                >
                  Voltar
                </Button>
              </Col>
              {!isViewMode && (
                <Col xs="auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="form-button btn-primary"
                    onClick={handleSave}
                  >
                    {isEditMode ? "Editar" : "Salvar"}
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Sessão: Modal Webcam */}
      <Modal show={!!showWebcam} onHide={() => setShowWebcam(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tirar Foto</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{
              facingMode: "user",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWebcam(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => handleCapturePhoto(showWebcam)}
          >
            Capturar Foto
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentsForm;