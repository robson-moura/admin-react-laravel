import React, { useState } from "react";
import { Form, Row, Col, Button, Container, Card } from "react-bootstrap";
import PaginatedTable from "../../components/PaginatedTable";
import { useNavigate } from "react-router-dom";

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

          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="nameFilter">
                    <Form.Label className="fw-bold text-dark">Filtrar por Nome</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                      className="shadow-sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="emailFilter">
                    <Form.Label className="fw-bold text-dark">Filtrar por E-mail</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o e-mail"
                      value={emailFilter}
                      onChange={(e) => setEmailFilter(e.target.value)}
                      className="shadow-sm"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="justify-content-end">
                <Col xs="auto">
                  <Button
                    variant="primary"
                    size="sm"
                    className="shadow-sm w-100"
                    onClick={handleFilter}
                  >
                    Filtrar
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="shadow-sm w-100"
                    onClick={handleClearFilters}
                  >
                    Limpar Filtros
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <PaginatedTable endpoint="/users" filters={filters} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UsersTable;