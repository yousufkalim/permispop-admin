
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
        var tokn = localStorage.getItem('userdata');
        this.WebServicesManager.getApiCall({
            endPoint: "Dispute/GetAllDisputesForAdmin",
            token:tokn,
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
                                    <div className="table-responsive">
                                        <Table bordered>
                                            <thead>
                                                <tr style = {{backgroundColor:"#149e7a",color:'#fff'}}>
                                                    <td className="text-center">Disputes</td>
                                                    <td className="text-center" colSpan="2" >Raised By</td>
                                                    <td className="text-center" colSpan="2" >Raised against</td>
                                                    <td className="text-center"></td>
                                                    <td className="text-center" colSpan="2" ></td>
                                                </tr>
                                                <tr style = {{backgroundColor:"#ffb733",color:'#fff'}}>
                                                    <td className="text-center">#</td>
                                                    <td className="text-center">Name</td>
                                                    <td className="text-center" >Role</td>
                                                    <td className="text-center">Name</td>
                                                    <td className="text-center">Role</td>
                                                    <td className="text-center">Comments</td>
                                                    <td className="text-center">status</td>
                                                    <td className="text-center">view details</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.users.map((prop, key) => {
                                                    console.log("props",prop);
                                                    return (
                                                        <tr key={key}>
                                                            {console.log("props are",prop)}
                                                            <td  className="text-center">{key + 1}</td>
                                                            <td className="text-center">{prop.disputingFrom.toLowerCase() === "student" ? prop.studentID : prop.instructorID}</td>
                                                            <td className="text-center">{prop.disputingFrom}</td>
                                                            <td className="text-center">{prop.disputingFrom.toLowerCase() === "student" ? prop.instructorID : prop.studentID}</td>
                                                            <td className="text-center">{prop.disputingFrom.toLowerCase() !== "student" ?"Student":"Instructor/DrivingSchool"}</td>
                                                            <td className="text-center">{prop.adminComments !== null && prop.adminComments !== "null"?prop.adminComments:"No Comment"}</td>
                                                            <td className="text-center">{prop.status !==null && prop.status !== "null"?prop.status:"Pending"}</td>
                                                            <td className="text-center"><Button disabled={prop.status==="close"?true:false} onClick={(e) => { this.toggle(prop.id); }}><li className="pe-7s-look fa-2x iconH" title="View More" style={{color:'#fff'}}></li></Button></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>);
    }
}

export default Disputes;
