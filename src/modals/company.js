const { Schema, Types, model } = require("mongoose"), 
    yup = require("yup"), 
    { schema_names } = require("./util");
const schema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    employees: [
        {
            time_group: String,
            employee: { type: Types.ObjectId, ref: schema_names.employee },
            added_at: { type: Date, default: new Date() }
        }
    ],
}),
vaildation = yup.object().shape({
    name: yup.string().required(),
    location: yup.string().required(),
    employee: yup.array(yup.object().shape({
        time_group: yup.string().required(),
        employee: yup.mixed().required(),
        added_at: yup.date().required()
    }))
}),
models = model(schema_names.company, schema);
// schema.plugin(autoIncrement.plugin, {
//     model: schema_names.company,
//     field: `${schema_names.company}ID`
    
// })
module.exports = {
    schema,
    vaildation,
    model: models
}