import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!sessionStorage.getItem("token"); // Verifica se o token está no localStorage

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute; // Exportação padrão