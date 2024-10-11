import mongoose, { Schema } from 'mongoose'
import { FileDocument } from '@/interfaces/FileDocument'
import Share from '@/models/Share'

const fileSchema: Schema<FileDocument> = new Schema({
    name: {
        type: String,
        required: true,
    },
    extension: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

fileSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Share.deleteMany({ fileId: doc._id })
    }
})

export default mongoose.models.File || mongoose.model<FileDocument>('File', fileSchema)
