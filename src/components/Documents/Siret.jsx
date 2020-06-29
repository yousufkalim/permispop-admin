import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";

class Siret extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siret: {}
        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "Business/GetBusinessStoreByUserId",
            dataToFetch: this.props.id
        },
        (statusCode, response) => {
            // debugger;
            if(response !== null){
                this.setState({ siret: response });
            }
        });
    }

    render() {
        return (
             <Grid fluid>
                <Row>
                    <Col md={6}>
                        <FileDisplay file={(this.state.siret.siratImagePath!==undefined || this.state.siret.siratImagePath !== null)?this.state.siret.siratImagePath:""} />
                        {this.state.siret.siratImagePath !== undefined?
                        <a href={this.state.siret.siratImagePath} target="_blank">View file in new Tab.</a>:""}
                    </Col>
                    <Col md={6}>        
                    <b>{this.state.siret.siratImagePath===undefined?"No Added Yet":""}</b>
                        <br/>        
                        Siret Number: {this.state.siret.siretNumber}
                    </Col>
                </Row>

            </Grid>
        );
    }
}

export default Siret;
