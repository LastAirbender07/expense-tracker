import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    description:{
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        enum: ["cash", "card", "other"],
        required: true
    },
    category: {
        type: String,
        enum: ["saving", "expense", "income", "investment", "other"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        default: "Unknown"
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;