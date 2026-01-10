import mongoose from "mongoose"

const CallSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true
})

export const Call = mongoose.models.Call || mongoose.model("Call", CallSchema)
