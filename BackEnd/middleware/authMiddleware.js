const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect =async(req, res, next)=>{
    //check if the user is loged in by checking the token
}

module.exports = {protect}