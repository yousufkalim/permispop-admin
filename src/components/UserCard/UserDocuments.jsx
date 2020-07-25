
import React, { Component } from "react";
import { Table, Modal,lg ,Button} from "react-bootstrap";
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
            veh1:{},
            veh2:{},
            veh3:{},
            dsa: {},
            profileData:"",
            vehicleInfo:"",

        };
    }
    componentWillMount() {
        var tokn = localStorage.getItem('userdata');
        this.WebServicesManager.getApiWithParamCall(
            {
                endPoint:"Profile/GetProfileByPersonalId",
                dataToFetch: this.props.id,
                token:tokn,
            },
            (statusCode,responseProfile)=>{
                var vehicle = "";
                console.log("response Profile",responseProfile);
                if(responseProfile.role === "Instructor"){
                    if(responseProfile.vehicleDetailInfoId !== ""){
                        vehicle = JSON.parse(responseProfile.vehicleDetailInfoId);
                    }
                }else{
                    if(responseProfile.drivingSchoolVehiclesInfoId !== ""){
                        vehicle = JSON.parse(responseProfile.drivingSchoolVehiclesInfoId);
                    }   
                }
                this.setState({profileData:responseProfile,vehicleInfo:vehicle},()=>{
                    console.log("update per",this.state);
                });
            }
        )
    }
    componentDidMount() {
        this.getData();

    }
    getData = e => {
        var tokn = localStorage.getItem('userdata');
        console.log("this.props.id",this.props.id)
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "Document/GetUserDoc",
            dataToFetch: this.props.id,
            token:tokn,
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
                    veh1:list.find(o => o.documentName === "veh1"),
                    veh2:list.find(o => o.documentName === "veh2"),
                    veh3:list.find(o => o.documentName === "veh3"),
                    vIns: list.find(o => o.documentName === "vIns"),
                    dsa: list.find(o => o.documentName === "dsa")
                },()=>{console.log("this.state",this.state)});
            });
    }

    maildata = m =>{
        var tokn = localStorage.getItem('userdata');
        var notVerfiedDoc = ""
        const listToMatch = {
            fic:"Front Id Card",
            bic:"Back Id Card",
            drvlic:"Driving Licence",
            aoe:"Authorizatio of Exercise",
            kbl:"kbls",
            veh:"Vehicle Image",
            vreg:"Vehicle Registration",
            vins:"Vehicle Insurance",
            rc:"Rcpro",
        }

        const listAllDocument = {
            fic:"Front Id Card",
            bic:"Back Id Card",
            drvlic:"Driving Licence",
            aoe:"Authorizatio of Exercise",
            kbl:"kbls",
            veh:"Vehicle Image",
            vreg:"Vehicle Registration",
            vins:"Vehicle Insurance",
            rc:"Rcpro",
            greenCard:"Green Card",
            vImg:"Vehicle Image",
            dsa:"dsa"
        }

        this.WebServicesManager.getApiWithParamCall({
            endPoint: "Document/GetUserDoc",
            dataToFetch: this.props.id,
            token:tokn,
        },
        (statusCode, Response) => {
            console.log("Result",Response);
            for(var i=0;i<Response.length;i++){     
                if (Response[i].status === "false") {
                    notVerfiedDoc = `${notVerfiedDoc}**${listToMatch[Response[i].documentName]}`;
                }
            }    
            this.WebServicesManager.getApiWithParamCall({
            endPoint:"Personal/EmailDocuments",
            dataToFetch:`${this.props.id}&email=${this.props.email}&doc=${notVerfiedDoc}`,
            token:tokn,
            },(statusCode,responseEmail)=>{
            console.log("email");
            alert("mail sent successfully");
            })  
        });
    }

    renderVehicle = () =>{
        if(this.state.vehicleInfo!==""){
            Object.entries(this.state.vehicleInfo).forEach((key,value)=>{
                console.log("key,value",key,value);
                if(value !== null){
                    return (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{this.state.veh === undefined ? "" : this.state.veh.status === "" ? "" : this.state.veh.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                            <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: {key}, idName: "veh", fbStatus: this.state.veh === undefined ? false : this.state.veh.status })}></i></td>
                        </tr>
                    )
                }
            })
        }
    }
    render() {
        const {vehicleInfo} = this.state;
        return (
            <div className="content">
                <Modal size="lg" show={this.state.showId} >
                    <Modal.Header closeButton onHide={() => this.setState({ showId: false })}>
                        <Modal.Title>{this.state.docTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ID Type={this.state.idName} {...this.props} {...this.state.profileData} vehicleInfo={this.state.vehicleInfo} status={this.state.fbStatus} retunfb={this.getData} />
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
                            <tr>
                                <td>RC Pro</td>
                                <td>{this.state.rc === undefined ? "" : this.state.rc.status === "" ? "" : this.state.rc.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "RC Pro", idName: "rc", fbStatus: this.state.rc === undefined ? false : this.state.rc.status })}></i></td>
                            </tr>
                            <tr>
                                <td>Green Card</td>
                                <td>{this.state.greenCard === undefined ? "" : this.state.greenCard.status === "" ? "" : this.state.greenCard.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Green Card", idName: "greenCard", fbStatus: this.state.greenCard === undefined ? false : this.state.greenCard.status })}></i></td>
                            </tr>
                            {vehicleInfo!=="" && vehicleInfo.Vehicle1 !== null && vehicleInfo.Vehicle1 !== undefined?
                                <tr>
                                    <td>Vehicle1 Detail</td>
                                    <td>{this.state.veh1 === undefined ? "" : this.state.veh1.status === "" ? "" : this.state.veh1.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                    <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Vehicle1 detail", idName: "veh1", fbStatus: this.state.veh1 === undefined ? false : this.state.veh1.status === undefined?false:this.state.veh1.status })}></i></td>
                                </tr>:""
                            }
                            {vehicleInfo!=="" && vehicleInfo.Vehicle2 !== null && vehicleInfo.Vehicle2 !== undefined?
                                <tr>
                                    <td>Vehicle2 Detail</td>
                                    <td>{this.state.veh2 === undefined ? "" : this.state.veh2.status === "" ? "" : this.state.veh2.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                    <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Vehicl2 detail", idName: "veh2", fbStatus: this.state.veh2 === undefined ? false : this.state.veh2.status === undefined?false:this.state.veh2.status })}></i></td>
                                </tr>:""
                            }
                            {vehicleInfo!=="" && vehicleInfo.Vehicle3 !== null && vehicleInfo.Vehicle3 !== undefined?
                                <tr>
                                    <td>Vehicle3 Detail</td>
                                    <td>{this.state.veh3 === undefined ? "" : this.state.veh3.status === "" ? "" : this.state.veh3.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                    <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Vehilce3 detail", idName: "veh3", fbStatus: this.state.veh3 === undefined ? false : this.state.veh3.status === undefined?false:this.state.veh3.status })}></i></td>
                                </tr>:""
                            }

                        </tbody>
                        :this.props.role.toLowerCase() === "dsinstructor" ?
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
                                <td>KBL DS</td>
                                <td>{this.state.kbl === undefined ? "" : this.state.kbl.status === "" ? "" : this.state.kbl.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "KBL", idName: "kbl", fbStatus: this.state.kbl === undefined ? false : this.state.kbl.status })}></i></td>
                            </tr>
                        </tbody>: 
                        this.props.role.toLowerCase() === "student" ?
                        <tbody>
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
                                <td>Driving School Approval</td>
                                <td>{this.state.dsa === undefined ? "" : this.state.dsa.status === "" ? "" : this.state.dsa.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Driving School Approval", idName: "dsa", fbStatus: this.state.dsa === undefined ? false : this.state.dsa.status })}></i></td>
                            </tr>
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

                            {vehicleInfo!=="" && vehicleInfo.Vehicle1 !== null && vehicleInfo.Vehicle1 !== undefined?
                                <tr>
                                    <td>Vehicle1 Detail</td>
                                    <td>{this.state.veh1 === undefined ? "" : this.state.veh1.status === "" ? "" : this.state.veh1.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                    <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Vehicle1 detail", idName: "veh1", fbStatus: this.state.veh1 === undefined ? false : this.state.veh1.status === undefined?false:this.state.veh1.status })}></i></td>
                                </tr>:""
                            }
                            {vehicleInfo!=="" && vehicleInfo.Vehicle2 !== null && vehicleInfo.Vehicle2 !== undefined?
                                <tr>
                                    <td>Vehicle2 Detail</td>
                                    <td>{this.state.veh2 === undefined ? "" : this.state.veh2.status === "" ? "" : this.state.veh2.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                    <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Vehicl2 detail", idName: "veh2", fbStatus: this.state.veh2 === undefined ? false : this.state.veh2.status === undefined?false:this.state.veh2.status })}></i></td>
                                </tr>:""
                            }
                            {vehicleInfo!=="" && vehicleInfo.Vehicle3 !== null && vehicleInfo.Vehicle3 !== undefined?
                                <tr>
                                    <td>Vehicle3 Detail</td>
                                    <td>{this.state.veh3 === undefined ? "" : this.state.veh3.status === "" ? "" : this.state.veh3.status === "true" ? <i className="fa fa-check"></i> : <i className="fa fa-remove"></i>}</td>
                                    <td><i className="fa fa-file" onClick={() => this.setState({ showId: true, docTitle: "Vehilce3 detail", idName: "veh3", fbStatus: this.state.veh3 === undefined ? false : this.state.veh3.status === undefined?false:this.state.veh3.status })}></i></td>
                                </tr>:""
                            }

                        </tbody>
                    }
                </Table>
                <Button onClick={this.maildata}><li className="fa fa-envelope  fa-1x"></li>Send Email Non-Verified Document</Button>
            </div>
        );
    }
}

export default UserDocuments;
