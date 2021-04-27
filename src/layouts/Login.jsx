import "../assets/sass/custom.scss";
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import logo from "../assets/img/images/logo.png";
import { Translation } from "react-i18next";
import WebServicesManager from "../WebServicesManager/WebServicesManager";
// import { ControlLabel, FormControl } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import Utilities from "../Utilities/Utilities";
import jwtDecode from "jwt-decode";
import { Base64 } from "js-base64";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const validateMessages = {
  types: {
    // eslint-disable-next-line
    email: "Votre ${name} n'est pas valide!",
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
  LogIn = (e) => {
    this.setState({ confirmLoading: true });
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
                  notValidError: (
                    <Translation>
                      {(t) => t("Your email or password is incorrect!")}
                    </Translation>
                  ),
                  // isLoading: false,
                  confirmLoading: false,
                });
                this.error();
              }, 4000);
            } else {
              setTimeout(() => {
                this.setState({
                  notValidError: (
                    <Translation>{(t) => t("Error from sever")}</Translation>
                  ),
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
  // componentWillMount() {
  //   localStorage.setItem("reload", "true");
  // }
  componentDidMount() {
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
      <Translation>
        {(t) => (
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
                        style={{
                          marginTop: "-10px",
                          marginLeft: "38px",
                          width: "80%",
                        }}
                        src={logo}
                        alt=""
                      />

                      <Form
                        onFinish={this.onFinish}
                        validateMessages={validateMessages}
                        name="login"
                        className="login-form"
                        initialValues={{ remember: true }}
                      >
                        <Form.Item
                          name="Email"
                          rules={[
                            {
                              type: "email",
                            },
                            {
                              required: true,
                              message: t("Please input a valid E-mail!"),
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
                              message: t("Please input your Password!"),
                            },
                          ]}
                        >
                          <Input.Password
                            style={{ borderRadius: "4px" }}
                            name="password"
                            type="password"
                            placeholder={t("Password")}
                            value={this.state.password}
                            onChange={this.handleChange}
                            allowClear
                            prefix={
                              <LockOutlined className="site-form-item-icon" />
                            }
                          />
                        </Form.Item>

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
                                  getFieldsValue("Password").password ===
                                    undefined
                                    ? {
                                        // borderColor: "#149e7a",
                                        // color: "lightgray",
                                        borderRadius: "4px",
                                      }
                                    : {
                                        background: "#149e7a",
                                        borderColor: "#149e7a",
                                        borderRadius: "4px",
                                      }
                                }
                                disabled={
                                  getFieldsError().filter(
                                    ({ errors }) => errors.length
                                  ).length > 0 ||
                                  getFieldsValue("Email").Email === undefined ||
                                  getFieldsValue("Password").password ===
                                    undefined
                                    ? true
                                    : false
                                }
                                onClick={this.LogIn}
                              >
                                {t("Log in")}
                              </Button>
                            </Form.Item>
                          )}
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
        )}
      </Translation>
    );
  }
}
