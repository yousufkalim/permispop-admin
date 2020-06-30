
import Dashboard from "views/Dashboard.jsx";
import Packages from "views/Packages.jsx";
import Users from "views/Users.jsx";
import Payments from "views/Payments.jsx";
import Disputes from "views/Disputes.jsx";

const dashboardRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "pe-7s-graph",
        component: Dashboard,
        layout: "/admin"
    },
    {
        path: "/Packages",
        name: "Membership Packages",
        icon: "pe-7s-key",
        component: Packages,
        layout: "/admin"
    },
    
    {
        path: "/users",
        name: "Users",
        icon: "pe-7s-users",
        component: Users,
        layout: "/admin"
    },
    {
        path: "/payments",
        name: "Payments",
        icon: "pe-7s-cash",
        component: Payments,
        layout: "/admin"
    },
    {
        path: "/disputes",
        name: "Disputes",
        icon: "pe-7s-attention",
        component: Disputes,
        layout: "/admin"
    },
    //{
    //    path: "/user",
    //    name: "User Profile",
    //    icon: "pe-7s-user",
    //    component: UserProfile,
    //    layout: "/admin"
    //},
    //{
    //    path: "/table",
    //    name: "Table List",
    //    icon: "pe-7s-note2",
    //    component: TableList,
    //    layout: "/admin"
    //},
    //{
    //    path: "/typography",
    //    name: "Typography",
    //    icon: "pe-7s-news-paper",
    //    component: Typography,
    //    layout: "/admin"
    //},
    //{
    //    path: "/icons",
    //    name: "Icons",
    //    icon: "pe-7s-science",
    //    component: Icons,
    //    layout: "/admin"
    //},
    //{
    //    path: "/maps",
    //    name: "Maps",
    //    icon: "pe-7s-map-marker",
    //    component: Maps,
    //    layout: "/admin"
    //},
    //{
    //    path: "/notifications",
    //    name: "Notifications",
    //    icon: "pe-7s-bell",
    //    component: Notifications,
    //    layout: "/admin"
    //},
    //{
    //    upgrade: true,
    //    path: "/upgrade",
    //    name: "Upgrade to PRO",
    //    icon: "pe-7s-rocket",
    //    component: Upgrade,
    //    layout: "/admin"
    //}
];

export default dashboardRoutes;
