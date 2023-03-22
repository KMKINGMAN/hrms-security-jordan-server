const { Router } = require("express");
const { model } = require("../modals/website");
let newRouter = Router()
let data = {
    main: "/",
    router: newRouter
    .get("/", (req, res)=> {
        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit("main_req");
        return res.send(
            {
                owner: "KINGMAN",
                developer: "Muhammad Rafat Kurkar",
                phone: "+962 79 291-4245",
                email: "kingkurkar@gmail.com"
            }
        );
    })
}
module.exports = data;