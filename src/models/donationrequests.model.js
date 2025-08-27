
const mongoose = require('mongoose');

const donationRequestStatusOptions = [
    "New", "Accepted", "Rejected", "Cancelled"
];

const donationRequestSchema = new mongoose.Schema({
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: donationRequestStatusOptions,
        required: true,
        default: 'New'
    },
    message: { type: String, trim: true, maxlength: 500, required: true },
    respondedDate: { type: Date }
}, {
    timestamps: true // adds createdAt and updatedAt
});

const DonationRequest = mongoose.model('DonationRequest', donationRequestSchema);
module.exports = DonationRequest;