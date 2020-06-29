
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";

class DrivingLicense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dLic: {}
        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "DrivingLisence/GetDrivingLisenceByInstructor",
            dataToFetch: this.props.id
        },
            (statusCode, response) => {
                if(response !==null){
                this.setState({ dLic: response });
                }
                // console.log("DSDSDSDSDSDSDSDS");
                // console.log(response);
            });
    }

    render() {
        return (
             <Grid fluid>
                <Row>
                    <Col md={6}>
                        {/* {console.log("this.state.dLic.drivingLisenceImagePath",this.state.dLic.drivingLisenceImagePath)} */}
                        <FileDisplay file={this.state.dLic.drivingLisenceImagePath!==undefined?this.state.dLic.drivingLisenceImagePath:""} />
                        {this.state.dLic.drivingLisenceImagePath !== undefined?
                        <a href={this.state.dLic.drivingLisenceImagePath} target="_blank">View file in new Tab.</a>:""}
                    </Col>

                    <Col md={6}>
                        <b>{this.state.dLic.drivingLisenceImagePath===undefined?"No Added Yet":""}</b>
                        <br/>        
                        {this.props.firstName}<br />
                        License No: {this.state.dLic.lisenceNumber}
                        <br />
                        Obtaining Date: {this.state.dLic.obtainingDate}
                        <br />
                        Delivery Place: {this.state.dLic.deliveryPlace}
                        <br />
                        Validity Date: {this.state.dLic.validityDate}
                    </Col>
                </Row>

            </Grid>
        );
    }
}

export default DrivingLicense;
