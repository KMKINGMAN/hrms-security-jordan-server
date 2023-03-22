const { Schema, Types, model } = require("mongoose"), 
    yup = require("yup"), 
    // { autoIncrement } = require("./../mongo"),
    { schema_names } = require("./util");
const schema = new Schema({
    timeGroup: { type: String, required: false },
    location: { type: Types.ObjectId, ref: schema_names.company },
    salary: { type: Number, required: true },
    attendance: [{
        location: { type: String, required: false },
        byManager: { type:Boolean, required: true, default: false },
        date: { type: Date, required: true, default: new Date()},
        manager: { type: Types.ObjectId, ref: schema_names.employee }
    }],
    loans: [{
        reason: { type: String, required: true },
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
        require_payments: { type: Number, required: true },
        repayment_payments: { type: Number, required: true },
        admin: { type: Types.ObjectId, ref: schema_names.employee }
    }],
    supplyies: { type: Number, default: 0 },
    job_title: { type: String },
    owner: { type: Types.ObjectId, ref: schema_names.employee },
    web: { type: Types.ObjectId, ref: schema_names.website }
}),
vaildation = yup.object().shape({
    timeGroub: yup.string().required(),
    location: yup.string().required(),
    salary: yup.number().required(),
    attendance: yup.array().of(yup.object().shape({
        location: yup.string().notRequired(),
        byManager: yup.boolean().default(false).required(),
        date: yup.date(),
        manager: yup.mixed()
    })).required(),
    loans: yup.array().of(
        yup.object().shape({
            reason: yup.string(),
            date: yup.date().default(new Date()),
            amount: yup.number(),
            require_payments: yup.number(),
            repayment_payments: yup.number().default(0),
            admin: yup.mixed()
        })
    ),
    supplies: yup.number().default(0),
    job_title: yup.string(),
    owner: yup.mixed(),
    web: yup.mixed()
}),
models = model(schema_names.work, schema);
// schema.plugin(autoIncrement.plugin, {
//     model: schema_names.work,
//     field: `${schema_names.work}ID`
    
// })
module.exports = {
    schema,
    vaildation,
    model: models
}