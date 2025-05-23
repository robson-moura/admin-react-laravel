import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { useNavigate } from "react-router-dom";
import { apiRequestWithToken } from "../../utils/api";
import { Card, Container, Button, Spinner } from "react-bootstrap";
import { useLoading } from "@/context/LoadingContext"; // Importe seu contexto de loading, ajuste o caminho se necessário

const AppointmentsCalendar = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading(); // Se usar contexto global

  // Carrega os atendimentos do backend
  useEffect(() => {
    setIsLoading && setIsLoading(true); // Se usar contexto global
    apiRequestWithToken("GET", "/appointments?limit=1000")
      .then((res) => {
        const data = res?.data || res || [];
        setEvents(
          data.map((item) => ({
            id: item.id,
            title:
              item.procedure +
              (item.client?.full_name ? ` - ${item.client.full_name}` : ""),
            start: item.calendar_date,
            end: item.calendar_date,
            extendedProps: item,
          }))
        );
      })
      .finally(() => {
        setIsLoading && setIsLoading(false); // Se usar contexto global
      });
  }, []);

  // Ao clicar em um evento, navega para visualizar ou editar
  const handleEventClick = (info) => {
    navigate(`/appointments/edit/${info.event.id}`);
  };

  // Ao clicar em um dia, navega para cadastrar novo atendimento já com a data
  const handleDateClick = (info) => {
    navigate(`/appointments/new?date=${info.dateStr}`);
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="mb-0 text-primary">Agenda de Atendimentos</h1>
            <Button
              variant="success"
              onClick={() => navigate("/appointments/new")}
            >
              + Novo Atendimento
            </Button>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            locales={[ptBrLocale]}
            locale="pt-br"
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="auto"
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AppointmentsCalendar;