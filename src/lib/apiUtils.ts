import { FileDocument } from '@/interfaces/FileDocument'
import { UserDocument } from '@/interfaces/UserDocument'
import { getFileById } from '@/services/fileService'
import { getUserByAuthId, getUserByEmail } from '@/services/userService'
import { Session } from '@auth0/nextjs-auth0'

/**
 * Fetches the user and file with the given id if authenticated, also validates they exist
 *
 * @param session - The session object
 * @param fileId - The mongoId of the file
 * @returns The user and file
 */
export async function getUserFile(
    session: Session | undefined | null,
    fileId: string
): Promise<{ user: UserDocument; file: FileDocument }> {
    if (!session) {
        throw { message: 'Not authenticated', status: 401 }
    }

    const user = await getUserByAuthId(session.user.sub)
    const file = await getFileById(fileId)
    if (!user || !user._id || !file || !file._id) {
        throw { message: `${!user ? 'User' : 'File'} not found`, status: 404 }
    }

    return { user, file }
}

/**
 * Fetches the user, file, and recipient with the given id if authenticated, also validates they exist
 *
 * @param session - The session object
 * @param requestBody - The request body containing the fileId and recipientEmail
 * @returns The user, file, and recipient
 */
export async function getUserFileRecipient(
    session: Session | undefined | null,
    requestBody: { fileId: string; recipientEmail: string }
): Promise<{ user: UserDocument; file: FileDocument; recipient: UserDocument }> {
    if (!session) {
        throw { message: 'Not authenticated', status: 401 }
    }

    if (!requestBody || !requestBody.fileId || !requestBody.recipientEmail) {
        throw { message: 'Missing required fields', status: 400 }
    }

    const { user, file } = await getUserFile(session, requestBody.fileId)

    const recipient = await getUserByEmail(requestBody.recipientEmail)
    if (!recipient || !recipient._id) {
        throw { message: 'Recipient not found', status: 404 }
    }

    return { user, file, recipient }
}

/**
 * Validates the userId and throws an error if it does not match the authenticated user
 *
 * @param session - The session object
 * @param userId - The mongoId of the user
 */
export async function fileRetrievalValidation(session: Session | undefined | null, userId: string) {
    if (!session) {
        throw { message: 'Not authenticated', status: 401 }
    }

    const user = await getUserByAuthId(session.user.sub)
    if (!user || !user._id) {
        throw { message: 'User not found', status: 404 }
    }

    if (!userId || userId !== user._id.toString()) {
        throw { message: 'Unauthorized: requesting userId does not match provided userId', status: 403 }
    }
}
