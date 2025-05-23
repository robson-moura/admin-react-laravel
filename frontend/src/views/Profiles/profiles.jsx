import React, { useState } from "react";
import { Form, Row, Col, Button, Container, Card } from "react-bootstrap";
import PaginatedTable from "../../components/PaginatedTable";
import { useNavigate } from "react-router-dom";
import "../../assets/scss/Forms.scss";
import { apiRequestWithToken } from "../../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "@/context/LoadingContext";

const ProfilesTable = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [filters, setFilters] = useState({});
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const handleFilter = () => {
    setFilters({
      name: nameFilter,
    });
  };

  const handleClearFilters = () => {
    setNameFilter("");
    setFilters({});
  };

  const handleNewProfile = () => {
    navigate("/profiles/new");
  };

  const handleEdit = (profile) => {
    navigate(`/profiles/edit/${profile.id}`);
  };

  const handleView = (profile) => {
    navigate(`/profiles/view/${profile.id}`);
  };

  const handleDelete = async (profile) => {
    if (window.confirm(`Tem certeza que deseja excluir o perfil ${profile.name}?`)) {
      try {
        await apiRequestWithToken(
          "DELETE",
          `/profiles/${profile.id}`,
          null,
          setIsLoading
        );
        toast.success("Perfil excluído com sucesso!");
        setFilters((prevFilters) => ({ ...prevFilters }));
      } catch (error) {
        toast.error("Erro ao excluir o perfil. Verifique sua conexão ou tente novamente.");
      }
    }
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col>
              <h1 className="mb-3 text-primary">Gerenciamento de Perfis</h1>
              <p className="text-muted">Gerencie os perfis cadastrados no sistema.</p>
            </Col>
            <Col className="text-end">
              <Button variant="success" size="sm" onClick={handleNewProfile}>
                + Novo Perfil
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0 mb-4 form-container">
            <Card.Body>
              <Row className="row-spacing">
                <Col md={6}>
                  <Form.Group controlId="nameFilter">
                    <Form.Label className="form-label">Filtrar por Perfil</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome do perfil"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
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
            endpoint="/profiles"
            filters={filters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            columns={[
              { label: "Perfil", field: "name" },
              { label: "Ativo", field: "active" },
            ]}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilesTable;