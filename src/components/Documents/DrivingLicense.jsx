
import React, { Component } from "react";
import { Grid, Row, Col,Modal,Button,FormControl,ControlLabel,FormGroup } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";
import moment from "moment";

class DrivingLicense extends Component {
    WebServicesManager = new WebServicesManager();
    constructor(props) {
        super(props);
        this.state = {
            dLic: {},
            lisenceNumber:"",
            deliveryPlace:"",
            obtainingDate:"",
            validityDate:"",
            drivingLisenceImagePath:"",
            already_have_license:"",
            licenses_for:"",
            licenses_type:"",
            folder:"",
            showModalUpdate:false,
        };
    }
    handleModelShow = () => {
        this.setState(
            { showModalUpdate:!this.state.showModalUpdate }
        )
    }
    componentDidMount() {
        console.log("this.props.DLID",this.props);
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "DrivingLisence/GetDrivingLisenceByInstructor",
            dataToFetch: this.props.drivingLisenceInfoId
        },
            (statusCode, response) => {
                debugger;
                if(response !==null){
                    this.setState({ 
                        dLic: response,
                        lisenceNumber:response.lisenceNumber,
                        deliveryPlace: response.deliveryPlace,
                        obtainingDate:response.obtainingDate,
                        validityDate: response.validityDate,
                        drivingLisenceImagePath:response.drivingLisenceImagePath,
                        already_have_license:response.already_have_license,
                        licenses_for:response.licenses_for,
                        licenses_type:response.licenses_type,
                        folder:response.folder,
                     });
                }
            });
    }
    handleFrontFileSelect = e =>{
        if (
        e.target.files[0] !== "" ||
        e.target.files[0] !== null ||
        e.target.files[0] !== undefined
        ) {
        this.setState({drivingLisenceImagePath:e.target.files[0].name});
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
                drivingLisenceImagePath: response
            });
            });
        }else{
            console.log("file is null");    
        }
    }

    handleSave = () =>{
        console.log("save");
        // save login will go here
        const perobj = {
            id:this.props.drivingLisenceInfoId,
            LisenceNumber:this.state.lisenceNumber,
            DeliveryPlace:this.state.deliveryPlace,
            ObtainingDate:this.state.obtainingDate,
            ValidityDate: this.state.validityDate,
            drivingLisenceImagePath:this.state.drivingLisenceImagePath,
            already_have_license:this.state.already_have_license,
            licenses_for:this.state.licenses_for ===null?"":this.state.licenses_for,
            licenses_type:this.state.licenses_type === null?"":this.state.licenses_type,
            Folder:`${this.props.id}_${this.props.firstName}_${this.props.surName}`,
        }
        this.WebServicesManager.postApiCall(
            {
                endPoint:"DrivingLisence/UpdateDrivingLisenceNew",
                dataToInsert:JSON.stringify(perobj)
            },
            (statusCode, Resp)=>
            {
                debugger;
                console.log("Resp",Resp)
                window.location.reload();
            }
        )
    }

    render() {
        return (
            <>
                <Grid fluid>
                    <Row>
                        <Col md={6}>
                            {/* {console.log("this.state.dLic.drivingLisenceImagePath",this.state.dLic.drivingLisenceImagePath)} */}
                            <FileDisplay file={this.state.dLic.drivingLisenceImagePath!==undefined?this.state.dLic.drivingLisenceImagePath:""} />
                            {this.state.dLic.drivingLisenceImagePath !== undefined?
                            <a href={this.state.dLic.drivingLisenceImagePath} target="_blank">View file in new Tab.</a>:""}
                        </Col>

                        <Col md={6}>
                            <b>{this.state.dLic.drivingLisenceImagePath===undefined?"No Added Yet":""}</b>
                            <br/>        
                            {this.props.firstName}<br />
                            License No: {this.state.dLic.lisenceNumber}
                            <br />
                            Obtaining Date: {moment(this.state.dLic.obtainingDate).format('DD/MM/YYYY')}
                            <br />
                            Delivery Place: {this.state.dLic.deliveryPlace}
                            <br />
                            Validity Date: {moment(this.state.dLic.validityDate).format('DD/MM/YYYY')}
                            <br/>
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
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <FormGroup>
                                                                <ControlLabel>License Number</ControlLabel>
                                                                <FormControl className="form-control"
                                                                    value={this.state.lisenceNumber}  
                                                                    onChange={(e) => { this.setState({lisenceNumber: e.target.value }); }} 
                                                                />
                                                            </FormGroup>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <FormGroup>
                                                                <ControlLabel>Delivery Place</ControlLabel>
                                                                <FormControl className="form-control"
                                                                    value={this.state.deliveryPlace} 
                                                                    onChange={(e) => { this.setState({deliveryPlace: e.target.value }); }}></FormControl>
                                                            </FormGroup>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <FormGroup>
                                                                <ControlLabel>Obtain Date</ControlLabel>
                                                                <FormControl className="form-control"
                                                                    type="date"
                                                                    value={moment(this.state.obtainingDate).format("YYYY-MM-DD")} 
                                                                    onChange={(e) => { this.setState({ obtainingDate: e.target.value }); }} 
                                                                />
                                                            </FormGroup>  
                                                        </div>
                                                        <div className="col-md-6">
                                                            <FormGroup>
                                                                <ControlLabel>Expire Date</ControlLabel>
                                                                <FormControl className="form-control"
                                                                    type="date"
                                                                    value={moment(this.state.validityDate).format("YYYY-MM-DD")} 
                                                                    onChange={(e) => { this.setState({ validityDate: e.target.value }); }} 
                                                                />
                                                            </FormGroup>  
                                                        </div>
                                                    </div>
                                                    <Row style={{padding:'20px 0px'}}>
                                                        <Col md={6}>
                                                        <ControlLabel>
                                                            Upload License File
                                                            <span className="text-red">*</span>
                                                        </ControlLabel>
                                                        <FormControl
                                                            type="file"
                                                            bsClass="form-control"
                                                            onChange={this.handleFrontFileSelect}
                                                            accept="image/jpeg,application/pdf"
                                                            name="DrivingLisence"
                                                            id="DrivingLisence"
                                                        />
                                                        {this.state.drivingLisenceImagePath!==""?<a href={this.state.drivingLisenceImagePath} target="_blank">View current File</a>:""}
                                                        </Col>
                                                    </Row>
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
    }
}

export default DrivingLicense;
