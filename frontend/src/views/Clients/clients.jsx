import React, { useState } from "react";
import { Form, Row, Col, Button, Container, Card } from "react-bootstrap";
import PaginatedTable from "../../components/PaginatedTable";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/Forms.scss";
import { apiRequestWithToken } from "../../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "@/context/LoadingContext";

const ClientsTable = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [cpfFilter, setCpfFilter] = useState("");
  const [filters, setFilters] = useState({});
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const handleFilter = () => {
    setFilters({
      full_name: nameFilter,
      cpf: cpfFilter,
    });
  };

  const handleClearFilters = () => {
    setNameFilter("");
    setCpfFilter("");
    setFilters({});
  };

  const handleNewClient = () => {
    navigate("/clients/new");
  };

  const handleEdit = (client) => {
    navigate(`/clients/edit/${client.id}`);
  };

  const handleView = (client) => {
    navigate(`/clients/view/${client.id}`);
  };

  const handleDelete = async (client) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.full_name}?`)) {
      try {
        await apiRequestWithToken("DELETE", `/clients/${client.id}`, null, setIsLoading);
        toast.success("Cliente excluído com sucesso!");
        setFilters((prevFilters) => ({ ...prevFilters }));
      } catch (error) {
        console.error("Erro ao excluir o cliente:", error);
        toast.error("Erro ao excluir o cliente. Verifique sua conexão ou tente novamente.");
      }
    }
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="mb-3 text-primary">Gerenciamento de Clientes</h1>
              <p className="text-muted">Gerencie os clientes cadastrados no sistema.</p>
            </Col>
            <Col className="text-end">
              <Button variant="success" size="sm" onClick={handleNewClient}>
                + Novo Cliente
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
                  <Form.Group controlId="cpfFilter">
                    <Form.Label className="form-label">Filtrar por CPF</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o CPF"
                      value={cpfFilter}
                      onChange={(e) => setCpfFilter(e.target.value)}
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
            endpoint="/clients"
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

export default ClientsTable;