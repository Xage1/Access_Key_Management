import mongoose from 'mongoose';

const accessKeySchema = new mongoose.Schema({
    access_key: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    expiry: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active' }
});

export const Key = mongoose.model('AccessKey', accessKeySchema);