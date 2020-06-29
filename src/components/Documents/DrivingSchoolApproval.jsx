import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";

class DrivingSchoolApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dsa: {}
        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "DrivingSchoolApproval/GetDrivingSchoolApprovalAsyncByPersonalInfoId",
            dataToFetch: this.props.id
        },
            (statusCode, response) => {
                if(response !== null){
                this.setState({ dsa: response });
                }
            });
    }

    render() {
        if (this.state.dsa !== null)
            return (
                <Grid fluid>
                    <Row>
                        <Col md={6} style={{ overflow: "auto" }}>

                            <FileDisplay file={this.state.dsa.approvalCertificationImagePath!==undefined?this.state.dsa.approvalCertificationImagePath:""} />
                            {this.state.dsa.approvalCertificationImagePath !== undefined?
                        <a href={this.state.dsa.approvalCertificationImagePath} target="_blank">View file in new Tab.</a>:""}
                        </Col>

                        <Col md={6}>
                            <b>{this.state.dsa.approvalCertificationImagePath===undefined?"No Added Yet":""}</b>
                            <br/>        
                            Approval Number: {this.state.dsa.approvalNumber}
                            <br />
                            approval Issuing Authority {this.state.dsa.approvalIssuingAuthority}
                            <br />
                            Date of Approval: {this.state.dsa.dateOfApproval}
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

            </Grid >);
    }
}

export default DrivingSchoolApproval;
