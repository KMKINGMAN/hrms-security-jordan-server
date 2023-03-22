
const { Router } = require("express");
const { getAllEmployees, getEmployeeById, removeEmployeeByID, getWorkProfile } = require("../kingman/utils/data");
const { employeeBaseValdation, webuserModel, employeeBaseModel, employeeWorkModel, companyModel, rootModel } = require("../modals");
const yup = require("yup");
const createEmployeeValdation = require("./utils/registerValdation");
let newRouter = Router()
let data = {
    main: "/employee",
    router: newRouter
    .get("/all", async(req, res)=> {
        try {
            const { employees } = await getAllEmployees();
            if (!employees) {
                return res.status(404).json({
                    error: "No employees found"
                })
            }
            return res.send(employees);
        } catch (error) {
            return res.status(500).json({
              error: "Server error occurred"
            });
        }
    })
    .get("/:employeeId/profile", async(req, res)=> {
        try {
            const employeeId = req.params.employeeId;
            const { employee } = await getEmployeeById(employeeId);
            if(!employee){
                return res.status(404).json({
                    error: "Employee not found"
                })
            };
            return res.send(employee)
        } catch (error) {
            console.log(error)

            return res.status(500).json({ message: 'Server error' });
        }
    })
    .delete("/:employeeId/remove", async(req, res)=> {
        try {
            const employeeId = req.params.employeeId;
            const emitter = req.app.get("eventEmitter");
            const employee = await removeEmployeeByID(employeeId);
            if(!employee){
                return res.status(404).json({
                    error: "Employee not found"
                })
            }
            emitter.emit("employeeRemove", employeeId);
            return res.status(200).json({
                message: "Employee removed successfully",
                employee: employee
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Server error' });
        }
    })
    .patch("/:employeeId/update", async(req, res)=> {
        try {
            const { employeeId } = req.params;
            const emitter = req.app.get("eventEmitter");
            const body = await employeeBaseValdation.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });
            const result = await employeeBaseModel.findByIdAndUpdate(employeeId, body, {
                new: true
            });
            if (!result) {
                return res.status(404).json({ error: "Employee not found" });
            }
            const updateEmployee = await getEmployeeById(employeeId);
            if(!updateEmployee.employee){
                return res.status(404).json({ error: "Employee not found" });
            }
            emitter.emit("employeeUpdate", updateEmployee.employee);
            return res.json(updateEmployee.employee)
        } catch (error) {
            console.log(error)

            return res.status(500).json({ message: 'Server error' });
        }
    })
    .post("/:employeeId/attendance", async(req, res)=> {
        try {
            const emitter = req.app.get("eventEmitter");
            let employeeId = req.params.employeeId;
            if(!employeeId){
                return res.status(404).json({
                    error: "Employee not found"
                })
            };
            let vaildation = yup.object().shape({
                location: yup.string().notRequired(),
                byManager: yup.boolean().required(),
                date: yup.date().required().default(new Date()),
                manager: yup.mixed()
            });
            let result = await vaildation.validate(req.body, {
                abortEarly: false,
            });
            const { employee } = await getEmployeeById(employeeId);
            if(!employee){
                return res.status(404).json({
                    error: "Employee not found"
                })
            };
            const work_profile_id = employee.work._id;
            const { workProfile } = await getWorkProfile(work_profile_id);
            if(!workProfile){
                return res.status(404).json({
                    error: "There is no Work Profile For This Employee"
                })
            };
            workProfile.attendance.push(result);
            workProfile.save();
            emitter.emit("employeeAttendance", workProfile);
            return res.status(201).json({
                message: "Employee Attendance Registered",
                workProfile
            })
            
        } catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }
    })
    .post("/create", async(req, res)=> {
        try {
            console.log(req.body)
            const emitter = req.app.get("eventEmitter");
            let result = await createEmployeeValdation.validate(req.body);
            if(!result){
                return res.status(404).json({
                    error: "invaild body"
                })
            };
            result.base.DOB = new Date(result.base.DOB);
            let createWebuser = await webuserModel.create(result.website);
            let createEmployee = await employeeBaseModel.create(result.base);
            let createEmployeeWork = await employeeWorkModel.create(result.work);
            createEmployee.work = createEmployeeWork._id;
            createEmployee.web_user = createWebuser._id;
            createEmployeeWork.owner = createEmployee._id;
            createEmployeeWork.web = createWebuser._id;
            createWebuser.employee = createEmployee._id;
            createWebuser.save();
            createEmployee.save();
            createEmployeeWork.save();
            let company = await companyModel.findById(result.work.company);
            if(!company){
                [company] = await rootModel.find({});
                company.employees.push(createEmployee._id);
                company.save();
            } else {
                company.employees.push({
                    time_group: result.work.timeGroup,
                    employee: createEmployee._id,
                    added_at: new Date()
                });
                company.save();
            } 

            let data = (await (await createEmployee.populate("web_user")).populate("work"));
            emitter.emit("employeeCreate", data);
            return res.status(201).json({
                message: "Created Employee",
                data: data
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Server error' });
        }
    })
}
module.exports = data;