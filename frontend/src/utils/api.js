const BASE_URL = import.meta.env.VITE_BASE_URL; // URL base do sistema

// Função para requisições sem token
export const apiRequest = async (method, endpoint, data = null, setIsLoading = null) => {
    try {
        if (setIsLoading && typeof setIsLoading === "function") setIsLoading(true); // Ativa o carregamento, se fornecido

        const options = {
            method,
            headers: {
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
export const apiRequestWithToken = async (method, endpoint, data = null, setIsLoading = null) => {
    try {
        if (setIsLoading && typeof setIsLoading === "function") setIsLoading(true); // Ativa o carregamento, se fornecido

        const token = localStorage.getItem("token"); // Obtém o token do localStorage

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
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
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
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