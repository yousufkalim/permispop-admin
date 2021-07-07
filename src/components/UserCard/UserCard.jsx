import React, { Component } from "react";
import moment from "moment";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import {
  Button,
  // Modal,
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  DropdownButton,
  MenuItem,
} from "react-bootstrap";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Translation } from "react-i18next";
import Autocomplete from "react-autocomplete";

const { confirm } = Modal;

export class UserCard extends Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showModal: false,
      firstName: "",
      surName: "",
      email: "",
      contactEmail: "",
      secondEmail: "",
      secondPhone: "",
      password: "",
      dob: "",
      phone: "",
      address: "",
      city: "",
      zip: "",
      zipError: "",
      disableSubmit: false,
      lat: "",
      long: "",
      addressError: "",
      gender: "",
      complement: "",
      highWayCodeDate: "",
      neph: "",
      frontIDPhoto: "",
      backIDPhoto: "",
      frontIdPathError: "",
      backIdPathError: "",
      banStatus: "",
      banDate: "",
      spokenLanguage: "",
      whichPlatform: "",
      giveOurPlatformTime: "",
      workWithOther: "",
      isAddDisable: false,
    };
  }

  componentWillMount() {
    console.log("users table ", this.props);
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Profile/GetProfileByPersonalId",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (statusCode, response) => {
        this.setState({
          banStatus: response.banStatus !== null ? response.banStatus : "",
          banDate: response.banDate !== null ? response.banDate : "",
        });
      }
    );
    this.setState({
      items: [],
      showModal: false,
      firstName: this.props.firstName,
      surName: this.props.surname,
      email: this.props.email,
      contactEmail: this.props.contactEmail,
      secondEmail: this.props.secondEmail,
      secondPhone: this.props.secondPhone,
      password: this.props.password,
      dob: this.props.dob,
      phone: this.props.phone,
      address: this.props.address,
      city: this.props.city,
      zip: this.props.zip,
      zipError: "",
      disableSubmit: false,
      lat: this.props.lat,
      long: this.props.long,
      addressError: "",
      gender: this.props.gender,
      complement: this.props.complement,
      highWayCodeDate: this.props.highWayCodeDate,
      neph: this.props.neph,
      frontIDPhoto: "",
      backIDPhoto: "",
      frontIdPathError: this.props.frontIDPhoto,
      backIdPathError: this.props.backIDPhoto,
      banStatus: "",
      banDate: "",
      spokenLanguage: this.props.spokenLanguage,
      whichPlatform: this.props.whichPlatform,
      giveOurPlatformTime: this.props.giveOurPlatformTime,
      workWithOther: this.props.workWithOther,
      isAddDisable: false,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log("this.state", this.state);
    if (this.props.email !== this.state.email) {
      this.setState({
        items: [],
        showModal: false,
        firstName: this.props.firstName,
        surName: this.props.surname,
        email: this.props.email,
        contactEmail: this.props.contactEmail,
        secondEmail: this.props.secondEmail,
        secondPhone: this.props.secondPhone,
        password: this.props.password,
        dob: this.props.dob,
        phone: this.props.phone,
        address: this.props.address,
        city: this.props.city,
        zip: this.props.zip,
        zipError: "",
        disableSubmit: false,
        lat: this.props.lat,
        long: this.props.long,
        addressError: "",
        gender: this.props.gender,
        complement: this.props.complement,
        highWayCodeDate: this.props.highWayCodeDate,
        neph: this.props.neph,
        frontIDPhoto: "",
        backIDPhoto: "",
        frontIdPathError: this.props.frontIDPhoto,
        backIdPathError: this.props.backIDPhoto,
        banStatus: "",
        banDate: "",
        spokenLanguage: this.props.spokenLanguage,
        whichPlatform: this.props.whichPlatform,
        giveOurPlatformTime: this.props.giveOurPlatformTime,
        workWithOther: this.props.workWithOther,
        isAddDisable: false,
      });
    }
  }

  handleFrontFileSelect = (e) => {
    if (
      e.target.files[0] !== "" ||
      e.target.files[0] !== null ||
      e.target.files[0] !== undefined
    ) {
      this.setState({ frontIDPhoto: e.target.files[0].name });
      const imagedata = e.target.files[0];
      const Picture = new FormData();
      Picture.append("file", imagedata);
      this.WebServicesManager.postApiImageCall(
        {
          endPoint: "Personal/UploadProfileImage",
          dataToInsert: Picture,
        },
        (statusCode, response) => {
          this.setState({
            frontIDPhoto: response,
          });
        }
      );
    } else {
      console.log("file is null");
    }
  };
  handleBackFileSelect = (e) => {
    if (
      e.target.files[0] !== "" ||
      e.target.files[0] !== null ||
      e.target.files[0] !== undefined
    ) {
      this.setState({ backIDPhoto: e.target.files[0].name });
      const imagedata = e.target.files[0];
      const Picture = new FormData();
      Picture.append("file", imagedata);
      this.WebServicesManager.postApiImageCall(
        {
          endPoint: "Personal/UploadProfileImage",
          dataToInsert: Picture,
        },
        (statusCode, response) => {
          this.setState({
            backIDPhoto: response,
          });
        }
      );
    } else {
      console.log("file is null");
    }
  };

  getAddress = (e) => {
    this.setState({
      address: e.target.value,
      zip: "",
      city: "",
      lat: 0,
      long: 0,
      zipError: "Please Select From Dropdown to set Address.",
      disableSubmit: true,
    });
    fetch(
      "https://api-adresse.data.gouv.fr/search/?q=" +
        e.target.value +
        "&type=street&autocomplete=1&limit=15"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        var addressToSet = [];
        for (var i = 0; i < responseJson.features.length; i++) {
          addressToSet.push({
            id: i,
            label: responseJson.features[i].properties.label,
            city: responseJson.features[i].properties.city,
            PostalCode: responseJson.features[i].properties.postcode,
            lat: responseJson.features[0].geometry.coordinates[1],
            lng: responseJson.features[0].geometry.coordinates[0],
          });
        }
        if (addressToSet.length === responseJson.features.length) {
          this.setState({ items: addressToSet }, () => {
            // console.log(
            //   "Address to set",
            //   addressToSet,
            //   "state",
            //   this.state.items
            // );
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  SetAddress = (item) => {
    this.setState({ address: item });
    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].label === item) {
        var city = this.state.items[i].city;
        var zipCode = this.state.items[i].PostalCode;
        var lat = this.state.items[i].lat;
        var lng = this.state.items[i].lng;
        var newAddress = this.state.items[i].label.split(String(zipCode));
        this.setState({
          address: newAddress[0],
          zip: zipCode,
          city: city,
          lat: lat,
          long: lng,
          zipError: "",
          disableSubmit: false,
        });
        // this.validationCheckforAddress(this.state);
      }
    }
  };

  handleSave = () => {
    this.setState({
      isAddDisable: true,
    });
    // debugger;
    var tokn = localStorage.getItem("userdata");
    const data = {
      id: this.props.id,
      FirstName: this.state.firstName,
      SurName: this.state.surName,
      DOB: this.state.dob,
      PlaceOfBirth: this.props.placeOfBirth,
      gender: this.state.gender,
      FrontIDPhoto:
        this.state.frontIDPhoto === ""
          ? this.state.frontIdPathError
          : this.state.frontIDPhoto,
      BackIDPhoto:
        this.state.backIDPhoto === ""
          ? this.state.backIdPathError
          : this.state.backIDPhoto,
      address: this.state.address,
      Complement: this.state.complement,
      ZIP: this.state.zip,
      City: this.state.city,
      Photo: this.props.photo,
      Password: this.state.password,
      NEPH: this.state.neph,
      NoOfHrsWanted: this.props.noOfHrsWanted,
      // Email: this.state.email,
      Email:
        this.state.contactEmail !== null
          ? this.state.contactEmail
          : this.state.email,
      ContactEmail:
        this.state.contactEmail !== null
          ? this.state.contactEmail
          : this.state.email,
      Phone: this.state.phone,
      SecondEmail: this.state.secondEmail,
      SecondPhone: this.state.secondPhone,
      HighWayCodeDate: this.state.highWayCodeDate,
      Lat: this.state.lat,
      Long: this.state.long,
      Role: this.props.role,
      DrivingSchoolID: this.props.drivingSchoolID,
      RegistrationDate: this.props.RegistrationDate,
      documentTested: this.props.documentTested,
      CPFAccept: this.props.cpfAccept,
      spokenLanguage: this.props.spokenLanguage,
      whichPlatform: this.props.whichPlatform,
      giveOurPlatformTime: this.props.giveOurPlatformTime,
      workWithOther: this.props.workWithOther,
    };
    var datais = JSON.stringify(data);
    this.WebServicesManager.postApiCall(
      {
        endPoint: "Personal/UpdatePersonal",
        dataToInsert: datais,
        token: tokn,
      },
      (statusCode, response) => {
        this.WebServicesManager.getApiWithParamCall(
          {
            endPoint: "Profile/GetProfileByPersonalId",
            dataToFetch: this.props.id,
            token: tokn,
          },
          (statusCode, responseProfile) => {
            responseProfile.lat = this.state.lat;
            responseProfile.long = this.state.long;
            this.WebServicesManager.postApiCall(
              {
                endPoint: "Profile/UpdateProfile",
                dataToInsert: JSON.stringify(responseProfile),
                token: tokn,
              },
              (statusCode, responseUpdate) => {
                window.location.reload();
              }
            );
            this.setState({
              isAddDisable: false,
            });
          }
        );
        this.setState({
          isAddDisable: false,
        });
      }
    );
  };

  handleFunc = (days) => {
    this.setState({
      isAddDisable: true,
    });
    var tokn = localStorage.getItem("userdata");
    var banTill = moment().add(days, "days").format();
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Profile/GetProfileByPersonalId",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (statusCode, responcedata) => {
        const profiledata = {
          id: responcedata.id,
          role: responcedata.role,
          PersonalInfoId: responcedata.personalInfoId,
          DrivingLisenceInfoId: responcedata.drivingLisenceInfoId,
          ExersiceAuthorizationInfoId: responcedata.exersiceAuthorizationInfoId,
          VehicleDetailInfoId: responcedata.vehicleDetailInfoId,
          VehicleInsuranceInfoId: responcedata.vehicleInsuranceInfoId,
          DrivingSchoolInsuranceInfoId:
            responcedata.drivingSchoolInsuranceInfoId,
          TechnicalControlInfoId: responcedata.technicalControlInfoId,
          BusinessInfoId: responcedata.businessInfoId,
          InsuranceCompanyInfoId: responcedata.insuranceCompanyInfoId,
          DrivingSchoolIdentityInfoId: responcedata.drivingSchoolIdentityInfoId,
          DrivingSchoolApprovalInfoId: responcedata.drivingSchoolApprovalInfoId,
          DrivingSchoolManagerInfoId: responcedata.drivingSchoolManagerInfoId,
          DrivingSchoolVehiclesInfoId: responcedata.drivingSchoolVehiclesInfoId,
          DrivingSchoolInstructorInfoId:
            responcedata.drivingSchoolInstructorInfoId,
          Lat: responcedata.lat,
          Long: responcedata.long,
          Status: responcedata.status,
          BanStatus: "Ban",
          BanDate: banTill,
        };
        var dataTo = JSON.stringify(profiledata);
        this.WebServicesManager.postApiCall(
          {
            endPoint: "Profile/UpdateProfile",
            dataToInsert: dataTo,
            token: tokn,
          },
          (statusCode, response) => {
            this.WebServicesManager.getApiWithParamCall(
              {
                endPoint: "Personal/SendEmail",
                dataToFetch:
                  this.props.id +
                  "&email=" +
                  this.props.email +
                  "&emailfor=Ban",
                token: tokn,
              },
              (statusCode, EResp) => {
                // console.log("data", EResp);
                window.location.reload();
              }
            );
          }
        );
      }
    );
  };

  handleUnban = () => {
    this.setState({
      isAddDisable: true,
    });
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Profile/GetProfileByPersonalId",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (statusCode, resp) => {
        const profiledataUnban = {
          id: resp.id,
          role: resp.role,
          PersonalInfoId: resp.personalInfoId,
          DrivingLisenceInfoId: resp.drivingLisenceInfoId,
          ExersiceAuthorizationInfoId: resp.exersiceAuthorizationInfoId,
          VehicleDetailInfoId: resp.vehicleDetailInfoId,
          VehicleInsuranceInfoId: resp.vehicleInsuranceInfoId,
          DrivingSchoolInsuranceInfoId: resp.drivingSchoolInsuranceInfoId,
          TechnicalControlInfoId: resp.technicalControlInfoId,
          BusinessInfoId: resp.businessInfoId,
          InsuranceCompanyInfoId: resp.insuranceCompanyInfoId,
          DrivingSchoolIdentityInfoId: resp.drivingSchoolIdentityInfoId,
          DrivingSchoolApprovalInfoId: resp.drivingSchoolApprovalInfoId,
          DrivingSchoolManagerInfoId: resp.drivingSchoolManagerInfoId,
          DrivingSchoolVehiclesInfoId: resp.drivingSchoolVehiclesInfoId,
          DrivingSchoolInstructorInfoId: resp.drivingSchoolInstructorInfoId,
          Lat: resp.lat,
          Long: resp.long,
          Status: resp.status,
          BanStatus: "",
          BanDate: "",
        };
        var dataTo = JSON.stringify(profiledataUnban);
        this.WebServicesManager.postApiCall(
          {
            endPoint: "Profile/UpdateProfile",
            dataToInsert: dataTo,
            token: tokn,
          },
          (statusCode, response) => {
            this.WebServicesManager.getApiWithParamCall(
              {
                endPoint: "Personal/SendEmail",
                dataToFetch:
                  this.props.id +
                  "&email=" +
                  this.props.email +
                  "&emailfor=Unban",
                token: tokn,
              },
              (statusCode, EResp) => {
                // console.log("data", EResp);
                window.location.reload();
              }
            );
          }
        );
      }
    );
  };

  handlefuntDeActive = () => {
    this.setState({
      isAddDisable: true,
    });

    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Profile/GetProfileByPersonalId",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (statusCode, resp) => {
        const profiledataUnban = {
          id: resp.id,
          role: resp.role,
          PersonalInfoId: resp.personalInfoId,
          DrivingLisenceInfoId: resp.drivingLisenceInfoId,
          ExersiceAuthorizationInfoId: resp.exersiceAuthorizationInfoId,
          VehicleDetailInfoId: resp.vehicleDetailInfoId,
          VehicleInsuranceInfoId: resp.vehicleInsuranceInfoId,
          DrivingSchoolInsuranceInfoId: resp.drivingSchoolInsuranceInfoId,
          TechnicalControlInfoId: resp.technicalControlInfoId,
          BusinessInfoId: resp.businessInfoId,
          InsuranceCompanyInfoId: resp.insuranceCompanyInfoId,
          DrivingSchoolIdentityInfoId: resp.drivingSchoolIdentityInfoId,
          DrivingSchoolApprovalInfoId: resp.drivingSchoolApprovalInfoId,
          DrivingSchoolManagerInfoId: resp.drivingSchoolManagerInfoId,
          DrivingSchoolVehiclesInfoId: resp.drivingSchoolVehiclesInfoId,
          DrivingSchoolInstructorInfoId: resp.drivingSchoolInstructorInfoId,
          Lat: resp.lat,
          Long: resp.long,
          Status: resp.status,
          BanStatus: "DeActive",
          BanDate: "",
        };
        var dataTo = JSON.stringify(profiledataUnban);
        this.WebServicesManager.postApiCall(
          {
            endPoint: "Profile/UpdateProfile",
            dataToInsert: dataTo,
            token: tokn,
          },
          (statusCode, response) => {
            this.WebServicesManager.getApiWithParamCall(
              {
                endPoint: "Personal/SendEmail",
                dataToFetch:
                  this.props.id +
                  "&email=" +
                  this.props.email +
                  "&emailfor=Deactivate",
                token: tokn,
              },
              (statusCode, EResp) => {
                // console.log("data", EResp);
                window.location.reload();
              }
            );
          }
        );
      }
    );
  };

  handleDelete = () => {
    this.setState({
      isAddDisable: true,
    });

    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.postApiCall(
      {
        endPoint: `Personal/RemoveSpecificData?id=${this.props.id}`,
        token: tokn,
      },
      (statusCode, resp) => {
        console.log(resp);
        // window.location.reload();
      }
    );
  };

  showConfirmDelete = () => {
    confirm({
      title: "Are you sure you want to delete this User?",
      icon: <ExclamationCircleOutlined />,
      content: "All data regarding the user will be deleted!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.handleDelete();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  showConfirmBan1 = () => {
    confirm({
      title: "Are you sure you want to Ban this User?",
      icon: <ExclamationCircleOutlined />,
      content: "The User will be banned for 15 days!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.handleFunc(15);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  showConfirmBan2 = () => {
    confirm({
      title: "Are you sure you want to Ban this User?",
      icon: <ExclamationCircleOutlined />,
      content: "The User will be banned for 30 days!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.handleFunc(30);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  showConfirmDeactive = () => {
    confirm({
      title: "Are you sure you want to De-activate this User?",
      icon: <ExclamationCircleOutlined />,
      // content: "The User will be De-activated!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.handlefuntDeActive();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  showConfirmReactive = () => {
    confirm({
      title: "Are you sure you want to Re-activate this User?",
      icon: <ExclamationCircleOutlined />,
      // content: "The User will be De-activated!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.handleUnban();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  showConfirmUnban = () => {
    confirm({
      title: "Are you sure you want to Un-ban this User?",
      icon: <ExclamationCircleOutlined />,
      // content: "The User will be De-activated!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        this.handleUnban();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  render() {
    console.log("usercard spoken lang ", this.props);
    return (
      <Translation>
        {(t) => (
          <div className="card card-user">
            <div className="image">
              <img src={this.props.bgImage} alt="..." />
            </div>
            <div className="content">
              <div className="author">
                {/* <a href="#pablo"> */}
                <img
                  className="avatar border-gray"
                  src={
                    this.props.photo !== ""
                      ? this.props.photo
                      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAG2YAABzjgAA+swAAIT6AAB5gQAA/RMAADBtAAASKQ0eJk4AAAMAUExURevr7Jydn5manJucnuPj5JiZm9vb3PT09MvLzMLCw5GSlPr6+qeoqdXV1tHR0rW1trW2uKusrbi4urO0tLq6vKiqq7e4uLW2tqGipLm6ury8vr6+vr+/wLu8vM7OztDQ0cjJytjY2dTU1aipqqqrrMXGxqanqKmqq6Wmp9LT062usKSlprS0ta2trra2t6ytrqWmqK2ur66vsK6ur7CwsbOztK+vsK+wsbKys7GxsqOkpqOkpZ6foampq6qqrJ2eoKenqaysraKjpZqbnbi4uaKjpKSlp5eYmqioqqurrKChory8vKGio6amqKCho7Gys7CxsrGysrKzs5+gop+gobS1tbq6u7e3uLCxsbKztLi4uJWWmJaXmba3t7i5ub29vZWXmZSWmLq6upOVl5SVl7m5up6foLq7u7u7vJqcnZOUlpeZm5aYmpKUlry8vZKTlpGTlZCRlJCRk6ytr9bX197e3q+vsb2+v8DAweDh4bOztebm5ujp6e/v756eoP///4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///zfARREAAAeqSURBVHja7N3xVxJZFMBxQAQVilzPSTslBxcDdwdtBQRBDQUFBYNMDTcoNLAMM7QD23JozvvX94cJZBhQZ+bdO2/26F/Q59wv8K48JwP5n/wY7iH3kHvIPYT6D89bLBazfiF8Y+T09PT09MOHzc3Nd+8yeoTwb99+/PjkSbfj8eN83qYPSCOTOTs7O3veEP69UkcegEIdMpPJCI6zz5/f9p9HPp9//97KMsTwLZO5o2Nh4RmrkHrpmxzHwsICzyLEWSq1IXd1TE6aWYNYSqVSqSRzHpOTDsdDliC2ksBQ4HA4zOxA6iURRJ7DccizAbE9fVpyNXhlXTkcjsNDHxMQKyGEWBV35Tg89Pl8rKTVUtHVoc/n89mYgPBK3686Dt8EIcQwMzOjKUTF+1XHMbG0tLT095s3y8vL77WCqHq/Ehy+Lsdybm9aC4irRKGrLkcut7cXiUTQIS1588jfPo/cXiQSibxGhtTpdyU4kCElyq/zXMdx9AwT0qI+j1zbEQwiQmyUX+fXXR0Fg0EXGsQK1dXRUTAYDIbRIJBdBYNhNIgFsqtgOBx2IkFguwqHQyEcSAu2q3AICwLcVSjEh1oYEPCuQgbix4A4obsK+QmPAwHtKhTy+3+gvEacsF2F/H5/wIAIAevK7/cHAhgQgPNuzzwCgcAiFgSoK3/bgQWhuUdJuwosYkGgu1pcnDdgQCju5wPmMY8CAeyqPY/5+To8BKErPAjY50fb8QIHAnIu6Z7HCxwI0Lmk24ECge8KB4LQ1YuNDYS3X4SuNjbGESAIXW2M40DAuxofH0c4ayF0hQNB6AoJAt8VDgShq/GdHQwIYFfteezMIkCgzrsiBwZkhPp+LulqFgXyB/X9XDoPFEgTviscCE99P+/+/PjlwIAQ6vu5dB4vX2JAALvaaTu8OBCoc0m7q5deHAjYuaQzD68fAwJ3Luk4vC4MyAh4V17vAwxIE7orr9fLY0AIdFde7xpBg8B09cuBCAHtyrvmxoLAdrXm/h0DUgfvas3tdvPQEBdCV2632+3eHgWFwL9ftR12+yYg5CfIfi7pyu3ettvtdkAI2B4lnYfdbndBQiD28wGO9XUwiAFmP5e8zu0CxGOFgrgQu1pf93hcUJA84HlX/DoXIDkoCNB+3r8rj8fjgYIA7ef9u4KGoHXl8XheAUKAzyXdXXlezcFBwM8lXV29moODoHY1BwfB7QoSgtoVIARuj+rXFTAEtCvxPJKPoCBm1K6SyZ9gx3jorrodc0kObh/B7CrJzQJCELviZA1EJsQAtp9LuwKFENA9SjwPbhoSYgbbzwVGl0PeQGT/gg5sP+/tipuFhRCkruQORD5kFPa8qzAsJb/Ehj3v/uqKM8NDSANmPxd11cD5fgS8K5Q/3yOE2L7l9vYWALpKPuI4jsP7M3DhB+JcovyBbmoeJ0K/K45oASG0u0py09pAND7v0oM0qe7nSU4zCKG7R2kJofw5yGsFcVLcz1UOROXztah2pSWE6vkqatUO0qS2n3McFyXaQYiP2h6l0qH6qYCU9nMuGmUBon6P4qLRh9pCrJS6UjsQ9Q+cXKKwR3HRaPQfrSGESlfRFaI5pK7284OKg8aDiyl0tcIEpKV4j6LooPIoaYParlZ4NiBE2X5+7fiXMAIh6rpaIcxAeDVdUXHQem78A/n7ecfRYAlCphXsURTnQfG/JJC/RwkO9iCy9yjBEWcNoqyrlTiTEPldxZmEKOgqHt9iDyL782MlHo9vsQeRtZ9fO5iDyNyjOg72IIq62tqaYg0ib4+6drAJkd3VFJMQBV1NTe2yC5HTFZOQO+9R3fPYZQ4iu6spwcEq5PY9StTV7m6WLYjtVFlXu9nsCDMQi9+ruKtsNptOp9N/WTWHmJ/I2s8l88im0+n0/v7+Qc6mHcSiZI8a4Dg4OFhdVXGnRjHks9I9StpVx7G6uvrpU8yJCHmudD+/cR6CIxaLxR5gQJT/3ufOjljMaDQ6ASHN18q+P5fRVcdhNBqNQ9tWAEhL+ffnCuZhNBqNQ0NDQ0N+qpCmyu85lTu+fEkkEnYLDcio6u/PFXbVcSQSiYTJ5FQFeU7le0518xAcJpPJNKMMUqL0/Tk1h2l4eHh4RB6kPkHlHvKA827HsS/bMXx+nvqtdUcItfvt9OcxfH6eSqVSqa8/boU06d2/AnR8LRaLN0Pq9O6339aVckfqa7FYLB7fBKF0DxlhHsXj42PjQEgIqqspCEehUBgA8dG5347S1fFxoVAo2PpCWrrqqlAoFE5OWn0gBr11VTg5Oan0gdC63w45j1Svo2KVQujdQ8bq6qRSqVQkkAlq95DxuqpUKmUJhNb9dsyuKpVyeVQC0WNX5XK52gOx6LKrcrlabYghE5Tut+N2VS5Xq3YxhNo9ZNyuqtXqhQhipXS/HburavVCDKkzvUcN7qp60QPZ1GtXFxc1EYTV/fwaMmgetV4Iu/v5jV3VarW6CML2fj64q1qt9mc3hPX9fPA8ape9ED3sUX3mcXl5KYboY4/q5xgTQdjfz/t31QvRb1djYz0QvXYlhbC/n/ftqgeinz1KMo8eiG72KKlDBNHPHtXbVT+ILrsaG7vqgei0q6ur770QfXZ19V2A/DcAHpmC7NcZ4/wAAAAASUVORK5CYII="
                  }
                  alt="..."
                />
                <div className="content">
                  <h4 className="title">
                    {this.props.firstName}
                    <br />
                    <small>{this.props.surname}</small>
                    <hr />
                  </h4>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>{t("Email")}</th>
                        <td>
                          {this.props.contactEmail === "" ||
                          this.props.contactEmail === null
                            ? this.props.email
                            : this.props.contactEmail}
                        </td>
                      </tr>
                      {this.props.role !== "DrivingSchool" ? (
                        <tr>
                          <th>{t("Date of Birth")}</th>
                          <td>
                            {moment(this.props.dob).format("DD MMM YYYY")}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                      <tr>
                        <th>{t("Address")}</th>
                        <td>{this.props.address}</td>
                      </tr>
                      <tr>
                        <th>{t("City")}</th>
                        <td>{this.props.city}</td>
                      </tr>
                      <tr>
                        <th>{t("Phone")}</th>
                        <td>{this.props.phone}</td>
                      </tr>
                      {this.props.role !== "Student" ? (
                        <>
                          <tr>
                            <th>{t("Will work on our Platform for")}</th>
                            {this.props.giveOurPlatformTime !== null &&
                            this.props.giveOurPlatformTime !== undefined ? (
                              <td>
                                {this.props.giveOurPlatformTime} (hr/month)
                              </td>
                            ) : (
                              <td>N/A</td>
                            )}
                          </tr>
                          <tr>
                            <th>{t("Working On Other Platform")}</th>
                            {this.props.workWithOther === "true" ? (
                              <td>{this.props.whichPlatform}</td>
                            ) : (
                              <td>N/A</td>
                            )}
                          </tr>
                          <tr>
                            <th>{t("Spoken Language/s")}</th>
                            {this.props.spokenLanguage !== "" ||
                            this.props.spokenLanguage !== null ? (
                              <td>{this.props.spokenLanguage.join(", ")}</td>
                            ) : (
                              <td>N/A</td>
                            )}
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <th>{t("Spoken Language/s")}</th>
                          {/* {this.props.spokenLanguage &&
                          this.props.spokenLanguage.length > 0 ? (
                            <td>{this.props.spokenLanguage.join(", ")}</td>
                          ) : (
                            <td>N/A</td>
                          )} */}
                          {this.props.spokenLanguage !== "" ||
                          this.props.spokenLanguage !== null ? (
                            <td>{this.props.spokenLanguage.join(", ")}</td>
                          ) : (
                            <td>N/A</td>
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* </a> */}
              </div>
              <p
                className="description text-center"
                style={{ fontWeight: "bold", fontSize: 16 }}
              >
                {this.props.role}
              </p>
              {this.state.banDate !== "" ? (
                <p className="text-center" style={{ fontSize: 10 }}>
                  {t("Ban till:")}{" "}
                  {moment(this.state.banDate).format("DD/MM/YYYY")}
                </p>
              ) : (
                ""
              )}
              <center style={{ margin: "4px" }}>
                <Button
                  varient="primary"
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    width: 110,
                    color: "white",
                    backgroundColor: "#149e7a",
                    border: "0",
                    borderRadius: "4px",
                  }}
                  disabled={this.state.isAddDisable}
                  onClick={() => this.setState({ showModal: true })}
                >
                  {t("Update User")}
                </Button>
                {this.state.banStatus === "" ? (
                  <DropdownButton
                    disabled={this.state.isAddDisable}
                    bsStyle="default"
                    title={t("Ban User")}
                    noCaret
                    id="dropdown-no-caret"
                    style={{
                      fontSize: "14px",
                      marginLeft: 10,
                      marginTop: 10,
                      width: 110,
                      color: "white",
                      backgroundColor: "#ff7700",
                      border: "0",
                      borderRadius: "4px",
                    }}
                  >
                    <MenuItem
                      disabled={this.state.isAddDisable}
                      onClick={() => this.showConfirmBan1()}
                      eventKey="1"
                    >
                      {t("15 Days")}
                    </MenuItem>
                    <MenuItem
                      disabled={this.state.isAddDisable}
                      onClick={() => this.showConfirmBan2()}
                      eventKey="2"
                    >
                      {t("30 Days")}
                    </MenuItem>
                  </DropdownButton>
                ) : this.state.banStatus !== "DeActive" ? (
                  <>
                    <Button
                      varient="primary"
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        width: 110,
                        color: "white",
                        backgroundColor: "#ff7700",
                        border: "0",
                        borderRadius: "4px",
                      }}
                      disabled={this.state.isAddDisable}
                      onClick={this.showConfirmUnban}
                    >
                      {t("Un-Ban")}
                    </Button>
                  </>
                ) : (
                  ""
                )}
                {this.state.banStatus === "" &&
                this.state.banStatus !== "Ban" ? (
                  <>
                    <Button
                      varient="primary"
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        width: 110,
                        color: "white",
                        backgroundColor: "red",
                        border: "0",
                        borderRadius: "4px",
                      }}
                      disabled={this.state.isAddDisable}
                      onClick={() => this.showConfirmDelete()}
                    >
                      {t("Delete User")}
                    </Button>
                    <Button
                      varient="primary"
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        width: 110,
                        color: "white",
                        backgroundColor: "#ff7700",
                        border: "0",
                        borderRadius: "4px",
                      }}
                      disabled={this.state.isAddDisable}
                      onClick={this.showConfirmDeactive}
                    >
                      {t("De-Active")}
                    </Button>
                  </>
                ) : this.state.banStatus !== "Ban" ? (
                  <>
                    {/* <p>De-Activated</p>  */}
                    <Button
                      varient="primary"
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        width: 110,
                        color: "white",
                        backgroundColor: "#ff7700",
                        border: "0",
                        borderRadius: "4px",
                      }}
                      disabled={this.state.isAddDisable}
                      onClick={this.showConfirmReactive}
                    >
                      {t("Re-Active")}
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </center>
            </div>
            <hr />
            <div className="text-center">{this.props.socials}</div>
            {/* {console.log("My Custom", this.props)} */}
            <Modal
              className="update-modal"
              title="Update Data"
              visible={this.state.showModal}
              style={{ marginTop: "-80px" }}
              onOk={this.handleSave}
              onCancel={() => this.setState({ showModal: false })}
              footer={null}
            >
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
                                  <ControlLabel>{t("First Name")}</ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    value={this.state.firstName}
                                    onChange={(e) => {
                                      this.setState({
                                        firstName: e.target.value,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </div>
                              <div className="col-md-6">
                                <FormGroup>
                                  <ControlLabel>{t("Last Name")}</ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    value={this.state.surName}
                                    onChange={(e) => {
                                      this.setState({
                                        surName: e.target.value,
                                      });
                                    }}
                                  ></FormControl>
                                </FormGroup>
                              </div>
                            </div>
                            {this.props.role !== "DrivingSchool" ? (
                              <div className="row">
                                <div className="col-md-6">
                                  <FormGroup>
                                    <ControlLabel>{t("DOB")}</ControlLabel>
                                    <FormControl
                                      className="form-control"
                                      type="date"
                                      value={moment(this.state.dob).format(
                                        "YYYY-MM-DD"
                                      )}
                                      onChange={(e) => {
                                        this.setState({ dob: e.target.value });
                                      }}
                                    />
                                  </FormGroup>
                                </div>
                                <div className="col-md-6">
                                  <FormGroup>
                                    <ControlLabel>{t("Gender")}</ControlLabel>
                                    <FormControl
                                      componentClass="select"
                                      name="gender"
                                      value={this.state.gender}
                                      onChange={(e) =>
                                        this.setState({
                                          gender: e.target.value,
                                        })
                                      }
                                    >
                                      <option value="Male">{t("Male")}</option>
                                      <option value="Female">
                                        {t("Female")}
                                      </option>
                                      <option value="Other">
                                        {t("Other")}
                                      </option>
                                    </FormControl>
                                  </FormGroup>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="row">
                              <div className="col-md-6">
                                <FormGroup>
                                  <ControlLabel>{t("Email")}</ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    value={
                                      this.state.contactEmail === "" ||
                                      this.state.contactEmail === null
                                        ? this.state.email
                                        : this.state.contactEmail
                                    }
                                    onChange={(e) => {
                                      this.setState({
                                        contactEmail: e.target.value,
                                      });
                                    }}
                                  ></FormControl>
                                </FormGroup>
                              </div>
                              <div className="col-md-6">
                                <FormGroup>
                                  <ControlLabel>{t("Phone")}</ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    maxLength={10}
                                    onChange={(e) => {
                                      this.setState({ phone: e.target.value });
                                    }}
                                    value={this.state.phone}
                                  />
                                </FormGroup>
                              </div>
                            </div>
                            {/* <div className="row">
                              <div className="col-md-6">
                                <FormGroup>
                                  <ControlLabel>
                                    {t("Second Email")}
                                  </ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    value={this.state.secondEmail}
                                    onChange={(e) => {
                                      this.setState({
                                        secondEmail: e.target.value,
                                      });
                                    }}
                                  ></FormControl>
                                </FormGroup>
                              </div>
                              <div className="col-md-6">
                                <FormGroup>
                                  <ControlLabel>
                                    {t("Second Phone")}
                                  </ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    maxLength={10}
                                    onChange={(e) => {
                                      this.setState({
                                        secondPhone: e.target.value,
                                      });
                                    }}
                                    value={this.state.secondPhone}
                                  />
                                </FormGroup>
                              </div>
                            </div> */}

                            <div className="row">
                              <Col md={6} className="address-in">
                                <FormGroup>
                                  <ControlLabel>
                                    {t("Address")}{" "}
                                    <span className="text-red"></span>
                                  </ControlLabel>
                                  <br />
                                  <Autocomplete
                                    items={this.state.items}
                                    // shouldItemRender={(item, value) =>
                                    //     item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                                    // }
                                    getItemValue={(item) => item.label}
                                    renderItem={(item, highlighted) => (
                                      <div
                                        key={item.id}
                                        style={{
                                          backgroundColor: highlighted
                                            ? "#eee"
                                            : "transparent",
                                        }}
                                      >
                                        {item.label}
                                      </div>
                                    )}
                                    wrapperStyle={{
                                      display: "block",
                                    }}
                                    menuStyle={{
                                      zIndex: "1",
                                      position: "static",
                                      borderRadius: "3px",
                                      boxShadow:
                                        "0 2px 12px rgba(0, 0, 0, 0.1)",
                                      background: "rgba(255, 255, 255, 0.9)",
                                      padding: "2px 0",
                                      fontSize: "90%",
                                      overflow: "auto",
                                      maxHeight: "50%",
                                    }}
                                    inputProps={{ className: "form-control" }}
                                    value={this.state.address}
                                    onChange={this.getAddress}
                                    onSelect={this.SetAddress}
                                  />
                                  <HelpBlock>
                                    {this.state.addressError}
                                  </HelpBlock>
                                </FormGroup>
                              </Col>
                              <div className="col-md-6">
                                <FormGroup>
                                  <ControlLabel>Complement</ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    value={this.state.complement}
                                    onChange={(e) => {
                                      this.setState({
                                        complement: e.target.value,
                                      });
                                    }}
                                  />
                                </FormGroup>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <FormGroup>
                                  <ControlLabel>Zip Code</ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    onChange={(e) => {
                                      this.setState({
                                        highWayCodeDate: e.target.value,
                                      });
                                    }}
                                    value={this.state.zip}
                                  />
                                  <HelpBlock
                                    style={{ color: "red", fontSize: 12 }}
                                  >
                                    {this.state.zipError}
                                  </HelpBlock>
                                </FormGroup>
                              </div>
                              <div className="col-md-6">
                                <FormGroup>
                                  <ControlLabel>{t("City")}</ControlLabel>
                                  <FormControl
                                    className="form-control"
                                    value={this.state.city}
                                    onChange={(e) => {
                                      this.setState({ city: e.target.value });
                                    }}
                                  />
                                </FormGroup>
                              </div>
                            </div>
                            {this.props.role === "Student" ? (
                              <div className="row">
                                <div className="col-md-6">
                                  <FormGroup>
                                    <ControlLabel>
                                      {t("Highway Code Date")}
                                    </ControlLabel>
                                    <FormControl
                                      className="form-control"
                                      type="date"
                                      value={moment(
                                        this.state.highWayCodeDate
                                      ).format("YYYY-MM-DD")}
                                      onChange={(e) => {
                                        this.setState({
                                          highWayCodeDate: e.target.value,
                                        });
                                      }}
                                    />
                                  </FormGroup>
                                </div>
                                <div className="col-md-6">
                                  <FormGroup>
                                    <ControlLabel>
                                      {t("NEPH number")}
                                    </ControlLabel>
                                    <FormControl
                                      className="form-control"
                                      maxLength={12}
                                      onChange={(e) => {
                                        this.setState({ neph: e.target.value });
                                      }}
                                      value={this.state.neph}
                                    />
                                  </FormGroup>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="clearfix" />
                      </form>
                    </Col>
                    {this.props.role !== "DrivingSchool" ? (
                      <Row style={{ padding: "20px 0px" }}>
                        <Col md={6}>
                          <ControlLabel>
                            {t(
                              "Upload front of your ID Card/Passport/Residence permit"
                            )}
                            <span className="text-red">*</span>
                          </ControlLabel>
                          <FormControl
                            type="file"
                            bsClass="form-control"
                            onChange={this.handleFrontFileSelect}
                            accept="image/x-png,image/gif,image/jpeg,application/pdf"
                            name="frontIDPhoto"
                            id="frontIDPhoto"
                          />
                          {this.state.frontIdPathError !== "" ? (
                            <a
                              href={this.state.frontIdPathError}
                              target="noopener noreferrer"
                            >
                              {t("View current File")}
                            </a>
                          ) : (
                            ""
                          )}
                        </Col>
                        <Col md={6}>
                          <ControlLabel>
                            {t(
                              "Upload back of your ID Card/Passport/Residence permit"
                            )}
                            <span className="text-red">*</span>
                          </ControlLabel>
                          <FormControl
                            type="file"
                            bsClass="form-control"
                            onChange={this.handleBackFileSelect}
                            accept="image/x-png,image/gif,image/jpeg,application/pdf"
                            name="backIDPhoto"
                            id="backIDPhoto"
                          />
                          {this.state.backIdPathError !== "" ? (
                            <a
                              href={this.state.backIdPathError}
                              target="noopener noreferrer"
                            >
                              {t("View current File")}
                            </a>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                    ) : (
                      ""
                    )}
                    <Row>
                      <Button
                        // type="primary"
                        style={{
                          float: "right",
                          marginLeft: 10,
                          marginTop: 10,
                          width: 110,
                          color: "white",
                          backgroundColor: "#149e7a",
                          border: "0",
                          borderRadius: "4px",
                        }}
                        onClick={this.handleSave}
                        disabled={this.state.isAddDisable}
                      >
                        {t("Update")}
                      </Button>
                    </Row>
                  </Row>
                </Grid>
              </div>
            </Modal>
          </div>
        )}
      </Translation>
    );
  }
}

export default UserCard;
