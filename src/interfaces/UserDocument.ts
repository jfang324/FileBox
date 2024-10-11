import mongoose from 'mongoose'

/**
 * Interface for a user document in the database
 *
 * @param id - The id of the user, will be user.sub from auth0
 * @param email - The email address of the user
 * @param name - The name of the user
 */
export interface UserDocument extends mongoose.Document {
    id: string
    email: string
    name?: string
}
