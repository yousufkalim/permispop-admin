import React, { Component } from "react";
import { Grid, Row, Col, FormGroup,FormControl,ControlLabel,Modal,Button } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";
import moment from "moment"

class DrivingSchoolApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dsa: {},
            approvalNumber:"",
            approvalIssuingAuthority:"",
            dateOfApproval:"",
            approvalCertificationImagePath:"",
        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        var tokn = localStorage.getItem('userdata');
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "DrivingSchoolApproval/GetDrivingSchoolApprovalAsyncByPersonalInfoId",
            dataToFetch: this.props.drivingSchoolApprovalInfoId,
            token:tokn,
        },
            (statusCode, response) => {
                if(response !== null){
                    this.setState(
                        { 
                            dsa: response,
                            approvalNumber: response.approvalNumber,
                            approvalIssuingAuthority:response.approvalIssuingAuthority,
                            dateOfApproval:response.dateOfApproval,
                            approvalCertificationImagePath:response.approvalCertificationImagePath, 
                        }
                    );
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
        this.setState({approvalCertificationImagePath:e.target.files[0].name});
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
                approvalCertificationImagePath: response
            });
            });
        }else{
            console.log("file is null");    
        }
    }

    handleSave = () =>{
        var tokn = localStorage.getItem('userdata');
        console.log("save");
        // save login will go here
        const perobj = {
            id:this.props.drivingSchoolApprovalInfoId,
            ApprovalNumber:this.state.approvalNumber,
            ApprovalIssuingAuthority:this.state.approvalIssuingAuthority,
            DateOfApproval:this.state.dateOfApproval,
            ApprovalCertificationImagePath:this.state.approvalCertificationImagePath,
            Folder:`${this.props.id}_${this.props.firstName}_${this.props.surName}`,
        }
        this.WebServicesManager.postApiCall(
            {
                endPoint:"DrivingSchoolApproval/UpdateSchoolApproval",
                dataToInsert:JSON.stringify(perobj),
                token:tokn,
            },
            (statusCode, Resp)=>
            {
                console.log("Resp",Resp)
                window.location.reload();
            }
        )
    }

    render() {
        if (this.state.dsa !== null)
            return (
                <>
                    <Grid fluid>
                        <Row>
                            <Col md={6} style={{ overflow: "auto" }}>

                                <FileDisplay file={this.state.dsa.approvalCertificationImagePath!==undefined?this.state.dsa.approvalCertificationImagePath:""} />
                                {this.state.dsa.approvalCertificationImagePath !== undefined?
                            <a href={this.state.dsa.approvalCertificationImagePath} target="_blank">View file in new Tab.</a>:""}
                            </Col>

                            <Col md={6}>
                                <b>{this.state.dsa.approvalCertificationImagePath===undefined?"No Added Yet":""}</b>
                                <br/>        
                                Approval Number: {this.state.dsa.approvalNumber}
                                <br />
                                approval Issuing Authority {this.state.dsa.approvalIssuingAuthority}
                                <br />
                                Date of Approval: {moment(this.state.dsa.dateOfApproval).format('DD/MM/YYYY')}
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
                                                                    <ControlLabel>Date of Approval</ControlLabel>
                                                                    <FormControl className="form-control"
                                                                        type="date"
                                                                        value={moment(this.state.dateOfApproval).format("YYYY-MM-DD")} 
                                                                        onChange={(e) => { this.setState({ dateOfApproval: e.target.value }); }} 
                                                                    />
                                                                </FormGroup>  
                                                            </div>
                                                            <div className="col-md-6">
                                                                <FormGroup>
                                                                    <ControlLabel>Approval Number</ControlLabel>
                                                                    <FormControl className="form-control"
                                                                        type="text"
                                                                        value={this.state.approvalNumber} 
                                                                        onChange={(e) => { this.setState({ approvalNumber: e.target.value }); }} 
                                                                    />
                                                                </FormGroup>  
                                                            </div>
                                                        </div>
                                                        <Row style={{padding:'20px 0px'}}>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <ControlLabel>Approval Issuing Authority</ControlLabel>
                                                                    <FormControl className="form-control"
                                                                        value={this.state.approvalIssuingAuthority}  
                                                                        onChange={(e) => { this.setState({approvalIssuingAuthority: e.target.value }); }} 
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                            <ControlLabel>
                                                                Upload Approval Certificate File
                                                                <span className="text-red">*</span>
                                                            </ControlLabel>
                                                            <FormControl
                                                                type="file"
                                                                bsClass="form-control"
                                                                onChange={this.handleFrontFileSelect}
                                                                accept="image/jpeg,application/pdf"
                                                                name="approvalCertificationImagePath"
                                                                id="approvalCertificationImagePath"
                                                            />
                                                            {this.state.approvalCertificationImagePath!==""?<a href={this.state.approvalCertificationImagePath} target="_blank">View current File</a>:""}
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

            </Grid >);
    }
}

export default DrivingSchoolApproval;
