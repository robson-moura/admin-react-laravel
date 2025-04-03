import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import { apiRequestWithToken, fetchAddressByCep } from "../../utils/api"; // Importa a função de busca de CEP
import { isValidCPF } from "../../utils/functions";
import InputMask from "react-input-mask"; // Importa a biblioteca
import { useLoading } from "@/context/LoadingContext";

const UserForm = () => {
  const { id, mode } = useParams(); // Lê os parâmetros da URL
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    cpf: "",
    rg: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    address_street: "",
    address_number: "",
    address_complement: "",
    address_neighborhood: "",
    address_city: "",
    address_state: "",
    address_zip_code: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { setIsLoading } = useLoading(); // Obtém o setIsLoading do contexto

  useEffect(() => {
    if (mode === "view") {
      setIsViewMode(true);
      setIsEditMode(false);
      if (id) fetchUserData(id); // Carrega os dados do usuário para visualização
    } else if (mode === "edit") {
      setIsViewMode(false);
      setIsEditMode(true);
      if (id) fetchUserData(id); // Carrega os dados do usuário para edição
    } else {
      setIsViewMode(false);
      setIsEditMode(false);
    }
  }, [id, mode]);

  const fetchUserData = async (userId) => {
    try {
      const response = await apiRequestWithToken(
        "GET",
        `/users/${userId}`,
        null,
        setIsLoading
      );
      setUserData(response); // Atualiza os dados do usuário
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCepBlur = async () => {
    const cep = userData.address_zip_code.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cep.length !== 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address_zip_code: "CEP inválido.",
      }));
      return;
    }

    try {
      const addressData = await fetchAddressByCep(cep);
      setUserData((prevData) => ({
        ...prevData,
        address_street: addressData.logradouro || "",
        address_neighborhood: addressData.bairro || "",
        address_city: addressData.localidade || "",
        address_state: addressData.uf || "",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        address_zip_code: null, // Remove o erro de CEP
      }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address_zip_code: "Erro ao buscar o CEP.",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Remove a máscara do CPF antes de validar
    const cpf = (userData.cpf || "").replace(/[^\d]+/g, ""); // Remove caracteres não numéricos

    if (!userData.name) newErrors.name = "O campo Nome é obrigatório.";
    if (!userData.email) newErrors.email = "O campo E-mail é obrigatório.";
    if (!cpf) {
      newErrors.cpf = "O campo CPF é obrigatório.";
    } else if (!isValidCPF(cpf)) {
      newErrors.cpf = "O CPF informado é inválido.";
    }
    if (!userData.rg) newErrors.rg = "O campo RG é obrigatório.";
    if (!userData.birthDate)
      newErrors.birthDate = "O campo Data de Nascimento é obrigatório.";
    if (!userData.gender) newErrors.gender = "O campo Gênero é obrigatório.";
    if (!userData.maritalStatus)
      newErrors.maritalStatus = "O campo Estado Civil é obrigatório.";
    if (!userData.address_street)
      newErrors.address_street = "O campo Logradouro é obrigatório.";
    if (!userData.address_city)
      newErrors.address_city = "O campo Cidade é obrigatório.";
    if (!userData.address_state)
      newErrors.address_state = "O campo Estado é obrigatório.";
    if (!userData.phone) newErrors.phone = "O campo Telefone é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEditMode) {
        await apiRequestWithToken(
          "PUT",
          `/users/${id}`,
          userData,
          setIsLoading
        );
        alert("Usuário atualizado com sucesso!");
      } else {
        await apiRequestWithToken("POST", `/users`, userData, setIsLoading);
        alert("Usuário cadastrado com sucesso!");
        setUserData({
          name: "",
          email: "",
          cpf: "",
          rg: "",
          birthDate: "",
          gender: "",
          maritalStatus: "",
          address_street: "",
          address_number: "",
          address_complement: "",
          address_neighborhood: "",
          address_city: "",
          address_state: "",
          address_zip_code: "",
          phone: "",
        });
      }
      navigate("/users");
    } catch (error) {
      console.error("Erro ao salvar os dados do usuário:", error);
    }
  };

  const handleBack = () => {
    navigate("/users");
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h1 className="mb-4 text-primary">
            {isViewMode
              ? "Visualizar Usuário"
              : isEditMode
              ? "Editar Usuário"
              : "Cadastrar Usuário"}
          </h1>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    placeholder="Digite o nome"
                    disabled={isViewMode}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="Digite o e-mail"
                    disabled={isViewMode}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="cpf">
                  <Form.Label>CPF</Form.Label>
                  <InputMask
                    mask="999.999.999-99" // Máscara para CPF
                    value={userData.cpf}
                    onChange={(e) => handleInputChange(e)}
                    disabled={isViewMode}
                  >
                    {(inputProps) => (
                      <Form.Control
                        {...inputProps}
                        type="text"
                        name="cpf"
                        placeholder="Digite o CPF"
                        isInvalid={!!errors.cpf}
                      />
                    )}
                  </InputMask>
                  <Form.Control.Feedback type="invalid">
                    {errors.cpf}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="rg">
                  <Form.Label>RG</Form.Label>
                  <Form.Control
                    type="text"
                    name="rg"
                    value={userData.rg}
                    onChange={handleInputChange}
                    placeholder="Digite o RG"
                    disabled={isViewMode}
                    isInvalid={!!errors.rg}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rg}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="birthDate">
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={userData.birthDate}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.birthDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.birthDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="gender">
                  <Form.Label>Gênero</Form.Label>
                  <Form.Select
                    name="gender"
                    value={userData.gender}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.gender}
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="maritalStatus">
                  <Form.Label>Estado Civil</Form.Label>
                  <Form.Select
                    name="maritalStatus"
                    value={userData.maritalStatus}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    isInvalid={!!errors.maritalStatus}
                  >
                    <option value="">Selecione</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.maritalStatus}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="phone">
                  <Form.Label>Telefone</Form.Label>
                  <InputMask
                    mask="(99) 9999-99999" // Máscara para CPF
                    value={userData.phone}
                    onChange={(e) => handleInputChange(e)}
                    disabled={isViewMode}
                  >
                    {(inputProps) => (
                      <Form.Control
                        {...inputProps}
                        type="text"
                        name="phone"
                        placeholder="Digite o telefone"
                        isInvalid={!!errors.phone}
                      />
                    )}
                  </InputMask>
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="address_zip_code">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_zip_code"
                    value={userData.address_zip_code}
                    onChange={handleInputChange}
                    onBlur={handleCepBlur} // Chama a busca de CEP ao sair do campo
                    placeholder="Digite o CEP"
                    disabled={isViewMode}
                    isInvalid={!!errors.address_zip_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address_zip_code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="address_street">
                  <Form.Label>Logradouro</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_street"
                    value={userData.address_street}
                    onChange={handleInputChange}
                    placeholder="Digite o logradouro"
                    disabled={isViewMode}
                    isInvalid={!!errors.address_street}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address_street}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="address_number">
                  <Form.Label>Número</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_number"
                    value={userData.address_number}
                    onChange={handleInputChange}
                    placeholder="Digite o número"
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="address_complement">
                  <Form.Label>Complemento</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_complement"
                    value={userData.address_complement}
                    onChange={handleInputChange}
                    placeholder="Digite o complemento"
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="address_neighborhood">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_neighborhood"
                    value={userData.address_neighborhood}
                    onChange={handleInputChange}
                    placeholder="Digite o bairro"
                    disabled={isViewMode}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="address_city">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_city"
                    value={userData.address_city}
                    onChange={handleInputChange}
                    placeholder="Digite a cidade"
                    disabled={isViewMode}
                    isInvalid={!!errors.address_city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address_city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="address_state">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_state"
                    value={userData.address_state}
                    onChange={handleInputChange}
                    placeholder="Digite o estado"
                    disabled={isViewMode}
                    isInvalid={!!errors.address_state}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address_state}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-end row-spacing">
              <Col xs="auto">
                <Button
                  variant="outline-secondary"
                  size="sm"
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
                    size="sm"
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

export default UserForm;
