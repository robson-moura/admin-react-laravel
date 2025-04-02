import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/context/LoadingContext";
import { apiRequestWithToken } from "@/utils/api";
import styles from "@/assets/scss/UesrProfile.module.scss";

const UserProfile = () => {
    const navigate = useNavigate();
    const { setIsLoading } = useLoading(); // Obtém o setIsLoading do contexto

    const handleLogout = async () => {
        try {
            await apiRequestWithToken("POST", "/logout", null, setIsLoading); // Passa o setIsLoading
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Erro ao fazer logout:", error.message);
        }
    };

    return (
        <div className={styles.user_menu}>
            <Nav className="p-0 flex-column">
                <Nav.Link href="#" className={styles.menu}>
                    <i className="fa fa-user"></i>
                    <span>My Profile</span>
                </Nav.Link>
                <Nav.Link href="#" className={styles.menu}>
                    <i className="fa-solid fa-bell"></i>
                    <span>Notifications</span>
                    <span className={`${styles.count} bg-danger`}>13</span>
                </Nav.Link>
                <Nav.Link href="#" className={styles.menu}>
                    <i className="fa-solid fa-gear"></i>
                    <span>Settings</span>
                </Nav.Link>
                <Nav.Link
                    href="#"
                    className={styles.menu}
                    onClick={handleLogout} // Chama a função de logout
                >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Logout</span>
                </Nav.Link>
            </Nav>
        </div>
    );
};

export default UserProfile;

