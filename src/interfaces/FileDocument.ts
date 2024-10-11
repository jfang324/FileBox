import mongoose from 'mongoose'

/**
 * Interface for a file document in the database
 *
 * @param name - The name of the file
 * @param extension - The file extension
 * @param size - The size of the file in bytes
 * @param ownerId - The _id of the user who owns the file
 */
export interface FileDocument extends mongoose.Document {
    name: string
    extension: string
    size: number
    ownerId: string | mongoose.Types.ObjectId
}
