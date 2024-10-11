import mongoose, { Schema } from 'mongoose'
import { UserDocument } from '@/interfaces/UserDocument'

const userSchema: Schema<UserDocument> = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: false,
        },
    },
    { collection: 'users' }
)

export default mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)
