import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import { Grid, Row, Col, Table, Button } from "react-bootstrap";
import WebServicesManager from "WebServicesManager/WebServicesManager";
import $ from 'jquery';


class Dispute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disputeInfo: {},
            bInfo: {},
            sInfo: {},
            iInfo: {},
            status: "-1"
        };
    }
    WebServicesManager = new WebServicesManager();
    componentWillMount() {
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "Dispute/GetDispute",
            dataToFetch: this.props.id
        }, (s, r) => {
            this.setState({ disputeInfo: r[0] });
            this.WebServicesManager.getApiWithParamCall({
                endPoint: "Bookings/GetBookingById",
                dataToFetch: r[0].bookingId
            }, (s, rb) => { this.setState({ bInfo: rb }); console.log(rb) });

            this.WebServicesManager.getApiWithParamCall({
                endPoint: "personal/GetAllById",
                dataToFetch: r[0].studentID
            }, (s, rs) => { this.setState({ sInfo: rs }); });


            this.WebServicesManager.getApiWithParamCall({
                endPoint: "personal/GetAllById",
                dataToFetch: r[0].instructorID
            }, (s, ri) => { this.setState({ iInfo: ri }) });

        }
        );
    }
    handleStatusChange = e => {
       
        this.setState({ status: e.target.value });
       
    }
    submit = e => {
        if ( this.state.status === '-1')
            alert("Please Select status");
        else
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "Dispute/UpdateDisputeStatus",
            dataToFetch: this.props.id + "&status=" + this.state.status + "&cmt=" + $("#txtCmt").val()
        }, (s, r) => { this.props.toggle();});

    }
    render() {
        return (
            <div className="content">
                <a href="#" onClick={this.props.toggle}> <i className="fa fa-arrow-circle-left"></i>Back to list</a>
                <Grid fluid><Row>
                    <Col md={12}>
                        <Card
                            title="Take Action"
                            category=""
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                                <Grid>
                                    <Row>
                                        <Col md={10}>
                                            Change Status: <select className="form-control" onChange={this.handleStatusChange}>
                                                <option value="-1"></option>
                                                <option value="Open">Open </option>
                                                <option value="Closed">Closed </option>
                                                <option value="Student Suspended">Student Suspended </option>
                                                <option value="Intructor Suspended">Instructor Suspended </option>
                                            </select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={5}>
                                            Comments: <textarea className="form-control" rows="3" id="txtCmt"></textarea>
                                        </Col>
                                        <Col md={5}>
                                            <Button id="btnSubmit" onClick={this.submit} >Submit</Button>
                                        </Col>
                                    </Row>
                                </Grid>
                            }
                        />
                    </Col>
                </Row>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Dispute Details"
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Grid>
                                        <Row>
                                            <Col md={6}>
                                                Date: {this.state.disputeInfo.feedBackDate}
                                            </Col>
                                            <Col md={6}>
                                                Raised From: {this.state.disputeInfo.disputingFrom}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                Dispute : {this.state.disputeInfo.dispute}
                                            </Col>
                                            <Col md={6}>
                                                Comments : {this.state.disputeInfo.comment}
                                            </Col>
                                        </Row>
                                    </Grid>
                                }
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Booking Details"
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Grid>
                                        <Row>
                                            <Col md={6}>
                                                Date: {this.state.bInfo.bookingDate}
                                            </Col>
                                            <Col md={6}>
                                                Start Time: {this.state.bInfo.startTime}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                End Time : {this.state.bInfo.endTime}
                                            </Col>
                                        </Row>
                                    </Grid>
                                }
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} >
                            <Card
                                title="Student"
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                bg={this.state.disputeInfo.disputingFrom === "Student" ? "lightgreen" : "orange"}
                                content={
                                    <div className="content">
                                        <li className="fa fa-user" />{this.state.sInfo.firstName + " " + this.state.sInfo.surName}
                                        <hr />
                                        <li className="fa fa-envelope" />{this.state.sInfo.email}
                                        <hr />
                                        <li className="fa fa-phone" />{this.state.sInfo.phone}
                                        <hr />
                                        <li className="fa fa-building" />{this.state.sInfo.city} <span> {this.state.sInfo.zip}</span>
                                        <br />
                                        <li className="fa fa-map" />{this.state.sInfo.address}
                                    </div>
                                }
                            />
                        </Col>
                        <Col md={6}>

                            <Card
                                title="Instructor"
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                bg={this.state.disputeInfo.disputingFrom === "Student" ? "orange" : "lightgreen"}
                                content={
                                    <div className="content">
                                        <li className="fa fa-user" />{this.state.iInfo.firstName + " " + this.state.iInfo.surName}
                                        <hr />
                                        <li className="fa fa-envelope" />{this.state.iInfo.email}
                                        <hr />
                                        <li className="fa fa-phone" />{this.state.iInfo.phone}
                                        <hr />
                                        <li className="fa fa-building" />{this.state.iInfo.city} <span> {this.state.iInfo.zip}</span>
                                        <br />
                                        <li className="fa fa-map" />{this.state.iInfo.address}
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Dispute;