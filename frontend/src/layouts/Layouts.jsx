import { useState } from "react";
import styles from "@/assets/scss/Layouts.module.scss";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbars/Navbar";
import { useDashboardDataContext } from "../context/dashboardDataContext";
import {
    Logo,
    Menu,
    MenuItem,
    SearchBar,
    Sidebar,
    SidenavUser,
    SubMenu,
} from "../components/Sidebar/Sidebar";
import lightLogo from "../assets/image/light-logo.png";
import lightMini from "../assets/image/light-mini.png";
import userImg from "../assets/image/admin.jpg";
console.log(sessionStorage.getItem("user_photo"));
const userName = sessionStorage.getItem("user_name") || "Usuário";
const userPhoto = sessionStorage.getItem("user_photo") || "/default-avatar.png";

const Layouts = () => {
    const [selectSize, setSelectSize] = useState(null);
    const { sidebarMini } = useDashboardDataContext();
    return (
        <div className={styles.layout_wrapper}>
            <Sidebar>
                <Logo>
                    <Link to="/">
                        <img data-logo="mini-logo" src={lightMini} alt="logo" />
                        <img data-logo="logo" src={lightLogo} alt="logo" />
                    </Link>
                </Logo>
                <SearchBar />
                <Menu>
                    <MenuItem routeLink="/dashboard">
                        <i className="fa fa-dashboard" />
                        <span>Dashboard</span>
                    </MenuItem>
                    <MenuItem routeLink="/users">
                        <i className="fa fa-user" />
                        <span>Usuários</span>
                    </MenuItem>
                    <MenuItem routeLink="/clients">
                        <i className="fa fa-users" />
                        <span>Clientes</span>
                    </MenuItem>
                    <MenuItem routeLink="/appointments">
                        <i className="fa fa-stethoscope" /> {/* Ícone de atendimento */}
                        <span>Atendimentos</span>
                    </MenuItem>
                    <MenuItem routeLink="/appointments-calendar">
                        <i className="fa fa-calendar" /> {/* Ícone de calendário */}
                        <span>Agenda</span>
                    </MenuItem>
                    <MenuItem routeLink="/profiles">
                        <i className="fa fa-id-badge" />
                        <span>Perfis</span>
                    </MenuItem>
                </Menu>
                <SidenavUser
                    userImg={userPhoto}
                    userName={userName}
                />
            </Sidebar>
            <div
                className={`${styles.content} p-4`}
                style={{
                    width: `${
                        sidebarMini ? "calc(100% - 80px)" : "calc(100% - 280px)"
                    }`,
                }}
            >
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
};

export default Layouts;

