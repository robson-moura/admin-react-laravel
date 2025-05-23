import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import { apiRequestWithToken } from "../../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "@/context/LoadingContext"; // Adicione este import

const initialProfileData = {
  name: "",
  description: "",
  active: true,
};

const ProfileForm = () => {
  const { id, mode } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(initialProfileData);
  const [errors, setErrors] = useState({});
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { setIsLoading } = useLoading(); // Adicione este hook

  useEffect(() => {
    if (mode === "view") {
      setIsViewMode(true);
      setIsEditMode(false);
      if (id) fetchProfileData(id);
    } else if (mode === "edit") {
      setIsViewMode(false);
      setIsEditMode(true);
      if (id) fetchProfileData(id);
    } else {
      setIsViewMode(false);
      setIsEditMode(false);
      setProfileData(initialProfileData);
    }
  }, [id, mode]);

  const fetchProfileData = async (profileId) => {
    try {
      setIsLoading(true);
      const response = await apiRequestWithToken(
        "GET",
        `/profiles/${profileId}`
      );
      setProfileData(response);
    } catch (error) {
      toast.error("Erro ao buscar os dados do perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]:
        name === "active"
          ? value === "true"
          : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profileData.name) newErrors.name = "O campo Perfil é obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      if (isEditMode) {
        await apiRequestWithToken(
          "PUT",
          `/profiles/${id}`,
          profileData
        );
        toast.success("Perfil atualizado com sucesso!");
      } else {
        await apiRequestWithToken(
          "POST",
          `/profiles`,
          profileData
        );
        toast.success("Perfil cadastrado com sucesso!");
        setProfileData(initialProfileData);
      }
      navigate("/profiles");
    } catch (error) {
      toast.error("Erro ao salvar os dados do perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/profiles");
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row>
            <Col>
              <h1 className="mb-4 text-primary">
                {isViewMode
                  ? "Visualizar Perfil"
                  : isEditMode
                  ? "Editar Perfil"
                  : "Cadastrar Perfil"}
              </h1>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Perfil</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    placeholder="Digite o nome do perfil"
                    disabled={isViewMode}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="active">
                  <Form.Label>Ativo</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Sim"
                      name="active"
                      type="radio"
                      value="true"
                      checked={profileData.active === true}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    />
                    <Form.Check
                      inline
                      label="Não"
                      name="active"
                      type="radio"
                      value="false"
                      checked={profileData.active === false}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="description">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={profileData.description}
                    onChange={handleInputChange}
                    placeholder="Digite a descrição do perfil"
                    disabled={isViewMode}
                  />
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

export default ProfileForm;