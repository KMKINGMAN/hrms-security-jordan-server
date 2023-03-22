let data = require("./data");
const { default: mongoose } = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment")
mongoose.connect(data.db, { dbName: data.name }).then(()=> console.log("db connection successful")).catch((reason)=> console.log("Connect Error " + reason));
const con = mongoose.createConnection(data.db, { dbName: data.name });
// autoIncrement.initialize(con);
module.exports = con;