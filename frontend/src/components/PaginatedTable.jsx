import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Card } from "react-bootstrap";
import { fetchPaginatedData } from "../utils/api";

const PaginatedTable = ({ endpoint }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10); // Número de registros por página
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(offset);
  }, [offset]);

  const fetchData = async (currentOffset) => {
    try {
      const response = await fetchPaginatedData(endpoint, currentOffset, limit, setLoading);
      setData(response.data); // Atualiza os registros da página atual
      setColumns(response.columns); // Define as colunas
      setTotal(response.total); // Total de registros
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
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
                    <th key={index}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>{item[col.field]}</td>
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