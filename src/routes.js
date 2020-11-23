import Dashboard from "views/Dashboard.jsx";
import Packages from "views/Packages.jsx";
import Users from "views/Users.jsx";
import Payments from "views/Payments.jsx";
import Disputes from "views/Disputes.jsx";
import UpdateRequest from "views/UpdateRequest";
const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/Packages",
    name: "Membership Packages",
    icon: "pe-7s-key",
    component: Packages,
    layout: "/admin",
  },

  {
    path: "/users",
    name: "Users",
    icon: "pe-7s-users",
    component: Users,
    layout: "/admin",
  },
  {
    path: "/payments",
    name: "Payments",
    icon: "pe-7s-cash",
    component: Payments,
    layout: "/admin",
  },
  {
    path: "/disputes",
    name: "Disputes",
    icon: "pe-7s-attention",
    component: Disputes,
    layout: "/admin",
  },
  {
    path: "/updateRequest",
    name: "Update Requests",
    icon: "pe-7s-edit",
    component: UpdateRequest,
    layout: "/admin",
  },
];

export default dashboardRoutes;
