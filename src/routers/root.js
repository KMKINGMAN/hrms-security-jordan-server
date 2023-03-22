
const { Router } = require("express");
const { rootModel } = require("../modals");
const jwt = require("jsonwebtoken");
const sec_data = require("../data");
const auth = require("./utils/accountTypeJWT");
let newRouter = Router()
let data = {
    main: "/root",
    router: newRouter.post("/create", async(req, res)=> {
        let { name, location } = req.body;
        let rootdata = await rootModel.create({
            name: name,
            location: location
        });
        res.status(200).json({
            message: "Created A Root Company Data",
            data: rootdata
        })
    })
    .get("/data", async(req, res)=> {
        let [data] = await rootModel.find({});
        return res.status(200).json(data)
    })
}
module.exports = data;