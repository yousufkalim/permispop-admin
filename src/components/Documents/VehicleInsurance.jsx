import React, { Component } from "react";
import { Grid, Row, Col,Button,Modal,FormControl,ControlLabel,FormGroup } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import moment from "moment";
import FileDisplay from "components/Documents/FileDisplay.jsx";

class VehicleInsurance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vIns: {},
            showModalUpdate:false,
            insurer:"",
            policeNumber:"",
            startDate:"",
            endDate:"",
            greenCardImagePath:"",
        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        // debugger;
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "VehicleInsurance/GetVehicleInsuranceByPersonalID",
            dataToFetch: this.props.vehicleInsuranceInfoId
        },
            (statusCode, response) => {
                if(response !== null){
                this.setState(
                    { 
                        vIns: response,
                        insurer:response.insurer,
                        policeNumber:response.policeNumber,
                        startDate:response.startDate,
                        endDate:response.endDate,
                        greenCardImagePath:response.greenCardImagePath 
                    });
                }
            });
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
        this.setState({greenCardImagePath:e.target.files[0].name});
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
                greenCardImagePath: response,
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
            id:this.props.vehicleInsuranceInfoId,
            insurer:this.state.insurer,
            policeNumber:this.state.policeNumber,
            startDate:this.state.startDate,
            endDate:this.state.endDate,
            greenCardImagePath:this.state.greenCardImagePath,
            Folder:`${this.props.id}_${this.props.firstName}_${this.props.surName}`,
        }
        this.WebServicesManager.postApiCall(
            {
                endPoint:"VehicleInsurance/UpdateInsurance",
                dataToInsert:JSON.stringify(perobj)
            },
            (statusCode, Resp)=>
            {
                // debugger;
                console.log("Resp",Resp)
                window.location.reload();
            }
        )
    }

    render() {
        if (this.state.vIns !== null)

            return (
                <>
                    <Grid fluid>
                        <Row>
                            <Col md={6}>
                                <FileDisplay file={this.state.vIns.greenCardImagePath!==undefined?this.state.vIns.greenCardImagePath:""}/>
                                {this.state.vIns.greenCardImagePath !== undefined?
                                <a href={this.state.vIns.greenCardImagePath} target="_blank">View file in new Tab.</a>:""}
                            </Col>
                            <Col md={6}>
                                <b>{this.state.vIns.greenCardImagePath===undefined?"No Added Yet":""}</b>
                                <br/>        
                                Insurer {this.state.vIns.insurer}
                                <br />
                                Police Number: {this.state.vIns.policeNumber}
                                <br />
                                Start Date: {moment(this.state.vIns.startDate).format('DD/MM/YYYY')}
                                <br />
                                End Date: {moment(this.state.vIns.endDate).format('DD/MM/YYYY')}
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
                                                                    <ControlLabel>Start Date</ControlLabel>
                                                                    <FormControl className="form-control"
                                                                        type="date"
                                                                        value={moment(this.state.startDate).format("YYYY-MM-DD")} 
                                                                        onChange={(e) => { this.setState({ startDate: e.target.value }); }} 
                                                                    />
                                                                </FormGroup>  
                                                            </div>
                                                            <div className="col-md-6">
                                                                <FormGroup>
                                                                    <ControlLabel>End Date</ControlLabel>
                                                                     <FormControl className="form-control"
                                                                        type="date"
                                                                        value={moment(this.state.endDate).format("YYYY-MM-DD")} 
                                                                        onChange={(e) => { this.setState({ endDate: e.target.value }); }} 
                                                                    />
                                                                </FormGroup>  
                                                            </div>
                                                        </div>
                                                        <Row style={{padding:'20px 0px'}}>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <ControlLabel>Insurer</ControlLabel>
                                                                    <FormControl className="form-control"
                                                                        value={this.state.insurer}  
                                                                        onChange={(e) => { this.setState({insurer: e.target.value }); }} 
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <ControlLabel>Police Number</ControlLabel>
                                                                    <FormControl className="form-control"
                                                                        value={this.state.policeNumber}  
                                                                        onChange={(e) => { this.setState({policeNumber: e.target.value }); }} 
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                            <ControlLabel>
                                                                Upload Insurance Certificate File
                                                                <span className="text-red">*</span>
                                                            </ControlLabel>
                                                            <FormControl
                                                                type="file"
                                                                bsClass="form-control"
                                                                onChange={this.handleFrontFileSelect}
                                                                accept="image/jpeg,application/pdf"
                                                                name="greenCardImagePath"
                                                                id="greenCardImagePath"
                                                            />
                                                            {this.state.greenCardImagePath!=="" ||this.state.greenCardImagePath!== null ?<a href={this.state.greenCardImagePath} target="_blank">View current File</a>:""}
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

export default VehicleInsurance;
