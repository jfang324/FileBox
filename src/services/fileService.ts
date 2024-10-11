import connectToDb from '@/config/db'
import { FileDocument } from '@/interfaces/FileDocument'
import File from '@/models/File'

/**
 * Create a new file document
 *
 * @param name - The name of the file
 * @param extension - The file extension
 * @param size - The size of the file in bytes
 * @param ownerId - The mongoId of the user who owns the file
 * @returns The file document
 */
export const createFile = async (
    name: string,
    extension: string,
    size: number,
    ownerId: string
): Promise<FileDocument> => {
    if (!name || !extension || !size || size < 0 || !ownerId) {
        throw new Error('Invalid or missing required parameters')
    }

    await connectToDb()

    try {
        const file = new File({
            name: name.split('.')[0],
            extension: extension.split('/')[1],
            size: size,
            ownerId: ownerId,
        })
        await file.save()

        return file
    } catch (error) {
        console.error('Error saving file to database:', error)
        throw new Error('Failed to save file to database')
    }
}

/**
 * Deletes the file document with the given id
 *
 * @param fileId - The mongoId of the file
 * @returns The result from the delete operation
 */
export const deleteFile = async (fileId: string) => {
    if (!fileId) {
        throw new Error('Missing fileId')
    }

    await connectToDb()

    try {
        const response = await File.findOneAndDelete({ _id: fileId })

        return response
    } catch (error) {
        console.error('Error deleting file in database:', error)
        throw new Error('Failed to delete file from database')
    }
}

/**
 * Returns all files owned by the user
 *
 * @param userId - The mongoId of the user
 * @returns - An array of file documents
 */
export const getUserFiles = async (userId: string): Promise<(FileDocument & { owner: string })[]> => {
    if (!userId) {
        throw new Error('Missing userId')
    }

    await connectToDb()

    try {
        const files = await File.find({ ownerId: userId }).populate({
            path: 'ownerId',
            select: 'name email',
        })

        const populatedFiles = files.map((file) => {
            return {
                ...file._doc,
                owner: (file.ownerId.name !== undefined ? file.ownerId.name : file.ownerId.email) as string,
                ownerId: file.ownerId._id,
            }
        })

        return populatedFiles
    } catch (error) {
        console.error('Error getting user files:', error)
        throw new Error('Failed to get user files')
    }
}

/**
 * Get a file by its mongoId
 *
 * @param fileId - The mongoId of the file
 * @returns The file document
 */
export const getFileById = async (fileId: string): Promise<FileDocument> => {
    if (!fileId) {
        throw new Error('Missing fileId')
    }

    await connectToDb()

    try {
        const file = await File.findOne({ _id: fileId })

        return file
    } catch (error) {
        console.error('Error getting file:', error)
        throw new Error('Failed to get file')
    }
}
