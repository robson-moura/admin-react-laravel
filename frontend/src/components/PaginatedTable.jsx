import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Card } from "react-bootstrap";
import { fetchPaginatedData } from "../utils/api";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Importa os ícones

const PaginatedTable = ({ endpoint, filters, onEdit, onDelete, onView}) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10); // Número de registros por página
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(offset);
  }, [offset, filters]);

  const fetchData = async (currentOffset) => {
    try {
      setLoading(true);
      const response = await fetchPaginatedData(endpoint, currentOffset, limit, setLoading, filters);
      setData(response.data); // Atualiza os registros da página atual
      setColumns([
        ...response.columns,
        {
          label: "Ações",
          field: "actions",
        },
      ]); // Adiciona a coluna de ações
      setTotal(response.total); // Total de registros
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (offset + limit < total) {
      setOffset(offset + limit);
    }
  };

  const handlePreviousPage = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  const getDisplayRange = () => {
    const start = offset + 1;
    const end = Math.min(offset + limit, total);
    return `${start}-${end}`;
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        {loading && data.length === 0 ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      className={col.field === "actions" ? "text-center" : ""} // Centraliza o label da coluna de ações
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={col.field === "actions" ? "text-end" : ""} // Alinha a coluna de ações à direita
                      >
                        {col.field === "actions" ? (
                          <div className="d-flex justify-content-end gap-2">
                          <FaEye
                            size={18}
                            style={{ cursor: "pointer", color: "#0d6efd" }} // Ícone de Visualizar
                            onClick={() => onView(item)}
                            title="Visualizar"
                          />
                          <FaEdit
                            size={18}
                            style={{ cursor: "pointer", color: "#ffc107" }} // Ícone de Editar
                            onClick={() => onEdit(item)}
                            title="Editar"
                          />
                          <FaTrash
                            size={18}
                            style={{ cursor: "pointer", color: "#dc3545" }} // Ícone de Excluir
                            onClick={() => onDelete(item)}
                            title="Excluir"
                          />
                        </div>
                        ) : (
                          item[col.field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span>
                  Exibindo {getDisplayRange()} de {total}
                </span>
              </div>
              <div>
                <Button
                  variant="secondary"
                  onClick={handlePreviousPage}
                  disabled={offset === 0}
                  className="me-2"
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleNextPage}
                  disabled={offset + limit >= total}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default PaginatedTable;