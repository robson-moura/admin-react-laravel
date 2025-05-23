import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Card, Row, Col, Modal } from "react-bootstrap";
import { apiRequestWithToken, fetchAddressByCep } from "../../utils/api";
import InputMask from "react-input-mask";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isValidCPF } from "../../utils/functions";
import Webcam from "react-webcam";
import PhotoCapture from "../../components/PhotoCapture";

const initialClientData = {
  full_name: "",
  birth_date: "",
  gender: "",
  marital_status: "",
  cpf: "",
  rg: "",
  profession: "",
  nationality: "",
  place_of_birth: "",
  phone: "",
  landline: "",
  email: "",
  whatsapp: "",
  zip_code: "",
  address: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  weight: "",
  height: "",
  chronic_diseases: "",
  allergies: "",
  medications: "",
  previous_surgeries: "",
  family_history: "",
  pregnant_or_breastfeeding: false,
  uses_birth_control: false,
  lifestyle: "",
  main_complaint: "",
  skin_type: "",
  hair_type: "",
  treatment_areas: "",
  aesthetic_goals: "",
  before_photo: null,
  notes: "",
  consent_to_treatment: false,
  accepts_promotions: false,
  status: "active",
};

const ClientsForm = () => {
  const { id, mode } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(initialClientData);
  const [errors, setErrors] = useState({});
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { setIsLoading } = useLoading();
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef();
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    if (mode === "view") {
      setIsViewMode(true);
      setIsEditMode(false);
      if (id) fetchClientData(id);
    } else if (mode === "edit") {
      setIsViewMode(false);
      setIsEditMode(true);
      if (id) fetchClientData(id);
    } else {
      setIsViewMode(false);
      setIsEditMode(false);
      setClientData(initialClientData);
    }
    // eslint-disable-next-line
  }, [id, mode]);

  useEffect(() => {
    if (clientData.before_photo instanceof File) {
      setPhotoPreview(URL.createObjectURL(clientData.before_photo));
    } else if (typeof clientData.before_photo === "string" && clientData.before_photo) {
      setPhotoPreview(clientData.before_photo);
    } else {
      setPhotoPreview(null);
    }
  }, [clientData.before_photo]);

  const fetchClientData = async (clientId) => {
    try {
      setIsLoading(true);
      const response = await apiRequestWithToken("GET", `/clients/${clientId}`);
      setClientData(response);
    } catch (error) {
      toast.error("Erro ao buscar os dados do cliente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClientData((prev) => ({ ...prev, before_photo: file }));
    }
  };

  const handleCapturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const arr = imageSrc.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], "webcam-photo.jpg", { type: mime });
      setClientData((prev) => ({ ...prev, before_photo: file }));
      setShowWebcam(false);
    }
  };

  const handleCepBlur = async () => {
    const cep = (clientData.zip_code || "").replace(/\D/g, "");
    if (cep.length !== 8) {
      setErrors((prev) => ({ ...prev, zip_code: "CEP inválido." }));
      return;
    }
    try {
      const addressData = await fetchAddressByCep(cep);
      setClientData((prev) => ({
        ...prev,
        address: addressData.logradouro || "",
        neighborhood: addressData.bairro || "",
        city: addressData.localidade || "",
        state: addressData.uf || "",
      }));
      setErrors((prev) => ({ ...prev, zip_code: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, zip_code: "Erro ao buscar o CEP." }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!clientData.full_name) newErrors.full_name = "O campo Nome Completo é obrigatório.";
    if (!clientData.cpf) {
      newErrors.cpf = "O campo CPF é obrigatório.";
    } else if (!isValidCPF(clientData.cpf)) {
      newErrors.cpf = "CPF inválido.";
    }
    if (!clientData.birth_date) newErrors.birth_date = "O campo Data de Nascimento é obrigatório.";
    if (!clientData.phone) newErrors.phone = "O campo Telefone é obrigatório.";
    if (!clientData.email) newErrors.email = "O campo E-mail é obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);

      // Converta os campos booleanos para "1" ou "0"
      const dataToSend = {
        ...clientData,
        pregnant_or_breastfeeding: clientData.pregnant_or_breastfeeding ? "1" : "0",
        uses_birth_control: clientData.uses_birth_control ? "1" : "0",
        consent_to_treatment: clientData.consent_to_treatment ? "1" : "0",
        accepts_promotions: clientData.accepts_promotions ? "1" : "0",
      };

      const formData = new FormData();
      Object.entries(dataToSend).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (isEditMode) {
        formData.append("_method", "PUT");
        await apiRequestWithToken(
          "POST",
          `/clients/${id}`,
          formData,
          setIsLoading,
          true
        );
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await apiRequestWithToken(
          "POST",
          `/clients`,
          formData,
          setIsLoading,
          true
        );
        toast.success("Cliente cadastrado com sucesso!");
        setClientData(initialClientData);
      }
      navigate("/clients");
    } catch (error) {
      toast.error("Erro ao salvar os dados do cliente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/clients");
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row>
            <Col>
              <h1 className="mb-4 text-primary">
                {isViewMode
                  ? "Visualizar Cliente"
                  : isEditMode
                  ? "Editar Cliente"
                  : "Cadastrar Cliente"}
              </h1>
            </Col>
            <Col xs="auto" className="d-flex flex-column align-items-end">
              <div style={{ width: 120, height: 120, marginBottom: 8, marginTop: 30 }}>
                <img
                  src={photoPreview || "/default-avatar.png"}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              {!isViewMode && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current.click()}
                    className="mb-2"
                  >
                    Selecionar Foto Inicial
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setShowWebcam(true)}
                  >
                    Tirar Foto com Câmera
                  </Button>
                </>
              )}
            </Col>
          </Row>

          <Modal show={showWebcam} onHide={() => setShowWebcam(false)} centered>
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
              <Button variant="primary" onClick={handleCapturePhoto}>
                Capturar Foto
              </Button>
            </Modal.Footer>
          </Modal>

          <Form>
            {/* Sessão: Dados Pessoais */}
            <h5 className="mt-4 mb-3 text-primary">Dados Pessoais</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="full_name">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={clientData.full_name}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.full_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.full_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="birth_date">
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control
                    type="date"
                    name="birth_date"
                    value={clientData.birth_date}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.birth_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.birth_date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="gender">
                  <Form.Label>Gênero</Form.Label>
                  <Form.Select
                    name="gender"
                    value={clientData.gender}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
               <Col md={3}>
                <Form.Group controlId="marital_status">
                  <Form.Label>Estado Civil</Form.Label>
                  <Form.Select
                    name="marital_status"
                    value={clientData.marital_status}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.marital_status}
                  >
                    <option value="">Selecione</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.marital_status}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="cpf">
                  <Form.Label>CPF</Form.Label>
                  <InputMask
                    mask="999.999.999-99"
                    value={clientData.cpf}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  >
                    {(inputProps) => (
                      <Form.Control
                        {...inputProps}
                        type="text"
                        name="cpf"
                        isInvalid={!!errors.cpf}
                      />
                    )}
                  </InputMask>
                  <Form.Control.Feedback type="invalid">
                    {errors.cpf}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="rg">
                  <Form.Label>RG</Form.Label>
                  <Form.Control
                    type="text"
                    name="rg"
                    value={clientData.rg}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="profession">
                  <Form.Label>Profissão</Form.Label>
                  <Form.Control
                    type="text"
                    name="profession"
                    value={clientData.profession}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="nationality">
                  <Form.Label>Nacionalidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="nationality"
                    value={clientData.nationality}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="place_of_birth">
                  <Form.Label>Naturalidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="place_of_birth"
                    value={clientData.place_of_birth}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Sessão: Contato */}
            <h5 className="mt-4 mb-3 text-primary">Contato</h5>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="phone">
                  <Form.Label>Telefone</Form.Label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={clientData.phone}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  >
                    {(inputProps) => (
                      <Form.Control
                        {...inputProps}
                        type="text"
                        name="phone"
                        isInvalid={!!errors.phone}
                      />
                    )}
                  </InputMask>
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="landline">
                  <Form.Label>Telefone Fixo</Form.Label>
                  <InputMask
                    mask="(99) 9999-9999"
                    value={clientData.landline}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  >
                    {(inputProps) => (
                      <Form.Control
                        {...inputProps}
                        type="text"
                        name="landline"
                      />
                    )}
                  </InputMask>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={clientData.email}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="whatsapp">
                  <Form.Label>WhatsApp</Form.Label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={clientData.whatsapp}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  >
                    {(inputProps) => (
                      <Form.Control
                        {...inputProps}
                        type="text"
                        name="whatsapp"
                      />
                    )}
                  </InputMask>
                </Form.Group>
              </Col>
            </Row>

            {/* Sessão: Endereço */}
            <h5 className="mt-4 mb-3 text-primary">Endereço</h5>
            <Row className="mb-3">
              <Col md={2}>
                <Form.Group controlId="zip_code">
                  <Form.Label>CEP</Form.Label>
                  <InputMask
                    mask="99999-999"
                    value={clientData.zip_code}
                    onChange={handleInputChange}
                    onBlur={handleCepBlur}
                    disabled={isViewMode}
                  >
                    {(inputProps) => (
                      <Form.Control
                        {...inputProps}
                        type="text"
                        name="zip_code"
                        isInvalid={!!errors.zip_code}
                      />
                    )}
                  </InputMask>
                  <Form.Control.Feedback type="invalid">
                    {errors.zip_code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="address">
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={clientData.address}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="number">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    name="number"
                    value={clientData.number}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="complement">
                  <Form.Label>Complemento</Form.Label>
                  <Form.Control
                    type="text"
                    name="complement"
                    value={clientData.complement}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="neighborhood">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control
                    type="text"
                    name="neighborhood"
                    value={clientData.neighborhood}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="city">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={clientData.city}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="state">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={clientData.state}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Sessão: Saúde e Hábitos */}
            <h5 className="mt-4 mb-3 text-primary">Saúde e Hábitos</h5>
            <Row className="mb-3">
              <Col md={2}>
                <Form.Group controlId="weight">
                  <Form.Label>Peso (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    value={clientData.weight}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="height">
                  <Form.Label>Altura (m)</Form.Label>
                  <Form.Control
                    type="number"
                    name="height"
                    value={clientData.height}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="chronic_diseases">
                  <Form.Label>Doenças Crônicas</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="chronic_diseases"
                    value={clientData.chronic_diseases}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="allergies">
                  <Form.Label>Alergias</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="allergies"
                    value={clientData.allergies}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="medications">
                  <Form.Label>Medicamentos Contínuos</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="medications"
                    value={clientData.medications}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="previous_surgeries">
                  <Form.Label>Cirurgias Anteriores</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="previous_surgeries"
                    value={clientData.previous_surgeries}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="family_history">
                  <Form.Label>Histórico Familiar</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="family_history"
                    value={clientData.family_history}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="pregnant_or_breastfeeding">
                  <Form.Check
                    type="checkbox"
                    name="pregnant_or_breastfeeding"
                    label="Grávida ou Amamentando"
                    checked={clientData.pregnant_or_breastfeeding}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="uses_birth_control">
                  <Form.Check
                    type="checkbox"
                    name="uses_birth_control"
                    label="Usa Anticoncepcional"
                    checked={clientData.uses_birth_control}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="lifestyle">
                  <Form.Label>Hábitos</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="lifestyle"
                    value={clientData.lifestyle}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Sessão: Estética e Tratamento */}
            <h5 className="mt-4 mb-3 text-primary">Estética e Tratamento</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="main_complaint">
                  <Form.Label>Queixa Principal</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="main_complaint"
                    value={clientData.main_complaint}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="skin_type">
                  <Form.Label>Tipo de Pele</Form.Label>
                  <Form.Control
                    type="text"
                    name="skin_type"
                    value={clientData.skin_type}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="hair_type">
                  <Form.Label>Tipo de Cabelo</Form.Label>
                  <Form.Control
                    type="text"
                    name="hair_type"
                    value={clientData.hair_type}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="treatment_areas">
                  <Form.Label>Áreas de Interesse para Tratamento</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="treatment_areas"
                    value={clientData.treatment_areas}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="aesthetic_goals">
                  <Form.Label>Objetivos Estéticos</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="aesthetic_goals"
                    value={clientData.aesthetic_goals}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Sessão: Documentos e Consentimento */}
            <h5 className="mt-4 mb-3 text-primary">Documentos e Consentimento</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="notes">
                  <Form.Label>Observações Gerais</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={clientData.notes}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="consent_to_treatment">
                  <Form.Check
                    type="checkbox"
                    name="consent_to_treatment"
                    label="Consentimento para Tratamento"
                    checked={clientData.consent_to_treatment}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="accepts_promotions">
                  <Form.Check
                    type="checkbox"
                    name="accepts_promotions"
                    label="Aceita receber promoções"
                    checked={clientData.accepts_promotions}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={clientData.status}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
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
    </Container>
  );
};

export default ClientsForm;