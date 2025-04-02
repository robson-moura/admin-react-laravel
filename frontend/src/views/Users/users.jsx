import React, { useState } from "react";
import { Form, Row, Col, Button, Container, Card } from "react-bootstrap";
import PaginatedTable from "../../components/PaginatedTable";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/Forms.scss"; // Importa o estilo do formulário

const UsersTable = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [filters, setFilters] = useState({});
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

  const handleDelete = (user) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      console.log("Usuário excluído:", user);
      // Aqui você pode chamar a API para excluir o usuário
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
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UsersTable;