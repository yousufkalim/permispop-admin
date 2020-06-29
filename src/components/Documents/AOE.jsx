import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";

class AOE extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aoe: {}
        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "ExersiceAuthorization/GetExersiceAuthorityByUserId",
            dataToFetch: this.props.id
        },
            (statusCode, response) => {
                if(response !== null){
                this.setState({ aoe: response });
                }
            });
    }

    render() {
        return (
             <Grid fluid>
                <Row>
                    <Col md={6} style={{overflow:"auto"}}>

                        <FileDisplay file={this.state.aoe.authorizationImagePath} />
                        {this.state.aoe.authorizationImagePath !== undefined?
                        <a href={this.state.aoe.authorizationImagePath} target="_blank">View file in new Tab.</a>:""}
                    </Col>
                    <Col md={6}>
                        <b>{this.state.aoe.authorizationImagePath===undefined?"No Added Yet":""}</b>
                        <br/>        
                        Authorization Date: {this.state.aoe.authorizationDate}
                        <br />
                        Expiry Date: {this.state.aoe.expirationDate}
                        <br />
                        Issuing Authority: {this.state.aoe.issuingAuthority}
                    </Col>
                </Row>

            </Grid>
        );
    }
}

export default AOE;
