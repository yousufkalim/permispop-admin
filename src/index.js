import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/dashboard.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import AdminLayout from "layouts/Admin.jsx";
import Login from "layouts/Login.jsx";

var y = localStorage.getItem('userdata');
console.log("y is",y);

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Redirect exact from="/" to={(y!== null && y!=="")?"/admin/dashboard":"/login"} />
      <Route path="/login" render={props => <Login {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
