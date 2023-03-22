module.exports = {
    companyValdation: require("./company").vaildation,
    companyModel: require("./company").model,
    companySchema: require("./company").schema,
    employeeBaseValdation: require("./employee").vaildation,
    employeeBaseModel: require("./employee").model,
    employeeBaseSchema: require("./employee").schema,
    employeeWorkValdation: require("./employee_work").vaildation,
    employeeWorkModel: require("./employee_work").model,
    employeeWorkSchema: require("./employee_work").schema,
    webuserValdation: require("./website").vaildation,
    webuserModel: require("./website").model,
    webuserSchema: require("./website").schema,
    rootValdation: require("./root").vaildation,
    rootModel: require("./root").model,
    rootSchema: require("./root").schema
}