
const { Router } = require("express");
const { webuserValdation, webuserModel, employeeBaseModel } = require("../modals");
const jwt = require("jsonwebtoken");
const sec_data = require("../data");
const auth = require("./utils/accountTypeJWT");
let newRouter = Router()
let data = {
    main: "/auth",
    router: newRouter
        .post("/login", async (req, res) => {
            webuserValdation.validate(req.body)
                .then(async (value) => {
                    console.log(value)
                    let User = await webuserModel.findOne({ username: value.username })
                        .then((userData) => { return { data: userData, err_status: false } })
                        .catch((error) => { return { data: undefined, err: error, err_status: true } });
                    let { err_status, data, err } = User;
                    if (err_status || data === undefined || err !== undefined) {
                        return res.status(401).json({
                            error: "User with that username does not exist."
                        });
                    };
                    if (data) {
                        if (data.password !== value.password) {
                            return res.status(401).json({
                                error: "Password Don't Match"
                            })
                        };
                        data.lastLogin = new Date();
                        data.save();
                        data = await data.populate({
                            path: "employee"
                        });
                        const token = jwt.sign({
                            id: data.employee._id,
                            name: `${data.employee.name.first} ${data.employee.name.family}`,
                            accountType: data.type,
                            username: data.username
                        }, sec_data.jwt);
                        const { username, type: account_level } = data;
                        return res.json({
                            token, user: {
                                _id: data.employee._id,
                                username,
                                name: `${data.employee.name.first} ${data.employee.name.family}`,
                                account_level,
                                employee: data.employee
                            }
                        });
                    }
                    return res.status(404).json({
                        message: "Username is invaild"
                    })
                })
                .catch((error) => {
                    console.log(error)
                    return res.status(500).json({ message: 'Server error' });
                })
        })
        .get("/status", auth, async (req, res)=> {
            if(!req.user){
                return res.status(404).json({
                    message: "invaild token"
                })
            }
            let data = await employeeBaseModel.findOne({ _id: req.user.id }).populate("web_user")
            if(!data){
                return res.status(404).json({
                    message: "user profile not found"
                })
            }
            return res.status(201).send({
                token: req.user.token,
                user: {
                    _id: req.user.id,
                    username: req.user.username,
                    name: `${data.name.first} ${data.name.family}`,
                    account_level: data.web_user.type,
                    employee: data
                }
            })
            
        })
}
module.exports = data;