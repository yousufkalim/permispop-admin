import React, { Component } from "react";
import { Grid, Row, Col , FormControl, ControlLabel} from "react-bootstrap";
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
            status: "",
            frontIdPath :this.props.frontIDPhoto,
            frontIdPathError:"",
            backIdPath:this.props.backIDPhoto,
            drivingLicanceImg:""
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
     
    
//front file
    handleFrontFileSelect = e =>{
        if (
          e.target.files[0] !== "" ||
          e.target.files[0] !== null ||
          e.target.files[0] !== undefined
        ) {
            // console.log("file valid", e.target.files[0].name);
            this.setState({frontIdPath:e.target.files[0].name});
            // console.log("after state",this.state);
            this.validationCheckForFileID(this.state);
            const imagedata = e.target.files[0];
            const Picture = new FormData();
            Picture.append("file", imagedata);
            this.WebServicesManager.postApiImageCall(
              {
                endPoint: "Personal/UploadProfileImage",
                dataToInsert: Picture
              },
              (statusCode, response) => {
                  debugger;
                // this.state.ImagePath =
                this.setState({
                  frontIdPath: response
                });
                console.log("Apires",this.state);
                this.validationCheckForFileID(this.state);
               
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
                    frontIDPhoto:this.state.frontIdPath,
                    backIDPhoto: this.state.backIdPath,
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
                    documentTested: responsePersonal.documentTested,
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
                        window.location.reload();
                        console.log("Resp",Resp)
                    }
                )
            })
             });
        }else{
          console.log("file is null");    
        }
      }

//back file
handleBackFileSelect = e =>{
    debugger;
    if (
      e.target.files[0] !== "" ||
      e.target.files[0] !== null ||
      e.target.files[0] !== undefined
    ) {
      
      // console.log("file valid", e.target.files[0].name);
      this.setState({backIdPath:e.target.files[0].name});
      // console.log("after state",this.state);
    //  this.validationCheckForFileIDBack(this.state);
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
          this.setState({
            backIdPath: response
          });
          console.log("Api res",this.state);
        //  this.validationCheckForFileIDBack(this.state);
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
            frontIDPhoto:this.state.frontIdPath,
            backIDPhoto: this.state.backIdPath,
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
            documentTested: responsePersonal.documentTested,
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
                window.location.reload();
                console.log("Resp",Resp)
            }
        )
    })
         
        });
    }else{
      console.log("file is null");
    }
  }

  handleDLicanceFileSelect = e =>{
    debugger;
    if (
      e.target.files[0] !== "" ||
      e.target.files[0] !== null ||
      e.target.files[0] !== undefined
    ) {
    
      this.setState({drivingLicanceImg:e.target.files[0].name});
    
      const imagedata = e.target.files[0];
      const Picture = new FormData();
      Picture.append("file", imagedata);
      this.WebServicesManager.getApiWithParamCall(
        {
          endPoint: "Profile/GetProfileByPersonalId",
          dataToFetch: this.props.id
        },
        (statusCode, response) => {
          debugger;
           this.WebServicesManager.getApiWithParamCall({
                   endPoint:"DrivingLisence/GetDrivingLisenceByIdAsync" ,
                   dataToFetch:response.drivingLisenceInfoId
               },
               (statusCode, Dresp)=>{
                this.setState({ drivingLicanceImg: response.DrivingLisenceImagePath })
                debugger;
                console.log("Drep",Dresp);
                const dObj = {
                id: Dresp.id,
                LisenceNumber:Dresp.lisenceNumber,
                ObtainingDate:Dresp.obtainingDate,
                DeliveryPlace: Dresp.deliveryPlace,
                ValidityDate: Dresp.validityDate,
                DrivingLisenceImagePath: this.state.drivingLicanceImg,
                already_have_license: Dresp.already_have_license,
                licenses_for: Dresp.licenses_for,
                licenses_type: Dresp.licenses_type
                }
          
               debugger;
               this.WebServicesManager.postApiCall({
                endPoint: "DrivingLisence/DrivingLisenceInfo",
                dataToInsert: JSON.stringify(dObj)
                },
                (statusCode, Resp)=>{
                    debugger;
                    window.location.reload();
                    console.log("Resp",Resp)
                }
             )
         })
      })
    }
  }
      validationCheckForFileID = stateData => {
        if(stateData.frontIdPath === "" || stateData.frontIdPath === null){
          this.setState({frontIdPathError:"Should Not be empty"});
        } else{
          this.setState({frontIdPathError:""});
          // this.validationCheckForFileIDBack(this.state);
        }
      }
    componentWillMount() {
        this.setState({ status: this.props.status === "true" ? "checked" : "" });
        console.log(this.props);

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
                    {
                    this.props.Type === "fic"?
                    <Col md={6}>
                            <ControlLabel>
                            Upload/ Chose Another Photo
                                <span className="text-red">*</span>
                            </ControlLabel>
                            <FormControl
                                type="file"
                                bsClass="form-control"
                                onChange={this.handleFrontFileSelect}
                                accept="image/jpeg,application/pdf"
                                name="frontIDPhoto"
                                id="frontIDPhoto"
                                value={this.state.frontIDPhoto}
                            />
                            {this.state.frontIdPathError!==""?<a href={this.state.frontIdPathError} target="_blank">View current File</a>:""}
                            </Col>: this.props.Type === "bic"? 
                            
                            <Col md={6}>
                            <ControlLabel>
                            Upload back Side Of Photo
                                <span className="text-red">*</span>
                            </ControlLabel>
                            <FormControl
                                type="file"
                                bsClass="form-control"
                                onChange={this.handleBackFileSelect}
                                accept="image/jpeg,application/pdf"
                                name="backIDPhoto"
                                id="backIDPhoto"
                                value={this.state.backIDPhoto}
                            />
                           
                            {this.state.backIdPathError!==""?<a href={this.state.backIdPathError} target="_blank">View current File</a>:""}
                            </Col>: this.props.Type === "drvlic" ?
                              <Col md={6}>
                              <ControlLabel>
                              Upload Driving Licance
                                  <span className="text-red">*</span>
                              </ControlLabel>
                              <FormControl
                                  type="file"
                                  bsClass="form-control"
                                  onChange={this.handleDLicanceFileSelect}
                                  accept="image/jpeg,application/pdf"
                                  name="drivingLicanceImg"
                                  id="drivingLicanceImg"
                                  value={this.state.drivingLicanceImg}
                              />
                             
                              {this.state.backIdPathError!==""?<a href={this.state.backIdPathError} target="_blank">View current File</a>:""}
                              </Col>: this.props.Type === "aoe" ?
                                <Col md={6}>
                                <ControlLabel>
                                Upload AOE
                                    <span className="text-red">*</span>
                                </ControlLabel>
                                <FormControl
                                    type="file"
                                    bsClass="form-control"
                                    onChange={this.handleBackFileSelect}
                                    accept="image/jpeg,application/pdf"
                                    name="backIDPhoto"
                                    id="backIDPhoto"
                                    value={this.state.backIDPhoto}
                                />
                               
                                {this.state.backIdPathError!==""?<a href={this.state.backIdPathError} target="_blank">View current File</a>:""}
                                </Col>:this.props.Type === "kbl"?

                                 <Col md={6}>
                                <ControlLabel>
                                Upload Kbl
                                    <span className="text-red">*</span>
                                </ControlLabel>
                                <FormControl
                                    type="file"
                                    bsClass="form-control"
                                    onChange={this.handleBackFileSelect}
                                    accept="image/jpeg,application/pdf"
                                    name="backIDPhoto"
                                    id="backIDPhoto"
                                    value={this.state.backIDPhoto}
                                />
                               
                                {this.state.backIdPathError!==""?<a href={this.state.backIdPathError} target="_blank">View current File</a>:""}
                                </Col>:this.props.Type === "veh"?
                                    <Col md={6}>
                                    <ControlLabel>
                                    Upload Image
                                        <span className="text-red">*</span>
                                    </ControlLabel>
                                    <FormControl
                                        type="file"
                                        bsClass="form-control"
                                        onChange={this.handleBackFileSelect}
                                        accept="image/jpeg,application/pdf"
                                        name="backIDPhoto"
                                        id="backIDPhoto"
                                        value={this.state.backIDPhoto}
                                    />
                                   
                                    {this.state.backIdPathError!==""?<a href={this.state.backIdPathError} target="_blank">View current File</a>:""}
                                    </Col>:this.props.Type === "vReg" ?
                                      <Col md={6}>
                                      <ControlLabel>
                                      Upload Registration Image
                                          <span className="text-red">*</span>
                                      </ControlLabel>
                                      <FormControl
                                          type="file"
                                          bsClass="form-control"
                                          onChange={this.handleBackFileSelect}
                                          accept="image/jpeg,application/pdf"
                                          name="backIDPhoto"
                                          id="backIDPhoto"
                                          value={this.state.backIDPhoto}
                                      />
                                     
                                      {this.state.backIdPathError!==""?<a href={this.state.backIdPathError} target="_blank">View current File</a>:""}
                                      </Col>:this.props.Type === "vIns" ?
                                        <Col md={6}>
                                        <ControlLabel>
                                        Upload Insurance
                                            <span className="text-red">*</span>
                                        </ControlLabel>
                                        <FormControl
                                            type="file"
                                            bsClass="form-control"
                                            onChange={this.handleBackFileSelect}
                                            accept="image/jpeg,application/pdf"
                                            name="backIDPhoto"
                                            id="backIDPhoto"
                                            value={this.state.backIDPhoto}
                                        />
                                       
                                        {this.state.backIdPathError!==""?<a href={this.state.backIdPathError} target="_blank">View current File</a>:""}
                                        </Col>:""
                            }
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


// handleCHange = e =>{
//     this.setState({[e.target.name]:e.target.value})
// }
