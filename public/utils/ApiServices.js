const ApiServices = {
  on_login: async ({ phone_number, password, UserCookie }) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", UserCookie);

    var raw = JSON.stringify({
      phone_number: phone_number,
      password: password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch("http://localhost/auth/signin", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        return JSON.parse(result);
      })
      .catch((error) => console.log("error", error));
  },
  on_register: async ({ company_name, company_location }) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      company_name: company_name,
      company_location: company_location,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch("http://localhost/api/companies", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        return JSON.parse(result);
      })
      .catch((error) => console.log("error", error));
  },
};

module.exports = {
  ApiServices,
};
