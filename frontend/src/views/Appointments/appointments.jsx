import React, { useState } from "react";
import { Form, Row, Col, Button, Container, Card } from "react-bootstrap";
import PaginatedTable from "../../components/PaginatedTable";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/Forms.scss";
import { apiRequestWithToken } from "../../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "@/context/LoadingContext";

const AppointmentsTable = () => {
  const [clientFilter, setClientFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filters, setFilters] = useState({});
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const handleFilter = () => {
    setFilters({
      client_name: clientFilter,
      date: dateFilter,
      status: statusFilter,
    });
  };

  const handleClearFilters = () => {
    setClientFilter("");
    setDateFilter("");
    setStatusFilter("");
    setFilters({});
  };

  const handleNewAppointment = () => {
    navigate("/appointments/new");
  };

  const handleEdit = (appointment) => {
    navigate(`/appointments/edit/${appointment.id}`);
  };

  const handleView = (appointment) => {
    navigate(`/appointments/view/${appointment.id}`);
  };

  const handleDelete = async (appointment) => {
    if (window.confirm(`Tem certeza que deseja excluir este atendimento?`)) {
      try {
        await apiRequestWithToken("DELETE", `/appointments/${appointment.id}`, null, setIsLoading);
        toast.success("Atendimento excluído com sucesso!");
        setFilters((prevFilters) => ({ ...prevFilters }));
      } catch (error) {
        toast.error("Erro ao excluir o atendimento. Verifique sua conexão ou tente novamente.");
      }
    }
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="mb-3 text-primary">Gerenciamento de Atendimentos</h1>
              <p className="text-muted">Gerencie os atendimentos realizados no sistema.</p>
            </Col>
            <Col className="text-end">
              <Button variant="success" size="sm" onClick={handleNewAppointment}>
                + Novo Atendimento
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0 mb-4 form-container">
            <Card.Body>
              <Row className="row-spacing">
                <Col md={4}>
                  <Form.Group controlId="clientFilter">
                    <Form.Label className="form-label">Filtrar por Cliente</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome do cliente"
                      value={clientFilter}
                      onChange={(e) => setClientFilter(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="dateFilter">
                    <Form.Label className="form-label">Filtrar por Data</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="statusFilter">
                    <Form.Label className="form-label">Status</Form.Label>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="form-control"
                    >
                      <option value="">Todos</option>
                      <option value="scheduled">Agendado</option>
                      <option value="completed">Concluído</option>
                      <option value="canceled">Cancelado</option>
                    </Form.Select>
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
            endpoint="/appointments"
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

export default AppointmentsTable;