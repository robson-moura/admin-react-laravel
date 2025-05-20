import React, { useState } from "react";
import { Form, Row, Col, Button, Container, Card } from "react-bootstrap";
import PaginatedTable from "../../components/PaginatedTable";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/Forms.scss"; // Importa o estilo do formulário
import { apiRequestWithToken } from "../../utils/api"; // Importa a função de busca de CEP
import { toast } from "react-toastify"; // Importando o React-Toastify
import "react-toastify/dist/ReactToastify.css"; // Importando o CSS
import { useLoading } from "@/context/LoadingContext";

const UsersTable = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [filters, setFilters] = useState({});
  const { setIsLoading } = useLoading(); // Obtém o setIsLoading do contexto
  const navigate = useNavigate();

  const handleFilter = () => {
    setFilters({
      name: nameFilter,
      email: emailFilter,
    });
  };

  const handleClearFilters = () => {
    setNameFilter("");
    setEmailFilter("");
    setFilters({});
  };

  const handleNewUser = () => {
    navigate("/users/new"); // Navega para a tela de cadastro de usuário
  };

  const handleEdit = (user) => {
    navigate(`/users/edit/${user.id}`); // Navega para a página de edição
  };

  const handleView = (user) => {
    navigate(`/users/view/${user.id}`); // Navega para a página de visualização
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      try {
        const response = await apiRequestWithToken(
          "DELETE",
          `/users/${user.id}`,
          null,
          setIsLoading
        );
        toast.success("Usuário excluído com sucesso!");
        setFilters((prevFilters) => ({ ...prevFilters })); // Atualiza os filtros para recarregar a tabela
      } catch (error) {
        console.error("Erro ao excluir o usuário:", error);
        toast.error("Erro ao excluir o usuário. Verifique sua conexão ou tente novamente.");
      }
    }
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="mb-3 text-primary">Gerenciamento de Usuários</h1>
              <p className="text-muted">Gerencie os usuários cadastrados no sistema.</p>
            </Col>
            <Col className="text-end">
              <Button variant="success" size="sm" onClick={handleNewUser}>
                + Novo Usuário
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0 mb-4 form-container">
            <Card.Body>
              <Row className="row-spacing">
                <Col md={6}>
                  <Form.Group controlId="nameFilter">
                    <Form.Label className="form-label">Filtrar por Nome</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="emailFilter">
                    <Form.Label className="form-label">Filtrar por E-mail</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o e-mail"
                      value={emailFilter}
                      onChange={(e) => setEmailFilter(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="justify-content-end row-spacing">
                <Col xs="auto">
                  <Button
                    variant="primary"
                    size="sm"
                    className="form-button btn-primary"
                    onClick={handleFilter}
                  >
                    Filtrar
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="form-button btn-outline-secondary"
                    onClick={handleClearFilters}
                  >
                    Limpar Filtros
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <PaginatedTable
            endpoint="/users"
            filters={filters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UsersTable;