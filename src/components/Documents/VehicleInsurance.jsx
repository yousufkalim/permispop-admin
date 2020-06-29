import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";

import FileDisplay from "components/Documents/FileDisplay.jsx";

class VehicleInsurance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vIns: {
            }
        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "VehicleInsurance/GetVehicleInsuranceByPersonalID",
            dataToFetch: this.props.id
        },
            (statusCode, response) => {
                if(response !== null){
                this.setState({ vIns: response });
                }
            });
    }

    render() {
        if (this.state.vIns !== null)

            return (<Grid fluid>
                <Row>
                    <Col md={6}>
                        <FileDisplay file={this.state.vIns.greenCardImagePath!==undefined?this.state.vIns.greenCardImagePath:""}/>
                        {this.state.vIns.greenCardImagePath !== undefined?
                        <a href={this.state.vIns.greenCardImagePath} target="_blank">View file in new Tab.</a>:""}
                    </Col>
                    <Col md={6}>
                        <b>{this.state.vIns.greenCardImagePath===undefined?"No Added Yet":""}</b>
                        <br/>        
                        Insurer {this.state.vIns.insurer}
                        <br />
                        Police Number: {this.state.vIns.policeNumber}
                        <br />
                        Start Date: {this.state.vIns.v}
                        <br />
                        End Date: {this.state.vIns.endDate}
                    </Col>
                </Row>

            </Grid>
            );
        else
            return (<Grid fluid>
                <Row>
                    <Col md={12}>
                        N/A
                    </Col>
                </Row>

            </Grid>);
    }
}

export default VehicleInsurance;
