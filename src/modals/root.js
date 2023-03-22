const { Schema, Types, model } = require("mongoose"), 
    yup = require("yup"), 
    // { autoIncrement } = require("./../mongo"),
    { schema_names } = require("./util");
const schema = new Schema({
    name: { type: String, required: true, default: "main" },
    location: { type: String, required: true },
    employees: [{ type: Types.ObjectId, ref: schema_names.employee }],
    logo: { data: Buffer, contentType: String, name: String },
}),
vaildation = yup.object().shape({
    name: yup.string(),
    location: yup.string(),
    employees: yup.array().of(yup.mixed()),
    logo: yup.mixed()
}),
models = model("root", schema);
// schema.plugin(autoIncrement.plugin, {
//     model: "root",
//     field: "rootID"
    
// })
module.exports = {
    schema,
    vaildation,
    model: models
}