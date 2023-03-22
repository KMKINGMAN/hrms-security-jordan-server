const { Schema, Types, model } = require("mongoose"), 
    yup = require("yup"), 
    // { autoIncrement } = require("./../mongo"),
    { schema_names } = require("./util");
const schema = new Schema({
    name: {
        first: { type: String, required: true },
        father: { type: String, required: true },
        grandfather: { type: String, required: true },
        family: { type: String, required: true },
        mother: { type: String, required: true }
    },
    DOB: { type: Date, required: true },
    bornPlace: { type: String, required: true },
    religion: { type: String, required: true },
    nationality: { type: String, required: true },
    relationStatus: { type: String, required: true },
    IDNumber: { type: String, required: true },
    phone: {
        main: { type: String, required: true },
        other: { type: String, required: true },
    },
    edu: {
        level: { type: String, required: true },
        degrees: { type: String, required: false },
        place: { type: String, required: false }
    },
    languageKnowlage: { type: String, required: true },
    skills: { type: [String], required: false },
    military: {
        join: { type: Boolean, required: true },
        ID: { type: String, required: false },
        role: { type: String, required: false },
    },
    workBGL: {
        worked: { type: Boolean, required: true },
        place: { type: String, required: false },
        salary: { type: Number, required: false },
    },
    work: { type: Types.ObjectId, ref: schema_names.work },
    web_user: { type: Types.ObjectId, ref: schema_names.website },
}),
vaildation = yup.object().shape({
    name: yup.object().shape({
        first: yup.string().required(),
        father: yup.string().required(),
        grandfather: yup.string().required(),
        family: yup.string().required(),
        mother: yup.string().required(),
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
        degrees: yup.string().notRequired(),
        place: yup.string().notRequired()
    }),
    languageKnowlage: yup.string().required(),
    skills: yup.array().of(yup.string()).notRequired(),
    military: yup.object().shape({
        join: yup.boolean().required(),
        ID: yup.string().notRequired(),
        role: yup.string().notRequired(),
    }),
    workBGL: yup.object().shape({
        worked: yup.boolean().required(),
        place: yup.string().notRequired(),
        salary: yup.string().notRequired(),
    })
}),
models = model(schema_names.employee, schema);
// schema.plugin(autoIncrement.plugin, {
//     model: schema_names.employee,
//     field: `${schema_names.employee}ID`
    
// })
module.exports = {
    schema,
    vaildation,
    model: models
}