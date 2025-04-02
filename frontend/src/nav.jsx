export const navItem = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: "fa fa-dashboard",
    },
    {
        name: "Components",
        path: "/",
        icon: "fa fa-puzzle-piece",
        children: [
            {
                name: "Buttons",
                path: "/components/buttons",
                icon: "fa fa-puzzle-piece",
            },
            {
                name: "Badges",
                path: "/components/badges",
                icon: "fa fa-id-badge",
            },
            {
                name: "Social Buttons",
                path: "/components/socials",
                icon: "fa fa-share-square",
            },
            {
                name: "Cards",
                path: "/components/cards",
                icon: "fa fa-id-card",
            },
            {
                name: "Alerts",
                path: "/components/alerts",
                icon: "fa fa-exclamation-triangle",
            },
            {
                name: "Progress Bars",
                path: "/components/progressbars",
                icon: "fa fa-spinner",
            },
            {
                name: "Modals",
                path: "/components/modals",
                icon: "fa fa-fire",
            },
            {
                name: "Grids",
                path: "/components/grids",
                icon: "fa fa-th",
            },
            {
                name: "Typography",
                path: "/components/typography",
                icon: "fa fa-file-word",
            },
        ],
    },
    {
        name: "Tables",
        path: "/components/tables",
        icon: "fa fa-table",
    },
    {
        name: "Forms",
        path: "/components/forms",
        icon: "fa fa-pencil-square",
    },
    {
        name: "Widgets",
        path: "/components/widgets",
        icon: "fa fa-calculator",
    },
    {
        name: "Charts",
        path: "/components/charts",
        icon: "fa fa-pie-chart",
    },
    {
        name: "Maps",
        path: "/components/maps",
        icon: "fa-solid fa-location-dot",
    },
    {
        name: "Pages",
        path: "/",
        icon: "fa fa-paperclip",
        children: [
            {
                name: "Login",
                path: "/auth/login",
                icon: "fa fa-sign-in",
            },
            {
                name: "Register",
                path: "/auth/register",
                icon: "fa fa-sign-in",
            },
            {
                name: "Error 404",
                path: "/auth/Page404",
                icon: "fa fa-paper-plane",
            },
            {
                name: "Error 500",
                path: "/auth/Page500",
                icon: "fa fa-paper-plane",
            },
        ],
    },
    {
        name: "Docs",
        url: "https://demo.reactadmin.com/bootstrap/reacty/docs/",
        icon: "fa-solid fa-file-lines",
    },
    {
        name: "Purchase",
        url: "https://reactadmin.com/reacty",
        icon: "fa fa-shopping-cart",
    },
];

