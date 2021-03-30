import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
// import { ControlLabel, FormControl } from "react-bootstrap";
// import { Link } from "react-router-dom";
import logo from "../assets/img/images/logo.png";
import "../assets/sass/custom.scss";
import WebServicesManager from "../WebServicesManager/WebServicesManager";
import Utilities from "../Utilities/Utilities";
import jwtDecode from "jwt-decode";
import { Base64 } from "js-base64";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const validateMessages = {
  types: {
    email: "${name} is invalid!",
  },
};

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
      confirmLoading: false,
      passwordShow: true,
      typeChng: "password",
      ShowLoading: [
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>,
      ],
    };
  }
  error = () => {
    message.error(this.state.notValidError, 3);
  };
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
    this.setState({ confirmLoading: true });
    // this.validationCheck(this.state);
    // e.preventDefault();
    const info = {
      Email: this.state.email,
      Password: this.state.password,
    };
    if (this.state.email && this.state.password) {
      var dataToLogIn = JSON.stringify(info);
      this.WebServicesManager.LogIn(
        { endPoint: "Personal/AdminLogin", dataToLogIn: dataToLogIn },
        (statusCode, response) => {
          if (statusCode === 500 || response === undefined) {
            this.setState({
              confirmLoading: false,
            });
          } else {
            if (response.returnStatus === true) {
              this.functionData(response.data);
            } else if (response.returnStatus === false) {
              setTimeout(() => {
                this.setState({
                  notValidError: "Your email or password wrong!",
                  // isLoading: false,
                  confirmLoading: false,
                });
                this.error();
              }, 4000);
            } else {
              setTimeout(() => {
                this.setState({
                  notValidError: "Error from sever",
                  // isLoading: false,
                  confirmLoading: false,
                });
                this.error();
              }, 1000);
            }
          }
        }
      );
    }
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
            <Col className="bg-login p-login full-height">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <div className="login-back-envelope">
                  <img
                    style={
                      {
                        // marginBottom: "px",
                      }
                    }
                    src={logo}
                    alt=""
                  />

                  <h2 style={{ color: "#4b4d4b" }}>Admin Login</h2>
                  <p style={{ color: "#4b4d4b" }}>
                    Enter your email and password to login with Permispop
                  </p>

                  <Form
                    onFinish={this.onFinish}
                    validateMessages={validateMessages}
                    name="login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    // onFinish={onFinish}
                  >
                    <Form.Item
                      name="Email"
                      rules={[
                        {
                          type: "email",
                        },
                        {
                          required: true,
                          message: "Please input your E-mail!",
                        },
                      ]}
                    >
                      <Input
                        style={{ borderRadius: "4px" }}
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        allowClear
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="aabc@xyz.com"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Password!",
                        },
                      ]}
                    >
                      <Input.Password
                        style={{ borderRadius: "4px" }}
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        allowClear
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                      />
                    </Form.Item>
                    {/* <Form.Item>
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                      >
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                    </Form.Item> */}

                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldsError, getFieldsValue }) => (
                        <Form.Item>
                          <Button
                            type={"primary"}
                            htmlType="submit"
                            loading={this.state.confirmLoading}
                            className="login-form-button"
                            style={
                              getFieldsError().filter(
                                ({ errors }) => errors.length
                              ).length > 0 ||
                              getFieldsValue("Email").Email === undefined ||
                              getFieldsValue("Password").password === undefined
                                ? {
                                    borderColor: "#149e7a",
                                    color: "black",
                                    borderRadius: "4px",
                                  }
                                : {
                                    background: "#149e7a",
                                    borderColor: "#149e7a",
                                    borderRadius: "4px",
                                  }
                            }
                            onClick={this.LogIn}
                            disabled={
                              getFieldsError().filter(
                                ({ errors }) => errors.length
                              ).length > 0 ||
                              getFieldsValue("Email").Email === undefined ||
                              getFieldsValue("Password").password === undefined
                                ? true
                                : false
                            }
                          >
                            Log in{" "}
                          </Button>
                        </Form.Item>
                      )}
                    </Form.Item>
                  </Form>
                  {/* <Form className="login-form">
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
                        style={{ borderRadius: "4px" }}
                      />
                      <i
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "6px",
                        }}
                        className="fas fa-user"
                        aria-hidden="true"
                      ></i>
                    </FormGroup>
                    <p className="helpingBlock">{this.state.passwordError}</p>
                    <FormGroup
                      controlId="formPassword"
                      className="inputWithIcon"
                    >
                      <ControlLabel className="t-white">Password</ControlLabel>
                      <FormControl
                        type={this.state.typeChng}
                        className={"c-in"}
                        name="password"
                        onChange={this.handleChange}
                        value={this.password}
                        style={{ borderRadius: "4px" }}
                      />
                      {this.state.passwordShow ? (
                        <i
                          style={{
                            width: "20px",
                            height: "20px",
                            margin: "2px",
                          }}
                          className="fa fa-eye fa-lg eyeIcon"
                          aria-hidden="true"
                          onClick={this.passwordShow}
                        ></i>
                      ) : (
                        <i
                          className="fas fa-eye"
                          aria-hidden="true"
                          onClick={this.passwordHide}
                        ></i>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Row>
                        <Col md={6}>
                          <Button
                            type="submit"
                            block
                            className="login-btn"
                            onClick={this.LogIn}
                            disabled={this.state.isLoading}
                            style={{
                              borderRadius: "4px",
                              width: "412px",
                              opacity: 1,
                            }}
                          >
                            {this.state.isLoading ? "Loading..." : "LOGIN"}
                          </Button>
                        </Col>
                      </Row>
                    </FormGroup>
                  </Form> */}
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
