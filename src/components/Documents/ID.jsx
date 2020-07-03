import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import DrivingLicense from "components/Documents/DrivingLicense";
import IDCard from "components/Documents/IDCard.jsx";
import AOE from "components/Documents/AOE.jsx";
import Siret from "components/Documents/Siret.jsx";
import VehicleRegistration from "components/Documents/VehicleDetails.jsx";
import VehicleInsurance from "components/Documents/VehicleInsurance.jsx";
import Dsa from "components/Documents/DrivingSchoolApproval.jsx";

class ID extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: ""
        };
    }
    WebServicesManager = new WebServicesManager();
    updateStatus = e => {
        const info = {
            userId: this.props.id,
            documentName: this.props.Type,
            status: e.target.checked,
            comments: ""
        };

        this.setState({ status: e.target.checked });
        var dataToInsert = JSON.stringify(info);
        this.WebServicesManager.postApiCall(
            { endPoint: "Document", dataToInsert: dataToInsert },
            (statusCode, response) => {
                console.log("response",response);
                this.WebServicesManager.getApiWithParamCall(
                    {
                      endPoint: "Document/GetUserDoc",
                      dataToFetch: this.props.id
                    },
                    (statusCode, responsePersonal) => {
                       debugger;
                       var docVarify = false;
                        console.log("rep",responsePersonal);
                        responsePersonal.map(item => {
                            if(item.status === "true"){
                                docVarify = true;
                            }else{
                                docVarify =false;
                            }
                        })
                        if(docVarify === true){
                            this.WebServicesManager.getApiWithParamCall(
                                {
                                endPoint: "Personal/GetAllById",
                                dataToFetch: this.props.id
                                },
                                (statusCode, responsePersonal) => {
                                debugger;
                                    console.log("rep",responsePersonal);
                                const perobj = {
                                id: responsePersonal.id,
                                firstName:responsePersonal.firstName,
                                surName: responsePersonal.surName,
                                dob: responsePersonal.dob,
                                placeOfBirth: responsePersonal.placeOfBirth,
                                gender: responsePersonal.gender,
                                frontIDPhoto: responsePersonal.frontIDPhoto,
                                backIDPhoto: responsePersonal.backIDPhoto,
                                address: responsePersonal.address,
                                complement: responsePersonal.complement,
                                zip: responsePersonal.zip,
                                city: responsePersonal.city,
                                photo: responsePersonal.photo,
                                password: responsePersonal.password,
                                neph: responsePersonal.neph,
                                noOfHrsWanted: responsePersonal.noOfHrsWanted,
                                email: responsePersonal.email,
                                phone: responsePersonal.phone,
                                secondEmail: responsePersonal.secondEmail,
                                secondPhone: responsePersonal.secondPhone,
                                highWayCodeDate: responsePersonal.highWayCodeDate,
                                lat: responsePersonal.let,
                                long: responsePersonal.long,
                                role: responsePersonal.role,
                                drivingSchoolID: responsePersonal.drivingSchoolID,
                                registrationDate: responsePersonal.registrationDate,
                                documentTested: "Tested"
                            }
                            debugger;
                            this.WebServicesManager.postApiCall(
                                {
                                    endPoint:"Personal/UpdatePersonal",
                                    dataToInsert:JSON.stringify(perobj)
                                },
                                (statusCode, Resp)=>
                                {
                                    debugger;
                                    console.log("Resp",Resp)
                                }
                            )
                    
                        })
                    }
                    else
                    {
                        this.WebServicesManager.getApiWithParamCall(
                            {
                            endPoint: "Personal/GetAllById",
                            dataToFetch: this.props.id
                            },
                            (statusCode, responsePersonal) => {
                            debugger;
                                console.log("rep",responsePersonal);
                            const perobj = {
                            id: responsePersonal.id,
                            firstName:responsePersonal.firstName,
                            surName: responsePersonal.surName,
                            dob: responsePersonal.dob,
                            placeOfBirth: responsePersonal.placeOfBirth,
                            gender: responsePersonal.gender,
                            frontIDPhoto: responsePersonal.frontIDPhoto,
                            backIDPhoto: responsePersonal.backIDPhoto,
                            address: responsePersonal.address,
                            complement: responsePersonal.complement,
                            zip: responsePersonal.zip,
                            city: responsePersonal.city,
                            photo: responsePersonal.photo,
                            password: responsePersonal.password,
                            neph: responsePersonal.neph,
                            noOfHrsWanted: responsePersonal.noOfHrsWanted,
                            email: responsePersonal.email,
                            phone: responsePersonal.phone,
                            secondEmail: responsePersonal.secondEmail,
                            secondPhone: responsePersonal.secondPhone,
                            highWayCodeDate: responsePersonal.highWayCodeDate,
                            lat: responsePersonal.let,
                            long: responsePersonal.long,
                            role: responsePersonal.role,
                            drivingSchoolID: responsePersonal.drivingSchoolID,
                            registrationDate: responsePersonal.registrationDate,
                            documentTested: ""
                        }
                        debugger;
                        this.WebServicesManager.postApiCall(
                            {
                                endPoint:"Personal/UpdatePersonal",
                                dataToInsert:JSON.stringify(perobj)
                            },
                            (statusCode, Resp)=>
                            {
                                debugger;
                                console.log("Resp",Resp)
                            }
                        )
                    })
                 }

                    })
                this.props.retunfb();
                
            }
        );
    }

    componentWillMount() {
        this.setState({ status: this.props.status === "true" ? "checked" : "" });
      
       
    }

    render() {

        return (

            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            {this.props.Type === "fic" || this.props.Type === "bic" ?
                                <IDCard {...this.props} /> : ""}
                            {this.props.Type === "drvlic" ?
                                <DrivingLicense {...this.props} /> : ""}
                            {this.props.Type === "aoe" ?
                                <AOE {...this.props} /> : ""}
                            {this.props.Type === "kbl" ?
                                <Siret {...this.props} /> : ""}
                            {this.props.Type === "vIns" ?
                                <VehicleInsurance {...this.props} /> : ""}
                            {this.props.Type === "vReg" ?
                                <VehicleRegistration {...this.props} imgType="reg" /> : ""}
                            {this.props.Type === "veh" ?
                                <VehicleRegistration {...this.props} /> : ""}
                            {this.props.Type === "dsa" ?
                                <Dsa {...this.props} /> : ""}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            Not Verified<label class="switch">
                                <input type="checkbox" checked={this.state.status} onChange={this.updateStatus} />
                                <span class="slider round"></span>
                            </label> Verified
                    </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default ID;
