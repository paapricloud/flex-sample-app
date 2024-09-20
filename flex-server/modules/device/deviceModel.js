const mongoose = require('mongoose');
const autoIncrement = require('../plugins/AutoIncrement')

const schema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "Please enter name."]
        },
        description: String,
        permissionCode: {
            type: String,
            default: "DEVICE",
            select: false
        },
        isInactive: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
)

schema.plugin(autoIncrement.plugin, {
    model: "Device",
    field: "documentId"
})

const Device = mongoose.model('Device', schema);
module.exports = Device;