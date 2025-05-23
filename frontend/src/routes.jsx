import Dashboard from "./views/Dashboard";
import Buttons from "./views/Buttons";
import Badges from "./views/Badges";
import Tables from "./views/Tables";
import SocialButtons from "./views/SocialButtons";
import Cards from "./views/Cards";
import Alerts from "./views/Alerts";
import ProgressBars from "./views/ProgressBars";
import Modals from "./views/Modals";
import Grids from "./views/Grids";
import Typography from "./views/Typography";
import Forms from "./views/Forms";
import Widgets from "./views/Widgets";
import Charts from "./views/Charts";
import Maps from "./views/Maps";
import Login from "./views/Login";
import Register from "./views/Register";
import Page404 from "./views/Error404";
import Users from "./views/Users/users";
import UserForm from "./views/Users/userForm"; 
import Profiles from "./views/Profiles/profiles";
import ProfileForm from "./views/Profiles/profileForm";
import Clients from "./views/Clients/clients";
import ClientsForm from "./views/Clients/clientsForm";
import Appointments from "./views/Appointments/appointments";
import AppointmentsForm from "./views/Appointments/appointmentsForm";
import AppointmentsCalendar from "./views/Appointments/appointmentsCalendar";

const routes = [
    // Rotas Públicas (sem layout)
    { route: "/login", component: Login, private: false },
    { route: "/register", component: Register, private: false },
    { route: "*", component: Page404, private: false },

    // Rotas Protegidas (com layout)
    { path: "/", component: Dashboard, private: true },
    { path: "/dashboard", component: Dashboard, private: true },
    { path: "/components/buttons", component: Buttons, private: true },
    { path: "/components/badges", component: Badges, private: true },
    { path: "/components/socials", component: SocialButtons, private: true },
    { path: "/components/cards", component: Cards, private: true },
    { path: "/components/alerts", component: Alerts, private: true },
    { path: "/components/progressbars", component: ProgressBars, private: true },
    { path: "/components/modals", component: Modals, private: true },
    { path: "/components/grids", component: Grids, private: true },
    { path: "/components/typography", component: Typography, private: true },
    { path: "/tables", component: Tables, private: true },
    { path: "/forms", component: Forms, private: true },
    { path: "/widgets", component: Widgets, private: true },
    { path: "/charts", component: Charts, private: true },
    { path: "/maps", component: Maps, private: true },
    { path: "/users", component: Users, private: true },

    // Rotas para Cadastro, Edição e Visualização de Usuários
    { path: "/users/:mode", component: UserForm, private: true }, // Cadastro
    { path: "/users/:mode/:id", component: UserForm, private: true }, // Edição
    { path: "/users/:mode/:id", component: UserForm, private: true }, // Visualização

    // Rotas para Perfis
    { path: "/profiles", component: Profiles, private: true },
    { path: "/profiles/:mode", component: ProfileForm, private: true },
    { path: "/profiles/:mode/:id", component: ProfileForm, private: true },

    // Rotas para Clientes
    { path: "/clients", component: Clients, private: true },

    // Rotas para Cadastro, Edição e Visualização de Clientes
    { path: "/clients/:mode", component: ClientsForm, private: true }, // Cadastro
    { path: "/clients/:mode/:id", component: ClientsForm, private: true }, // Edição/Visualização

    // Rotas para Atendimentos
    { path: "/appointments", component: Appointments, private: true },
    { path: "/appointments/:mode", component: AppointmentsForm, private: true }, // Cadastro
    { path: "/appointments/:mode/:id", component: AppointmentsForm, private: true }, // Edição/Visualização
    { path: "/appointments-calendar", component: AppointmentsCalendar, private: true },
];

export default routes;