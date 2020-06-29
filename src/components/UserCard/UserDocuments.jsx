
import React, { Component } from "react";
import { Table, Modal,lg } from "react-bootstrap";
import 'font-awesome/css/font-awesome.min.css';
import ID from "components/Documents/ID.jsx";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";


class UserDocuments extends Component {
    WebServicesManager = new WebServicesManager();
    constructor(props) {
        super(props);
        this.state = {
            showId: false,
            idName: "",
            docTitle: "",
            fbStatus: false,
            profile: {},
            frontDoc: {},
            backDoc: {},
            drvLic: {},
            exeDoc: {},
            kbl: {},
            rc: {},
            greenCard: {},
            vImg: {},
            vReg: {},
            vIns: {},
            veh: {},
            dsa: {}
        };
    }
    componentDidMount() {
        this.getData();

    }
    getData = e => {
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "Document/GetUserDoc",
            dataToFetch: this.props.id
        },
            (statusCode, list) => {
                console.log("list",list);
                this.setState({
                    profile: list.find(o => o.documentName === "profile"),
                    frontDoc: list.find(o => o.documentName === "fic"),
                    backDoc: list.find(o => o.documentName === "bic"),
                    drvLic: list.find(o => o.documentName === "drvlic"),
                    exeDoc: list.find(o => o.documentName === "aoe"),
                    kbl: list.find(o => o.documentName === "kbl"),
                    rc: list.find(o => o.documentName === "rc"),
                    greenCard: list.find(o => o.documentName === "greenCard"),
                    vImg: list.find(o => o.documentName === "vImg"),
                    vReg: list.find(o => o.documentName === "vReg"),
                    veh: list.find(o => o.documentName === "veh"),
                    vIns: list.find(o => o.documentName === "vIns"),
                    dsa: list.find(o => o.documentName === "dsa")
                });
            });
    }
    render() {
        return (
            <div className="content">
                <Modal size="lg" show={this.state.showId} >
                    <Modal.Header closeButton onHide={() => this.setState({ showId: false })}>
                        <Modal.Title>{this.state.docTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ID Type={this.state.idName} {...this.props} status={this.state.fbStatus} retunfb={this.getData} />
                    </Modal.Body>
                </Modal>

                <Table striped hover>
                    <thead>
                        <tr><th>Document </th><th>Verification Status </th><th> </th>
                        </tr>
                    </thead>
                    {this.props.role.toLowerCase() === "instructor" ?
                        <tbody>
                            <tr>
                                <td>Front Id</td>
                                <td>{this.state.frontDoc === undefined ? "" : this.state.frontDoc.status === "" ? "" : this.state.frontDoc.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Front ID", idName: "fic", fbStatus: this.state.frontDoc === undefined ? false : this.state.frontDoc.status })}></i></td>
                            </tr>
                            <tr>
                                <td>Back Id</td>
                                <td>{this.state.backDoc === undefined ? "" : this.state.backDoc.status === "" ? "" : this.state.backDoc.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Back ID", idName: "bic", fbStatus: this.state.backDoc === undefined ? false : this.state.backDoc.status })}></i></td>
                            </tr>

                            <tr>
                                <td>Driving License</td>
                                <td>{this.state.drvLic === undefined ? "" : this.state.drvLic.status === "" ? "" : this.state.drvLic.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() =>  this.setState({ showId: true, docTitle: "Driving License", idName: "drvlic", fbStatus: this.state.drvLic === undefined ? false : this.state.drvLic.status })}></i></td>
                            </tr>
                            <tr>
                                <td>Authorization to Exercise</td>
                                <td>{this.state.exeDoc === undefined ? "" : this.state.exeDoc.status === "" ? "" : this.state.exeDoc.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Exe authority", idName: "aoe", fbStatus: this.state.exeDoc === undefined ? false : this.state.exeDoc.status })}></i></td>
                            </tr>
                            <tr>
                                <td>KBL</td>
                                <td>{this.state.kbl === undefined ? "" : this.state.kbl.status === "" ? "" : this.state.kbl.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "KBL", idName: "kbl", fbStatus: this.state.kbl === undefined ? false : this.state.kbl.status })}></i></td>
                            </tr>
                            {/*   <tr>
                                <td>RC Pro</td>
                                <td>{this.state.rc === undefined ? "" : this.state.rc.status === "" ? "" : this.state.rc.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "RC Pro", idName: "rc", fbStatus: this.state.rc === undefined ? false : this.state.rc.status })}></i></td>
                            </tr>
                            <tr>
                                <td>Green Card</td>
                                <td>{this.state.greenCard === undefined ? "" : this.state.greenCard.status === "" ? "" : this.state.greenCard.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Green Card", idName: "greenCard", fbStatus: this.state.greenCard === undefined ? false : this.state.greenCard.status })}></i></td>
                            </tr>*/}
                            <tr>
                                <td>Vehicle Image</td>
                                <td>{this.state.veh === undefined ? "" : this.state.veh.status === "" ? "" : this.state.veh.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Vehicle Image", idName: "veh", fbStatus: this.state.veh === undefined ? false : this.state.veh    .status })}></i></td>
                            </tr>
                            <tr>
                                <td>Vehicle Registratione</td>
                                <td>{this.state.vReg === undefined ? "" : this.state.vReg.status === "" ? "" : this.state.vReg.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Vehicle Registration", idName: "vReg", fbStatus: this.state.vReg === undefined ? false : this.state.vReg.status })}></i></td>
                            </tr>
                            <tr>
                                <td>Vehicle Insurance</td>
                                <td>{this.state.vIns === undefined ? "" : this.state.vIns.status === "" ? "" : this.state.vIns.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Vehicle Insurance", idName: "vIns", fbStatus: this.state.vReg === undefined ? false : this.state.vIns.status })}></i></td>
                            </tr>

                        </tbody>
                        : this.props.role.toLowerCase() === "student" ?
                        <tbody>
                            {/* //<tr>
                            //    <td>Profile</td>
                            //    <td>{this.state.profile === undefined ? "" : this.state.profile.status === "" ? "" : this.state.profile.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                            //    <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Profile Photo", idName: "profile", fbStatus: this.state.profile === undefined ? false : this.state.profile.status })}></i></td>
                            //</tr>-*/}
                            <tr>
                                <td>Front Id</td>
                                <td>{this.state.frontDoc === undefined ? "" : this.state.frontDoc.status === "" ? "" : this.state.frontDoc.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Front ID", idName: "fic", fbStatus: this.state.frontDoc === undefined ? false : this.state.frontDoc.status })}></i></td>
                            </tr>
                            <tr>  <td>Back Id</td>

                                <td>{this.state.backDoc === undefined ? "" : this.state.backDoc.status === "" ? "" : this.state.backDoc.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Back ID", idName: "bic", fbStatus: this.state.backDoc === undefined ? false : this.state.backDoc.status })}></i></td>
                            </tr>
                            </tbody> :
                        <tbody>
                            <tr>
                                <td>KBL</td>
                                <td>{this.state.kbl === undefined ? "" : this.state.kbl.status === "" ? "" : this.state.kbl.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "KBL", idName: "kbl", fbStatus: this.state.kbl === undefined ? false : this.state.kbl.status })}></i></td>
                            </tr>
                             <tr>
                                <td>RC Pro</td>
                                <td>{this.state.rc === undefined ? "" : this.state.rc.status === "" ? "" : this.state.rc.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "RC Pro", idName: "rc", fbStatus: this.state.rc === undefined ? false : this.state.rc.status })}></i></td>
                                </tr>
                                <tr>
                                    <td>Driving School Approval</td>
                                    <td>{this.state.dsa === undefined ? "" : this.state.dsa.status === "" ? "" : this.state.dsa.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                    <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Driving School Approval", idName: "dsa", fbStatus: this.state.dsa === undefined ? false : this.state.dsa.status })}></i></td>
                                </tr>

                        </tbody>
                    }
                </Table>
            </div>
        );
    }
}

export default UserDocuments;
