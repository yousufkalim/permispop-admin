import React, { Component } from "react";
import {
  Table,
  Modal,
  Button,
  Col,
  Row,
  ControlLabel,
  HelpBlock,
  Form,
  FormControl,
  Grid,
  FormGroup,
} from "react-bootstrap";
import FormInputs from "../../components/FormInputs/FormInputs";
import Loader from "react-loader-spinner";
import { Translation } from "react-i18next";
import DatePicker from "react-datepicker";
import "font-awesome/css/font-awesome.min.css";
import ID from "components/Documents/ID.jsx";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import moment from "moment";
import Utilities from "../../Utilities/Utilities";

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
      veh1: {},
      veh2: {},
      veh3: {},
      dsa: {},
      profileData: "",
      vehicleInfo: "",
      // vehicle Add States
      registerDate: "",
      brand: "",
      model: "",
      numberPlate: "",
      numberPlateError: "",
      gearBox: "Auto",
      color: "",
      energy: "Diesel",
      VInsurer: "",
      VImage: "",
      registerDateError: "",
      brandError: "",
      modelError: "",
      gearBoxError: "",
      colorError: "",
      energyError: "",
      VInsurerError: "",
      VImageError: "",
      VCertificateImage: "",
      DSVCertificateImage: "",
      VInsuranceImage: "",
      TCImage: "",
      VpoliceNumber: "",
      VStartDate: "",
      VEndDate: "",
      DrivingSchoolInsuranceEndDate: "",
      startDateOfTech: "",
      endDateOfTech: "",
      VpoliceNumberError: "",
      VStartDateError: "",
      VEndDateError: "",
      DrivingSchoolInsuranceEndDateError: "",
      startDateOfTechError: "",
      endDateOfTechError: "",
      VImagePath: "",
      VCertifiateImagePath: "",
      VCertificateImageError: "",
      DSVCertifiateImagePath: "",
      TCImagePath: "",
      VInsuranceImagePath: "",
      isAddDisable: true,
      showAddModel: false,
      brandList: [],
      modelList: [],
      techicalID: "",
      insuranceID: "",
      detailID: "",
      loading: false,
    };
  }
  componentWillMount() {
    var tokn = localStorage.getItem("userdata");
    this.setState({
      folder: `${this.props.id}_${this.props.firstName}_${this.props.surName}`,
    });
    this.loadDataFromProps();
  }
  componentDidMount() {
    this.getData();
    this.getVehicleMakeData();
    this.getVehicleModelData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id !== this.props.id) {
      this.loadDataFromProps();
      this.getData();
      this.getVehicleMakeData();
      this.getVehicleModelData();
    }
  }

  loadDataFromProps = () => {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Profile/GetProfileByPersonalId",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (statusCode, responseProfile) => {
        var vehicle = "";
        if (
          responseProfile.role === "Instructor" ||
          responseProfile.role === "CarRentalAgent"
        ) {
          if (responseProfile.vehicleDetailInfoId !== "") {
            vehicle = JSON.parse(responseProfile.vehicleDetailInfoId);
          }
        } else if (responseProfile.role === "DSInstructor") {
          vehicle = {};
        } else {
          if (responseProfile.drivingSchoolVehiclesInfoId !== "") {
            vehicle = JSON.parse(responseProfile.drivingSchoolVehiclesInfoId);
          }
        }
        var vehicleData = {};
        if (vehicle !== null && Object.entries(vehicle).length > 0) {
          Object.entries(vehicle).forEach(([key, value]) => {
            this.WebServicesManager.getApiWithParamCall(
              {
                endPoint: "VehicleDetail/GetVehicleDetailByIdAsync",
                dataToFetch: value,
                token: tokn,
              },
              (statusCode, responseVehicle) => {
                vehicleData[key] = responseVehicle;
                if (
                  Object.entries(vehicleData).length ===
                  Object.entries(vehicle).length
                ) {
                  this.setState(
                    { profileData: responseProfile, vehicleInfo: vehicleData },
                    () => {}
                  );
                }
              }
            );
          });
        } else {
          this.setState(
            { profileData: responseProfile, vehicleInfo: vehicleData },
            () => {}
          );
        }
      }
    );
  };

  getData = (e) => {
    var tokn = localStorage.getItem("userdata");
    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Document/GetUserDoc",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (statusCode, list) => {
        var newState = {};
        list
          .filter((item) => item.documentName.includes("veh"))
          .map((item) => {
            newState[item.documentName] = item;
          });
        this.setState(
          {
            profile: list.find((o) => o.documentName === "profile"),
            frontDoc: list.find((o) => o.documentName === "fic"),
            backDoc: list.find((o) => o.documentName === "bic"),
            drvLic: list.find((o) => o.documentName === "drvlic"),
            exeDoc: list.find((o) => o.documentName === "aoe"),
            kbl: list.find((o) => o.documentName === "kbl"),
            rc: list.find((o) => o.documentName === "rc"),
            greenCard: list.find((o) => o.documentName === "greenCard"),
            vImg: list.find((o) => o.documentName === "vImg"),
            vReg: list.find((o) => o.documentName === "vReg"),
            vIns: list.find((o) => o.documentName === "vIns"),
            dsa: list.find((o) => o.documentName === "dsa"),
            ...newState,
          },
          () => {}
        );
      }
    );
  };

  maildata = (m) => {
    var tokn = localStorage.getItem("userdata");
    var notVerfiedDoc = "";
    const listToMatch = {
      fic: "Front Id Card",
      bic: "Back Id Card",
      drvlic: "Driving Licence",
      aoe: "Authorizatio of Exercise",
      kbl: "kbls",
      veh: "Vehicle Image",
      vreg: "Vehicle Registration",
      vins: "Vehicle Insurance",
      rc: "Rcpro",
    };

    // const listAllDocument = {
    //   fic: "Front Id Card",
    //   bic: "Back Id Card",
    //   drvlic: "Driving Licence",
    //   aoe: "Authorizatio of Exercise",
    //   kbl: "kbls",
    //   veh: "Vehicle Image",
    //   vreg: "Vehicle Registration",
    //   vins: "Vehicle Insurance",
    //   rc: "Rcpro",
    //   greenCard: "Green Card",
    //   vImg: "Vehicle Image",
    //   dsa: "dsa",
    // };

    this.WebServicesManager.getApiWithParamCall(
      {
        endPoint: "Document/GetUserDoc",
        dataToFetch: this.props.id,
        token: tokn,
      },
      (statusCode, Response) => {
        console.log("Result", Response);
        for (var i = 0; i < Response.length; i++) {
          if (Response[i].status === "false") {
            notVerfiedDoc = `${notVerfiedDoc}**${
              listToMatch[Response[i].documentName]
            }`;
          }
        }
        this.WebServicesManager.getApiWithParamCall(
          {
            endPoint: "Personal/EmailDocuments",
            dataToFetch: `${this.props.id}&email=${this.props.email}&doc=${notVerfiedDoc}`,
            token: tokn,
          },
          (statusCode, responseEmail) => {
            console.log("email");
            alert("mail sent successfully");
          }
        );
      }
    );
  };

  // add vehicle Logic state here
  handleResetState = () => {
    this.setState({
      showAddModel: false,
      // vehicle info states
      registerDate: "",

      numberPlate: "",
      numberPlateError: "",
      gearBox: "Auto",
      color: "",
      energy: "Diesel",
      VInsurer: "",
      VImage: "",
      registerDateError: "",
      brandError: "",
      modelError: "",
      gearBoxError: "",
      colorError: "",
      energyError: "",
      VInsurerError: "",
      VImageError: "",
      VCertificateImage: "",
      DSVCertificateImage: "",
      VInsuranceImage: "",
      TCImage: "",
      VpoliceNumber: "",
      VStartDate: "",
      VEndDate: "",
      DrivingSchoolInsuranceEndDate: "",
      startDateOfTech: "",
      endDateOfTech: "",
      VpoliceNumberError: "",
      VStartDateError: "",
      VEndDateError: "",
      DrivingSchoolInsuranceEndDateError: "",
      startDateOfTechError: "",
      endDateOfTechError: "",
      VImagePath: "",
      VCertifiateImagePath: "",
      VCertificateImageError: "",
      DSVCertifiateImagePath: "",
      TCImagePath: "",
      VInsuranceImagePath: "",
      isAddDisable: true,
      loading: false,
    });
  };

  // enable/disable add button
  // button enables on state changes
  handleValidationCheckForButtonDisable = () => {
    // get input fields values
    const {
      registerDate,
      brand,
      model,
      numberPlate,
      gearBox,
      color,
      energy,
      VInsurer,
      VpoliceNumber,
      VStartDate,
      VEndDate,
      startDateOfTech,
      endDateOfTech,
      VImagePath,
      TCImagePath,
      VCertifiateImagePath,
      VInsuranceImagePath,
    } = this.state;
    // get errros value
    const {
      registerDateError,
      brandError,
      modelError,
      numberPlateError,
      gearBoxError,
      colorError,
      energyError,
      VInsurerError,
      VpoliceNumberError,
      VStartDateError,
      VEndDateError,
      startDateOfTechError,
      endDateOfTechError,
      VImageError,
      VCertificateImageError,
    } = this.state;
    // conditionings
    if (
      registerDate &&
      brand &&
      model &&
      numberPlate &&
      gearBox &&
      color &&
      energy &&
      VInsurer &&
      VpoliceNumber &&
      VStartDate &&
      VEndDate &&
      VImagePath &&
      VCertifiateImagePath &&
      VInsuranceImagePath
    ) {
      // if techincal date
      if (
        (startDateOfTech &&
          endDateOfTech &&
          TCImagePath &&
          !startDateOfTechError &&
          !endDateOfTechError) ||
        (!startDateOfTech &&
          !endDateOfTech &&
          !TCImagePath &&
          !startDateOfTechError &&
          !endDateOfTechError)
      ) {
        // if errors
        if (
          !registerDateError &&
          !brandError &&
          !modelError &&
          !numberPlateError &&
          !gearBoxError &&
          !colorError &&
          !energyError &&
          !VInsurerError &&
          !VpoliceNumberError &&
          !VStartDateError &&
          !VEndDateError
        ) {
          console.log("true");
          this.setState({ isAddDisable: false });
        } else {
          console.log("false 2 inner");
          this.setState({ isAddDisable: true });
        }
      } else {
        console.log("false inner");
        this.setState({ isAddDisable: true });
      }
    } else {
      console.log("false outer");
      this.setState({ isAddDisable: true });
    }
  };

  // new Validations start

  validationCheckForRegisterDate = (date) => {
    this.setState({ registerDate: date }, () => {
      if (this.state.registerDate !== "") {
        if (this.state.registerDate < new Date()) {
          this.setState({ registerDateError: "" });
        } else {
          this.setState({
            registerDateError: "Date should not be future date",
          });
        }
      } else {
        this.setState({
          registerDateError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVehicleBrand = (e) => {
    this.setState({ brand: e.target.value }, () => {
      if (Utilities.isValidString(this.state.brand)) {
        this.setState({ brandError: "" });
      } else {
        this.setState({
          brandError: "Should Not be empty",
        });
      }
      this.getVehicleModelData();
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVehicleModel = (e) => {
    this.setState({ model: e.target.value }, () => {
      if (Utilities.isValidString(this.state.model)) {
        this.setState({ modelError: "" });
      } else {
        this.setState({
          modelError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVehicleNumberPlate = (e) => {
    this.setState({ numberPlate: e.target.value }, () => {
      if (Utilities.isValidString(this.state.numberPlate)) {
        this.setState({ numberPlateError: "" });
      } else {
        this.setState({
          numberPlateError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVehicleGearBox = (e) => {
    this.setState({ gearBox: e.target.value }, () => {
      if (Utilities.isValidString(this.state.gearBox)) {
        this.setState({ gearBoxError: "" });
      } else {
        this.setState({
          gearBoxError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVehicleColor = (e) => {
    this.setState({ color: e.target.value }, () => {
      if (Utilities.isValidString(this.state.color)) {
        this.setState({ colorError: "" });
      } else {
        this.setState({
          colorError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVehicleEnergy = (e) => {
    this.setState({ energy: e.target.value }, () => {
      if (Utilities.isValidString(this.state.energy)) {
        this.setState({ energyError: "" });
      } else {
        this.setState({
          energyError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVInsurer = (e) => {
    this.setState({ VInsurer: e.target.value }, () => {
      if (Utilities.isValidString(this.state.VInsurer)) {
        this.setState({
          VInsurerError: "",
        });
      } else {
        this.setState({
          VInsurerError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVInPoliceNumber = (e) => {
    this.setState({ VpoliceNumber: e.target.value }, () => {
      if (this.state.VpoliceNumber !== "") {
        this.setState({
          VpoliceNumberError: "",
        });
      } else {
        this.setState({
          VpoliceNumberError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVStartD = (date) => {
    this.setState({ VStartDate: date }, () => {
      if (this.state.VStartDate !== "") {
        if (this.state.VStartDate < new Date()) {
          this.setState({
            VStartDateError: "",
          });
        } else {
          this.setState({
            VStartDateError: "Should not be future date",
          });
        }
      } else {
        this.setState({
          VStartDateError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  validationCheckForVEndD = (date) => {
    this.setState({ VEndDate: date }, () => {
      if (this.state.VEndDate !== "") {
        if (this.state.VEndDate > this.state.VStartDate) {
          if (this.state.VEndDate > new Date()) {
            this.setState({
              VEndDateError: "",
            });
          } else {
            this.setState({
              VEndDateError: "Should not be past date",
            });
          }
        } else {
          this.setState({
            VEndDateError: "Should not be past date",
          });
        }
      } else {
        this.setState({
          VEndDateError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  handleChangeDateForStartTech = (date) => {
    this.setState({ startDateOfTech: date }, () => {
      if (this.state.startDateOfTech !== "") {
        if (this.state.startDateOfTech < new Date()) {
          this.setState({
            startDateOfTechError: "",
          });
        } else {
          this.setState({
            startDateOfTechError: "Should not be future date",
          });
        }
      } else {
        this.setState({
          startDateOfTechError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  handleChangeDateForEndTech = (date) => {
    this.setState({ endDateOfTech: date }, () => {
      if (this.state.endDateOfTech !== "") {
        if (
          this.state.endDateOfTech > this.state.startDateOfTech &&
          this.state.endDateOfTech > new Date()
        ) {
          this.setState({
            endDateOfTechError: "",
            isAddDisable: false,
          });
        } else {
          this.setState({
            endDateOfTechError: "End should not be past date",
            isAddDisable: true,
          });
        }
      } else {
        this.setState({
          endDateOfTechError: "Should Not be empty",
        });
      }
      this.handleValidationCheckForButtonDisable();
    });
  };

  handleFileSelectForVImage = (e) => {
    if (e.target.files[0].size !== "") {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          VImage: e.target.files[0].name,
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
            this.setState({ VImagePath: response }, () => {
              this.handleValidationCheckForButtonDisable();
            });
          }
        );
      }
    }
  };

  handleFileSelectForVCertificate = (e) => {
    if (e.target.files[0].size !== "") {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          VCertificateImage: e.target.files[0].name,
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
            this.setState({ VCertifiateImagePath: response }, () => {
              this.handleValidationCheckForButtonDisable();
            });
          }
        );
      }
    }
  };

  handleFileSelectForDSVImage = (e) => {
    if (e.target.files[0].size !== "") {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          DSVCertificateImage: e.target.files[0].name,
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
            this.setState({ DSVCertifiateImagePath: response }, () => {
              this.handleValidationCheckForButtonDisable();
            });
          }
        );
      }
    }
  };

  handleFileSelectForVInsurance = (e) => {
    if (e.target.files[0].size !== "") {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          VInsuranceImagePath: e.target.files[0],
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
            this.setState({ VInsuranceImagePath: response }, () => {
              this.handleValidationCheckForButtonDisable();
            });
          }
        );
      }
    }
  };

  handleFileSelectForTCImage = (e) => {
    if (e.target.files[0].size !== "") {
      if (e.target.files[0].size > 10506316) {
        alert("File is too big!");
        e.target.value = "";
      } else {
        this.setState({
          TCImage: e.target.files[0].name,
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
            this.setState({ TCImagePath: response }, () => {
              this.handleValidationCheckForButtonDisable();
            });
          }
        );
      }
    }
  };

  // new validation end

  // handle all fields state generic.
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.handleValidationCheckForButtonDisable();
    });
  };

  handleShowModel = () => {
    this.setState({
      showAddModel: !this.state.showAddModel,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    // String capitalize /
    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    const vehicleInsurance = {
      greenCardImagePath: this.state.VInsuranceImagePath,
      insurer: toTitleCase(this.state.VInsurer),
      policeNumber: this.state.VpoliceNumber,
      startDate: this.state.VStartDate,
      endDate: this.state.VEndDate,
      folder: this.state.folder,
    };

    const vehicleTechnicalControl = {
      startDateOfTech: this.state.startDateOfTech,
      endDateOfTechControl: this.state.endDateOfTech,
      technicalControlImagePath: this.state.TCImagePath,
      dateofTechnicalControl: this.state.startDateOfTech,
      endData: this.state.endDateOfTech,
      folder: this.state.folder,
    };

    let token = localStorage.getItem("userdata");
    // api call for posting Vehicle Insurance data
    var insuranceDetail,
      technicalDetail,
      vehicleDetail = "";

    new Promise(async (resolve, reject) => {
      try {
        // add insurance details to db
        await fetch(`${process.env.REACT_APP_BASE_URL}VehicleInsurance`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(vehicleInsurance),
        })
          .then((res) => res.json())
          .then((resJson) => {
            insuranceDetail = resJson.data?.id;
          })
          .catch((e) => reject(e));

        // add vehicle technical details to db
        await fetch(`${process.env.REACT_APP_BASE_URL}TechnicalControl`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(vehicleTechnicalControl),
        })
          .then((res) => res.json())
          .then((resJson) => {
            technicalDetail = resJson.data?.id;
          })
          .catch((e) => reject(e));

        var VehichleDetail = {
          dateOfFirstRegistration: this.state.registerDate,
          brand: toTitleCase(this.state.brand),
          model: toTitleCase(this.state.model),
          color: toTitleCase(this.state.color),
          energy: toTitleCase(this.state.energy),
          gearBox: toTitleCase(this.state.gearBox),
          numberPlate: this.state.numberPlate.toUpperCase(),
          vehichleInsuranceInfoId: insuranceDetail,
          technicalControlInfoID: technicalDetail,
          vehicleRegistrationCertificatePhotoImagePath: this.state
            .VCertifiateImagePath,
          vehicleePhotosImagePath: this.state.VImagePath,
          folder: this.state.folder,
        };
        // add vehicle detail to db
        await fetch(`${process.env.REACT_APP_BASE_URL}VehicleDetail`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(VehichleDetail),
        })
          .then((res) => res.json())
          .then((resJson) => {
            vehicleDetail = resJson.data?.id;
          })
          .catch((e) => reject(e));

        await fetch(
          `${process.env.REACT_APP_BASE_URL}Profile/GetProfileByPersonalId?id=${this.props.id}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then(async (resJson) => {
            resJson = resJson.data;
            let vehicles = {};
            if (
              resJson.role !== "DrivingSchool" &&
              resJson.role !== "DSInstructor"
            ) {
              vehicles = JSON.parse(resJson.vehicleDetailInfoId);
            } else {
              vehicles = JSON.parse(resJson.drivingSchoolVehiclesInfoId);
            }
            let lastElement =
              Object.keys(vehicles).length > 0
                ? Object.keys(vehicles)[Object.keys(vehicles).length - 1]
                : "Vehicle0";
            lastElement =
              "Vehicle" + String(parseInt(lastElement.split("Vehicle")[1]) + 1);

            vehicles[lastElement] = vehicleDetail;
            let updateUserProfile = {};
            if (resJson.role !== "DrivingSchool") {
              updateUserProfile = {
                ...resJson,
                vehicleDetailInfoId: JSON.stringify(vehicles),
              };
            } else {
              updateUserProfile = {
                ...resJson,
                drivingSchoolVehiclesInfoId: JSON.stringify(vehicles),
              };
            }

            await fetch(
              `${process.env.REACT_APP_BASE_URL}Profile/UpdateProfile`,
              {
                method: "POST",
                headers: {
                  authorization: `Bearer ${token}`,
                  "content-type": "application/json",
                },
                body: JSON.stringify(updateUserProfile),
              }
            )
              .then((res) => res.json())
              .then((resJson) => {
                resolve(resJson.data);
                window.location.reload();
              })
              .catch((e) => reject(e));
          });
      } catch (e) {
        reject(e);
      }
    });
  };

  // get dynamic data for vehicle model and brand
  getVehicleMakeData = async () => {
    const response = await fetch(
      "https://parseapi.back4app.com/classes/Carmodels_Car_Model_List?keys=Make&limit=999999",
      {
        headers: {
          "X-Parse-Application-Id": "XSV8AboSPQpA4pAyKCw67EX7KBnI8YiMt1NvrCdM", // This is your app's application id
          "X-Parse-REST-API-Key": "qFiiXv1DSjHnkTrrrNWZVcyuiAz7y8uVnf44WLcS", // This is your app's REST API key
        },
      }
    );
    const data = await response.json(); // Here you have the data that you need
    const makeList = [];
    data.results.map((list) => {
      var exists = makeList.find((item) => item.Make === list.Make);
      // debugger;
      if (!exists) {
        makeList.push(list);
      }
    });
    this.setState({ brandList: makeList, brand: data.results[0].Make });
  };
  getVehicleModelData = async () => {
    const response = await fetch(
      "https://parseapi.back4app.com/classes/Carmodels_Car_Model_List?limit=9999",
      {
        headers: {
          "X-Parse-Application-Id": "XSV8AboSPQpA4pAyKCw67EX7KBnI8YiMt1NvrCdM", // This is your app's application id
          "X-Parse-REST-API-Key": "qFiiXv1DSjHnkTrrrNWZVcyuiAz7y8uVnf44WLcS", // This is your app's REST API key
        },
      }
    );
    const data = await response.json(); // Here you have the data that you need
    // console.log("models",JSON.stringify(data.results, null, 2));
    const filterData = data.results.filter(
      (item) => item.Make === this.state.brand
    );
    this.setState({
      modelList: filterData,
      model: `${filterData[0] !== undefined && filterData[0].Model}(${
        filterData[0] !== undefined && filterData[0].Year
      })`,
    });
  };
  // end of vehicle add

  //start for vehicle upodate
  handleUpdateCall = (responseVehicle) => {
    console.log(responseVehicle, "id is");

    var insuranceDetail = JSON.parse(responseVehicle.vehichleInsuranceInfoId);
    var technicalControlDetial = JSON.parse(
      responseVehicle.technicalControlInfoID
    );

    // update state data and open model
    this.setState(
      {
        // vehicle info states
        registerDate: new Date(
          moment(responseVehicle?.dateOfFirstRegistration).local().format()
        ),
        brand: responseVehicle?.brand,

        numberPlate: responseVehicle?.numberPlate,
        gearBox: responseVehicle?.gearBox,
        color: responseVehicle?.color,
        energy: responseVehicle?.energy,
        VImagePath: responseVehicle?.vehicleePhotosImagePath,
        VCertifiateImagePath:
          responseVehicle?.vehicleRegistrationCertificatePhotoImagePath,
        //   insurance
        VInsurer: insuranceDetail?.insurer,
        VInsuranceImagePath: insuranceDetail?.greenCardImagePath,
        VpoliceNumber: insuranceDetail?.policeNumber,
        VStartDate: new Date(
          moment(insuranceDetail?.startDate).local().format()
        ),
        VEndDate: new Date(moment(insuranceDetail?.endDate).local().format()),
        //   technical control
        startDateOfTech: new Date(
          moment(technicalControlDetial?.startDateOfTech).local().format()
        ),
        endDateOfTech: new Date(
          moment(technicalControlDetial?.endDateOfTechControl).local().format()
        ),
        TCImagePath: technicalControlDetial?.technicalControlImagePath,
        techicalID: technicalControlDetial?.id,
        insuranceID: insuranceDetail?.id,
        detailID: responseVehicle?.id,
      },
      async () => {
        await this.getVehicleModelData();
        this.setState({
          model: responseVehicle.model.toUpperCase(),
          showEdit: true,
          // isAddDisable: false,
        });
      }
    );
  };

  handleEditModel = () => {
    this.setState({ showEdit: !this.state.showEdit }, () => {
      if (this.state.showEdit === false) {
        this.handleResetState();
      }
    });
  };

  handleUpdate = (e) => {
    e.preventDefault();
    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    const vehicleInsurance = {
      id: this.state.insuranceID,
      greenCardImagePath: this.state.VInsuranceImagePath,
      insurer: toTitleCase(this.state.VInsurer),
      policeNumber: this.state.VpoliceNumber,
      startDate: moment(this.state.VStartDate).utc().format(),
      endDate: moment(this.state.VEndDate).utc().format(),
      folder: this.state.folder,
    };

    const vehicleTechnicalControl = {
      id: this.state.techicalID,
      startDateOfTech: moment(this.state.startDateOfTech).utc().format(),
      endDateOfTechControl: moment(this.state.endDateOfTech).utc().format(),
      technicalControlImagePath: this.state.TCImagePath,
      dateofTechnicalControl: moment(this.state.startDateOfTech).utc().format(),
      endData: moment(this.state.endDateOfTech).utc().format(),
      folder: this.state.folder,
    };

    let token = localStorage.getItem("userdata");
    // api call for posting Vehicle Insurance data
    this.WebServicesManager.putApiWithParams(
      {
        endPoint: "VehicleInsurance",
        dataToUpdate: JSON.stringify(vehicleInsurance),
        updateId: this.state.insuranceID,
        token,
      },
      (statusCode, responseAddVehicleInsurance) => {
        // let vehicleInsuranceId = responseAddVehicleInsurance.id;
        // api call for adding technical control data
        this.WebServicesManager.putApiWithParams(
          {
            endPoint: "TechnicalControl",
            updateId: this.state.techicalID,
            dataToUpdate: JSON.stringify(vehicleTechnicalControl),
            token,
          },
          (statusCode, responseAddVehicleTC) => {
            // add vehicle detail

            const VehichleDetail = {
              id: this.state.detailID,
              dateOfFirstRegistration: moment(this.state.registerDate)
                .utc()
                .format(),
              brand: toTitleCase(this.state.brand),
              model: toTitleCase(this.state.model),
              color: toTitleCase(this.state.color),
              energy: toTitleCase(this.state.energy),
              gearBox: toTitleCase(this.state.gearBox),
              numberPlate: this.state.numberPlate,
              vehichleInsuranceInfoId: this.state.insuranceID,
              technicalControlInfoID: this.state.techicalID,
              vehicleRegistrationCertificatePhotoImagePath: this.state
                .VCertifiateImagePath,
              vehicleePhotosImagePath: this.state.VImagePath,
              folder: this.state.folder,
            };
            this.WebServicesManager.putApiWithParams(
              {
                endPoint: "VehicleDetail",
                dataToUpdate: JSON.stringify(VehichleDetail),
                updateId: this.state.detailID,
                token,
              },
              (statusCode, responseAddVehicle) => {
                window.location.reload();
              }
            );
          }
        );
      }
    );
  };

  handleDelete = (id) => {
    const token = localStorage.getItem("userdata");
    var conf = window.confirm("Are you sure want to delete this vehicle?");
    if (conf) {
      this.WebServicesManager.getApiWithParamCall(
        {
          endPoint: "VehicleDetail/UpdateVehicleDetail",
          dataToFetch: id,
          token,
        },
        (statusCode, responseUpdate) => {
          //   update it in user profile as well.
          this.WebServicesManager.getApiWithParamCall(
            {
              endPoint: "Profile/GetProfileByPersonalId",
              dataToFetch: this.state.userData.id,
              token,
            },
            (statusCode, responseGet) => {
              let vehicles = {};
              if (responseGet.role === "Instructor") {
                vehicles = JSON.parse(responseGet.vehicleDetailInfoId);
              } else {
                vehicles = JSON.parse(responseGet.drivingSchoolVehiclesInfoId);
              }
              Object.entries(vehicles).forEach(([key, value]) => {
                if (value === id) {
                  delete vehicles[key];
                }
              });

              let updateUserProfile = {};
              if (responseGet.role === "Instuctor") {
                updateUserProfile = {
                  ...responseGet,
                  vehicleDetailInfoId: JSON.stringify(vehicles),
                };
              } else {
                updateUserProfile = {
                  ...responseGet,
                  drivingSchoolVehiclesInfoId: JSON.stringify(vehicles),
                };
              }
              console.log(updateUserProfile);
              // update profile api call
              this.WebServicesManager.postApiCall(
                {
                  endPoint: "Profile/UpdateProfile",
                  dataToInsert: JSON.stringify(updateUserProfile),
                  token,
                },
                (statusCode, responseUpdateProfile) => {
                  window.location.reload();
                }
              );
            }
          );
        }
      );
    }
  };

  render() {
    var vehicleList = [];
    const { vehicleInfo } = this.state;
    if (vehicleInfo !== "" && Object.entries(vehicleInfo).length > 0) {
      Object.entries(vehicleInfo).forEach(([key, value]) => {
        var keySplit = "veh" + key.split("Vehicle")[1];
        var stateis = Object.entries(this.state).find(
          (item) => item[0] === keySplit
        );
        if (stateis !== undefined) {
          stateis = stateis[1];
          vehicleList.push(
            <tr key={stateis.id}>
              <td>{key} Detail</td>
              <td>
                {stateis === undefined ? (
                  <i className="fa fa-remove"></i>
                ) : stateis.status === "" ? (
                  <i className="fa fa-remove"></i>
                ) : stateis.status === "true" ? (
                  <i className="fa fa-check"></i>
                ) : (
                  <i className="fa fa-remove"></i>
                )}
              </td>
              <td>
                <i
                  className="fa fa-file"
                  onClick={() =>
                    this.setState({
                      showId: true,
                      docTitle: `${key} Detail`,
                      idName: `${keySplit}`,
                      fbStatus:
                        stateis === undefined
                          ? false
                          : stateis.status === undefined
                          ? false
                          : stateis.status,
                    })
                  }
                ></i>
                <i
                  className="fa fa-pencil"
                  onClick={() => this.handleUpdateCall(value)}
                ></i>
                <i
                  className="fa fa-trash"
                  onClick={() => this.handleDelete(value)}
                ></i>
              </td>
            </tr>
          );
        } else {
          vehicleList.push(
            <tr key={keySplit}>
              <td>{key} Detail</td>
              <td>
                {stateis === undefined ? (
                  <i className="fa fa-remove"></i>
                ) : stateis.status === "" ? (
                  <i className="fa fa-remove"></i>
                ) : stateis.status === "true" ? (
                  <i className="fa fa-check"></i>
                ) : (
                  <i className="fa fa-remove"></i>
                )}
              </td>
              <td>
                <i
                  className="fa fa-file"
                  onClick={() =>
                    this.setState({
                      showId: true,
                      docTitle: `${key} Detail`,
                      idName: `${keySplit}`,
                      fbStatus:
                        stateis === undefined
                          ? false
                          : stateis.status === undefined
                          ? false
                          : stateis.status,
                    })
                  }
                ></i>
                <i
                  className="fa fa-pencil"
                  onClick={() => this.handleUpdateCall(value)}
                ></i>
                <i
                  className="fa fa-trash"
                  onClick={() => this.handleDelete(value)}
                ></i>
              </td>
            </tr>
          );
        }
      });
    }

    return (
      <Translation>
        {(t) => (
          <div className="content">
            <Modal size="lg" show={this.state.showId}>
              <Modal.Header
                closeButton
                onHide={() => this.setState({ showId: false })}
              >
                <Modal.Title>{this.state.docTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ID
                  Type={this.state.idName}
                  {...this.props}
                  {...this.state.profileData}
                  vehicleInfo={this.state.vehicleInfo}
                  status={this.state.fbStatus}
                  retunfb={this.getData}
                />
              </Modal.Body>
            </Modal>

            <Table striped hover>
              <thead>
                <tr>
                  <th>Document </th>
                  <th>Verification Status </th>
                  <th> </th>
                </tr>
              </thead>
              {this.props.role.toLowerCase() === "instructor" ? (
                <tbody>
                  <tr>
                    <td colSpan="3">
                      <h3>Personal Detail</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>Front Id</td>
                    <td>
                      {this.state.frontDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.frontDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.frontDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Front ID",
                            idName: "fic",
                            fbStatus:
                              this.state.frontDoc === undefined
                                ? false
                                : this.state.frontDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Back Id</td>
                    <td>
                      {this.state.backDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.backDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.backDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Back ID",
                            idName: "bic",
                            fbStatus:
                              this.state.backDoc === undefined
                                ? false
                                : this.state.backDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>

                  <tr>
                    <td>Driving License</td>
                    <td>
                      {this.state.drvLic === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.drvLic.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.drvLic.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Driving License",
                            idName: "drvlic",
                            fbStatus:
                              this.state.drvLic === undefined
                                ? false
                                : this.state.drvLic.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Authorization to Exercise</td>
                    <td>
                      {this.state.exeDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.exeDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.exeDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Exe authority",
                            idName: "aoe",
                            fbStatus:
                              this.state.exeDoc === undefined
                                ? false
                                : this.state.exeDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>KBL</td>
                    <td>
                      {this.state.kbl === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.kbl.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.kbl.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "KBL",
                            idName: "kbl",
                            fbStatus:
                              this.state.kbl === undefined
                                ? false
                                : this.state.kbl.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>RC Pro</td>
                    <td>
                      {this.state.rc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.rc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.rc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "RC Pro",
                            idName: "rc",
                            fbStatus:
                              this.state.rc === undefined
                                ? false
                                : this.state.rc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Green Card</td>
                    <td>
                      {this.state.greenCard === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.greenCard.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.greenCard.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Green Card",
                            idName: "greenCard",
                            fbStatus:
                              this.state.greenCard === undefined
                                ? false
                                : this.state.greenCard.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h3>Vehicle Details</h3>
                    </td>
                    <td>
                      <i
                        className="fa fa-plus-circle"
                        style={{ fontSize: 18 }}
                        onClick={this.handleShowModel}
                      ></i>
                    </td>
                  </tr>
                  {vehicleList}
                </tbody>
              ) : this.props.role.toLowerCase() === "dsinstructor" ? (
                <tbody>
                  <tr>
                    <td colSpan="3">
                      <h3>Personal Detail</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>Front Id</td>
                    <td>
                      {this.state.frontDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.frontDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.frontDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Front ID",
                            idName: "fic",
                            fbStatus:
                              this.state.frontDoc === undefined
                                ? false
                                : this.state.frontDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Back Id</td>
                    <td>
                      {this.state.backDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.backDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.backDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Back ID",
                            idName: "bic",
                            fbStatus:
                              this.state.backDoc === undefined
                                ? false
                                : this.state.backDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>

                  <tr>
                    <td>Driving License</td>
                    <td>
                      {this.state.drvLic === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.drvLic.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.drvLic.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Driving License",
                            idName: "drvlic",
                            fbStatus:
                              this.state.drvLic === undefined
                                ? false
                                : this.state.drvLic.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Authorization to Exercise</td>
                    <td>
                      {this.state.exeDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.exeDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.exeDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Exe authority",
                            idName: "aoe",
                            fbStatus:
                              this.state.exeDoc === undefined
                                ? false
                                : this.state.exeDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>KBL DS</td>
                    <td>
                      {this.state.kbl === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.kbl.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.kbl.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "KBL",
                            idName: "kbl",
                            fbStatus:
                              this.state.kbl === undefined
                                ? false
                                : this.state.kbl.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                </tbody>
              ) : this.props.role.toLowerCase() === "student" ? (
                <tbody>
                  <tr>
                    <td colSpan="3">
                      <h3>Personal Detail</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>Front Id</td>
                    <td>
                      {this.state.frontDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.frontDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.frontDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Front ID",
                            idName: "fic",
                            fbStatus:
                              this.state.frontDoc === undefined
                                ? false
                                : this.state.frontDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    {" "}
                    <td>Back Id</td>
                    <td>
                      {this.state.backDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.backDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.backDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Back ID",
                            idName: "bic",
                            fbStatus:
                              this.state.backDoc === undefined
                                ? false
                                : this.state.backDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                </tbody>
              ) : this.props.role.toLowerCase() === "drivingschool" ? (
                <tbody>
                  <tr>
                    <td colSpan="3">
                      <h3>Personal Detail</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>Driving School Approval</td>
                    <td>
                      {this.state.dsa === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.dsa.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.dsa.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Driving School Approval",
                            idName: "dsa",
                            fbStatus:
                              this.state.dsa === undefined
                                ? false
                                : this.state.dsa.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>KBL</td>
                    <td>
                      {this.state.kbl === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.kbl.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.kbl.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "KBL",
                            idName: "kbl",
                            fbStatus:
                              this.state.kbl === undefined
                                ? false
                                : this.state.kbl.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>RC Pro</td>
                    <td>
                      {this.state.rc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.rc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.rc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "RC Pro",
                            idName: "rc",
                            fbStatus:
                              this.state.rc === undefined
                                ? false
                                : this.state.rc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h3>Vehicle Details</h3>
                    </td>
                    <td>
                      <i
                        className="fa fa-plus-circle"
                        style={{ fontSize: 18 }}
                        onClick={this.handleShowModel}
                      ></i>
                    </td>
                  </tr>
                  {vehicleList}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="3">
                      <h3>Personal Detail</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>Front Id</td>
                    <td>
                      {this.state.frontDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.frontDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.frontDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Front ID",
                            idName: "fic",
                            fbStatus:
                              this.state.frontDoc === undefined
                                ? false
                                : this.state.frontDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Back Id</td>
                    <td>
                      {this.state.backDoc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.backDoc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.backDoc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "Back ID",
                            idName: "bic",
                            fbStatus:
                              this.state.backDoc === undefined
                                ? false
                                : this.state.backDoc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>

                  <tr>
                    <td>KBL</td>
                    <td>
                      {this.state.kbl === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.kbl.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.kbl.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "KBL",
                            idName: "kbl",
                            fbStatus:
                              this.state.kbl === undefined
                                ? false
                                : this.state.kbl.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>RC Pro</td>
                    <td>
                      {this.state.rc === undefined ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.rc.status === "" ? (
                        <i className="fa fa-remove"></i>
                      ) : this.state.rc.status === "true" ? (
                        <i className="fa fa-check"></i>
                      ) : (
                        <i className="fa fa-remove"></i>
                      )}
                    </td>
                    <td>
                      <i
                        className="fa fa-file"
                        onClick={() =>
                          this.setState({
                            showId: true,
                            docTitle: "RC Pro",
                            idName: "rc",
                            fbStatus:
                              this.state.rc === undefined
                                ? false
                                : this.state.rc.status,
                          })
                        }
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h3>Vehicle Details</h3>
                    </td>
                    <td>
                      <i
                        className="fa fa-plus-circle"
                        style={{ fontSize: 18 }}
                        onClick={this.handleShowModel}
                      ></i>
                    </td>
                  </tr>
                  {vehicleList}
                </tbody>
              )}
            </Table>
            <Button onClick={this.maildata}>
              <li className="fa fa-envelope  fa-1x"></li>Send Email Non-Verified
              Document
            </Button>
            {/* add data model */}
            <Modal
              show={this.state.showAddModel}
              siz="xl"
              onHide={this.handleShowModel}
              className="modelVehicle"
            >
              <Modal.Header closeButton>{t("Add Vehicle")}</Modal.Header>
              <Modal.Body>
                <Translation>
                  {(t) => (
                    <form className="cField" onSubmit={this.handleSubmit}>
                      <Row>
                        <Grid>
                          <Row>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Date of the 1st Registration")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <DatePicker
                                selected={this.state.registerDate}
                                onChange={(date) =>
                                  this.validationCheckForRegisterDate(date)
                                }
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                placeholderText="DD/MM/YYYY"
                                autoComplete="off"
                              />
                              <HelpBlock>
                                {t(this.state.registerDateError)}
                              </HelpBlock>
                            </Col>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Brand")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <FormControl
                                className="noBorderRadius"
                                componentClass="select"
                                value={this.state.brand}
                                onChange={this.validationCheckForVehicleBrand}
                                autoComplete="off"
                              >
                                <option value="">{t("Select Option")}</option>
                                {this.state.brandList.map((item) => (
                                  <option
                                    key={item.objectId}
                                    value={`${item.Make}`}
                                  >{`${item.Make}`}</option>
                                ))}
                              </FormControl>
                              {/* <FormControl
                                type="text"
                                name="brand"
                                onChange={this.validationCheckForVehicleBrand}
                                className="form-control"
                                value={this.state.brand}
                                autoComplete="off"
                              /> */}
                              <HelpBlock>{t(this.state.brandError)}</HelpBlock>
                            </Col>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Upload Image")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <FormControl
                                type="file"
                                id="VImage"
                                bsClass="form-control"
                                onChange={this.handleFileSelectForVImage}
                                accept="image/jpeg"
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <FormGroup>
                                <Translation>
                                  {(t) => (
                                    <ControlLabel>
                                      {t("Model")}{" "}
                                      <span className="text-red">*</span>
                                    </ControlLabel>
                                  )}
                                </Translation>
                                <FormControl
                                  className="noBorderRadius"
                                  componentClass="select"
                                  value={this.state.model}
                                  onChange={this.validationCheckForVehicleModel}
                                  autoComplete="off"
                                >
                                  <option value="">{t("Select Option")}</option>
                                  {this.state.modelList.map((item) => (
                                    <option
                                      value={`${item.Model}(${item.Year})`}
                                      key={item.objectId}
                                    >{`${item.Model}(${item.Year})`}</option>
                                  ))}
                                </FormControl>
                                <HelpBlock>
                                  {t(this.state.modelError)}
                                </HelpBlock>
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <FormGroup>
                                <Translation>
                                  {(t) => (
                                    <ControlLabel>
                                      {t("Number Plate")}{" "}
                                      <span className="text-red">*</span>
                                    </ControlLabel>
                                  )}
                                </Translation>
                                <FormControl
                                  type="text"
                                  bsClass="form-control"
                                  name="numberPlate"
                                  value={this.state.numberPlate}
                                  onChange={
                                    this.validationCheckForVehicleNumberPlate
                                  }
                                  autoComplete="off"
                                />
                                <HelpBlock>
                                  {t(this.state.numberPlateError)}
                                </HelpBlock>
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                              <FormGroup controlId="formControlsSelect">
                                <Translation>
                                  {(t) => (
                                    <ControlLabel>
                                      {t("Gearbox")}{" "}
                                      <span className="text-red">*</span>
                                    </ControlLabel>
                                  )}
                                </Translation>
                                <FormControl
                                  className="noBorderRadius"
                                  componentClass="select"
                                  value={this.state.gearBox}
                                  onChange={
                                    this.validationCheckForVehicleGearBox
                                  }
                                  autoComplete="off"
                                >
                                  <Translation>
                                    {(t) => (
                                      <React.Fragment>
                                        <option value="Auto">
                                          {t("Auto")}
                                        </option>
                                        <option value="Manual">
                                          {t("Manual")}
                                        </option>
                                      </React.Fragment>
                                    )}
                                  </Translation>
                                </FormControl>
                              </FormGroup>
                              <HelpBlock>
                                {t(this.state.gearBoxError)}
                              </HelpBlock>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <FormGroup>
                                <Translation>
                                  {(t) => (
                                    <ControlLabel>
                                      {t("Color")}{" "}
                                      <span className="text-red">*</span>
                                    </ControlLabel>
                                  )}
                                </Translation>
                                <FormControl
                                  type="text"
                                  bsClass="form-control"
                                  name="color"
                                  value={this.state.color}
                                  onChange={this.validationCheckForVehicleColor}
                                  autoComplete="off"
                                />
                                <HelpBlock>
                                  {t(this.state.colorError)}
                                </HelpBlock>
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <FormGroup controlId="formControlsSelect">
                                <Translation>
                                  {(t) => (
                                    <ControlLabel>
                                      {t("Energy")}{" "}
                                      <span className="text-red">*</span>
                                    </ControlLabel>
                                  )}
                                </Translation>
                                <FormControl
                                  className="noBorderRadius"
                                  name="energy"
                                  value={this.state.energy}
                                  componentClass="select"
                                  onChange={
                                    this.validationCheckForVehicleEnergy
                                  }
                                  autoComplete="off"
                                >
                                  <Translation>
                                    {(t) => (
                                      <React.Fragment>
                                        <option value="Diesel">
                                          {t("Diesel")}
                                        </option>
                                        <option value="Petrol">
                                          {t("Petrol")}
                                        </option>
                                        <option value="Hybrid">
                                          {t("Hybrid")}
                                        </option>
                                        <option value="Electric">
                                          {t("Electric")}
                                        </option>
                                        <option value="GPL">{t("GPL")}</option>
                                        <option value="Other">
                                          {t("Other")}
                                        </option>
                                      </React.Fragment>
                                    )}
                                  </Translation>
                                </FormControl>
                              </FormGroup>
                              <HelpBlock>{t(this.state.energyError)}</HelpBlock>
                            </Col>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t(
                                      "Upload Vehicle Registration Certificate"
                                    )}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <FormControl
                                type="file"
                                name="VCertificateImage"
                                bsClass="form-control"
                                onChange={this.handleFileSelectForVCertificate}
                                accept="image/jpeg,application/pdf"
                              />
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
                                  {t("Vehicle Insurance")}
                                </label>
                              )}
                            </Translation>
                          </Row>
                          <FormInputs
                            ncols={["col-md-4", "col-md-4", "col-md-4"]}
                            properties={[
                              {
                                label: "Insurer",
                                type: "text",
                                bsClass: "form-control",
                                name: "VInsurer",
                                value: this.state.VInsurer,
                                onChange: this.validationCheckForVInsurer,
                                help: this.state.VInsurerError,
                                isImport: false,
                                autoComplete: "off",
                              },
                              {
                                label: "Police Number",
                                type: "text",
                                bsClass: "form-control",
                                name: "VpoliceNumber",
                                value: this.state.VpoliceNumber,
                                onChange: this
                                  .validationCheckForVInPoliceNumber,
                                help: this.state.VpoliceNumberError,
                                isImport: false,
                                autoComplete: "off",
                              },
                              {
                                label: "Upload Scaned Green Card",
                                type: "file",
                                bsClass: "form-control",
                                onChange: this.handleFileSelectForVInsurance,
                                isImport: false,
                                accept: "image/jpeg,application/pdf",
                              },
                            ]}
                          />
                          <Row>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Start Date")}{" "}
                                    <span className="text-red">*</span>
                                  </ControlLabel>
                                )}
                              </Translation>
                              <DatePicker
                                selected={this.state.VStartDate}
                                name="VStartDate"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                onChange={(date) =>
                                  this.validationCheckForVStartD(date)
                                }
                                className="form-control"
                                autoComplete="off"
                              />
                              <HelpBlock>
                                {t(this.state.VStartDateError)}
                              </HelpBlock>
                            </Col>
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
                                selected={this.state.VEndDate}
                                name="VEndDate"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                onChange={(date) =>
                                  this.validationCheckForVEndD(date)
                                }
                                autoComplete="off"
                                className="form-control"
                              />
                              <HelpBlock>
                                {t(this.state.VEndDateError)}
                              </HelpBlock>
                            </Col>
                          </Row>
                        </Grid>
                      </Row>
                      <Row>
                        <Grid>
                          <Row>
                            <label className="my-3 ml-1 reg-Label">
                              {t("Technical Control")}
                            </label>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Date of Technical Control")}
                                  </ControlLabel>
                                )}
                              </Translation>
                              <DatePicker
                                selected={this.state.startDateOfTech}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                onChange={(date) =>
                                  this.handleChangeDateForStartTech(date)
                                }
                                className="form-control"
                                autoComplete="off"
                              />
                              <HelpBlock>
                                {t(this.state.startDateOfTechError)}
                              </HelpBlock>
                            </Col>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("End Date")}{" "}
                                    {/* <span className="text-red">*</span> */}
                                  </ControlLabel>
                                )}
                              </Translation>
                              <DatePicker
                                selected={this.state.endDateOfTech}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                onChange={(date) =>
                                  this.handleChangeDateForEndTech(date)
                                }
                                className="form-control"
                                autoComplete="off"
                              />
                              <HelpBlock>
                                {t(this.state.endDateOfTechError)}
                              </HelpBlock>
                            </Col>
                            <Col md={4}>
                              <Translation>
                                {(t) => (
                                  <ControlLabel>
                                    {t("Scan and upload your CT")}
                                  </ControlLabel>
                                )}
                              </Translation>
                              <FormControl
                                type="file"
                                onChange={this.handleFileSelectForTCImage}
                                accept="image/jpeg,application/pdf"
                                bsClass="form-control"
                              />
                            </Col>
                          </Row>
                        </Grid>
                      </Row>
                    </form>
                  )}
                </Translation>
              </Modal.Body>
              <Modal.Footer>
                {this.state.loading || this.state.isAddDisable ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div style={{ marginRight: 10 }}>
                      Cheking required fields
                    </div>
                    <Loader
                      type="Puff"
                      color="#149e7a"
                      height={30}
                      width={30}
                      // timeout={3000} //3 secs
                    ></Loader>
                  </div>
                ) : (
                  <Button
                    style={{ marginRight: 20 }}
                    className="form-cust-btn"
                    onClick={this.handleSubmit}
                    disabled={this.state.isAddDisable}
                  >
                    {t("Add")}
                  </Button>
                )}
              </Modal.Footer>
            </Modal>
            {/* update data model */}
            <Modal
              show={this.state.showEdit}
              onHide={this.handleEditModel}
              className="modelVehicle"
            >
              <Modal.Header closeButton>{t("Update Vehicle")}</Modal.Header>
              <Modal.Body>
                <Form onSubmit={this.handleUpdate}>
                  <Row>
                    <Grid>
                      <Row>
                        <Col md={4}>
                          <Translation>
                            {(t) => (
                              <ControlLabel>
                                {t("Date of the 1st Registration")}{" "}
                                <span className="text-red">*</span>
                              </ControlLabel>
                            )}
                          </Translation>
                          <DatePicker
                            selected={this.state.registerDate}
                            onChange={(date) =>
                              this.validationCheckForRegisterDate(date)
                            }
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            placeholderText="DD/MM/YYYY"
                            autoComplete="off"
                          />
                          <HelpBlock>
                            {t(this.state.registerDateError)}
                          </HelpBlock>
                        </Col>
                        <Col md={4}>
                          <Translation>
                            {(t) => (
                              <ControlLabel>
                                {t("Brand")} <span className="text-red">*</span>
                              </ControlLabel>
                            )}
                          </Translation>
                          <FormControl
                            className="noBorderRadius"
                            componentClass="select"
                            value={this.state.brand}
                            onChange={this.validationCheckForVehicleBrand}
                            autoComplete="off"
                          >
                            <option value="">{t("Select Option")}</option>
                            {this.state.brandList.map((item) => (
                              <option
                                key={item.objectId}
                                value={`${item.Make}`}
                              >{`${item.Make}`}</option>
                            ))}
                          </FormControl>
                          {/* <FormControl
                                type="text"
                                name="brand"
                                onChange={this.validationCheckForVehicleBrand}
                                className="form-control"
                                value={this.state.brand}
                                autoComplete="off"
                              /> */}
                          <HelpBlock>{t(this.state.brandError)}</HelpBlock>
                        </Col>
                        <Col md={4}>
                          <Translation>
                            {(t) => (
                              <ControlLabel>{t("Upload Image")}</ControlLabel>
                            )}
                          </Translation>
                          <FormControl
                            type="file"
                            id="VImage"
                            bsClass="form-control"
                            onChange={this.handleFileSelectForVImage}
                            accept="image/jpeg"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Translation>
                              {(t) => (
                                <ControlLabel>
                                  {t("Model")}{" "}
                                  <span className="text-red">*</span>
                                </ControlLabel>
                              )}
                            </Translation>
                            <FormControl
                              className="noBorderRadius"
                              componentClass="select"
                              value={this.state.model}
                              onChange={this.validationCheckForVehicleModel}
                              autoComplete="off"
                            >
                              <option value="">{t("Select Option")}</option>
                              {this.state.modelList.map((item) => (
                                <option
                                  value={`${item.Model}(${item.Year})`}
                                  key={item.objectId}
                                >{`${item.Model}(${item.Year})`}</option>
                              ))}
                            </FormControl>
                            <HelpBlock>{t(this.state.modelError)}</HelpBlock>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Translation>
                              {(t) => (
                                <ControlLabel>
                                  {t("Number Plate")}{" "}
                                  <span className="text-red">*</span>
                                </ControlLabel>
                              )}
                            </Translation>
                            <FormControl
                              type="text"
                              bsClass="form-control"
                              name="numberPlate"
                              value={this.state.numberPlate}
                              onChange={
                                this.validationCheckForVehicleNumberPlate
                              }
                              autoComplete="off"
                            />
                            <HelpBlock>
                              {t(this.state.numberPlateError)}
                            </HelpBlock>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup controlId="formControlsSelect">
                            <Translation>
                              {(t) => (
                                <ControlLabel>
                                  {t("Gearbox")}{" "}
                                  <span className="text-red">*</span>
                                </ControlLabel>
                              )}
                            </Translation>
                            <FormControl
                              className="noBorderRadius"
                              componentClass="select"
                              value={this.state.gearBox}
                              onChange={this.validationCheckForVehicleGearBox}
                              autoComplete="off"
                            >
                              <Translation>
                                {(t) => (
                                  <React.Fragment>
                                    <option value="Auto">{t("Auto")}</option>
                                    <option value="Manual">
                                      {t("Manual")}
                                    </option>
                                  </React.Fragment>
                                )}
                              </Translation>
                            </FormControl>
                          </FormGroup>
                          <HelpBlock>{t(this.state.gearBoxError)}</HelpBlock>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Translation>
                              {(t) => (
                                <ControlLabel>
                                  {t("Color")}{" "}
                                  <span className="text-red">*</span>
                                </ControlLabel>
                              )}
                            </Translation>
                            <FormControl
                              type="text"
                              bsClass="form-control"
                              name="color"
                              value={this.state.color}
                              onChange={this.validationCheckForVehicleColor}
                              autoComplete="off"
                            />
                            <HelpBlock>{t(this.state.colorError)}</HelpBlock>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup controlId="formControlsSelect">
                            <Translation>
                              {(t) => (
                                <ControlLabel>
                                  {t("Energy")}{" "}
                                  <span className="text-red">*</span>
                                </ControlLabel>
                              )}
                            </Translation>
                            <FormControl
                              className="noBorderRadius"
                              name="energy"
                              value={this.state.energy}
                              componentClass="select"
                              onChange={this.validationCheckForVehicleEnergy}
                              autoComplete="off"
                            >
                              <Translation>
                                {(t) => (
                                  <React.Fragment>
                                    <option value="Diesel">
                                      {t("Diesel")}
                                    </option>
                                    <option value="Petrol">
                                      {t("Petrol")}
                                    </option>
                                    <option value="Hybrid">
                                      {t("Hybrid")}
                                    </option>
                                    <option value="Electric">
                                      {t("Electric")}
                                    </option>
                                    <option value="GPL">{t("GPL")}</option>
                                    <option value="Other">{t("Other")}</option>
                                  </React.Fragment>
                                )}
                              </Translation>
                            </FormControl>
                          </FormGroup>
                          <HelpBlock>{t(this.state.energyError)}</HelpBlock>
                        </Col>
                        <Col md={4}>
                          <Translation>
                            {(t) => (
                              <ControlLabel>
                                {t("Upload Vehicle Registration Certificate")}{" "}
                                {/* <span className="text-red">*</span> */}
                              </ControlLabel>
                            )}
                          </Translation>
                          <FormControl
                            type="file"
                            name="VCertificateImage"
                            bsClass="form-control"
                            onChange={this.handleFileSelectForVCertificate}
                            accept="image/jpeg,application/pdf"
                          />
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
                              {t("Vehicle Insurance")}
                            </label>
                          )}
                        </Translation>
                      </Row>
                      <FormInputs
                        ncols={["col-md-4", "col-md-4", "col-md-4"]}
                        properties={[
                          {
                            label: "Insurer",
                            type: "text",
                            bsClass: "form-control",
                            name: "VInsurer",
                            value: this.state.VInsurer,
                            onChange: this.validationCheckForVInsurer,
                            help: this.state.VInsurerError,
                            isImport: false,
                            autoComplete: "off",
                          },
                          {
                            label: "Police Number",
                            type: "text",
                            bsClass: "form-control",
                            name: "VpoliceNumber",
                            value: this.state.VpoliceNumber,
                            onChange: this.validationCheckForVInPoliceNumber,
                            help: this.state.VpoliceNumberError,
                            isImport: false,
                            autoComplete: "off",
                          },
                          {
                            label: "Upload Scaned Green Card",
                            type: "file",
                            bsClass: "form-control",
                            onChange: this.handleFileSelectForVInsurance,
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
                                {t("Start Date")}{" "}
                                <span className="text-red">*</span>
                              </ControlLabel>
                            )}
                          </Translation>
                          <DatePicker
                            selected={this.state.VStartDate}
                            name="VStartDate"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/YYYY"
                            onChange={(date) =>
                              this.validationCheckForVStartD(date)
                            }
                            className="form-control"
                            autoComplete="off"
                          />
                          <HelpBlock>{t(this.state.VStartDateError)}</HelpBlock>
                        </Col>
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
                            selected={this.state.VEndDate}
                            name="VEndDate"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/YYYY"
                            onChange={(date) =>
                              this.validationCheckForVEndD(date)
                            }
                            autoComplete="off"
                            className="form-control"
                          />
                          <HelpBlock>{t(this.state.VEndDateError)}</HelpBlock>
                        </Col>
                      </Row>
                    </Grid>
                  </Row>

                  <Row>
                    <Grid>
                      <Row>
                        <label className="my-3 ml-1 reg-Label">
                          {t("Technical Control")}
                        </label>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <Translation>
                            {(t) => (
                              <ControlLabel>
                                {t("Date of Technical Control")}
                              </ControlLabel>
                            )}
                          </Translation>
                          <DatePicker
                            selected={this.state.startDateOfTech}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/YYYY"
                            onChange={(date) =>
                              this.handleChangeDateForStartTech(date)
                            }
                            className="form-control"
                            autoComplete="off"
                          />
                          <HelpBlock>
                            {t(this.state.startDateOfTechError)}
                          </HelpBlock>
                        </Col>
                        <Col md={4}>
                          <Translation>
                            {(t) => (
                              <ControlLabel>
                                {t("End Date")}{" "}
                                {/* <span className="text-red">*</span> */}
                              </ControlLabel>
                            )}
                          </Translation>
                          <DatePicker
                            selected={this.state.endDateOfTech}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/YYYY"
                            onChange={(date) =>
                              this.handleChangeDateForEndTech(date)
                            }
                            className="form-control"
                            autoComplete="off"
                          />
                          <HelpBlock>
                            {t(this.state.endDateOfTechError)}
                          </HelpBlock>
                        </Col>
                        <Col md={4}>
                          <Translation>
                            {(t) => (
                              <ControlLabel>
                                {t("Scan and upload your CT")}
                              </ControlLabel>
                            )}
                          </Translation>
                          <FormControl
                            type="file"
                            onChange={this.handleFileSelectForTCImage}
                            accept="image/jpeg,application/pdf"
                            bsClass="form-control"
                          />
                        </Col>
                      </Row>
                    </Grid>
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={this.handleUpdate}
                  disabled={this.state.isAddDisable}
                >
                  {t("Confirm")}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}
      </Translation>
    );
  }
}

export default UserDocuments;
