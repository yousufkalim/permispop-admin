import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";

class MembershipSetting extends Component {

    constructor(props) {
        super(props);
        this.state = { packages: [] };
    }

    WebServicesManager = new WebServicesManager();

    componentDidMount() {
        var tokn = localStorage.getItem('userdata');
        this.WebServicesManager.getApiCall({
            endPoint: "package/GetStudentPackages",
            token:tokn,
        },
            (statusCode, pgkDetails) => {
                this.setState({ packages: pgkDetails });
                console.log(pgkDetails);
            });
    }
    render() {
        return (
            <div className="content">
                <Grid fluid>

                    <Row>
                        <Col md={12}>
                            <Card
                                title="Settings"
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Grid fluid>
                                    <Row>
                                        <Col md={6}>
                                            Role
                                        </Col>
                                        <Col md={6}>
                                            Membership Type
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            Student Membership
                                        </Col>
                                        <Col md={6}>
                                            Free<label className="switch">
                                                <input type="checkbox" checked/>
                                                    <span className="slider round"></span>
</label> Paid
                                        </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                Instructor Membership
                                        </Col>
                                            <Col md={6}>
                                                Free<label className="switch">
                                                    <input type="checkbox" />
                                                    <span className="slider round"></span>
                                                </label> Paid
                                        </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                Driving Membership
                                        </Col>
                                            <Col md={6}>
                                                Free<label className="switch">
                                                    <input type="checkbox" />
                                                    <span className="slider round"></span>
                                                </label> Paid
                                        </Col>
                                        </Row>
                                        </Grid>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default MembershipSetting;
