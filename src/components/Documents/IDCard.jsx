import React, { Component } from "react";
import FileDisplay from "components/Documents/FileDisplay.jsx";
import { Grid, Row, Col } from "react-bootstrap";

class DrivingLicense extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() { console.log(this.props.surName);}

    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col md={6}> 
                        <FileDisplay file={this.props.Type === "fic" ? this.props.frontIDPhoto : this.props.backIDPhoto} />
                        {this.props.Type !== undefined?
                        <a href={this.props.Type === "fic" ? this.props.frontIDPhoto : this.props.backIDPhoto} target="_blank">View file in new Tab.</a>:""}
                    </Col>

                    <Col md={6}>
                        <b>{this.props.Type===undefined?"No Added Yet":""}</b>
                        <br/>        
                        {this.props.firstName}<br />
                        Email: {this.props.gender}
                        <br />
                        Date of Birth: {this.props.dob}
                        <br />
                        City: {this.props.city}
                        <br />
                        Zip: {this.props.zip}
                        <br />
                        Address: {this.props.addres}
                        </Col>
                </Row>

            </Grid>

        );
    }
}

export default DrivingLicense;
