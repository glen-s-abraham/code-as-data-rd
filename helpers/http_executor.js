const axios = require("axios");

async function sendHttpRequest(reqParams) {
  const { method, url, data, headers } = reqParams;
  //add validator
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });  
    return response.data;
  } catch (error) {
    // Handle error here, e.g., log or throw an exception
    console.error("Error sending HTTP request:", error.message);
    throw error;
  }
}

module.exports = {
  sendHttpRequest,
};
