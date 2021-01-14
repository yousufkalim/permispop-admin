import React, { useState, useEffect, useMemo } from "react";
import WebServicesManager from "../../WebServicesManager/WebServicesManager";
import InstructorAdd from "../InstructorComponents/InstructorAdd";

function UserInstructors(props) {
  const WebServicesManagers = useMemo(() => new WebServicesManager());
  const [instructors, setInstructors] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  // fetch all instructors by driving school
  useEffect(() => {
    console.log(props, "Props");
    var tokn = localStorage.getItem("userdata");
    WebServicesManagers.getApiWithParamCall(
      {
        endPoint: "Profile/GetProfileByPersonalId",
        dataToFetch: props.id,
        token: tokn,
      },
      (statusCode, responseDrivingSchool) => {
        var instructorsDetails = JSON.parse(
          responseDrivingSchool.drivingSchoolInstructorInfoId
        );
        var lenToMatch = Object.entries(instructorsDetails).length;
        var data = [];
        Object.entries(instructorsDetails).forEach(async ([key, value]) => {
          if (value !== null && value !== undefined) {
            // inslen = inslen + 1;
            await WebServicesManagers.getApiWithParamCall(
              {
                endPoint: "Personal/GetAllById",
                dataToFetch: value,
                token: tokn,
              },
              (statusCode, responsePersonalData) => {
                var datais = [
                  `${responsePersonalData.firstName} ${responsePersonalData.surName}`,
                  `${responsePersonalData.address} ${responsePersonalData.zip} ${responsePersonalData.city}`,
                  responsePersonalData.gender,
                  responsePersonalData.email,
                  responsePersonalData.documentTested,
                  responsePersonalData.id,
                ];
                data.push(datais);
                if (data.length === lenToMatch) {
                  setInstructors(data);
                }
              }
            );
          } else {
            lenToMatch = lenToMatch - 1;
            if (data.length === lenToMatch) {
              setInstructors(data);
            }
          }
        });
      }
    );
  }, [updateList]);

  const updateData = () => {
    setUpdateList(!updateList);
  };

  return (
    <div className="table-responsive" style={{ overflowX: "scroll" }}>
      {!showAdd ? (
        <i
          className="fa fa-plus-circle"
          style={{ float: "right", fontSize: 18, margin: "15px 10px" }}
          onClick={() => setShowAdd(true)}
        ></i>
      ) : (
        <i
          className="fa fa-times-circle"
          style={{ float: "right", fontSize: 18, margin: "15px 10px" }}
          onClick={() => setShowAdd(false)}
        ></i>
      )}
      <InstructorAdd
        showAddModel={showAdd}
        drivingSchoolData={props}
        update={updateData}
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.length > 0
            ? instructors.map((ins) => (
                <tr key={ins[ins.length - 1]}>
                  <td>{ins[0]}</td>
                  <td>{ins[1]}</td>
                  <td>{ins[2]}</td>
                  <td>{ins[3]}</td>
                  <td>
                    {ins[4] === "Tested" ? (
                      <i className="fa fa-check" style={{ color: "green" }}></i>
                    ) : (
                      <i className="fa fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <i
                      className="fa fa-eye"
                      onClick={() => props.changeUser(ins[5])}
                    ></i>
                    {/* <i className="fa fa-trash"></i> */}
                  </td>
                </tr>
              ))
            : ""}
        </tbody>
      </table>
    </div>
  );
}

export default UserInstructors;
