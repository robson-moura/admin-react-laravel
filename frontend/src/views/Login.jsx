import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "@/utils/api"; // Importa a função utilitária
import "./Login.css"; // Importa o arquivo CSS

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpa erros anteriores
        setLoading(true); // Ativa o estado de carregamento

        try {
            const data = await apiRequest("POST", "/login", { email, password });

            console.log("Login successful:", data);
            console.log(data.user?.photo);
            // Salva token e dados do usuário na sessionStorage
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user_name", data.user?.name || "");
            sessionStorage.setItem("user_id", data.user?.id || "");
            sessionStorage.setItem("user_photo", data.user?.photo || "");

            navigate("/dashboard"); // Redireciona para o dashboard
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h3>Bem-vindo!</h3>
                    <p>Por favor, faça login na sua conta</p>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading} // Desabilita o campo enquanto carrega
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Senha
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading} // Desabilita o campo enquanto carrega
                        />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading} // Desabilita o botão enquanto carrega
                        >
                            {loading ? "Carregando..." : "Entrar"} {/* Mostra "Carregando..." enquanto carrega */}
                        </button>
                    </div>
                </form>     
            </div>
        </div>
    );
};

export default Login;