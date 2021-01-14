import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormControl,
  ControlLabel,
  FormGroup,
  HelpBlock,
  Radio,
  Panel,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import Autocomplete from "react-autocomplete";
import FormInputs from "../FormInputs/FormInputs";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import moment from "moment";
import Utilities from "../../Utilities/Utilities";
import jwtDecode from "jwt-decode";
import { Base64 } from "js-base64";
import { Translation } from "react-i18next";

class InstructorAdd extends Component {
  WebServicesManager = new WebServicesManager();

  constructor(props) {
    super(props);
    this.state = {
      dataSet: [],
      language: "",
      dataSetToShow: [],
      dataInfo: [],
      CompanyName: "",
      status: "Active",
      isLoading: false,
      isDataFound: false,
      dummy: false,
      showAddBtn: false,
      showAddModel: false,
      isDisabled: true,
      position: "",
      CheckedIF: false,
      CheckedIF1: false,
      items: [],
      isShow: false,
      fName: "",
      sName: "",
      bDate: "",
      bPlace: "",
      gender: "male",
      address: "",
      city: "",
      zip: "",
      complement: "",
      email: "",
      email2: "",
      Phone: "",
      Phone2: "",
      Password: "",
      CPassword: "",
      Dnumber: "",
      DdateofObtain: "",
      DDateValidity: "",
      DEndDate: "",
      DateOfAuth: "",
      IssuingAuth: "",
      DateofExpire: "",
      Slrel: "",
      lat: "",
      long: "",
      ICInsurer: "",
      ICPNumber: "",
      fNameError: "",
      sNameError: "",
      bDateError: "",
      bPlaceError: "",
      addressError: "",
      cityError: "",
      zipError: "",
      ComplementError: "",
      emailError: "",
      email2Error: "",
      PhoneError: "",
      Phone2Error: "",
      PasswordError: "",
      CPasswordError: "",
      DnumberError: "",
      DdateofObtainError: "",
      DDateValidityError: "",
      DEndDateError: "",
      DateOfAuthError: "",
      IssuingAuthError: "",
      DateofExpireError: "",
      SlrelError: "",
      ICInsurerError: "",
      ICPNumberError: "",
      InstructorGridData: [],
      ItemLength: 1,
      proPic: "",
      proPicImagePath: "",
      drivingLicenseImagepath: "",
      drivingLicenseImage: "",
      ExeImagePath: "",
      ExeImage: "",
      ExpiryDateAdd5: "2000/01/01",
      isAddDisable: true,
    };
  }

  componentDidMount() {
    var tokn = localStorage.getItem("userdata");
    var x = jwtDecode(tokn);
    var userInfo = JSON.parse(Base64.decode(x.userData));
    this.setState({ isLoading: true });
    console.log("this.props", this.props);
  }

  componentWillMount() {
    var tokn = localStorage.getItem("userdata");
    var x = jwtDecode(tokn);
    var userInfo = JSON.parse(Base64.decode(x.userData));
    this.getLimitation(userInfo);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isLoading !== this.state.isLoading) {
      var userdata = localStorage.getItem("userdata");
      if (userdata) {
        try {
          var decoded = jwtDecode(userdata);
          userdata = JSON.parse(Base64.decode(decoded.userData));
          this.getLimitation(userdata);
        } catch (e) {
          const consent = localStorage.getItem("acceptCookies");
          const language = localStorage.getItem("language");
          localStorage.clear();
          localStorage.setItem("acceptCookies", consent);
          localStorage.setItem("language", language);
          window.location.replace("/login");
        }
      }
    }
  }

  getLimitation = (user) => {
    fetch(
      `${process.env.REACT_APP_BASE_NODE}dynamic/getuserlimits/${user.id}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userdata")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((resJson) => {
        var instructorLimit = 2;
        if (user.role === "DrivingSchool") {
          instructorLimit = resJson.instructorAddLimit;
        } else {
          instructorLimit = 0;
        }
        if (this.state.dataSet.length < instructorLimit) {
          this.setState({ showAddBtn: true });
        }
      })
      .catch((e) => console.log(e));
  };

  handleValidationCheckForButtonEnable = () => {
    // get state for input fields
    const {
      fName,
      sName,
      bDate,
      bPlace,
      gender,
      address,
      city,
      zip,
      email,
      Phone,
      Password,
      CPassword,
      Dnumber,
      DdateofObtain,
      DEndDate,
      DateOfAuth,
      IssuingAuth,
      DateofExpire,
      Slrel,
      lat,
      long,
      ICInsurer,
      ICPNumber,
      ICExpireDate,
      isContentShow,
      drivingLicenseImagepath,
      ExeImagePath,
      SlrelImagePath,
      RCProImagePath,
    } = this.state;
    // get state for error fields
    const {
      fNameError,
      sNameError,
      bDateError,
      bPlaceError,
      addressError,
      cityError,
      zipError,
      ComplementError,
      emailError,
      email2Error,
      PhoneError,
      Phone2Error,
      PasswordError,
      CPasswordError,
      DnumberError,
      DdateofObtainError,
      DDateValidityError,
      DEndDateError,
      DateOfAuthError,
      IssuingAuthError,
      DateofExpireError,
      SlrelError,
      ICInsurerError,
      ICPNumberError,
      ICExpireDateError,
      SlerlImageError,
      RcProImageError,
    } = this.state;
    // condtioning for button enabling and disableing

    if (
      fName &&
      sName &&
      bDate &&
      bPlace &&
      gender &&
      address &&
      city &&
      zip &&
      email &&
      Phone &&
      Password &&
      CPassword &&
      Dnumber &&
      DdateofObtain &&
      DEndDate &&
      DateOfAuth &&
      IssuingAuth &&
      DateofExpire &&
      lat &&
      long &&
      drivingLicenseImagepath &&
      ExeImagePath
    ) {
      // check all error are resolved
      if (
        !fNameError &&
        !sNameError &&
        !bDateError &&
        !bPlaceError &&
        !addressError &&
        !cityError &&
        !zipError &&
        !ComplementError &&
        !emailError &&
        !email2Error &&
        !PhoneError &&
        !Phone2Error &&
        !PasswordError &&
        !CPasswordError &&
        !DnumberError &&
        !DdateofObtainError &&
        !DDateValidityError &&
        !DEndDateError &&
        !DateOfAuthError &&
        !IssuingAuthError &&
        !DateofExpireError
      ) {
        //  if external provider then check for the 2 sections KBIS and Insurance
        this.setState({ isAddDisable: false });
      } else {
        this.setState({ isAddDisable: true });
      }
    } else {
      this.setState({ isAddDisable: true });
    }

    if (
      !isContentShow &&
      !Slrel &&
      !SlrelImagePath &&
      !RCProImagePath &&
      !ICInsurer &&
      !ICPNumber &&
      !ICExpireDate &&
      SlrelError &&
      ICInsurerError &&
      ICPNumberError &&
      ICExpireDateError &&
      SlerlImageError &&
      RcProImageError
    ) {
      this.setState({ isAddDisable: true });
    }
  };

  validationCheck = (e) => {
    this.setState({ fName: e.target.value }, () => {
      if (Utilities.isValidString(this.state.fName)) {
        this.setState({ fNameError: "" });
      } else {
        this.setState({ fNameError: "Should Not be empty" });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForSName = (e) => {
    this.setState({ sName: e.target.value }, () => {
      if (Utilities.isValidString(this.state.sName)) {
        this.setState({ sNameError: "" });
      } else {
        this.setState({
          sNameError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForBDate = (date) => {
    this.setState({ bDate: date }, () => {
      var today = new Date();
      var GetTodayYear = moment(today).format("YYYY");
      var GetYear = moment(this.state.bDate).format("YYYY");
      var check = GetTodayYear - GetYear;
      if (this.state.bDate === "") {
        this.setState({
          bDateError: "Should Not be empty",
        });
      } else if (check < 20) {
        this.setState({ bDateError: "20yearAgeError" });
      } else {
        this.setState({ bDateError: "" });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckforBPlace = (e) => {
    this.setState({ bPlace: e.target.value }, () => {
      if (!Utilities.checkNull(this.state.bPlace)) {
        this.setState({
          bPlaceError: "Should Not be empty",
          // isDisableSubmitBtn: true
        });
      } else {
        this.setState({
          bPlaceError: "",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForFileIDBack = (stateData) => {
    if (stateData.backIdPath === "" || stateData.backIdPath === null) {
      this.setState({ backIdPathError: "Should Not be empty" });
    } else {
      this.setState({ backIdPathError: "" });
      this.handleValidationCheckForButtonEnable();
    }
  };

  validationCheckForFileID = (stateData) => {
    if (stateData.frontIdPath === "" || stateData.frontIdPath === null) {
      this.setState({ frontIdPathError: "Should Not be empty" });
    } else {
      this.setState({ frontIdPathError: "" });
      this.handleValidationCheckForButtonEnable();
    }
  };

  validationCheckforAddress = (e) => {
    this.setState({ address: e.target.value }, () => {
      if (!Utilities.checkNull(this.state.address)) {
        this.setState({
          addressError: "Should Not be empty",
        });
      } else if (this.state.lat !== 0 && this.state.long !== 0) {
        this.setState({
          addressError: "auto-complete-error",
        });
      } else {
        this.setState({
          addressError: "",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckforZip = (e) => {
    this.setState({ zip: e.target.value }, () => {
      if (!Utilities.checkNull(this.state.zip)) {
        this.setState({
          zipError: "Should Not be empty",
        });
      } else if (!Utilities.ValidateCellNo(this.state.zip)) {
        this.setState({
          zipError: "Zip Code must be number",
        });
      } else {
        this.setState({
          zipError: "",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckforCity = (e) => {
    this.setState({ city: e.target.value }, () => {
      if (!Utilities.checkNull(this.state.city)) {
        this.setState({
          cityError: "Should Not be empty",
          isDisableSubmitBtn: true,
        });
      } else {
        this.setState({
          cityError: "",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckforEmail = (e) => {
    this.setState({ email: e.target.value }, () => {
      if (Utilities.ValidateEmail(this.state.email)) {
        this.WebServicesManager.getApiCallForEmail(
          {
            endPoint: "Personal/Email",
            dataToCheck: this.state.email,
          },
          (statusCode, response) => {
            if (response.returnStatus === true) {
              this.setState({
                emailError: "Email alread exist",
              });
            } else {
              this.setState({
                emailError: "",
              });
            }
          }
        );
        this.setState({
          emailError: "",
        });
      } else if (!Utilities.checkNull(this.state.email)) {
        this.setState({
          emailError: "Should Not be empty",
        });
      } else {
        this.setState({
          emailError: "Email should be valid",
          isDisableSubmitBtn: true,
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckforPhone = (e) => {
    this.setState({ Phone: e.target.value }, () => {
      if (!Utilities.checkNull(this.state.Phone)) {
        this.setState({
          PhoneError: "Should Not be empty",
        });
      } else if (!Utilities.ValidateCellNo(this.state.Phone)) {
        this.setState({
          PhoneError: "Must be numeric",
        });
      } else if (this.state.Phone.length < 10) {
        this.setState({
          PhoneError: "Phone must be 10 digits",
        });
      } else {
        this.setState({
          PhoneError: "",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckforPassword = (e) => {
    this.setState({ Password: e.target.value }, () => {
      if (!Utilities.checkNull(this.state.Password)) {
        this.setState({
          PasswordError: "Should Not be empty",
        });
      } else if (!Utilities.ValidatePassword(this.state.Password)) {
        this.setState({
          PasswordError: "Password must contain minimum length of 8",
        });
      } else if (this.state.Password === this.state.CPassword) {
        this.setState({
          CPasswordError: "",
        });
      } else {
        this.setState({
          PasswordError: "",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckforCPassword = (e) => {
    this.setState({ CPassword: e.target.value }, () => {
      if (!Utilities.checkNull(this.state.CPassword)) {
        this.setState({
          CPasswordError: "Should Not be empty",
        });
      } else if (this.state.Password !== this.state.CPassword) {
        this.setState({
          CPasswordError: "Password did not match",
        });
      } else {
        this.setState({
          CPasswordError: "",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForLicenseNumber = (e) => {
    this.setState({ Dnumber: e.target.value }, () => {
      if (Utilities.checkNull(this.state.Dnumber)) {
        this.setState({ DnumberError: "" });
      } else {
        this.setState({ DnumberError: "Should Not be empty" });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForDateOFob = (date) => {
    this.setState({ DdateofObtain: date }, () => {
      var today = new Date();
      if (this.state.DdateofObtain > today) {
        this.setState({ DdateofObtainError: "You can not select future date" });
      } else if (
        this.state.DdateofObtain !== "" &&
        this.state.DdateofObtain < today
      ) {
        this.setState({ DdateofObtainError: "" });
      } else {
        this.setState({ DdateofObtainError: "Should Not be empty" });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForValidityD = (date) => {
    this.setState({ DEndDate: date }, () => {
      if (this.state.DEndDate !== "") {
        this.setState({
          DEndDateError: "",
        });
        if (this.state.DEndDate <= this.state.dateOfObtainD) {
          this.setState({
            DEndDateError: "validityDateErrorInstructor",
          });
        } else if (this.state.DEndDate > this.state.dateOfObtainD) {
          if (this.state.DEndDate > new Date()) {
            this.setState({
              DEndDateError: "",
            });
          } else {
            this.setState({
              DEndDateError: "futureDateRequiredError",
            });
          }
        }
      } else {
        this.setState({
          DEndDateError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForDLicenseFile(stateVarValue) {
    if (
      stateVarValue.drivingLicenseImagepath !== "" &&
      stateVarValue.drivingLicenseImagepath !== null
    ) {
      this.setState({ drivingLicenseImageError: "" });
    } else {
      this.setState({ drivingLicenseImageError: "Should Not be empty" });
    }
    this.handleValidationCheckForButtonEnable();
  }

  handleFileSelectforDL = (e) => {
    if (
      e.target.files[0] !== "" &&
      e.target.files[0] !== null &&
      e.target.files[0] !== undefined
    ) {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          drivingLicenseImagepath: e.target.files[0].name,
        });

        localStorage.setItem("Seconddata", JSON.stringify(this.state));
        const imagedata = e.target.files[0];
        const Picture = new FormData();
        Picture.append("file", imagedata);
        this.WebServicesManager.postApiImageCall(
          {
            endPoint: "Personal/UploadProfileImage",
            dataToInsert: Picture,
          },
          (statusCode, response) => {
            // this.state.ImagePath =
            this.setState(
              {
                drivingLicenseImagepath: response,
              },
              () => {
                this.validationCheckForDLicenseFile(this.state);
                localStorage.setItem("Seconddata", JSON.stringify(this.state));
              }
            );
          }
        );
      }
    }
  };

  // end of driving license information

  // authorization to exercise information

  validationCheckForExDate = (date) => {
    this.setState({ DateOfAuth: date }, () => {
      var today = new Date();
      if (this.state.DateOfAuth !== "") {
        if (this.state.DateOfAuth < today) {
          var getTodayYear = moment(today).format("YYYY");
          var getYear = moment(this.state.DateOfAuth).format("YYYY");
          var check = getTodayYear - getYear;

          if (check <= 5) {
            this.setState({
              DateOfAuthError: "",
            });
          } else {
            this.setState({
              DateOfAuthError:
                "Obtain Date should not be more than 5 years in previous",
            });
          }
        } else {
          this.setState({
            DateOfAuthError: "You can not select future date",
          });
        }
      } else {
        this.setState({
          DateOfAuthError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForAuthority = (e) => {
    this.setState({ IssuingAuth: e.target.value }, () => {
      if (Utilities.isValidString(this.state.IssuingAuth)) {
        this.setState({
          IssuingAuthError: "",
        });
      } else {
        this.setState({
          IssuingAuthError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForDateOfExpire(date) {
    this.setState({ DateofExpire: date }, () => {
      if (this.state.DateofExpire !== "") {
        if (moment(this.state.DateofExpire).format() > moment().format()) {
          this.setState({
            DateofExpireError: "",
          });
        } else {
          this.setState({
            DateofExpireError: "pastExpireError",
          });
        }
      } else {
        this.setState({
          DateofExpireError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  }

  validationCheckForDAuthFile(stateVarValue) {
    if (
      stateVarValue.ExeImageError !== "" &&
      stateVarValue.ExeImagePath !== null
    ) {
      this.setState({ ExeImageError: "" });
    } else {
      this.setState({ ExeImageError: "Should Not be empty" });
    }
    this.handleValidationCheckForButtonEnable();
  }

  handleFileSelectforEX = (e) => {
    if (
      e.target.files[0] !== "" &&
      e.target.files[0] !== null &&
      e.target.files[0] !== undefined
    ) {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          ExeImagePath: e.target.files[0].name,
        });
        const imagedata = e.target.files[0];

        const Picture = new FormData();
        Picture.append("file", imagedata);
        this.WebServicesManager.postApiImageCall(
          {
            endPoint: "Personal/UploadProfileImage",
            dataToInsert: Picture,
          },
          (statusCode, response) => {
            // this.state.ImagePath =
            this.setState({ ExeImagePath: response }, () => {
              this.validationCheckForDAuthFile(this.state);
              localStorage.setItem("Seconddata", JSON.stringify(this.state));
            });
          }
        );
      }
    }
  };

  // end of authorization of exercise information

  // business infomation
  validationCheckForSIrel = (e) => {
    this.setState({ Slrel: e.target.value }, () => {
      if (Utilities.ValidateCellNo(this.state.Slrel)) {
        if (this.state.Slrel.length !== 14) {
          this.setState({ SlrelError: "kbis14digits" });
        } else {
          this.setState({ SlrelError: "" });
          if (this.state.kblsImage !== "") {
            this.setState({ kblsImageError: "" });
          } else {
            this.setState({ kblsImageError: "Should Not be empty" });
          }
          this.handleValidationCheckForButtonEnable();
        }
      } else if (!Utilities.checkNull(this.state.Slrel)) {
        this.setState({ SlrelError: "Should Not be empty" });
      } else {
        this.setState({ SlrelError: "Must be digits" });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForDKblsFile(stateVarValue) {
    if (stateVarValue.imagepathForKbls !== "") {
      this.setState({ SlerlImageError: "" });
      // this.props.context.checkforStepTwo(true);
    } else {
      this.setState({ SlerlImageError: "Should Not be empty" });
      //
    }
    this.handleValidationCheckForButtonEnable();
  }

  handleFileSelectforBKbls = (e) => {
    if (
      e.target.files[0] !== "" &&
      e.target.files[0] !== null &&
      e.target.files[0] !== undefined
    ) {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          SlrelImagePath: e.target.files[0].name,
        });
        const imagedata = e.target.files[0];
        const Picture = new FormData();
        Picture.append("file", imagedata);
        this.WebServicesManager.postApiImageCall(
          {
            endPoint: "Personal/UploadProfileImage",
            dataToInsert: Picture,
          },
          (statusCode, response) => {
            // this.state.ImagePath =
            console.log("Response file", response);
            if (
              response === null &&
              response === undefined &&
              response === ""
            ) {
              response = "dummyfile";
            }
            this.setState({ SlrelImagePath: response }, () => {
              this.validationCheckForDKblsFile(this.state);
              localStorage.setItem("Seconddata", JSON.stringify(this.state));
            });
          }
        );
      }
    }
  };

  // end of business information

  // insurance company inforamtion

  validationCheckForInsurer = (e) => {
    this.setState({ ICInsurer: e.target.value }, () => {
      if (Utilities.isValidString(this.state.ICInsurer)) {
        this.setState({ ICInsurerError: "" });
      } else {
        this.setState({ ICInsurerError: "Should Not be empty" });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForInsPoliceNumber = (e) => {
    this.setState({ ICPNumber: e.target.value }, () => {
      if (this.state.ICPNumber !== "") {
        this.setState({
          ICPNumberError: "",
        });
      } else {
        this.setState({
          ICPNumberError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForInsExDate = (date) => {
    this.setState({ ICExpireDate: date }, () => {
      if (this.state.ICExpireDate !== "") {
        if (this.state.ICExpireDate > new Date()) {
          this.setState({
            ICExpireDateError: "",
          });
        } else {
          this.setState({
            ICExpireDateError: "Should not be past date",
          });
        }
      } else {
        this.setState({
          ICExpireDateError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonEnable();
    });
  };

  validationCheckForRCFile(stateVarValue) {
    if (
      stateVarValue.RCProImagePath !== "" &&
      stateVarValue.RCProImagePath !== null
    ) {
      // this.validationCheckForInsExDate(stateVarValue);
      this.setState({ RcProImageError: "" });
    } else {
      this.setState({ RcProImageError: "Should Not be empty" });
      // this.props.context.checkforStepThree(false);
    }
    this.handleValidationCheckForButtonEnable();
  }

  handleFileSelectforRC = (e) => {
    if (
      e.target.files[0] !== "" &&
      e.target.files[0] !== null &&
      e.target.files[0] !== undefined
    ) {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          RCProImagePath: e.target.files[0].name,
        });
        const imagedata = e.target.files[0];

        const Picture = new FormData();
        Picture.append("file", imagedata);
        this.WebServicesManager.postApiImageCall(
          {
            endPoint: "Personal/UploadProfileImage",
            dataToInsert: Picture,
          },
          (statusCode, response) => {
            this.setState({ RCProImagePath: response }, () => {
              this.validationCheckForRCFile(this.state);
              localStorage.setItem("thirdData", JSON.stringify(this.state));
            });
          }
        );
      }
    }
  };

  handleShowModel = () => {
    this.setState({ showAddModel: !this.state.showAddModel });
  };
  updateStatus = (id) => {
    var tokn = localStorage.getItem("userdata");
    if (this.state.status !== "Delete") {
      var statystoPush;
      if (this.state.status === "Active") {
        statystoPush = "Suspend";
      } else if (this.state.status === "Suspend") {
        statystoPush = "Active";
      }
      const info = {
        id: id,
        status: statystoPush,
      };
      var dataToUpdate = JSON.stringify(info);
      this.WebServicesManager.postMethodForSuspend(
        {
          endPoint: "Profile/UpdateStatus",
          dataToUpdate: dataToUpdate,
          token: tokn,
        },
        (statusCode, response) => {
          console.log("response", response);
        }
      );
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  handleAddIns = () => {
    console.log("Add instructors clicked");
    var tokn = localStorage.getItem("userdata");
    var x = jwtDecode(tokn);
    const userinfo = JSON.parse(Base64.decode(x.userData));
  };

  handleCheck = (e) => {
    this.setState({
      CheckedIF: true,
      CheckedIF1: false,
      isContentShow: false,
    });
  };

  handleCheck2 = (e) => {
    this.setState({
      CheckedIF: false,
      CheckedIF1: true,
      isContentShow: true,
    });
  };

  handleChangeDate = (date) => {
    this.setState({ bDate: date }, () => {
      this.ValidateChecking(this.state);
    });
  };

  handleChangeDateofObtain = (date) => {
    this.setState({ DdateofObtain: date }, () => {
      this.ValidateChecking(this.state);
    });
  };

  handleChangeDateDEnd = (date) => {
    this.setState({ DEndDate: date }, () => {
      this.ValidateChecking(this.state);
    });
  };

  handleChangeDateOfAuth = (date) => {
    var updateDate = moment().format("MM-DD-YYYY");
    this.setState({ DateOfAuth: date, ExpiryDateAdd5: updateDate }, () => {
      this.ValidateChecking(this.state);
    });
  };

  handleChangeDateofExpire = (date) => {
    this.setState({ DateofExpire: date }, () => {
      this.ValidationCheckForAuthDateEX(this.state);
    });
  };
  // handle all fields state
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      // this.ValidateChecking(this.state);
    });

    if (e.target.name === "email2") {
      if (e.target.value === "") {
        this.setState({ email2Error: "" });
      } else if (this.state.email !== "") {
        if (e.target.value === this.state.email) {
          this.setState({ email2Error: "Second email should not be same" });
        } else if (!Utilities.ValidateEmail(this.state.email2)) {
          this.setState({
            email2Error: "Email should be vaild",
          });
        } else {
          this.WebServicesManager.getApiCallForEmail(
            {
              endPoint: "Personal/Email",
              dataToCheck: e.target.value,
            },
            (statusCode, response) => {
              if (response.returnStatus === true) {
                this.setState({
                  email2Error: "Email 2 alread exist",
                });
              } else {
                this.setState({ email2Error: "" });
              }
            }
          );
        }
      } else if (this.state.email === "") {
        this.setState({ email2Error: "Above email should not be empty" });
      } else {
        this.setState({ email2Error: "" });
      }
    } else if (e.target.name === "phone2") {
      if (e.target.value === "") {
        this.setState({ phone2Error: "" });
      } else if (this.state.phone !== "") {
        if (e.target.value === this.state.phone) {
          this.setState({ phone2Error: "Second phone should not be same" });
        } else if (!Utilities.ValidateCellNo(this.state.phone2)) {
          this.setState({
            phone2Error: "Phone number Must be numeric",
          });
        } else if (this.state.phone2.length < 9) {
          this.setState({
            phone2Error: "Must be 10 digits",
          });
        } else {
          this.setState({ phone2Error: "" });
        }
      } else if (this.state.phone === "") {
        this.setState({ phone2Error: "Above phone should not be empty" });
      } else {
        this.setState({ phone2Error: "" });
      }
    }
  };

  handleFileSelectForPropic = (e) => {
    if (e.target.files[0].size !== "") {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          proPic: e.target.files[0].name,
        });
        const imagedata = e.target.files[0];

        const Picture = new FormData();
        Picture.append("file", imagedata);
        this.WebServicesManager.postApiImageCall(
          {
            endPoint: "Personal/UploadProfileImage",
            dataToInsert: Picture,
          },
          (statusCode, response) => {
            this.setState({ proPicImagePath: response });
          }
        );
      }
    }
  };
  handleFileSelectForDrivingLicenseImage = (e) => {
    if (e.target.files[0].size !== "") {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          drivingLicenseImage: e.target.files[0].name,
        });
        const imagedata = e.target.files[0];

        const Picture = new FormData();
        Picture.append("file", imagedata);
        this.WebServicesManager.postApiImageCall(
          {
            endPoint: "Personal/UploadProfileImage",
            dataToInsert: Picture,
          },
          (statusCode, response) => {
            this.setState({ drivingLicenseImagepath: response });
          }
        );
      }
    }
  };
  handleFileSelectForExeImage = (e) => {
    if (e.target.files[0].size !== "") {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          ExeImage: e.target.files[0].name,
        });
        const imagedata = e.target.files[0];

        const Picture = new FormData();
        Picture.append("file", imagedata);
        this.WebServicesManager.postApiImageCall(
          {
            endPoint: "Personal/UploadProfileImage",
            dataToInsert: Picture,
          },
          (statusCode, response) => {
            this.setState({ ExeImagePath: response });
          }
        );
      }
    }
  };

  onClick() {
    this.setState({
      isShow: !this.state.isShow,
    });
  }

  checkcontent() {
    this.setState({
      isContentShow: !this.state.isContentShow,
    });
  }

  getAddress = (e) => {
    this.setState({
      address: e.target.value,
      zip: "",
      city: "",
      lat: 0,
      long: 0,
      zipError: "auto-complete-error",
      isDisableSubmitBtn: true,
    });
    fetch(
      "https://api-adresse.data.gouv.fr/search/?q=" +
        e.target.value +
        "&type=housenumber&autocomplete=1&limit=15"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("res address", responseJson);
        var addressToSet = [];
        // debugger;
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
            console.log(
              "Address to set",
              addressToSet,
              "state",
              this.state.items
            );
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
        // debugger;
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
        });
        this.handleValidationCheckForButtonEnable();
      }
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    var tokn = localStorage.getItem("userdata");
    var x = jwtDecode(tokn);
    var userInfo = JSON.parse(Base64.decode(x.userData));
    this.setState({ showAddModel: false });
    console.log("Submit", this.state);
    debugger;
    const instructorInfo = {
      id: "",
      firstName: this.state.fName,
      surName: this.state.sName,
      address: this.state.address,
      gender: this.state.gender,
      frontIdPhoto: "",
      backIdPhoto: "",
      zip: this.state.zipCode,
      city: this.state.city,
      photo: this.state.proPicImagePath,
      dob: this.state.bDate,
      placeOfBirth: this.state.bPlace,
      email: this.state.email,
      ContactEmail: this.state.email,
      secondEmail: this.state.email2,
      phone: this.state.Phone,
      secondPhone: this.state.Phone2,
      complement: this.state.complement,
      password: this.state.Password,
      lat: this.state.lat !== "" ? this.state.lat : 0,
      long: this.state.long !== "" ? this.state.long : 0,
      role: "DSInstructor",
      drivingSchoolID: userInfo.id,
    };

    const PersonalInfo = JSON.stringify(instructorInfo);
    this.WebServicesManager.postApiCall(
      {
        endPoint: "Personal",
        dataToInsert: PersonalInfo,
      },
      (statusCode, response) => {
        console.log("Response Personal", response);
        var personalRefId = response.id;
        var f = response.id + "_" + response.firstName + "_" + response.surName;
        //Driver's license
        const dLInfo = {
          id: "",
          lisenceNumber: this.state.Dnumber,
          obtainingDate: this.state.DdateofObtain,
          deliveryPlace: "",
          validityDate: this.state.DEndDate,
          drivingLisenceImagePath:
            this.state.drivingLicenseImagepath !== "" &&
            this.state.drivingLicenseImagepath !== null
              ? this.state.drivingLicenseImagepath
              : "http://160.153.244.127:82/CredentialFiles/placeholderimage.png",
          already_have_license: false,
          licenses_for: "",
          licenses_type: "",
          folder: f,
        };
        var dataToInsertOfStep2 = JSON.stringify(dLInfo);
        const eAInfo = {
          id: "",
          authorizationDate: this.state.DateOfAuth,
          issuingAuthority: this.state.IssuingAuth,
          expirationDate: this.state.DateofExpire,
          authorizationImagePath:
            this.state.ExeImagePath !== "" && this.state.ExeImagePath !== null
              ? this.state.ExeImagePath
              : "http://160.153.244.127:82/CredentialFiles/placeholderimage.png",
          folder: f,
        };
        var dataToInsertOfStep3 = JSON.stringify(eAInfo);
        const bInfo = {
          id: "",
          siretNumber: this.state.Slrel,
          siratImagePath:
            this.state.businessKBISImage !== "" &&
            this.state.businessKBISImage !== null
              ? this.state.businessKBISImage
              : "http://160.153.244.127:82/CredentialFiles/placeholderimage.png",
          folder: f,
        };
        var dataToInsertOfStep4 = JSON.stringify(bInfo);
        const ProfileInfo = {
          id: "",
          role: "DSInstructor",
          personalInfoId: personalRefId,
          drivingLisenceInfoId: dataToInsertOfStep2,
          exersiceAuthorizationInfoId: dataToInsertOfStep3,
          businessInfoId: dataToInsertOfStep4,
          insuranceCompanyInfoId: "",
          vehicleDetailInfoId: "",
          vehicleInsuranceInfoid: "",
          drivingSchoolInsuranceInfoId: "",
          technicalControlInfoId: "",
          drivingSchoolIdentityInfoId: userInfo.id,
          drivingSchoolApprovalInfoId: "",
          drivingSchoolManagerInfoId: "",
          lat: this.state.lat !== "" ? this.state.lat : 0,
          long: this.state.long !== "" ? this.state.long : 0,
          status: "Active",
        };
        var dataToInsertOfStepFinal = JSON.stringify(ProfileInfo);
        this.WebServicesManager.postApiCall(
          {
            endPoint: "Profile",
            dataToInsert: dataToInsertOfStepFinal,
          },
          (statusCode, response) => {
            var dataToPost = JSON.stringify({
              instructorId: personalRefId,
              meetup: this.state.address,
              city: this.state.city,
              zipCode: this.state.zipCode,
              lat: this.state.lat !== "" ? this.state.lat : 0,
              long: this.state.long !== "" ? this.state.long : 0,
            });
            this.WebServicesManager.postApiCall(
              {
                endPoint: "InstructorMeetupPoints",
                dataToInsert: dataToPost,
              },
              (statusCode, response) => {
                console.log("Meetup added 1");
                //  update profile table for driving School to add instructor info here.
                this.WebServicesManager.getApiWithParamCall(
                  {
                    endPoint: "Profile/GetProfileByPersonalId",
                    dataToFetch: this.props.drivingSchoolData.id,
                    token: tokn,
                  },
                  (statusCode, responseUp) => {
                    debugger;
                    const Instructros = JSON.parse(
                      responseUp.drivingSchoolInstructorInfoId
                    );
                    console.log("Instructros", Instructros);
                    var updateid = 0;
                    Object.entries(Instructros).forEach(([key, value]) => {
                      if (value === null) {
                        updateid = updateid + 1;
                        if (updateid === 1) {
                          // console.log("value",updateIns[key]);
                          Instructros[key] = personalRefId;
                        }
                      }
                    });
                    const info = {
                      id: responseUp.id,
                      role: responseUp.role,
                      PersonalInfoId: responseUp.personalInfoId,
                      DrivingLisenceInfoId: responseUp.drivingLisenceInfoId,
                      ExersiceAuthorizationInfoId:
                        responseUp.exersiceAuthorizationInfoId,
                      VehicleDetailInfoId: responseUp.vehicleDetailInfoId,
                      VehicleInsuranceInfoId: responseUp.vehicleInsuranceInfoId,
                      DrivingSchoolInsuranceInfoId:
                        responseUp.drivingSchoolInsuranceInfoId,
                      TechnicalControlInfoId: responseUp.technicalControlInfoId,
                      BusinessInfoId: responseUp.businessInfoId,
                      InsuranceCompanyInfoId: responseUp.insuranceCompanyInfoId,
                      DrivingSchoolIdentityInfoId:
                        responseUp.drivingSchoolIdentityInfoId,
                      DrivingSchoolApprovalInfoId:
                        responseUp.drivingSchoolApprovalInfoId,
                      DrivingSchoolManagerInfoId:
                        responseUp.drivingSchoolManagerInfoId,
                      DrivingSchoolVehiclesInfoId:
                        responseUp.drivingSchoolVehiclesInfoId,
                      DrivingSchoolInstructorInfoId: JSON.stringify(
                        Instructros
                      ),
                      Lat: responseUp.lat,
                      Long: responseUp.long,
                      Status: responseUp.status,
                    };
                    console.log("info", info);
                    const dataToUpdate = JSON.stringify(info);
                    this.WebServicesManager.postApiCall(
                      {
                        endPoint: "Profile/UpdateProfile",
                        dataToInsert: dataToUpdate,
                        token: tokn,
                      },
                      (statusCode, responseNewUp) => {
                        console.log("after update", responseNewUp);
                        alert("Successfully Added");
                        this.props.update();
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  };
  render() {
    return (
      <Translation>
        {(t) => (
          <>
            <div
              className={this.props.showAddModel ? "form-show" : "form-hide"}
            >
              <Grid className="panel-grid">
                <Panel
                  style={{
                    boxShadow: "2px 2px 2px 2px #ccc",
                    margin: "10px 0px",
                  }}
                >
                  <Panel.Body>
                    <Translation>
                      {(t) => (
                        <label className="my-3 ml-1 reg-Label">
                          {t("Identity Of Instructor")}
                        </label>
                      )}
                    </Translation>
                    <form className="cField" onSubmit={this.onSubmit}>
                      <Row>
                        <Grid>
                          <FormInputs
                            ncols={["col-md-4", "col-md-3", "col-md-3"]}
                            properties={[
                              {
                                label: "First Name",
                                type: "text",
                                bsClass: "form-control",
                                name: "fName",
                                value: this.state.fName,
                                onChange: this.validationCheck,
                                help: this.state.fNameError,
                                isImport: false,
                                autoComplete: "off",
                              },
                              {
                                label: "Surname",
                                type: "text",
                                bsClass: "form-control",
                                name: "sName",
                                value: this.state.sName,
                                onChange: this.validationCheckForSName,
                                help: this.state.sNameError,
                                isImport: false,
                                autoComplete: "off",
                              },
                              {
                                label: "Upload Image",
                                type: "file",
                                bsClass: "form-control",
                                onChange: this.handleFileSelectForPropic,
                                isImport: true,
                                accept: "image/jpeg,application/pdf",
                              },
                            ]}
                          />
                          <Row>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Date of Birth")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <DatePicker
                                selected={this.state.bDate}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) =>
                                  this.validationCheckForBDate(date)
                                }
                                placeholderText="DD/MM/YYYY"
                                openToDate={new Date("2000/01/01")}
                                autoComplete="off"
                              />
                              <HelpBlock>{t(this.state.bDateError)}</HelpBlock>
                            </Col>
                            <Col md={3}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Place of Birth")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <FormControl
                                type="text"
                                name="bPlace"
                                id="bPlace"
                                className="form-control"
                                onChange={this.validationCheckforBPlace}
                                autoComplete="off"
                              />
                              <HelpBlock>{t(this.state.bPlaceError)}</HelpBlock>
                            </Col>
                            <Col md={3}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Gender")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <br />
                              <FormControl
                                componentClass="select"
                                name="gender"
                                value={this.state.gender}
                                onChange={this.handleChange}
                              >
                                <Translation>
                                  {(t) => (
                                    <React.Fragment>
                                      <option value="Male">{t("Male")}</option>
                                      <option value="Female">
                                        {t("Female")}
                                      </option>
                                      <option value="Other">
                                        {t("Other")}
                                      </option>
                                    </React.Fragment>
                                  )}
                                </Translation>
                              </FormControl>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={5}>
                              <FormGroup>
                                <Translation>
                                  {(t) => (
                                    <ControlLabel>
                                      {t("Address")}{" "}
                                      <span className="text-red">*</span>
                                    </ControlLabel>
                                  )}
                                </Translation>
                                <br />
                                <Autocomplete
                                  items={this.state.items}
                                  shouldItemRender={(item, value) =>
                                    item.label
                                      .toLowerCase()
                                      .indexOf(value.toLowerCase()) > -1
                                  }
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
                                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                                    background: "rgba(255, 255, 255, 0.9)",
                                    padding: "2px 0",
                                    fontSize: "90%",
                                    overflow: "auto",
                                    maxHeight: "50%",
                                  }}
                                  inputProps={{
                                    className: "form-control",
                                  }}
                                  value={this.state.address}
                                  onChange={this.getAddress}
                                  onSelect={this.SetAddress}
                                />
                                <HelpBlock>
                                  {t(this.state.addressError)}
                                </HelpBlock>
                              </FormGroup>
                            </Col>
                            <Col md={5}>
                              <FormGroup>
                                <Translation>
                                  {(t) => (
                                    <ControlLabel>
                                      {t("Complement")}
                                      {/* <span className="text-red">*</span> */}
                                    </ControlLabel>
                                  )}
                                </Translation>
                                <FormControl
                                  type="text"
                                  name="complement"
                                  value={this.state.complement}
                                  onChange={this.handleChange}
                                  autoComplete="off"
                                />
                                <HelpBlock>{t(this.state.cityError)}</HelpBlock>
                              </FormGroup>
                            </Col>
                          </Row>
                          <FormInputs
                            ncols={["col-md-5", "col-md-5"]}
                            properties={[
                              {
                                label: "ZIP CODE",
                                type: "text",
                                bsClass: "form-control",
                                name: "zip",
                                value: this.state.zip,
                                onChange: this.handleChange,
                                help: this.state.zipError,
                                readOnly: true,
                                isImport: false,
                                autoComplete: "off",
                              },
                              {
                                label: "City",
                                type: "text",
                                bsClass: "form-control",
                                name: "city",
                                value: this.state.city,
                                onChange: this.handleChange,
                                autoComplete: "off",
                                help: this.state.cityError,
                                readOnly: true,
                                isImport: false,
                                autoComplete: "off",
                              },
                            ]}
                          />
                          <FormInputs
                            ncols={["col-md-5", "col-md-5"]}
                            properties={[
                              {
                                label: "Email",
                                type: "email",
                                bsClass: "form-control",
                                name: "email",
                                value: this.state.email,
                                onChange: this.validationCheckforEmail,
                                help: this.state.emailError,
                                isImport: false,
                                autoComplete: "off",
                              },
                              {
                                label: "Phone",
                                type: "text",
                                bsClass: "form-control",
                                name: "Phone",
                                value: this.state.Phone,
                                onChange: this.validationCheckforPhone,
                                help: this.state.PhoneError,
                                isImport: false,
                                maxLength: 10,
                                autoComplete: "off",
                              },
                            ]}
                          />
                          <FormInputs
                            ncols={["col-md-5", "col-md-5"]}
                            properties={[
                              {
                                label: "Email (2nd email)",
                                type: "email",
                                bsClass: "form-control",
                                name: "email2",
                                value: this.state.email2,
                                onChange: this.handleChange,
                                isImport: true,
                                autoComplete: "off",
                                help: this.state.email2Error,
                              },
                              {
                                label: "Phone (2nd phone)",
                                type: "text",
                                bsClass: "form-control",
                                name: "Phone2",
                                value: this.state.Phone2,
                                onChange: this.handleChange,
                                isImport: true,
                                autoComplete: "off",
                                maxLength: 10,
                              },
                            ]}
                          />
                          <FormInputs
                            ncols={["col-md-5", "col-md-5"]}
                            properties={[
                              {
                                label: "Password",
                                type: "password",
                                bsClass: "form-control",
                                name: "Password",
                                value: this.state.Password,
                                onChange: this.validationCheckforPassword,
                                help: this.state.PasswordError,
                                isImport: false,
                                autoComplete: "off",
                              },
                              {
                                label: "Confirm Password",
                                type: "password",
                                bsClass: "form-control",
                                name: "CPassword",
                                value: this.state.CPassword,
                                onChange: this.validationCheckforCPassword,
                                help: this.state.CPasswordError,
                                isImport: false,
                                autoComplete: "off",
                              },
                            ]}
                          />
                        </Grid>
                      </Row>
                      <Row>
                        <Grid>
                          <Row>
                            <label className="my-3 ml-1 reg-Label">
                              {t("Driver's License")}
                            </label>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Number")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <FormControl
                                type="text"
                                name="Dnumber"
                                id="Dnumber"
                                onChange={this.validationCheckForLicenseNumber}
                                bsClass="form-control"
                                autoComplete="off"
                              />
                              <HelpBlock>
                                {t(this.state.DnumberError)}
                              </HelpBlock>
                            </Col>
                            <Col md={3}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Date of Obtaining")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <DatePicker
                                selected={this.state.DdateofObtain}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) =>
                                  this.validationCheckForDateOFob(date)
                                }
                                autoComplete="off"
                                placeholderText="DD/MM/YYYY"
                              />
                              <HelpBlock>
                                {t(this.state.DdateofObtainError)}
                              </HelpBlock>
                            </Col>
                            <Col md={3}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Scan and Upload your Driving License")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <FormControl
                                type="file"
                                bsClass="form-control"
                                onChange={this.handleFileSelectforDL}
                                accept="image/jpeg,application/pdf"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("End Date")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <DatePicker
                                selected={this.state.DEndDate}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) =>
                                  this.validationCheckForValidityD(date)
                                }
                                placeholderText="DD/MM/YYYY"
                                autoComplete="off"
                              />
                              <HelpBlock>
                                {t(this.state.DEndDateError)}
                              </HelpBlock>
                            </Col>
                          </Row>
                        </Grid>
                      </Row>
                      <Row>
                        <Grid>
                          <Row>
                            <Translation>
                              {(t) => (
                                <label className="my-3 ml-1 reg-Label">
                                  {t("Authorization to Exercise")}
                                </label>
                              )}
                            </Translation>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Date of the authorization to exercise")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <DatePicker
                                selected={this.state.DateOfAuth}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) =>
                                  this.validationCheckForExDate(date)
                                }
                                autoComplete="off"
                                placeholderText="DD/MM/YYYY"
                              />
                              <HelpBlock>
                                {t(this.state.DateOfAuthError)}
                              </HelpBlock>
                            </Col>
                            <Col md={3}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Issuing Authority")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <FormControl
                                type="text"
                                name="IssuingAuth"
                                id="IssuingAuth"
                                onChange={this.validationCheckForAuthority}
                                bsClass="form-control"
                                autoComplete="off"
                              />
                              <HelpBlock>
                                {t(this.state.IssuingAuthError)}
                              </HelpBlock>
                            </Col>
                            <Col md={3}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Scan and upload your authorization")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <FormControl
                                type="file"
                                bsClass="form-control"
                                onChange={this.handleFileSelectforEX}
                                accept="image/jpeg,application/pdf"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Expiration date")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <DatePicker
                                selected={this.state.DateofExpire}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) =>
                                  this.validationCheckForDateOfExpire(date)
                                }
                                autoComplete="off"
                                placeholderText="DD/MM/YYYY"
                              />
                              <HelpBlock>
                                {t(this.state.DateofExpireError)}
                              </HelpBlock>
                            </Col>
                          </Row>
                        </Grid>
                      </Row>

                      <Row>
                        <Grid>
                          <Row>
                            <Translation>
                              {(t) => (
                                <label className="my-3 ml-1 reg-Label">
                                  {t(
                                    "Type of contract with the driving school"
                                  )}
                                </label>
                              )}
                            </Translation>
                          </Row>
                          <FormGroup>
                            <Radio
                              name="contract"
                              inline
                              value="Employee"
                              id="Employee"
                              onChange={this.handleCheck}
                            >
                              {t("Employee")}
                            </Radio>
                            <Radio
                              name="contract"
                              inline
                              value="External Provider"
                              onChange={this.handleCheck2}
                            >
                              {t("External provider")}
                            </Radio>
                          </FormGroup>
                          <div
                            className={
                              this.state.isContentShow
                                ? "form-show"
                                : "form-hide"
                            }
                          >
                            <Row>
                              <Grid>
                                <Row>
                                  <Translation>
                                    {(t) => (
                                      <label className="my-3 ml-1 reg-Label">
                                        {t("Business")}
                                      </label>
                                    )}
                                  </Translation>
                                </Row>
                                <FormInputs
                                  ncols={["col-md-5", "col-md-5"]}
                                  properties={[
                                    {
                                      label: "SIrel Number",
                                      type: "text",
                                      bsClass: "form-control",
                                      name: "Slrel",
                                      value: this.state.Slrel,
                                      help: this.state.SlrelError,
                                      onChange: this.validationCheckForSIrel,
                                      autoComplete: "off",
                                      maxLength: 14,
                                    },
                                    {
                                      label: "Upload your kbls",
                                      type: "file",
                                      onChange: this.handleFileSelectforBKbls,
                                      bsClass: "form-control",
                                      help: this.state.SlerlImageError,
                                    },
                                  ]}
                                />
                              </Grid>
                            </Row>
                            <Row>
                              <Grid>
                                <Row>
                                  <Translation>
                                    {(t) => (
                                      <label className="my-3 ml-1 reg-Label">
                                        {t("Insurance Company")}
                                      </label>
                                    )}
                                  </Translation>
                                </Row>
                                <FormInputs
                                  ncols={["col-md-5", "col-md-5"]}
                                  properties={[
                                    {
                                      label: "Insurer",
                                      type: "text",
                                      bsClass: "form-control",
                                      name: "ICInsurer",
                                      value: this.state.ICInsurer,
                                      onChange: this.validationCheckForInsurer,
                                      autoComplete: "off",
                                    },
                                    {
                                      label: "Police number",
                                      type: "text",
                                      bsClass: "form-control",
                                      name: "ICPNumber",
                                      value: this.state.ICPNumber,
                                      onChange: this
                                        .validationCheckForInsPoliceNumber,
                                      autoComplete: "off",
                                    },
                                  ]}
                                />
                                <FormInputs
                                  ncols={["col-md-5", "col-md-5"]}
                                  properties={[
                                    {
                                      label: "Expiry Date",
                                      type: "date",
                                      value: this.state.ICExpireDate,
                                      onChange: (date) =>
                                        this.validationCheckForInsExDate(date),
                                      bsClass: "form-control",
                                    },
                                    {
                                      label: "Upload your RC Pro",
                                      onChange: this.handleFileSelectforRC,
                                      type: "file",
                                      bsClass: "form-control",
                                    },
                                  ]}
                                />
                              </Grid>
                            </Row>
                          </div>
                        </Grid>
                      </Row>
                      <button
                        className="form-cust-btn"
                        onClick={this.onSubmit}
                        disabled={this.state.isAddDisable}
                        style={{ width: "20%", marginRight: "70px" }}
                      >
                        {t("Add")}
                      </button>
                    </form>
                  </Panel.Body>
                </Panel>
              </Grid>
            </div>
          </>
        )}
      </Translation>
    );
  }
}

export default InstructorAdd;
