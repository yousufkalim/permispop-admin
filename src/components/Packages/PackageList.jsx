import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";

class PackageList extends Component {

    constructor(props) {
        super(props);
        this.state = { packages: [] };
    }

    WebServicesManager = new WebServicesManager();

    componentDidMount() {
        var tokn = localStorage.getItem('userdata');
        this.WebServicesManager.getApiCall({
            endPoint: "package/GetStudentPackages",
            token:tokn,
        },
            (statusCode, pgkDetails) => {
                this.setState({ packages: pgkDetails });
            });
    }
    render() {
        return (
            <div className="content">
                <Grid fluid>

                    <Row>
                        <Col md={12}>
                            <Card
                                title=""
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                {thArray.map((prop, key) => {
                                                    return <th key={key}>{prop}</th>;
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.packages.map((prop, key) => {
                                                return (<tr key={key}>
                                                    <td key={key}>{key+1}</td>
                                                    <td key={key}>{prop.name}</td>
                                                    <td key={key}>{prop.type}</td>
                                                    <td key={key}>{prop.price}</td>
                                                    <td key={key}>{prop.role}</td>
                                                </tr>);
                                            })}
                                        </tbody>
                                    </Table>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PackageList;
