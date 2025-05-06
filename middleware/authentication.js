//middleware 
const jwt = require('jsonwebtoken');
require("dotenv").config()


const authenticateToken = (request, response, next) => {
  // console.log('authentication:',"Hello Ok")
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401).send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, process.env.MY_SECRET_KEY, async (error, payload) => {
      if (error) {
        response.status(401).send("Invalid JWT Token");
      } else {
        request.email = payload.email;
        next();
      }
    });
  }
};

module.exports = authenticateToken;