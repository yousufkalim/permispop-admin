
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";

class VehicleInsurance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vIns: {}
        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "VehicleDetail/GetVehicleDetailsByUserId",
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
                        {this.props.imgType === "reg" ?
                            <FileDisplay file={this.state.vIns.vehicleRegistrationCertificatePhotoImagePath!==undefined?this.state.vIns.vehicleRegistrationCertificatePhotoImagePath:""}/> :
                            <FileDisplay file={this.state.vIns.vehicleePhotosImagePath!==undefined?this.state.vIns.vehicleePhotosImagePath:""} />}
                        {this.props.imgType !== undefined?
                        <a href={this.props.imgType=== "reg"?this.state.vIns.vehicleRegistrationCertificatePhotoImagePath!==undefined?this.state.vIns.vehicleePhotosImagePath:"":this.state.vIns.vehicleePhotosImagePath!==undefined?this.state.vIns.vehicleePhotosImagePath:""} target="_blank">View file in new Tab.</a>:""}
                    </Col>

                    <Col md={6}>
                    <b>{this.props.imgType===undefined?"No Added Yet":""}</b>
                        <br/>        
                        Date Of First Registration {this.state.vIns.dateOfFirstRegistration}
                        <br />
                        Brand: {this.state.vIns.brand}
                        <br />
                        Color: {this.state.vIns.color}
                        <br />
                        Model: {this.state.vIns.model}
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
