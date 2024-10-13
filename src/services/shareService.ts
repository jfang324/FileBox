import { FileDocument } from '@/interfaces/FileDocument'
import { ShareDocument } from '@/interfaces/ShareDocument'
import connectToDb from '@/lib/db'
import Share from '@/models/Share'

/**
 * Create a new share between the file and the recipient if it doesn't exist and return the share document
 *
 * @param fileId - The mongoId of the file
 * @param recipientId - The mongoId of the recipient
 * @returns The share document
 */
export async function createShare(fileId: string, recipientId: string): Promise<ShareDocument> {
    if (!fileId || !recipientId) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()
    const existingShare = await Share.findOne({
        fileId: fileId,
        userId: recipientId,
    })

    if (existingShare) {
        return existingShare
    } else {
        try {
            const share = new Share({
                fileId: fileId,
                userId: recipientId,
            })
            await share.save()

            return share
        } catch (error) {
            console.error('Error creating share:', error)
            throw new Error('Error creating share')
        }
    }
}

/**
 * Delete a share between the file and the recipient and return the share document
 *
 * @param fileId - The mongoId of the file
 * @param recipientId - The mongoId of the recipient
 * @returns The share document
 */
export async function deleteShare(fileId: string, recipientId: string): Promise<ShareDocument> {
    if (!fileId || !recipientId) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()

    try {
        const share = await Share.findOneAndDelete({
            fileId: fileId,
            userId: recipientId,
        })

        return share
    } catch (error) {
        console.error('Error deleting share:', error)
        throw new Error('Error deleting share')
    }
}

/**
 * Get all files shared with the user
 *
 * @param userId - The mongoId of the user
 * @returns An array of file documents + owner
 */
export async function getSharedFiles(userId: string): Promise<(FileDocument & { owner: string })[]> {
    if (!userId) {
        throw new Error('Missing userId')
    }

    await connectToDb()

    try {
        const shares = await Share.find({ userId: userId }).populate({
            path: 'fileId',
            select: 'name extension size ownerId',
            populate: {
                path: 'ownerId',
                select: 'name email',
            },
        })

        const sharedFiles = shares.map((share) => {
            const file = share.fileId

            return {
                ...file._doc,
                owner: (file.ownerId.name !== undefined ? file.ownerId.name : file.ownerId.email) as string,
                ownerId: file.ownerId._id,
            }
        })

        return sharedFiles
    } catch (error) {
        console.error('Error getting shared files:', error)
        throw new Error('Failed to get shared files')
    }
}

/**
 * Check if the user the file shared with them
 *
 * @param userId - The mongoId of the user
 * @param fileId - The mongoId of the file
 * @returns True if the user has the file shared with them, false otherwise
 */
export async function isShared(userId: string, fileId: string): Promise<boolean> {
    if (!userId || !fileId) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()

    try {
        const share = await Share.findOne({ fileId: fileId, userId: userId })

        return !!share
    } catch (error) {
        console.error('Error checking if file is shared:', error)
        throw new Error('Error checking if file is shared')
    }
}
