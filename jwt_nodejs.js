const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const app = express();
require("dotenv").config();

// Set up Global configuration access
dotenv.config();
  
let PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});

// Generating JWT
app.post("/user/generateToken", (req, res) => {
    // Validate User Here
    // Then generate JWT Token
  
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
    }
  
    const token = jwt.sign(data, jwtSecretKey);
    // res.json(data, token);
    res.send(token);
    
});

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;

        next(); // use next() to invoke the next route handler.
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}

  
// Verification of JWT
app.get("/user/validateToken", checkToken, (req, res) => {
    
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
  
    jwt.verify(req.token, jwtSecretKey, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
        } else {
    // Tokens are generally passed in header of request
            //If token is successfully verified, we can send the authorized data 
            res.json({
                message: 'Successful log in',
                authorizedData
            });
            console.log('SUCCESS: Connected to protected route');
        }
    })
});

