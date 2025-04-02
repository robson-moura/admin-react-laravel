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
                    <SubMenu
                        label="Components"
                        icon={<i className="fa fa-puzzle-piece" />}
                    >
                        <MenuItem routeLink="/components/buttons">
                            <i className="fa fa-puzzle-piece" />
                            <span>Buttons</span>
                        </MenuItem>
                        <MenuItem routeLink="/components/badges">
                            <i className="fa fa-id-badge" />
                            <span>Badges</span>
                        </MenuItem>
                        <MenuItem routeLink="/components/socials">
                            <i className="fa fa-share-square" />
                            <span>Social Buttons</span>
                        </MenuItem>
                        <MenuItem routeLink="/components/cards">
                            <i className="fa fa-id-card" />
                            <span>Cards</span>
                        </MenuItem>
                        <MenuItem routeLink="/components/alerts">
                            <i className="fa fa-exclamation-triangle" />
                            <span>Alerts</span>
                        </MenuItem>
                        <MenuItem routeLink="/components/progressbars">
                            <i className="fa fa-share-square" />
                            <span>Progress Bars</span>
                        </MenuItem>
                        <MenuItem routeLink="/components/modals">
                            <i className="fa fa-fire" />
                            <span>Modals</span>
                        </MenuItem>
                        <MenuItem routeLink="/components/grids">
                            <i className="fa fa-th" />
                            <span>Grids</span>
                        </MenuItem>
                        <MenuItem routeLink="/components/typography">
                            <i className="fa fa-file-word" />
                            <span>Typography</span>
                        </MenuItem>
                    </SubMenu>
                    <MenuItem routeLink="/tables">
                        <i className="fa fa-table" />
                        <span>Tables</span>
                    </MenuItem>
                    <MenuItem routeLink="/forms">
                        <i className="fa fa-pencil-square" />
                        <span>Forms</span>
                    </MenuItem>
                    <MenuItem routeLink="/widgets">
                        <i className="fa fa-calculator" />
                        <span>Widgets</span>
                    </MenuItem>
                    <MenuItem routeLink="/charts">
                        <i className="fa fa-pie-chart" />
                        <span>Charts</span>
                    </MenuItem>
                    <MenuItem routeLink="/maps">
                        <i className="fa-solid fa-location-dot" />
                        <span>Google Map</span>
                    </MenuItem>
                    <SubMenu
                        label="Pages"
                        icon={<i className="fa fa-paperclip" />}
                    >
                        <MenuItem routeLink="/login">
                            <i className="fa fa-sign-in" />
                            <span>Login</span>
                        </MenuItem>
                        <MenuItem routeLink="/register">
                            <i className="fa fa-sign-in" />
                            <span>Register</span>
                        </MenuItem>
                        <MenuItem routeLink="/page404">
                            <i className="fa fa-paper-plane" />
                            <span>Page 404</span>
                        </MenuItem>
                        <MenuItem routeLink="/page500">
                            <i className="fa fa-paper-plane" />
                            <span>Page 500</span>
                        </MenuItem>
                    </SubMenu>
                    <MenuItem hrefUrl="https://demo.reactadmin.com/bootstrap/adminx/docs/">
                        <i className="fa-solid fa-file-lines" />
                        <span>Docs</span>
                    </MenuItem>
                    <MenuItem hrefUrl="https://www.reactadmin.com/adminx">
                        <i className="fa fa-shopping-cart" />
                        <span>Purchase</span>
                    </MenuItem>
                </Menu>
                <SidenavUser
                    userImg={userImg}
                    userName="Olivia Rhye"
                    userEmail="olivia@reactadmin.com"
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

