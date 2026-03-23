import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reportId: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    results: {
        type: Array,
        required: true
    },
    fullData: {
        type: Object, // Store the entire response for rendering
        required: false
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
export default Report;
