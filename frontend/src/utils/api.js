const BASE_URL = import.meta.env.VITE_BASE_URL; // URL base do sistema

// Função para requisições sem token
export const apiRequest = async (method, endpoint, data = null, setIsLoading = null) => {
    try {
        if (setIsLoading && typeof setIsLoading === "function") setIsLoading(true); // Ativa o carregamento, se fornecido

        const options = {
            method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Request failed");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    } finally {
        if (setIsLoading && typeof setIsLoading === "function") setIsLoading(false); // Desativa o carregamento, se fornecido
    }
};

// Função para requisições autenticadas (com token)
export const apiRequestWithToken = async (method, endpoint, data = null, setIsLoading = null, isFormData = false) => {
    try {
        if (setIsLoading && typeof setIsLoading === "function") setIsLoading(true);

        const token = sessionStorage.getItem("token");
        const headers = {};
        headers["Accept"] = "application/json";
        
        if (token) headers["Authorization"] = `Bearer ${token}`;
        if (!isFormData) headers["Content-Type"] = "application/json";

        const options = {
            method,
            headers,
        };

        if (data) {
            options.body = isFormData ? data : JSON.stringify(data);
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Request failed");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    } finally {
        if (setIsLoading && typeof setIsLoading === "function") setIsLoading(false);
    }
};

/**
 * Função para buscar dados paginados com autenticação.
 * @param {string} endpoint - O endpoint da API (ex: "/users").
 * @param {number} offset - O deslocamento para os registros (padrão: 0).
 * @param {number} limit - O número de registros por solicitação (padrão: 10).
 * @param {function} setIsLoading - Função opcional para gerenciar estado de carregamento.
 * @param {object} filters - Filtros adicionais para a solicitação.
 * @returns {Promise} - Retorna os dados da API.
 */
export const fetchPaginatedData = async (endpoint, offset = 0, limit = 10, setIsLoading = null, filters = {}) => {
    try {
        if (setIsLoading && typeof setIsLoading === "function") setIsLoading(true);

        // Constrói os parâmetros da URL com os filtros
        const queryParams = new URLSearchParams({ offset, limit, ...filters }).toString();
        const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Request failed");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    } finally {
        if (setIsLoading && typeof setIsLoading === "function") setIsLoading(false);
    }
};

export const fetchAddressByCep = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      throw new Error("Erro ao buscar o CEP.");
    }
    const data = await response.json();
    if (data.erro) {
      throw new Error("CEP não encontrado.");
    }
    return data;
  } catch (error) {
    console.error("Erro ao buscar o endereço:", error);
    throw error;
  }
};