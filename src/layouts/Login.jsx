import React, { Component } from "react";
import { Grid, Row, Col, FormGroup, Button } from "react-bootstrap";
import { Form, ControlLabel, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/img/images/logo.png";
import "../assets/sass/custom.scss";
import WebServicesManager from "../WebServicesManager/WebServicesManager";
import Utilities from "../Utilities/Utilities";
import jwtDecode from "jwt-decode";
import { Base64 } from "js-base64";

export default class Login extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: "",
      password: "",
      data: "",
      emailError: "",
      notValidError: "",
      passwordError: "",
      isLoading: false,
      IsValid: false,
      passwordShow: true,
      typeChng: "password",

      ShowLoading: [
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>,
      ],
    };
  }

  // handler for all fields change
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {});
  };
  validationCheck(state) {
    if (Utilities.ValidateEmail(state.email)) {
      this.setState({ emailError: "" });
      if (Utilities.isValidString(state.password)) {
        this.setState({ passwordError: "", isLoading: true });
      } else {
        this.setState({ passwordError: "Password is Invaild" });
      }
    } else {
      this.setState({ emailError: "Email is Invaild" });
    }
  }
  LogIn = (e) => {
    this.validationCheck(this.state);
    e.preventDefault();
    const info = {
      Email: this.state.email,
      Password: this.state.password,
    };
    var dataToLogIn = JSON.stringify(info);
    this.WebServicesManager.LogIn(
      { endPoint: "Personal/AdminLogin", dataToLogIn: dataToLogIn },
      (statusCode, response) => {
        if (response.returnStatus === true) {
          this.functionData(response.data);
        } else if (response.returnStatus === false) {
          setTimeout(() => {
            this.setState({
              notValidError: "Your email or password wrong!",
              isLoading: false,
            });
          }, 4000);
        } else {
          setTimeout(() => {
            this.setState({
              notValidError: "Error from sever",
              isLoading: false,
            });
          }, 1000);
        }
      }
    );
  };
  componentWillMount() {
    // localStorage.setItem("userdata", "");
    localStorage.setItem("reload", "true");
  }
  functionData(response) {
    var decoded = jwtDecode(response);
    var userinfo = JSON.parse(Base64.decode(decoded.userData));
    localStorage.setItem("getRatings", "true");
    localStorage.setItem("userdata", response);
    localStorage.setItem("firstVisit", 0);
    this.props.history.push(`/admin/Dashboard/user/${userinfo.id}`);
  }
  passwordShow = () => {
    this.setState({ passwordShow: false, typeChng: "text" });
  };
  passwordHide = () => {
    this.setState({ passwordShow: true, typeChng: "password" });
  };

  render() {
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col md={6} sm={6} className="text-center p-4 full-height" xsHidden>
              <img src={logo} alt="" className="img-fluid mx-auto" />

              <p className="p-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
              <Link to={"/"}>
                <Button className="cbtn my-3" bsSize="large">
                  BACK TO WEBSITE
                </Button>
              </Link>

              <p className="my-5">
                Terms & Conditions <span className="px-2"> | </span>
                Privacy Policy <span className="px-2"> | </span> Cookies
              </p>
            </Col>
            <Col
              md={5}
              sm={5}
              className="bg-login p-login full-height"
              mdOffset={1}
              smOffset={1}
            >
              <h2 className="t-white">Admin Login</h2>
              <p className="t-white">
                Enter your email and password to login with Permispop
              </p>
              <Form className="login-form">
                <p className="helpingBlock">{this.state.emailError}</p>
                <div className="blink">
                  <p className="helpingBlockError">
                    {this.state.notValidError}
                  </p>
                </div>
                <FormGroup controlId="formEmail" className="inputWithIcon">
                  <ControlLabel className="t-white">Email</ControlLabel>
                  <FormControl
                    type="email"
                    className="c-in"
                    name="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                  />
                  <i className="fa fa-user fa-lg fa-fw" aria-hidden="true"></i>
                </FormGroup>
                <p className="helpingBlock">{this.state.passwordError}</p>
                <FormGroup controlId="formPassword" className="inputWithIcon">
                  <ControlLabel className="t-white">Password</ControlLabel>
                  <FormControl
                    type={this.state.typeChng}
                    className={"c-in"}
                    name="password"
                    onChange={this.handleChange}
                    value={this.password}
                  />
                  {this.state.passwordShow ? (
                    <i
                      className="fa fa-eye fa-lg eyeIcon"
                      aria-hidden="true"
                      onClick={this.passwordShow}
                    ></i>
                  ) : (
                    <i
                      className="fa fa-eye-slash fa-lg eyeIcon"
                      aria-hidden="true"
                      onClick={this.passwordHide}
                    ></i>
                  )}
                </FormGroup>
                {/* <FormGroup>
                  <Row>
                    <Col md={6} xs={6}>
                      <Checkbox className="t-white">Remember me</Checkbox>
                    </Col>
                    <Col md={6} xs={6} className="p-3 f-r">
                      <a href="" className="t-white">
                        Forget Password
                      </a>
                    </Col>
                  </Row>
                </FormGroup> */}
                <FormGroup>
                  <Row>
                    <Col md={6}>
                      <Button
                        type="submit"
                        block
                        className="login-btn"
                        onClick={this.LogIn}
                        disabled={this.state.isLoading}
                      >
                        {this.state.isLoading ? "Loading..." : "LOGIN"}
                      </Button>
                    </Col>
                    {/* <Col md={6}>
                      <Button
                        block
                        href="/register"
                        type="submit"
                        className="register-btn"
                      >
                        REGISTER NOW
                      </Button>
                    </Col> */}
                  </Row>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
