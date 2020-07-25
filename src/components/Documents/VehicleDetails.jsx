
import React, { Component } from "react";
import { Grid, Row, Col,Button,Modal,FormControl,FormGroup,ControlLabel } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";
import moment from "moment";

class VehicleRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vIns: {},
            brand:"",
            model:"",
            gearBox:"",
            energy:"",
            dateOfFirstRegistration:"",
            color:"",
            greenCardImagePath:"",
            vehicleInsurer:"",
            vehiclePoliceNumber:"",
            vehicleInsuranceStartDate:"",
            vehicleInsuranceEndDate:"",
            startDateOfTech:"",
            endDateOfTechControl:"",
            technicalControlImagePath:"",
            vehicleRegistrationCertificatePhotoImagePath:"",
            vehicleePhotosImagePath:"",
            VImagePath:"",
            vRegCert:"",
            showModalUpdate:false,
        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        var tokn = localStorage.getItem('userdata');
        console.log("props for vehicle",this.props)
        const {vehicleInfo,Type} = this.props;
        if(Type === "veh1"){
            this.setState({
                vIns:vehicleInfo.Vehicle1,
                brand:vehicleInfo.Vehicle1.brand,
                model:vehicleInfo.Vehicle1.model,
                color:vehicleInfo.Vehicle1.color,
                gearBox:vehicleInfo.Vehicle1.gearBox,
                energy:vehicleInfo.Vehicle1.energy,
                dateOfFirstRegistration:vehicleInfo.Vehicle1.dateOfFirstRegistration,
                vehicleRegistrationCertificatePhotoImagePath:vehicleInfo.Vehicle1.vehicleRegistrationCertificatePhotoImagePath,
                VImagePath:vehicleInfo.Vehicle1.VImagePath,
                vRegCert:vehicleInfo.Vehicle1.vRegCert,
                vehicleePhotosImagePath:vehicleInfo.Vehicle1.vehicleePhotosImagePath,
                greenCardImagePath:vehicleInfo.Vehicle1.greenCardImagePath,
                vehicleInsurer:vehicleInfo.Vehicle1.vehicleInsurer,
                vehiclePoliceNumber:vehicleInfo.Vehicle1.vehiclePoliceNumber,
                vehicleInsuranceStartDate:vehicleInfo.Vehicle1.vehicleInsuranceStartDate,
                vehicleInsuranceEndDate:vehicleInfo.Vehicle1.vehicleInsuranceEndDate,
                startDateOfTech:vehicleInfo.Vehicle1.startDateOfTech,
                endDateOfTechControl:vehicleInfo.Vehicle1.endDateOfTech,
                technicalControlImagePath:vehicleInfo.Vehicle1.technicalControlImagePath,
            })
        }else if (Type === "veh2"){
            this.setState({
                vIns:vehicleInfo.Vehicle2,
                brand:vehicleInfo.Vehicle2.brand,
                model:vehicleInfo.Vehicle2.model,
                color:vehicleInfo.Vehicle2.color,
                gearBox:vehicleInfo.Vehicle2.gearBox,
                energy:vehicleInfo.Vehicle2.energy,
                dateOfFirstRegistration:vehicleInfo.Vehicle2.dateOfFirstRegistration,
                VImagePath:vehicleInfo.Vehicle2.VImagePath,
                vRegCert:vehicleInfo.Vehicle2.vRegCert,
                vehicleRegistrationCertificatePhotoImagePath:vehicleInfo.Vehicle2.vehicleRegistrationCertificatePhotoImagePath,
                vehicleePhotosImagePath:vehicleInfo.Vehicle2.vehicleePhotosImagePath,
                greenCardImagePath:vehicleInfo.Vehicle2.greenCardImagePath,
                vehicleInsurer:vehicleInfo.Vehicle2.vehicleInsurer,
                vehiclePoliceNumber:vehicleInfo.Vehicle2.vehiclePoliceNumber,
                vehicleInsuranceStartDate:vehicleInfo.Vehicle2.vehicleInsuranceStartDate,
                vehicleInsuranceEndDate:vehicleInfo.Vehicle2.vehicleInsuranceEndDate,
                startDateOfTech:vehicleInfo.Vehicle2.startDateOfTech,
                endDateOfTechControl:vehicleInfo.Vehicle2.endDateOfTech,
                technicalControlImagePath:vehicleInfo.Vehicle2.technicalControlImagePath,
            })

        } else if (Type === "veh3"){
            this.setState({
                vIns:vehicleInfo.Vehicle3,
                brand:vehicleInfo.Vehicle3.brand,
                model:vehicleInfo.Vehicle3.model,
                color:vehicleInfo.Vehicle3.color,
                gearBox:vehicleInfo.Vehicle3.gearBox,
                energy:vehicleInfo.Vehicle3.energy,
                VImagePath:vehicleInfo.Vehicle3.VImagePath,
                vRegCert:vehicleInfo.Vehicle3.vRegCert,
                dateOfFirstRegistration:vehicleInfo.Vehicle3.dateOfFirstRegistration,
                vehicleRegistrationCertificatePhotoImagePath:vehicleInfo.Vehicle3.vehicleRegistrationCertificatePhotoImagePath,
                vehicleePhotosImagePath:vehicleInfo.Vehicle3.vehicleePhotosImagePath,
                greenCardImagePath:vehicleInfo.Vehicle3.greenCardImagePath,
                vehicleInsurer:vehicleInfo.Vehicle3.vehicleInsurer,
                vehiclePoliceNumber:vehicleInfo.Vehicle3.vehiclePoliceNumber,
                vehicleInsuranceStartDate:vehicleInfo.Vehicle3.vehicleInsuranceStartDate,
                vehicleInsuranceEndDate:vehicleInfo.Vehicle3.vehicleInsuranceEndDate,
                startDateOfTech:vehicleInfo.Vehicle3.startDateOfTech,
                endDateOfTechControl:vehicleInfo.Vehicle3.endDateOfTech,
                technicalControlImagePath:vehicleInfo.Vehicle3.technicalControlImagePath,
            })

        } else{
            this.setState({
                vIns:vehicleInfo.Vehicle4,
                brand:vehicleInfo.Vehicle4.brand,
                model:vehicleInfo.Vehicle4.model,
                color:vehicleInfo.Vehicle4.color,
                gearBox:vehicleInfo.Vehicle4.gearBox,
                energy:vehicleInfo.Vehicle4.energy,
                VImagePath:vehicleInfo.Vehicle4.VImagePath,
                vRegCert:vehicleInfo.Vehicle4.vRegCert,
                dateOfFirstRegistration:vehicleInfo.Vehicle4.dateOfFirstRegistration,
                vehicleRegistrationCertificatePhotoImagePath:vehicleInfo.Vehicle4.vehicleRegistrationCertificatePhotoImagePath,
                vehicleePhotosImagePath:vehicleInfo.Vehicle4.vehicleePhotosImagePath,
                greenCardImagePath:vehicleInfo.Vehicle4.greenCardImagePath,
                vehicleInsurer:vehicleInfo.Vehicle4.vehicleInsurer,
                vehiclePoliceNumber:vehicleInfo.Vehicle4.vehiclePoliceNumber,
                vehicleInsuranceStartDate:vehicleInfo.Vehicle4.vehicleInsuranceStartDate,
                vehicleInsuranceEndDate:vehicleInfo.Vehicle4.vehicleInsuranceEndDate,
                startDateOfTech:vehicleInfo.Vehicle4.startDateOfTech,
                endDateOfTechControl:vehicleInfo.Vehicle4.endDateOfTech,
                technicalControlImagePath:vehicleInfo.Vehicle4.technicalControlImagePath,
            })
        }
    }

    handleModelShow = () => {
        this.setState(
            { showModalUpdate:!this.state.showModalUpdate }
        )
    }

    handleFrontFileSelect = e =>{
        if (
        e.target.files[0] !== "" ||
        e.target.files[0] !== null ||
        e.target.files[0] !== undefined
        ) {
        const updatedFile = e.target.name;
        this.setState({updatedFile:e.target.files[0].name});
        const imagedata = e.target.files[0];
        const Picture = new FormData();
        Picture.append("file", imagedata);
        this.WebServicesManager.postApiImageCall(
            {
                endPoint: "Personal/UploadProfileImage",
                dataToInsert: Picture
            },
            (statusCode, response) => {
                // this.state.ImagePath =
                this.setState({updatedFile: response},()=>{
                    console.log(`${updatedFile} value ${this.state}`)
                });
            });
        }else{
            console.log("file is null");    
        }
    }

    handleSave = () =>{
        var tokn = localStorage.getItem('userdata');
        console.log("save",this.state);
        const {Type,role,vehicleInfo } = this.props;
        var vehicle  = {};
        // save login will go here
        if(role === "Instructor"){
            if(Type === "veh1"){
                vehicle = {
                    id:1,
                    dateOfFirstRegistration:this.state.dateOfFirstRegistration,
                    brand:this.state.brand,
                    model:this.state.model,
                    color:this.state.color,
                    energy:this.state.energy,
                    gearBox:this.state.gearBox,
                    vRegCert:this.state.vRegCert,
                    VImagePath:this.state.VImagePath,
                    startDateOfTech:this.state.startDateOfTech,
                    endDateOfTechControl:this.state.endDateOfTechControl,
                    technicalControlImagePath:this.state.technicalControlImagePath
                }
                vehicleInfo.Vehicle1 = vehicle
            }else if(Type === "veh2"){
                vehicle = {
                    id:2,
                    dateOfFirstRegistration:this.state.dateOfFirstRegistration,
                    brand:this.state.brand,
                    model:this.state.model,
                    color:this.state.color,
                    energy:this.state.energy,
                    gearBox:this.state.gearBox,
                    vRegCert:this.state.vRegCert,
                    VImagePath:this.state.VImagePath,
                    startDateOfTech:this.state.startDateOfTech,
                    endDateOfTechControl:this.state.endDateOfTechControl,
                    technicalControlImagePath:this.state.technicalControlImagePath
                }
                vehicleInfo.Vehicle2 = vehicle
            }else{
                vehicle = {
                    id:3,
                    dateOfFirstRegistration:this.state.dateOfFirstRegistration,
                    brand:this.state.brand,
                    model:this.state.model,
                    color:this.state.color,
                    energy:this.state.energy,
                    gearBox:this.state.gearBox,
                    vRegCert:this.state.vRegCert,
                    VImagePath:this.state.VImagePath,
                    startDateOfTech:this.state.startDateOfTech,
                    endDateOfTechControl:this.state.endDateOfTechControl,
                    technicalControlImagePath:this.state.technicalControlImagePath
                }
                vehicleInfo.Vehicle3 = vehicle
            }
        }else{
            if(Type === "veh1"){
                vehicle = {
                    id:1,
                    dateOfFirstRegistration:this.state.dateOfFirstRegistration,
                    brand:this.state.brand,
                    model:this.state.model,
                    color:this.state.color,
                    energy:this.state.energy,
                    gearBox:this.state.gearBox,
                    vehicleRegistrationCertificatePhotoImagePath:this.state.vehicleRegistrationCertificatePhotoImagePath,
                    vehicleePhotosImagePath:this.state.vehicleePhotosImagePath,
                    startDateOfTech:this.state.startDateOfTech,
                    endDateOfTechControl:this.state.endDateOfTechControl,
                    technicalControlImagePath:this.state.technicalControlImagePath,
                    greenCardImagePath:this.state.greenCardImagePath,
                    vehicleInsurer:this.state.vehicleInsurer,
                    vehiclePoliceNumber:this.state.vehiclePoliceNumber,
                    vehicleInsuranceStartDate:this.state.vehicleInsuranceStartDate,
                    vehicleInsuranceEndDate:this.state.vehicleInsuranceEndDate,
                    drivingSchoolInsuranceImagePath:"",
                    drivingSchoolInsuranceEndDate:""
                }
                vehicleInfo.Vehicle1 = vehicle
            }else if(Type === "veh2"){
                vehicle = {
                    id:2,
                    dateOfFirstRegistration:this.state.dateOfFirstRegistration,
                    brand:this.state.brand,
                    model:this.state.model,
                    color:this.state.color,
                    energy:this.state.energy,
                    gearBox:this.state.gearBox,
                    vehicleRegistrationCertificatePhotoImagePath:this.state.vehicleRegistrationCertificatePhotoImagePath,
                    vehicleePhotosImagePath:this.state.vehicleePhotosImagePath,
                    startDateOfTech:this.state.startDateOfTech,
                    endDateOfTechControl:this.state.endDateOfTechControl,
                    technicalControlImagePath:this.state.technicalControlImagePath,
                    greenCardImagePath:this.state.greenCardImagePath,
                    vehicleInsurer:this.state.vehicleInsurer,
                    vehiclePoliceNumber:this.state.vehiclePoliceNumber,
                    vehicleInsuranceStartDate:this.state.vehicleInsuranceStartDate,
                    vehicleInsuranceEndDate:this.state.vehicleInsuranceEndDate,
                    drivingSchoolInsuranceImagePath:"",
                    drivingSchoolInsuranceEndDate:""
                }
                vehicleInfo.Vehicle2 = vehicle
            }else{
                vehicle = {
                    id:3,
                    dateOfFirstRegistration:this.state.dateOfFirstRegistration,
                    brand:this.state.brand,
                    model:this.state.model,
                    color:this.state.color,
                    energy:this.state.energy,
                    gearBox:this.state.gearBox,
                    vehicleRegistrationCertificatePhotoImagePath:this.state.vehicleRegistrationCertificatePhotoImagePath,
                    vehicleePhotosImagePath:this.state.vehicleePhotosImagePath,
                    startDateOfTech:this.state.startDateOfTech,
                    endDateOfTechControl:this.state.endDateOfTechControl,
                    technicalControlImagePath:this.state.technicalControlImagePath,
                    greenCardImagePath:this.state.greenCardImagePath,
                    vehicleInsurer:this.state.vehicleInsurer,
                    vehiclePoliceNumber:this.state.vehiclePoliceNumber,
                    vehicleInsuranceStartDate:this.state.vehicleInsuranceStartDate,
                    vehicleInsuranceEndDate:this.state.vehicleInsuranceEndDate,
                    drivingSchoolInsuranceImagePath:"",
                    drivingSchoolInsuranceEndDate:""
                }
                vehicleInfo.Vehicle3 = vehicle
            }
        }
        this.WebServicesManager.getApiWithParamCall(
            {
                endPoint: "Profile/GetProfileByPersonalId",
                dataToFetch: this.props.personalInfoId,
                token:tokn,
            },
            (statusCode, response) => {
                // get all detail and reassign
                const info = {
                    id: response.id,
                    role: response.role,
                    PersonalInfoId:response.personalInfoId,
                    DrivingLisenceInfoId: response.drivingLisenceInfoId,
                    ExersiceAuthorizationInfoId: response.exersiceAuthorizationInfoId,
                    VehicleDetailInfoId: role==="Instructor"?JSON.stringify(vehicleInfo):response.vehicleDetailInfoId,
                    VehicleInsuranceInfoId: response.vehicleInsuranceInfoId,
                    DrivingSchoolInsuranceInfoId: response.drivingSchoolInsuranceInfoId,
                    TechnicalControlInfoId: response.technicalControlInfoId,
                    BusinessInfoId:response.businessInfoId,
                    InsuranceCompanyInfoId: response.insuranceCompanyInfoId,
                    DrivingSchoolIdentityInfoId: response.drivingSchoolIdentityInfoId,
                    DrivingSchoolApprovalInfoId: response.drivingSchoolApprovalInfoId,
                    DrivingSchoolManagerInfoId: response.drivingSchoolManagerInfoId,
                    DrivingSchoolVehiclesInfoId:role!=="Instructor"?JSON.stringify(vehicleInfo):response.drivingSchoolVehiclesInfoId,
                    DrivingSchoolInstructorInfoId: response.drivingSchoolInstructorInfoId,
                    Lat: response.lat,
                    Long: response.long,
                    Status: response.status,
                    BanStatus:response.banStatus,
                    BanDate:response.banDate,
                }
                const dataToUpdate = JSON.stringify(info);
                this.WebServicesManager.postApiCall(
                    {
                        endPoint: "Profile/UpdateProfile",
                        dataToInsert: dataToUpdate,
                        token:tokn,
                    },
                    (statusCode, response) => {
                        console.log("after update",response);
                        window.location.reload();
                    }
                )
            }
        )
    }

    render() {
        const {role} = this.props;
        if (this.state.vIns !== null)
            return (
                <>
                    <Grid fluid>
                        <Row>
                            <Col md={6}>
                                    <FileDisplay file={role!=="Instructor"?this.state.vIns.vehicleePhotosImagePath!==undefined?this.state.vIns.vehicleePhotosImagePath:"":this.state.vIns.VImagePath!==undefined?this.state.vIns.VImagePath:""} />
                                    <a href={role!=="Instructor"?this.state.vIns.vehicleePhotosImagePath!==undefined?this.state.vIns.vehicleePhotosImagePath:"":this.state.vIns.VImagePath!==undefined?this.state.vIns.VImagePath:""} target="_blank">View Vehicle file.</a>
                                    <hr/>
                                    <FileDisplay file={role!=="Instrutor"?this.state.vIns.vehicleRegistrationCertificatePhotoImagePath!==undefined && this.state.vIns.vehicleRegistrationCertificatePhotoImagePath!==null?this.state.vIns.vehicleRegistrationCertificatePhotoImagePath:"":this.state.vIns.vRegCert!==undefined?this.state.vIns.vRegCert:""}/> 
                                    <a href={role!=="Instrutor"?this.state.vIns.vehicleRegistrationCertificatePhotoImagePath!==undefined?this.state.vIns.vehicleRegistrationCertificatePhotoImagePath:"":this.state.vIns.vRegCert!==undefined?this.state.vIns.vRegCert:""} target="_blank">View Registration file.</a>
                                    <hr/>
                                    <FileDisplay file={this.state.vIns.technicalControlImagePath!==undefined?this.state.vIns.technicalControlImagePath:""} />
                                    <a href={this.state.vIns.technicalControlImagePath!==undefined?this.state.vIns.technicalControlImagePath:""} target="_blank">View file in new Tab.</a>
                                    <hr/>
                                    {role !=="Instructor"?
                                    <>
                                    <FileDisplay file={role!=="Instructor"?this.state.greenCardImagePath!==undefined?this.state.greenCardImagePath:"":this.state.greenCardImagePath!==undefined?this.state.greenCardImagePath:""} />
                                    <a href={role!=="Instructor"?this.state.greenCardImagePath!==undefined?this.state.greenCardImagePath:"":this.state.greenCardImagePath!==undefined?this.state.greenCardImagePath:""} target="_blank">View GreenCard file.</a>
                                    </>:""
                                    }
                            </Col>

                            <Col md={6}>
                                <b>Vehicle Details</b>
                                <br/>
                                Date Of First Registration: {moment(this.state.vIns.dateOfFirstRegistration).format('DD/MM/YYYY')}
                                <br />
                                Brand: {this.state.vIns.brand}
                                <br />
                                Color: {this.state.vIns.color}
                                <br />
                                Model: {this.state.vIns.model}
                                <br/>
                                GearBox: {this.state.vIns.gearBox}
                                <br/>
                                Energy: {this.state.vIns.energy}
                                <hr/>
                                { role !== "Instructor"?
                                <React.Fragment>
                                    <b>Vehicle Insurance</b>
                                    <br/>
                                    Insurer: {this.state.vIns.vehicleInsurer}
                                    <br/>
                                    Police Number: {this.state.vIns.vehiclePoliceNumber}
                                    <br/>
                                    Start Data: {moment(this.state.vehicleInsuranceStartDate).format("DD/MM/YYYY")}
                                    <br/>
                                    End Data: {moment(this.state.vehicleInsuranceEndDate).format("DD/MM/YYYY")}
                                    <hr/>
                                </React.Fragment>:""}
                                <b>Technical Control</b>
                                <br/>
                                Start Data: {moment(this.state.vIns.startDateOfTech).format('DD/MM/YYYY')}
                                <br/>
                                End Data: {moment(this.state.vIns.endDateOfTech).format('DD/MM/YYYY')}
                                <hr/>
                                <Button varient="success" onClick={this.handleModelShow}>Update Data</Button>
                            </Col>
                        </Row>
                    </Grid>
                    <Modal
                        show={this.state.showModalUpdate}
                        onHide={this.handleModelShow}
                        backdrop="static"
                        keyboard={false}
                        size="xl"
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Update Data</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="content">
                                <Grid fluid>
                                    <Row>
                                        <Col md={12}>
                                            <form>
                                                <div className="clearfix" />
                                                <div className="container-flex">
                                                    <div>
                                                        <Row>
                                                            <label className="reg-Label">
                                                            Vehicle Details
                                                            </label>
                                                        </Row>
                                                        <Row>
                                                            <Col md={6}>
                                                                <ControlLabel>
                                                                    Date of the 1st Registration
                                                                    <span className="text-red"> *</span>
                                                                </ControlLabel>
                                                                <br />
                                                                <FormControl
                                                                    type="date"
                                                                    value={moment(this.state.dateOfFirstRegister).format("YYYY-MM-DD")}
                                                                    onChange={e => this.setState({dateOfFirstRegister:e.target.value})}

                                                                />
                                                            </Col>
                                                            <Col md={6}>
                                                            <ControlLabel>
                                                                Brand
                                                                <span className="text-red"> *</span>
                                                            </ControlLabel>
                                                            <br />
                                                            <FormControl
                                                                type="text"
                                                                bsClass="form-control"
                                                                name="brand"
                                                                value={this.state.brand}
                                                                onChange={e=>this.setState({brand:e.target.value})}
                                                            />
                                                            </Col>
                                                            <Col md={6}>
                                                            <ControlLabel>
                                                                Upload Image
                                                            </ControlLabel>
                                                            <FormControl
                                                                id="VImage"
                                                                type="file"
                                                                bsClass="form-control"
                                                                name={role==="Instructor"?"VImagePath":"vehiclePhotoImagePath"}
                                                                onChange={this.handleFrontFileSelect}
                                                                accept="image/jpeg"
                                                            />
                                                            </Col>
                                                        </Row>
                                                        <br/>
                                                        <Row>
                                                            <Col md={6}>
                                                                <ControlLabel>
                                                                    Model
                                                                </ControlLabel>
                                                                <br />
                                                                <FormControl
                                                                    type="text"
                                                                    value={this.state.model}
                                                                    onChange={e => this.setState({model:e.target.value})}

                                                                />
                                                            </Col>
                                                            <Col md={6}>
                                                                <ControlLabel>
                                                                    Color
                                                                    <span className="text-red"> *</span>
                                                                </ControlLabel>
                                                                <br />
                                                                <FormControl
                                                                    type="text"
                                                                    bsClass="form-control"
                                                                    name="brand"
                                                                    value={this.state.color}
                                                                    onChange={e=>this.setState({color:e.target.value})}
                                                                />
                                                            </Col>
                                                            <Col md={6}>
                                                            <ControlLabel>
                                                                Registration Certificate Image <span className="text-red">*</span>
                                                            </ControlLabel>
                                                            <FormControl
                                                                id="vRegCert"
                                                                type="file"
                                                                bsClass="form-control"
                                                                name={role==="Instructor"?"vRegCert":"vehicleRegistrationCertificatePhotoImagePath"}
                                                                onChange={this.handleFrontFileSelect}
                                                                accept="image/jpeg"
                                                            />
                                                            </Col>
                                                        </Row>
                                                        <br/>
                                                        <Row>
                                                            <Col md={6}>
                                                                <FormGroup controlId="formControlsSelect">
                                                                    <ControlLabel>
                                                                    Gearbox
                                                                    <span className="text-red"> *</span>
                                                                    </ControlLabel>
                                                                    <FormControl
                                                                    componentClass="select"
                                                                    value={this.state.gearBox}
                                                                    onChange={e=>this.setState({gearBox:e.target.value})}
                                                                    >
                                                                    <option value="Auto">Auto</option>
                                                                    <option value="Manual">Manual</option>
                                                                    </FormControl>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                            <FormGroup>
                                                                <ControlLabel>
                                                                Energy
                                                                <span className="text-red"> *</span>
                                                                </ControlLabel>
                                                                <FormControl
                                                                className="noBorderRadius"
                                                                name="energy"
                                                                value={this.state.energy}
                                                                componentClass="select"
                                                                onChange={e=>this.setState({energy:e.target.value})}
                                                                autoComplete="off"
                                                                >
                                                                    <option value="Auto">Diesel</option>
                                                                    <option value="Petrol">Petrol</option>
                                                                    <option value="Hybrid">Hybrid</option>
                                                                    <option value="Electric">Electric</option>
                                                                    <option value="GPL">GPL</option>
                                                                    <option value="Other">Other</option>
                                                                </FormControl>
                                                            </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <br/>
                                                        <Row className="secndpage">
                                                            <Row>
                                                                <label className="reg-Label">
                                                                Technical control
                                                                </label>
                                                            </Row>
                                                            <br/>
                                                            <Row>
                                                                <Col md={6}>
                                                                    <ControlLabel>
                                                                        Date of the technical control
                                                                        <span className="text-red"> *</span>
                                                                    </ControlLabel>
                                                                    <br />
                                                                    <FormControl
                                                                        type="date"
                                                                        onChange={e => this.setState({startDateOfTech:e.target.value})}
                                                                        className="form-control"
                                                                        value={moment(this.state.startDateOfTech).format("YYYY-MM-DD")}
                                                                        
                                                                    />
                                                                </Col>
                                                                <Col md={6}>
                                                                    <ControlLabel>
                                                                        End Date
                                                                        <span className="text-red"> *</span>
                                                                    </ControlLabel>
                                                                    <br />
                                                                    <FormControl
                                                                        type="date"
                                                                        onChange={date =>
                                                                        this.setState({endDateOfTechControl:date.target.value})
                                                                        }
                                                                        value={moment(this.state.endDateOfTechControl).format('YYYY-MM-DD')}
                                                                        // placeholderText="DD/MM/YYYY"
                                                                    />
                                                                </Col>
                                                                <Col md={6}>
                                                                    <ControlLabel>
                                                                        Scan and upload your CT
                                                                    </ControlLabel>
                                                                    <FormControl
                                                                        type="file"
                                                                        bsClass="form-control"
                                                                        name="technicalControlImagePath"
                                                                        id="technicalControlImagePath"
                                                                        onChange={this.handleFrontFileSelect}
                                                                        accept="image/jpeg,application/pdf"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Row>
                                                        {role!=="Instructor"?
                                                        <Row>
                                                            <br/>
                                                            <Row>
                                                                <label className="reg-Label">
                                                                    Insurance Details
                                                                </label>
                                                            </Row>
                                                            <Row>
                                                                <Col md={6}>
                                                                    <ControlLabel>
                                                                    Insurer
                                                                    <span className="text-red"> *</span>
                                                                    </ControlLabel>
                                                                    <br />
                                                                    <FormControl
                                                                        type="text"
                                                                        onChange={e => this.setState({vehicleInsurer:e.target.value})}
                                                                        className="form-control"
                                                                        value={this.state.vehicleInsurer}
                                                                    />
                                                                </Col>
                                                                <Col md={6}>
                                                                    <ControlLabel>
                                                                        Police Number
                                                                        <span className="text-red"> *</span>
                                                                    </ControlLabel>
                                                                    <br />
                                                                    <FormControl
                                                                        type="text"
                                                                        onChange={date =>
                                                                        this.setState({vehiclePoliceNumber:date.target.value})
                                                                        }
                                                                        value={this.state.vehiclePoliceNumber}
                                                                        // placeholderText="DD/MM/YYYY"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <br/>
                                                            <Row>
                                                                <Col md={6}>
                                                                    <ControlLabel>
                                                                        Start Date
                                                                        <span className="text-red"> *</span>
                                                                    </ControlLabel>
                                                                    <br />
                                                                    <FormControl
                                                                        type="date"
                                                                        onChange={e => this.setState({vehicleInsuranceStartDate:e.target.value})}
                                                                        className="form-control"
                                                                        value={moment(this.state.vehicleInsuranceStartDate).format("YYYY-MM-DD")}
                                                                        
                                                                    />
                                                                </Col>
                                                                <Col md={6}>
                                                                    <ControlLabel>
                                                                        End Date
                                                                        <span className="text-red"> *</span>
                                                                    </ControlLabel>
                                                                    <br />
                                                                    <FormControl
                                                                        type="date"
                                                                        onChange={date =>
                                                                        this.setState({vehicleInsuranceEndDate:date.target.value})
                                                                        }
                                                                        value={moment(this.state.vehicleInsuranceEndDate).format('YYYY-MM-DD')}
                                                                        // placeholderText="DD/MM/YYYY"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                            <br/>
                                                            <Row>
                                                                <Col md={6}>
                                                                    <ControlLabel>
                                                                        Green Card
                                                                    </ControlLabel>
                                                                    <FormControl
                                                                        type="file"
                                                                        bsClass="form-control"
                                                                        name="greenCardImagePath"
                                                                        id="greenCardImagePath"
                                                                        onChange={this.handleFrontFileSelect}
                                                                        accept="image/jpeg,application/pdf"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Row>:""}
                                                    </div>
                                                </div>
                                            </form>
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleModelShow}>
                            Close
                            </Button>
                            <Button variant="primary" onClick={this.handleSave}>Update</Button>
                        </Modal.Footer>
                    </Modal>
                </>
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

export default VehicleRegistration;
