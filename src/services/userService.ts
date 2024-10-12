import { UserDocument } from '@/interfaces/UserDocument'
import connectToDb from '@/lib/db'
import User from '@/models/User'

/**
 * Create a new user if they don't exist and return the user document
 *
 * @param authId - The authId of the user. This is user.sub from auth0
 * @param email - The email of the user
 * @returns The user document
 */
export async function createIfNewUser(authId: string, email: string): Promise<UserDocument> {
    if (!email || !authId) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()
    const existingUser = await User.findOne({
        id: authId,
    })

    if (existingUser) {
        return existingUser
    } else {
        try {
            const newUser = new User({
                email: email,
                id: authId,
            })
            await newUser.save()

            return newUser
        } catch (error) {
            console.error('Error creating new user:', error)
            throw new Error('Error creating new user')
        }
    }
}

/**
 * Change the name of the user with the given authId
 *
 * @param authId - The authId of the user. This is user.sub from auth0
 * @param name - The new name of the user
 * @returns The updated user document
 */
export async function changeUserName(authId: string, name: string): Promise<UserDocument> {
    if (!authId || !name) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()

    try {
        const user = await User.findOneAndUpdate(
            {
                id: authId,
            },
            {
                name: name,
            },
            {
                new: true,
            }
        )

        return user
    } catch (error) {
        console.error('Error changing user name:', error)
        throw new Error('Error changing user name')
    }
}

/**
 * Get a user by their authId
 *
 * @param authId - The authId of the user
 * @returns The user document
 */
export async function getUserByAuthId(authId: string): Promise<UserDocument> {
    if (!authId) {
        throw new Error('Missing authId')
    }

    await connectToDb()

    try {
        const user = await User.findOne({
            id: authId,
        })

        return user
    } catch (error) {
        console.error('Error getting user:', error)
        throw new Error('Error getting user')
    }
}

/**
 * Get a user by their email
 *
 * @param email - The email of the user
 * @returns The user document
 */
export async function getUserByEmail(email: string): Promise<UserDocument> {
    if (!email) {
        throw new Error('Missing email')
    }

    await connectToDb()

    try {
        const user = await User.findOne({
            email: email,
        })

        return user
    } catch (error) {
        console.error('Error getting user:', error)
        throw new Error('Error getting user')
    }
}
