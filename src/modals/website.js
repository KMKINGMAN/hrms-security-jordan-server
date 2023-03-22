const { Schema, Types, model } = require("mongoose"), 
    yup = require("yup"), 
    // { autoIncrement } = require("./../mongo"),
    { schema_names } = require("./util");
const schema = new Schema({
    username: { type: String, required: true },
    pwd: { type: String, required: true },
    type: { type: Number, default: 0 },
    lastLogin: { type: Date, default: new Date() },
    employee: { type: Types.ObjectId, ref: schema_names.employee },
    active: { type: Boolean, default: false ,required: true }
}),
vaildation = yup.object().shape({
    username: yup.string().required(),
    pwd: yup.string().required(),
    type: yup.number().default(0).required(),
    lastLogin: yup.date().default(new Date),
    active: yup.boolean().default(false).required()
}),
models = model(schema_names.website, schema);
// schema.plugin(autoIncrement.plugin, {
//     model: schema_names.website,
//     field: `${schema_names.website}ID`
    
// })
module.exports = {
    schema,
    vaildation,
    model: models
}