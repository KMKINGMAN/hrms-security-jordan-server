
const { Router } = require("express");
const { getAllCompanies, getCompanyById, removeCompanyByID } = require("../kingman/utils/data");
const { companyValdation, companyModel } = require("../modals");
let newRouter = Router();
let data = {
    main: "/companies",
    router: newRouter
    .get("/all", async (req, res)=> {
        try {
            const { companies } = await getAllCompanies();
            if (!companies) {
              return res.status(404).json({
                error: "No companies found"
              });
            }        
            return res.send(companies);
          } catch (error) {
            console.error(error);
            return res.status(500).json({
              error: "Server error occurred"
            });
          }
    })
    .get("/:companyId/profile", async(req, res)=> {
        try {
            const companyId = req.params.companyId;
            const company = await getCompanyById(companyId);
            if (!company) {
              return res.status(404).json({
                error: "Company not found"
              });
            }
            return res.send(company);
          } catch (error) {
            console.error(error);
            return res.status(500).json({
              error: "Server error occurred"
            });
          }
    })
    .delete("/:companyId/remove", async(req, res)=> {
        try {
            const companyId = req.params.companyId;
            const emitter = req.app.get("eventEmitter");
            const company = await removeCompanyByID(companyId);
            if (!company) {
              return res.status(404).json({
                error: "Company not found"
              });
            }
            emitter.emit("companyRemove", companyId);
            return res.status(200).json({
              message: "Company removed successfully",
              company: company
            });
          } catch (error) {
            console.error(error);
            return res.status(500).json({
              error: "Server error occurred"
            });
          }
    })
    .patch("/:companyId/update", async(req, res)=> {
        try {
            const { companyId } = req.params;
            const emitter = req.app.get("eventEmitter");
            const validatedBody = await companyValdation.validate(req.body, {
              abortEarly: false,
              stripUnknown: true,
            });
        
            const result = await companyModel.findByIdAndUpdate(companyId, validatedBody, {
              new: true,
            });
        
            if (!result) {
              return res.status(404).json({ error: "Company not found" });
            }
        
            const updatedCompany = await getCompanyById(companyId);
            if (!updatedCompany.company) {
              return res.status(404).json({ error: "Company not found" });
            }
            emitter.emit("companyUpdate", updatedCompany.company);
            return res.json(updatedCompany.company);
          } catch (error) {
            if (error.name === "ValidationError") {
              return res.status(400).json({ errors: error.errors });
            }
            return res.status(500).json({ error: "Server error" });
          }
    })
    .post("/create", async(req, res)=> {
        try {
          console.log(req.body)
            const companyData = await companyValdation.validate(req.body);
            const newCompany = await companyModel(companyData);
            await newCompany.save();
            return res.status(201).json(newCompany);
        } catch (error){
            if (error.name === 'ValidationError') {
                return res.status(400).json({ errors: error.errors });
            }
            console.log(error)
            return res.status(500).json({ message: 'Server error' });

        }
    })
}
module.exports = data;