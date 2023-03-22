const { employeeBaseModel, companyModel, employeeWorkModel, webuserModel } = require("../../modals/index");
const { schema_names } = require("../../modals/util");

/**
 * @typedef {Object} EmployeeData
 * @property {string} _id - The unique identifier of the employee.
 * @property {{ first: string, father: string, grandfather: string, family: string, mother: string }} name - The name of the employee.
 * @property {Date} DOB - The date of born for the employee.
 * @property {string} bornPlace - The Employee Born Place
 * @property {string} religion - The Employee Religion
 * @property {string} nationality - The Employee Nationality
 * @property {string} relationStatus - The Employee Relation Ship Status
 * @property {string} IDNumber - The Employee ID Number
 * @property {{ main: string, other: string}} phone - The Employee Phone Numbers
 * @property {{ level: string, degrees: string, place: string }} edu - The Employee Education Level
 * @property {string} languageKnowlage - The Employee Education Level
 * @property {[string]} skills - The Employee Skills
 * @property {{join: boolean, ID: string, role: string }} military - The Employee Military Status
 * @property {{ worked: boolean, place: string, salary: number }} workBGL - The Employee Other Company Data
 * @property {EmployeeWorkProfileData} work - The Employee Work Profile
 * @property {{}} web_user - The Employee Website Profile

/**
 * @typedef {Object} CompanyData
 * @property {string} _id - The unique identifier of the company.
 * @property {string} name - The name of the company.
 * @property {string} location - The location of the company.
 * @property {[{ time_group: string, employee: EmployeeData, added_at: Date }]} employees - The Company Employees List
 */

/**
 * @typedef {Object} EmployeeWorkProfileData
 * @property {string} _id - The unique identifier of the employee.
 * @property {string} job_title - The job title of the employee.
 * @property {number} salary - The salary of the employee.
 * @property {CompanyData} location - The Employee Work at
 * @property {[{ location: string, byManager: boolean , date: Date, manager: EmployeeData }]} attendance - the Employee attendance data
 * @property {[{ reason: string, date: Date, amount: number, require_payments: number, repayment_payments: number, admin: EmployeeData }]} loans - The Employee Loans
 * @property {number} supplyies - The Employee Supplyies
 * @property {string} job_title - The Employee Job Title
 * @property {EmployeeData} owner - The Employee Data
 * @property {} web - The Employee web data
 */

/**
 * @typedef {Object} ErrorObject
 * @property {string} message - The error message.
 * @property {Error} error - The error object.
 */

/**
 * @typedef {Object} GetAllEmployeesResponse
 * @property {Array<EmployeeData>} employees - An array of employee data.
 */

/**
 * @typedef {Object} GetAllCompaniesResponse
 * @property {Array<CompanyData>} companies - An array of company data.
 */

/**
 * @typedef {Object} GetEmployeeByIdResponse
 * @property {EmployeeData} employee - The employee data.
 * @property {ErrorObject} error - The error object, if any.
 */

/**
 * @typedef {Object} GetCompanyByIdResponse
 * @property {CompanyData} company - The company data.
 * @property {ErrorObject} error - The error object, if any.
 */

/**
 * @typedef {Object} GetWorkProfileResponse
 * @property {EmployeeWorkProfileData} workProfile - The employee work profile data.
 * @property {ErrorObject} error - The error object, if any.
 */

module.exports = {
    /**
     * Get all employees from the database.
     *
     * @returns {Promise<GetAllEmployeesResponse>}
     */
    getAllEmployees: async () => {
        try {
            const employees = await employeeBaseModel.find()
            .populate('work')
            .populate('web_user');
            return { employees };
        } catch (error) {
            return { error: { message: "Error getting employees", error } };
        }
    },

    /**
     * Get all companies from the database.
     *
     * @returns {Promise<GetAllCompaniesResponse>}
     */
    getAllCompanies: async () => {
        try {
            const companies = await companyModel.find({}).populate({
                path: 'employees.employee',
                model: schema_names.employee,
            });
            return { companies };
        } catch (error) {
            return { error: { message: "Error getting companies", error } };
        }
    },

    /**
     * Get employee data from their id from the database.
     *
     * @param {string} employeeId - The id of the employee.
     * @returns {Promise<GetEmployeeByIdResponse>}
     */
    getEmployeeById: async (employeeId) => {
        try {
            const employee = await employeeBaseModel.findById(employeeId)
            .populate('work')
            .populate('web_user');
            return { employee };
        } catch (error) {
            return { error: { message: "Error getting employee", error } };
        }
    },

    /**
     * Get company data from their id from the database.
     *
     * @param {string} companyId - The id of the company.
     * @returns {Promise<GetCompanyByIdResponse>}
     */
    getCompanyById: async (companyId) => {
        try {
            const company = await
                companyModel.findById(companyId).populate({
                    path: 'employees.employee',
                    model: schema_names.employee,
                });
            return { company };
        } catch (error) {
            return { error: { message: "Error getting company", error } };
        }
    },

    /**
    
        Get employee work profile by id from the database.
        @param {string} employeeId - The id of the employee.
        @returns {Promise<GetWorkProfileResponse>}
        */
    getWorkProfile: async (employeeId) => {
        try {
            const workProfile = await employeeWorkModel.findById(employeeId)
            .populate("owner")
            .populate("web");
            return { workProfile };
        } catch (error) {
            return { error: { message: "Error getting work profile", error } };
        }
    },
    /**
   * @description remove company document from the database by its ID
   * @param {string} company_id - The ID of the company to remove
   * @returns {Promise<boolean>} - Returns true if the company document is removed successfully, or false if it's not found or an error occurs.
   */
  removeCompanyByID: async (company_id) => {
    try {
      const result = await companyModel.deleteOne({ _id: company_id });
      if (result.deletedCount === 0) {
        return false;
      }
      return true; 
    } catch (err) {
      return false; 
    }
  },
  /**
   * @description remove employee document from the database by its ID
   * @param {string} employee_id - The ID of the employee to remove
   * @returns {Promise<boolean>} - Returns true if the employee document is removed successfully, or false if it's not found or an error occurs.
   */
      removeEmployeeByID: async (employee_id) => {
        try {
          const result = await employeeBaseModel.findById(employee_id)
          .populate('work')
          .populate('web_user');
          let work_id = result.work._id;
          let web_user_id = result.web_user._id;
          const resultForBase = await employeeBaseModel.deleteOne({ _id: employee_id });
          const resultForWork = await employeeWorkModel.deleteOne({ _id: work_id });
          const resultForWeb = await webuserModel.deleteOne({ _id: web_user_id });
          if (resultForBase.deletedCount === 0){
            return false
          }
          return true; 
        } catch (err) {
          return false; 
        }
      },
};