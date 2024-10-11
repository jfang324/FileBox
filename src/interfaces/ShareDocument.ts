import mongoose from 'mongoose'

/**
 * Interface for a share document in the database
 *
 * @param fileId - The _id of the file being shared
 * @param userId - The _id of the user being shared with
 */
export interface ShareDocument extends mongoose.Document {
    fileId: string | mongoose.Types.ObjectId
    userId: string | mongoose.Types.ObjectId
}
