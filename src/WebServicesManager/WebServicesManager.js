import React from "react";
import Utilities from "Utilities/Utilities";

export default class WebServicesManager extends React.Component {
	//  baseUrl = "http://160.153.244.127:82/api/";
  baseUrl = "http://localhost:63539/api/";


  //Post method

  callPostMethod(apiURL, params, callback) {
    fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: params.dataToInsert
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  postApiCall(params, callback) {
    return this.callPostMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get method
  callGetMethod(baseURL, params, callback) {
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {});
  }
  getApiCall(params, callback) {
    return this.callGetMethod(this.baseUrl + params.endPoint, params, callback);
  }

  //Get method for contactUs
  callGetMethodForContactUs(baseURL, params, callback) {
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        Utilities.showAlert("Error");
      });
  }
  getApiCallForContactUs(params, callback) {
    return this.callGetMethodForContactUs(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get method for Email validate Check
  callGetMethodForEmailValidate(baseURL, params, callback) {
    baseURL = baseURL + "/?email=" + params.dataToCheck;
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {
        Utilities.showAlert("Error");
      });
  }
  getApiCallForEmail(params, callback) {
    return this.callGetMethodForEmailValidate(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Post method
  callPostMethodToGetAllPerson(baseURL, params, callback) {
    fetch(baseURL, {
      method: "Post",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        Utilities.showAlert("Error");
      });
  }
  callPostToGetAllPerson(params, callback) {
    return this.callPostMethodToGetAllPerson(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  callPostNearbyInstructorMethod(apiURL, params, callback) {
    fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: params.dataToInsert
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {});
  }
  // getApiCallInstructor(params, callback) {
  //   return this.callGetMethod(this.baseUrl + params.endPoint, params, callback);
  // }

  postApiNearbyInstructorsCall(params, callback) {
    return this.callPostNearbyInstructorMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get with parameters method with ID
  callGetWithParamMethod(baseURL, params, callback) {
    baseURL = baseURL + "/?id=" + params.dataToFetch;
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json"
      }
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {});
  }
  callApiwithParamReturnMsg(baseURL, params, callback) {
    baseURL = baseURL + "/?id=" + params.dataToFetch;
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json"
      }
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("Json Form of response", responseJson);
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {console.log(error)});
  }

  GetBookletCmt(baseURL, params, callback) {
    baseURL = this.baseUrl +baseURL+ "/?studentId=" + params[0]+"&bookletItemId="+params[1];
    
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json"
      }
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {});
  }
  getApiWithParamCall(params, callback) {
    return this.callGetWithParamMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }
getApiwithParamReturnMsg(params, callback) {
  return this.callApiwithParamReturnMsg(
    this.baseUrl + params.endPoint,
    params,
    callback
  );
}
  //Get LogIn
  callGetLogIn(baseURL, params, callback) {
    fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: params.dataToLogIn
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {});
  }

  LogIn(params, callback) {
    return this.callGetLogIn(this.baseUrl + params.endPoint, params, callback);
  }

  //Update method

  //Get with parameters method with ID
  callPutMethod(baseURL, params, callback) {
    var params2 = JSON.parse(params.dataToUpdate);
    baseURL = baseURL + "?id=" + params2.id + "&status=" + params2.status;

    // baseURL = baseURL;
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json"
      }
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {});
  }

  putApi(params, callback) {
    return this.callPutMethod(this.baseUrl + params.endPoint, params, callback);
  }

  //delete with parameters method with ID
  callDeleteMethod(baseURL, params, callback) {
    var params1 = JSON.parse(params.dataToUpdate);
    baseURL = baseURL + "?id=" + params1.id;

    // baseURL = baseURL;
    fetch(baseURL, {
      method: "Post",
      headers: {
        "Content-Type": "application/json"
      }
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        Utilities.showAlert("Error");
      });
  }

  DeleteApi(params, callback) {
    return this.callDeleteMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //delete with Id in url
  callDeleteMethodInURL(baseURL, params, callback) {
    // var params = JSON.parse(params.dataToDelete);
    baseURL = baseURL + "/" + params.dataToDelete;

    // baseURL = baseURL;
    fetch(baseURL, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json"
      }
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.returnStatus);
      })
      .catch(error => {
        Utilities.showAlert("Error");
      });
  }

  DeleteApiInURL(params, callback) {
    return this.callDeleteMethodInURL(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get with parameters method with ID
  callPostMethodForSuspend(baseURL, params, callback) {
    // var params = JSON.parse(params.dataToUpdate);

    // baseURL = baseURL;
    fetch(baseURL, {
      method: "Post",
      headers: {
        "Content-Type": "application/json"
      },
      body: params.dataToUpdate
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        Utilities.showAlert("Error");
      });
  }

  postMethodForSuspend(params, callback) {
    return this.callPostMethodForSuspend(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Image Post Method
  callImagePostMethod(apiURL, params, callback) {
    fetch(apiURL, {
      method: "POST",
      body: params.dataToInsert
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.message);
      })
      .catch(error => {});
  }

  postApiImageCall(params, callback) {
    return this.callImagePostMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }
}
