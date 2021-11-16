import React, { useState, useEffect } from "react";
import {
  Grid,
  Row,
  Col,
  Modal,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from "react-bootstrap";
import { Translation } from "react-i18next";
import { motion } from "framer-motion";
import CustomModal from "../components/Modal/CustomModal";
import FormInput from "../components/FormInput/FormInput";
import {
  changePages,
  inputHandler,
  cmsSubmitHandler,
  changeSection,
  changeCards,
} from "../Utilities/FormInputs";
import FormSelect from "../components/FormInput/FormSelect";
import { Select } from "antd";
import CMSTable from "../components/Table/CMSTable";

const { Option } = Select;

const cards = [
  {
    name: "General",
    value: "4",
  },
  {
    name: "Card 1",
    value: "1",
  },
  {
    name: "Card 2",
    value: "2",
  },
  {
    name: "Card 3",
    value: "3",
  },
];

const mySections = [
  [
    {
      id: 1,
      name: "Header",
      value: "header",
    },
    {
      id: 2,
      name: "Our Services",
      value: "contactus",
    },
    {
      id: 3,
      name: "Footer",
      value: "footer",
    },
    {
      id: 4,
      name: "Contact Us",
      value: "ourservices",
    },
    {
      id: 5,
      name: "Code",
      value: "code",
    },
    {
      id: 6,
      name: "Cookies",
      value: "cookies",
    },
  ],
  [
    {
      id: 1,
      name: "Student",
      value: "student",
    },
    {
      id: 2,
      name: "Instructor",
      value: "instructor",
    },
    {
      id: 3,
      name: "Rental Car Agent",
      value: "rentalCarAgent",
    },
    {
      id: 4,
      name: "Driving school",
      value: "drivingSchool",
    },
  ],
];

const CMS = (props) => {
  const [show, setShow] = useState(false);
  const [sections, setSections] = useState([]);

  const [page, setPage] = useState("");
  const [pageName, setPageName] = useState("");
  const [section, setSection] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [card, setCard] = useState("1");
  const [cardName, setCardName] = useState("1");
  const [cms, setCms] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const [selectedSection, setSelectedSection] = useState([]);
  const [showSections, setShowSections] = useState(false);
  const [id, setId] = useState(null);
  const [showLinks, setShowLinks] = useState(false);

  const [data, setData] = useState({
    heading: "",
    headingFrench: "",
    text: "",
    textFrench: "",
  });
  const [pages, setPages] = useState([
    {
      name: "Select Page",
      id: "",
      value: "",
    },
  ]);

  useEffect(() => {
    getPages();
    getAllData();
  }, [props]);

  const getAllData = () => {
    var tokn = localStorage.getItem("userdata");
    const baseUrl = process.env.REACT_APP_BASE_URL;
    fetch(`${baseUrl}CMS/GetAllData`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokn}`,
        "Content-type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log("all data ", res);

        setCms(res.data);
      })
      .catch((err) => console.log(err.message));
  };

  const editRecord = (item) => {
    console.log("edit ", item);
    const {
      pageValue,
      pageName,
      cardId,
      cardName,
      sectionId,
      sectionName,
      headingEnglish,
      headingFrench,
      textEnglish,
      textFrench,
      id,
    } = item;

    setId(item.id);
    const pageIndex = pages.findIndex(
      (item, index) => item.value === pageValue
    );

    if (pageIndex < 3) {
      setShowSections(true);
      setShowLinks(false);

      console.log("find page ", pageIndex);
      const ind = pageIndex - 1;
      const newSections = mySections.find((item, index) => index === ind);
      // const newArr = [];
      const newSection = newSections.find(
        (item, index) => item.id == sectionId
      );
      // newArr.push(newSection);
      // console.log("find sections array ", newArr);

      console.log("find section ", newSection);
      console.log("find sections ", newSections);

      const newSection1 = newSection.id;
      if (pageValue === "home" && sectionId == "2") {
        setShowCards(true);
      }

      // setSelectedSection(newArr);
      setSections(newSections);
      setPage(pageValue);
      setPageName(pageName);
      setSection(newSection1);
      setSectionName(newSection.name);
      setCard(cardId);
      setCardName(cardName);
      setData({
        ...data,
        heading: headingEnglish,
        headingFrench: headingFrench,
        text: textEnglish,
        textFrench: textFrench,
      });
      handleShow(true);
      setDisableSelect(true);
    } else {
      if (pageIndex === 5) {
        setShowLinks(true);
        setShowSections(false);
        setShowCards(false);

        setSections([]);
        setPage(pageValue);
        setPageName(pageName);
        setSection("1");
        setSectionName(pageName);
        setCard("1");
        setCardName("General");
        setData({
          ...data,
          heading: headingEnglish,
          headingFrench: headingFrench,
          text: textEnglish,
          textFrench: textFrench,
        });
        handleShow(true);
        setDisableSelect(true);
      } else {
        setShowLinks(false);
        setShowSections(false);
        setShowCards(false);

        setSections([]);
        setPage(pageValue);
        setPageName(pageName);
        setSection("1");
        setSectionName(pageName);
        setCard("1");
        setCardName("General");
        setData({
          ...data,
          heading: headingEnglish,
          headingFrench: headingFrench,
          text: textEnglish,
          textFrench: textFrench,
        });
        handleShow(true);
        setDisableSelect(true);
      }
    }
  };
  const handleShow = (edit) => {
    setIsEdit(edit);
    setShow(true);
    setDisableSelect(false);
  };

  const clearStates = () => {
    setData({
      heading: "",
      headingFrench: "",
      text: "",
      textFrench: "",
    });
    setPage("");
    setSection("");
    setCard("");
    setPageName("");
    setSectionName("");
    setCardName("");
  };

  const handleClose = () => {
    isEdit && clearStates();
    isEdit && setShowCards(false);
    isEdit && setShowLinks(false);
    // clearStates();
    setShow(false);
    setId(null);
  };

  const getPages = () => {
    var tokn = localStorage.getItem("userdata");
    const baseUrl = process.env.REACT_APP_BASE_URL;
    fetch(`${baseUrl}CMS/GetPages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokn}`,
      },
    })
      .then((res) => res.json())
      .then((resp) => {
        let prevPages = resp.data;
        const newPages = [...pages, ...prevPages];
        setPages(newPages);
      })
      .catch((err) => {});
  };

  const deleteRecord = (id) => {
    console.log("delete id ", id);
    var tokn = localStorage.getItem("userdata");
    const baseUrl = process.env.REACT_APP_BASE_URL;

    fetch(`${baseUrl}CMS/DeleteDataById?id=${id}`, {
      method: "Delete",
      headers: {
        Authorization: `Bearer ${tokn}`,
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
  };
  console.log("new pages page ", pageName);
  console.log("new pages section ", section);
  console.log("new pages card ", cardName);
  //   console.log("new pages ", pages);
  //   console.log("new pages ", pages);
  return (
    <Translation>
      {(t) => (
        <>
          <div className="content">
            <Grid fluid>
              <Row>
                <Col md={12} className="text-right">
                  <div
                    className="d-inline-block"
                    style={{ display: "inline-block" }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      style={{
                        position: "relative",
                        zIndex: "1000",
                      }}
                      onClick={() => handleShow(false)}
                    >
                      <div
                        style={{
                          backgroundColor: "#149e7a",
                          padding: "10px 15px 10px 15px",
                          borderRadius: "50%",
                          color: "white",
                          margin: "16px 20px 0px 2px",
                        }}
                      >
                        <i
                          className="fas fa-plus"
                          style={{ color: "white" }}
                        ></i>
                      </div>
                    </motion.div>
                  </div>
                </Col>
                <Col md={12}>
                  <CMSTable
                    deleteRecord={deleteRecord}
                    loading={false}
                    cms={cms}
                    editRecord={editRecord}
                  />
                </Col>
              </Row>
            </Grid>
          </div>

          <CustomModal
            title={isEdit ? "Edit" : "Add"}
            visible={show}
            onCancel={handleClose}
            footer={null}
          >
            <Form
              onSubmit={(e) =>
                cmsSubmitHandler(
                  e,
                  data,
                  page,
                  section,
                  card,
                  setData,
                  setPage,
                  setSection,
                  setCard,
                  handleClose,
                  pageName,
                  sectionName,
                  cardName,
                  getAllData,
                  setShowLinks,

                  id
                )
              }
            >
              <FormSelect
                style={{ width: "100%" }}
                value={page}
                label="Page"
                disabled={disableSelect}
                onChange={(e) =>
                  changePages(
                    e,
                    pages,
                    setSections,
                    mySections,
                    setPage,
                    setShowCards,
                    setSection,
                    setPageName,
                    setShowSections,
                    setCard,
                    setSectionName,
                    setCardName,
                    setShowLinks
                  )
                }
              >
                {pages &&
                  pages.map((page, index) => (
                    <Option key={page.value}>{page.name}</Option>
                  ))}
                {/* {cities.map((city) => (
                  <Option key={city}>{city}</Option>
                ))} */}
              </FormSelect>
              {/* <FormInput
                name="pages"
                label="Pages"
                cat="select"
                onChange={(e) =>
                  changePages(
                    e,
                    pages,
                    setSections,
                    mySections,
                    setPage,
                    setShowCards,
                    setSection
                  )
                }
              >
                {pages &&
                  pages.map((page, index) => (
                    <option value={page.value}>{page.name}</option>
                  ))}
              </FormInput> */}

              {showSections && (
                <FormSelect
                  style={{
                    width: "100%",
                  }}
                  value={isEdit ? sectionName : section}
                  label="Section"
                  disabled={disableSelect}
                  onChange={(e) =>
                    changeSection(
                      e,
                      setSection,
                      sections,
                      page,
                      setShowCards,
                      setCard,
                      setSectionName,
                      setCardName
                    )
                  }
                >
                  {sections.map((section, index) => (
                    <Option key={section.id}>{section.name}</Option>
                  ))}
                </FormSelect>
              )}
              {showCards && (
                <FormSelect
                  style={{ width: "100%" }}
                  label="Card"
                  value={card}
                  disabled={disableSelect}
                  onChange={(e) => changeCards(e, setCard, cards, setCardName)}
                >
                  {cards.map((card, index) => (
                    <Option key={card.value}>{card.name}</Option>
                  ))}
                </FormSelect>
              )}

              <FormInput
                name="heading"
                label="Heading"
                cat="input"
                onChange={(e) => inputHandler(e, setData, data)}
                value={data.heading}
              ></FormInput>

              <FormInput
                name="text"
                label={showLinks ? "Link" : "Description"}
                cat="textarea"
                onChange={(e) => inputHandler(e, setData, data)}
                value={data.text}
              ></FormInput>
              <FormInput
                name="headingFrench"
                label="Heading French"
                cat="input"
                onChange={(e) => inputHandler(e, setData, data)}
                value={data.headingFrench}
              ></FormInput>
              {!showLinks && (
                <FormInput
                  name="textFrench"
                  label="Description French"
                  cat="textarea"
                  onChange={(e) => inputHandler(e, setData, data)}
                  value={data.textFrench}
                ></FormInput>
              )}

              <Button
                type="submit"
                disabled={
                  page && section && card
                    ? //   &&
                      //   data.heading &&
                      //   data.headingFrench &&
                      //   data.text &&
                      //   data.textFrench
                      false
                    : true
                }
              >
                {t("Submit")}
              </Button>
              {/* <FormGroup>
                <ControlLabel>{t("Pages")}</ControlLabel>
                <FormControl
                  componentClass="select"
                  name="pages"
                  //   value={newCustom.user ? newCustom.user : ""}
                  //   onChange={(e) => {
                  //     setNewCustom({ ...newCustom, user: e.target.value });
                  //   }}
                >
                  <React.Fragment>
                    {pages.map((page, index) => (
                      <option value={page.value}>{page.name}</option>
                    ))}
                  </React.Fragment>
                </FormControl>
              </FormGroup> */}

              {/* <div className="customWrap">
                  {listAppend.map((item, index) => (
                    <li key={index}>{`${item.key} = ${item.value}`}</li>
                  ))}
                </div> */}
            </Form>
          </CustomModal>
        </>
      )}
    </Translation>
  );
};

export default CMS;
