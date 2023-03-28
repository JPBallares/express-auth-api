import { Document, model, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
    token: string
    user: Schema.Types.ObjectId
    revoked: boolean
    createdTime: Date
    updatedTime: Date
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    createdTime: {
        type: Date,
        default: () => new Date()
    },
    updatedTime: {
        type: Date,
        default: () => new Date()
    },
});

refreshTokenSchema.pre<IRefreshToken>('save', function(next) {
    this.updatedTime = new Date();
    next();
});

export default model<IRefreshToken>('RefreshToken', refreshTokenSchema);
