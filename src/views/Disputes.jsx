
import React, { Component } from "react";
import Dispute from "components/Disputes/Dispute.jsx";
import { Card } from "components/Card/Card.jsx";
import { Grid, Row, Col, Table, Button, Modal } from "react-bootstrap";
import WebServicesManager from "WebServicesManager/WebServicesManager";


class Disputes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails: false,
            disputeId: "0",
            users: []
        };
    }   

    WebServicesManager = new WebServicesManager();
    componentWillMount() {
        this.WebServicesManager.getApiCall({
            endPoint: "Dispute/GetAllDisputesForAdmin"
        }, (s, r) => {
                if (r !== null)
                    this.setState({ users: r });
        }
        );
    }
    toggle = (id) => {
        this.setState({
            disputeId: id
        }, this.setState({ showDetails: !this.state.showDetails }));
    }
    render() {
        if (this.state.showDetails)
            return (<Dispute toggle={this.toggle} id={this.state.disputeId}></Dispute>);
        else
            return (<div className="content">


                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title=""
                                content={
                                    <Table>
                                        <thead>
                                            <tr>
                                                <td style={{ backgroundColor: 'grey', color: 'white' }} className="text-center">Disputes</td>
                                                <td style={{ backgroundColor: '#CA6F1E', color: 'white' }} className="text-center" colSpan="2" >Raised By</td>
                                                <td style={{ backgroundColor: '#27AE60', color: 'white' }} className="text-center" colSpan="2" >Raised against</td>
                                                <td style={{ backgroundColor: '#2874A6', color: 'white' }} className="text-center"></td>
                                                <td style={{ backgroundColor: '#E74C3C', color: 'white' }} className="text-center" colSpan="2" ></td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#ABB2B9', color: 'white' }} className="text-center">No.</td>
                                                <td style={{ backgroundColor: '#F5B041', color: 'white' }} className="text-center">Name</td>
                                                <td style={{ backgroundColor: '#F5B041', color: 'white' }} className="text-center" >Role</td>
                                                <td style={{ backgroundColor: '#7DCEA0', color: 'white' }} className="text-center">Name</td>
                                                <td style={{ backgroundColor: '#7DCEA0', color: 'white' }} className="text-center">Role</td>
                                                <td style={{ backgroundColor: '#5DADE2', color: 'white' }} className="text-center">Comments</td>
                                                <td style={{ backgroundColor: '#F1948A', color: 'white' }} className="text-center">status</td>
                                                <td style={{ backgroundColor: '#F1948A', color: 'white' }} className="text-center"></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.users.map((prop, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td style={{ backgroundColor: '#D5D8DC', color: 'white' }} className="text-right">{key + 1}</td>
                                                        <td style={{ backgroundColor: '#F8C471', color: 'white' }} className="text-center">{prop.disputingFrom.toLowerCase() === "student" ? prop.studentID : prop.instructorID}</td>
                                                       <td style={{ backgroundColor: '#F8C471', color: 'white' }} className="text-center">{prop.disputingFrom}</td>
                                                        <td style={{ backgroundColor: '#82E0AA', color: 'white' }} className="text-center">{prop.disputingFrom.toLowerCase() === "student" ? prop.instructorID : prop.studentID}</td>
                                                        <td style={{ backgroundColor: '#82E0AA', color: 'white' }} className="text-center">{prop.disputingFrom.toLowerCase() === "student" ?"Student":"Instructor"}</td>
                                                        <td style={{ backgroundColor: '#85C1E9', color: 'white' }} className="text-center">{prop.adminComments}</td>
                                                        <td style={{ backgroundColor: '#F2D7D5', color: 'white' }} className="text-center">{prop.status}</td>
                                                        <td style={{ backgroundColor: '#F2D7D5', color: 'white' }} className="text-center"><Button onClick={(e) => { this.toggle(prop.id); }}><li className="pe-7s-look   fa-2x" title="View More"></li></Button></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>);
    }
}

export default Disputes;
