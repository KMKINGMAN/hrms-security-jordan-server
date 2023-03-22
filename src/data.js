require("dotenv").config();
var data = { 
    db: process.env.DB_HOST,
    name: process.env.DB_NAME,
    jwt: process.env.JWT_SECRIT
}
console.log(data)
module.exports = data;