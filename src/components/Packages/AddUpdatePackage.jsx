import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";

class AddUpdatePackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pkName: "",
            pkDuration: "Monthly",
            pkRole: "Student",
            pkPrice: "",
            pkDesc1: "",
            pkDesc2: "",
            pkDesc3: "",
        };
    }

    WebServicesManager = new WebServicesManager();
    handleSave = e => {
        var tokn = localStorage.getItem('userdata');
        const pkg = {
            name: this.state.pkName,
            type: this.state.pkDuration,
            role: this.state.pkRole,
            price: this.state.pkPrice,
            desc1: this.state.pkDesc1,
            desc2: this.state.pkDesc2,
            desc3: this.state.pkDesc3,
        }
        this.WebServicesManager.postApiCall({
            endPoint: "Package",
            dataToInsert: JSON.stringify(pkg),
            token:tokn,
        }, () => {  this.props.toggle(); 
        });
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Package Details"
                                content={
                                    <form>

                                        <Button bsStyle="info" pullRight fill type="button" onClick={this.props.toggle}>
                                            Back to List
                    </Button>
                                        <div className="clearfix" />
                                        <div className="container-flex">
                                            <div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <FormGroup>
                                                            <ControlLabel>Name</ControlLabel>
                                                            <FormControl className="form-control" placeholder="Package Name" onChange={(e) => { this.setState({ pkName: e.target.value }); }} />
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <FormGroup>
                                                            <ControlLabel>Duration</ControlLabel>


                                                            <select className="form-control" onChange={(e) => { this.setState({ pkDuration: e.target.value }); }}>

                                                                <option value="Monthly">Monthly
                                                    </option>   <option value="Quarterly">Quarterly
                                                    </option>   <option value="Yearly">Yearly
                                                    </option>
                                                            </select>
                                                        </FormGroup>
                                                    </div>
                                                </div>



                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <FormGroup>
                                                            <ControlLabel>For</ControlLabel>
                                                            <select className="form-control" onChange={(e) => { this.setState({ pkRole: e.target.value }); }}>
                                                                <option>Student
                                                    </option>   <option>Instructor
                                                    </option>   <option>Driving School
                                                    </option>
                                                            </select>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <FormGroup>
                                                            <ControlLabel>Price</ControlLabel>
                                                            <FormControl className="form-control" placeholder="Package Price" onChange={(e) => { this.setState({ pkPrice: e.target.value }); }} />
                                                        </FormGroup>
                                                    </div>
                                                </div>


                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <FormGroup>
                                                            <ControlLabel>Description 1</ControlLabel>
                                                            <FormControl className="form-control" text={this.state.pkName} placeholder="Package Description 1" onChange={(e) => { this.setState({ pkDesc1: e.target.value }); }} />
                                                        </FormGroup>
                                                    </div>

                                                </div>


                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <FormGroup>
                                                            <ControlLabel>Description 2</ControlLabel>
                                                            <FormControl className="form-control" text={this.state.pkName} placeholder="Package Description 2" onChange={(e) => { this.setState({ pkDesc2: e.target.value }); }} />
                                                        </FormGroup>
                                                    </div>


                                                </div>




                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <FormGroup>
                                                            <ControlLabel>Description 3</ControlLabel>
                                                            <FormControl className="form-control" text={this.state.pkName} placeholder="Package Description 3" onChange={(e) => { this.setState({ pkDesc3: e.target.value }); }} />
                                                        </FormGroup>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <Button bsStyle="info" pullRight fill type="button" onClick={this.handleSave}>
                                            Save
                    </Button>
                                        <div className="clearfix" />
                                    </form>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default AddUpdatePackage;
