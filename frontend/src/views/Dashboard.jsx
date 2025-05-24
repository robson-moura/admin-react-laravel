import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, Table, Spinner, Alert } from "react-bootstrap";
import { apiRequestWithToken } from "../utils/api";
import { FaUser, FaUsers, FaStethoscope } from "react-icons/fa";

const TotalCard = ({ icon, label, value, color }) => (
  <Card className="shadow-sm border-0 text-center" style={{ background: "#f8f9fa" }}>
    <Card.Body>
      <div style={{ fontSize: 36, color: color, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 32, color: "#222" }}>{value}</div>
      <div style={{ color: "#555", fontSize: 16 }}>{label}</div>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [appointments, setAppointments] = useState([]);

  // Pegue o nome do usuário da sessionStorage
  const userName = sessionStorage.getItem("user_name") || "Usuário";

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiRequestWithToken("GET", "/users?limit=1"),
      apiRequestWithToken("GET", "/clients?limit=1"),
      apiRequestWithToken("GET", "/appointments?limit=10&status=scheduled"),
    ])
      .then(([usersRes, clientsRes, appointmentsRes]) => {
        setUsersCount(usersRes?.total || 0);
        setClientsCount(clientsRes?.total || 0);
        setAppointments(appointmentsRes?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container fluid className="p-0">
      <Row>
        <Col>
          <h2 className="mb-4" style={{ color: "#222", fontWeight: 700 }}>
            BEM VINDO, {userName}
          </h2>
        </Col>
      </Row>
      <Row className="gy-4 gx-4 mb-4">
        <Col sm={12} md={4}>
          <TotalCard
            icon={<FaUser size={36} />}
            label="Usuários cadastrados"
            value={usersCount}
            color="#5c6bc0"
          />
        </Col>
        <Col sm={12} md={4}>
          <TotalCard
            icon={<FaUsers size={36} />}
            label="Clientes cadastrados"
            value={clientsCount}
            color="#42a5f5"
          />
        </Col>
        <Col sm={12} md={4}>
          <TotalCard
            icon={<FaStethoscope size={36} />}
            label="Próximos Atendimentos"
            value={appointments.length}
            color="#ffa726"
          />
        </Col>
      </Row>

      <Row className="gy-4 gx-4">
        <Col sm={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h4 className="mb-4 text-primary">Próximos 10 Atendimentos</h4>
              {loading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : appointments.length === 0 ? (
                <Alert variant="info" className="text-center py-4 mb-0">
                  Nenhum atendimento agendado.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Profissional</th>
                        <th>Data</th>
                        <th>Hora</th>
                        <th>Procedimento</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a) => (
                        <tr key={a.id}>
                          <td>{a.client?.full_name}</td>
                          <td>{a.user?.nome || a.user?.name}</td>
                          <td>{a.date_br || (a.date && a.date.substring(0, 10))}</td>
                          <td>{a.time ? a.time.substring(0, 5) : ""}</td>
                          <td>{a.procedure}</td>
                          <td>
                            {a.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

