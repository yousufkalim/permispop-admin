import React, { Component } from "react";
import { Grid, Row, Col,Modal,Button,FormControl,ControlLabel,FormGroup } from "react-bootstrap";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import FileDisplay from "components/Documents/FileDisplay.jsx";
import moment from "moment";
class Siret extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siret: {},
            showModelUpdate:false,
            siratImagePath:"",
            siretNumber:"",

        };
    }
    WebServicesManager = new WebServicesManager();
    componentDidMount() {
        this.WebServicesManager.getApiWithParamCall({
            endPoint: "Business/GetBusinessStoreByUserId",
            dataToFetch: this.props.businessInfoId
        },
        (statusCode, response) => {
            // debugger;
            if(response !== null){
                this.setState({ 
                    siret: response,
                    siratImagePath:response.siratImagePath,
                    siretNumber:response.siretNumber,
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
        this.setState({siratImagePath:e.target.files[0].name});
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
                siratImagePath: response
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
            id:this.props.businessInfoId,
            SiratImagePath:this.state.siratImagePath,
            SiretNumber:this.state.siretNumber,
            Folder:`${this.props.id}_${this.props.firstName}_${this.props.surName}`,
        }
        this.WebServicesManager.postApiCall(
            {
                endPoint:"Business/UpdateBusinessTable",
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
        return (
            <>
                <Grid fluid>
                    <Row>
                        <Col md={6}>
                            <FileDisplay file={(this.state.siret.siratImagePath!==undefined || this.state.siret.siratImagePath !== null)?this.state.siret.siratImagePath:""} />
                            {this.state.siret.siratImagePath !== undefined?
                            <a href={this.state.siret.siratImagePath} target="_blank">View file in new Tab.</a>:""}
                        </Col>
                        <Col md={6}>        
                        <b>{this.state.siret.siratImagePath===undefined?"No Added Yet":""}</b>
                            <br/>        
                            Siret Number: {this.state.siret.siretNumber}
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
                                                    <Row style={{padding:'20px 0px'}}>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <ControlLabel>Sirat Number</ControlLabel>
                                                                <FormControl className="form-control"
                                                                    maxLength={14}
                                                                    value={this.state.siretNumber}  
                                                                    onChange={(e) => { this.setState({siretNumber: e.target.value }); }} 
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                        <ControlLabel>
                                                            Upload Sirat File
                                                            <span className="text-red">*</span>
                                                        </ControlLabel>
                                                        <FormControl
                                                            type="file"
                                                            bsClass="form-control"
                                                            onChange={this.handleFrontFileSelect}
                                                            accept="image/jpeg,application/pdf"
                                                            name="frontIDPhoto"
                                                            id="frontIDPhoto"
                                                            value=""
                                                        />
                                                        {this.state.siratImagePath!==""?<a href={this.state.siratImagePath} target="_blank">View current File</a>:""}
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

export default Siret;
