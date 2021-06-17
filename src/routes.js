import React from "react";
import Dashboard from "views/Dashboard.jsx";
import Packages from "views/Packages.jsx";
import Users from "views/Users.jsx";
import CloseBooking from "views/CloseBooking.jsx";
import Payments from "views/Payments.jsx";
import Disputes from "views/Disputes.jsx";
import UpdateRequest from "views/UpdateRequest";
import Limitaions from "views/Limitaions";
import UserRatings from "views/UserRatings";
import { Translation } from "react-i18next";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: <Translation>{(t) => t("Dashboard")}</Translation>,
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/Packages",
    name: <Translation>{(t) => t("Membership Packages")}</Translation>,
    icon: "pe-7s-key",
    component: Packages,
    layout: "/admin",
  },
  {
    path: "/users",
    name: <Translation>{(t) => t("Users")}</Translation>,
    icon: "pe-7s-users",
    component: Users,
    layout: "/admin",
  },
  // {
  //   path: "/userRating",
  //   name: <Translation>{(t) => t("User Rating")}</Translation>,
  //   icon: "pe-7s-star",
  //   component: UserRatings,
  //   layout: "/admin",
  // },
  {
    path: "/CloseBooking",
    name: <Translation>{(t) => t("Close Booking")}</Translation>,
    icon: "pe-7s-notebook",
    component: CloseBooking,
    layout: "/admin",
  },
  {
    path: "/payments",
    name: <Translation>{(t) => t("Payments")}</Translation>,
    icon: "pe-7s-cash",
    component: Payments,
    layout: "/admin",
  },
  {
    path: "/disputes",
    name: <Translation>{(t) => t("Disputes")}</Translation>,
    icon: "pe-7s-attention",
    component: Disputes,
    layout: "/admin",
  },
  {
    path: "/updateRequest",
    name: <Translation>{(t) => t("Update Requests")}</Translation>,
    icon: "pe-7s-edit",
    component: UpdateRequest,
    layout: "/admin",
  },
  {
    path: "/limitaions",
    name: <Translation>{(t) => t("User Limitations")}</Translation>,
    icon: "pe-7s-lock",
    component: Limitaions,
    layout: "/admin",
  },
];

export default dashboardRoutes;
