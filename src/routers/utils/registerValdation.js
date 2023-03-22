const yup = require("yup");

const createEmployeeValdation = yup.object().shape({
    base: yup.object().shape({
      name: yup.object().shape({
        first: yup.string().required(),
        father: yup.string().required(),
        grandfather: yup.string().required(),
        family: yup.string().required(),
        mother: yup.string().required()
      }),
      DOB: yup.date().required(),
      bornPlace: yup.string().required(),
      religion: yup.string().required(),
      nationality: yup.string().required(),
      relationStatus: yup.string().required(),
      IDNumber: yup.string().required(),
      phone: yup.object().shape({
        main: yup.string().required(),
        other: yup.string().required()
      }),
      edu: yup.object().shape({
        level: yup.string().required(),
        degrees: yup.string(),
        place: yup.string(),
      }),
      languageKnowlage: yup.string().required(),
      skills: yup.array().required(),
      military: yup.object().shape({
        join: yup.boolean().required(),
        ID: yup.string(),
        role: yup.string(),
      }),
      workBGL: yup.object().shape({
        worked: yup.boolean().required(),
        place: yup.string(),
        salary: yup.number(),
      }),
    }),
    website: yup.object().shape({
      username: yup.string().required(),
      pwd: yup.string().required(),
      type: yup.number().required()
    }),
    work: yup.object().shape({
      timeGroup: yup.string().required(),
      salary: yup.number().required(),
      job_title: yup.string().required(),
      company: yup.string().required()
    }),
});
module.exports = createEmployeeValdation;