export const changePages = (value,pages, setSections, mySections, setPage, setShowCards, setSection, setPageName, setShowSections, setCard, setSectionName, setCardName) => {
    // setSection(1);
    if(value !== "home"){
        setShowCards(false)
    }
    
    const i = pages.findIndex((item) => item.value === value);
    const item = pages.find((item) => item.value === value);
    setPage(value);
    setPageName(item.name);
    if(i > 1) {
        setShowSections(false);
        setSection(value);
        setSections([]);
        setShowCards(false);
        setCard("1"); 
        setSectionName(item.name); 
        setCardName("General")
    }
    else{
        setShowSections(true);
        setCard(""); 
        setSectionName(""); 
        setCardName("")

        if(i > 0){
            const ind = i - 1;
            const sections = mySections.find((item, index) => index === ind);
            console.log("all sections ", sections);
            setSections(sections);
        }
        else{
            setSection("")
            setSections([])
            setShowCards(false)
        }
    }

    

}

export const inputHandler = (e, setData, data) => {
    const {name, value} = e.target;
    setData({...data, [name]: value});
    // if(name === "heading"){
    //     setData({...data, heading: value});
    // }
    // else if(name === "headingFrench"){
    //     setData({...data, headingFrench: value});
    // }
}

export const changeSection = (value, setSection, sections, page, setShowCards, setCard, setSectionName, setCardName) =>{
    console.log("section value ", value);
    setSection(value);
    setCard("4");
    setCardName("General");
  
    const item = sections.find((sec, index) => sec.id == value );
    setSectionName(item.name);
    if(page === "home" && value === "2"){
        setShowCards(true);
    }
    else{
        setShowCards(false)
    }
}

export const changeCards = (value, setCard, cards, setCardName) => {

    const item = cards.find((a, index) => a.value == value);
    setCardName(item.name);
    setCard(value);

}
export const cmsSubmitHandler = (e, data, page, section, card, setData, setPage, setSection, setCard, handleClose, pageName,
    sectionName,
    cardName, getAllData, id) => {
    e.preventDefault();
    console.log("set data ", data);
    console.log("set page ", page);
    console.log("set section ", section);
    console.log("set card ", card);

    var tokn = localStorage.getItem("userdata");
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const send = {
        id: id,
        sectionId: section,
        cardId: card,
        headingEnglish: data.heading,
        textEnglish: data.text,
        headingFrench: data.headingFrench,
        textFrench: data.textFrench,
        pageValue:page,
        pageName: pageName,
        sectionName: sectionName,
        cardName: cardName
    }

    console.log("send data  ", send);


    fetch(`${baseUrl}CMS/CreateCM`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${tokn}`,
            "Content-type": "application/json"
        },
        body: JSON.stringify(send)
    }
    )
    .then(resp => resp.json())
        .then(res =>{
             console.log("response page ", res);
             getAllData();
            })
        .catch(err => console.log("page error ", err.message))

    clearStates(setData, setPage, setSection, setCard,handleClose)
}

const clearStates = (setData, setPage, setSection, setCard, handleClose) => {
    setData({
        heading: "",
        headingFrench: "",
        text: "",
        textFrench: "",
    });
    setPage("");
    setSection("");
    setCard("");
    handleClose();
}
