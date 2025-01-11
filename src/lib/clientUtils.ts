import { FileDocument } from '@/interfaces/FileDocument'
import { UserDocument } from '@/interfaces/UserDocument'
import { clsx, type ClassValue } from 'clsx'
import { report } from 'process'
import { twMerge } from 'tailwind-merge'

const VT_UPLOAD_URL = process.env.NEXT_PUBLIC_VIRUS_TOTAL_UPLOAD_URL || ''
const VT_REPORT_URL = process.env.NEXT_PUBLIC_VIRUS_TOTAL_REPORT_URL || ''
const VT_API_KEY = process.env.NEXT_PUBLIC_VIRUS_TOTAL_API_KEY || ''

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Retrieves the user details and returns the user document if successful
 *
 * @returns The user document
 */
export async function retrieveUserDetails(): Promise<UserDocument> {
    const response = await fetch('/api/users', {
        method: 'POST',
    })

    if (response.status === 200) {
        const userDetails: UserDocument = await response.json()

        return userDetails
    } else {
        const errorBody = await response.json()
        throw new Error(`Error fetching user details \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}

/**
 * Initializes the user details
 *
 * @param setUserMongoId - A function to set state for the mongoId
 * @param setName - A function to set state for the name
 * @param setEmail - A function to set state for the email
 * @param userDetails - The user document
 */
export function initializeUserDetails(
    setUserMongoId: (mongoId: string) => void,
    setName: (name: string) => void,
    setEmail: (email: string) => void,
    userDetails: UserDocument
) {
    if (!userDetails) {
        throw new Error('Missing user details')
    }

    try {
        setUserMongoId(userDetails._id as string)
        setName(userDetails.name || userDetails.email)
        setEmail(userDetails.email)
    } catch (error) {
        throw new Error(`Error initializing user details \n${error}`)
    }
}

/**
 * Fetches the user files and returns the file documents
 *
 * @param userId - The mongoId of the user
 * @param activeSection - The active section of the user's dashboard
 * @returns An array of file documents + owner
 */
export async function retrieveFiles(
    userId: string,
    activeSection: string
): Promise<(FileDocument & { owner: string })[]> {
    if (!userId || !activeSection) {
        throw new Error('Missing required parameters')
    }

    const response = await fetch(`/api/users/${userId}/${activeSection === 'my-files' ? 'files' : 'shared'}`, {
        method: 'GET',
    })

    if (response.status === 200) {
        const userFiles = await response.json()

        return userFiles
    } else {
        const errorBody = await response.json()
        throw new Error(`Error fetching user files \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}

/**
 * Uploads a file to the server
 *
 * @param file - The file to upload
 * @returns The file document
 */
export async function uploadFile(file: File): Promise<FileDocument> {
    if (!file) {
        throw new Error('Missing file')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
    })

    if (response.status === 200) {
        const savedFile = await response.json()

        return savedFile
    } else {
        const errorBody = await response.json()
        throw new Error(`Error uploading file \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}

/**
 * Scans a file with VirusTotal
 *
 * @param file - The file to scan
 * @returns
 */
export async function scanFile(file: File): Promise<{
    complete: boolean
    fileName: string
    data: { malicious: number; suspicious: number; undetected: number }
}> {
    if (!file) {
        throw new Error('Missing file')
    }

    const formData = new FormData()
    formData.append('file', await new Response(file.stream()).blob(), file.name)

    const scanReport = await fetch('/api/scan', { method: 'POST', body: formData })

    if (scanReport.status !== 200) {
        const errorBody = await scanReport.json()
        throw new Error(`Error uploading file \n${errorBody.error} \nStatus Code: ${scanReport.status}`)
    }

    const scanReportData = await scanReport.json()

    if (!scanReportData.complete) {
        throw new Error('Scan report not complete')
    }

    return scanReportData
}

/**
 * Deletes the file with the given id
 *
 * @param fileId - The mongoId of the file
 * @returns The result from the delete operation
 */
export async function deleteFile(fileId: string) {
    if (!fileId) {
        throw new Error('Missing fileId')
    }

    const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
    })

    if (response.status === 200) {
        const deletedFile = await response.json()

        return deletedFile
    } else {
        const errorBody = await response.json()
        throw new Error(`Error deleting file \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}

/**
 * Share a file with the given email
 *
 * @param fileId - The mongoId of the file
 * @param recipientEmail - The email of the recipient
 * @returns The share document
 */
export async function shareFile(fileId: string, recipientEmail: string) {
    if (!fileId || !recipientEmail) {
        throw new Error('Missing required parameters')
    }

    const response = await fetch('/api/shares', {
        method: 'POST',
        body: JSON.stringify({
            fileId: fileId,
            recipientEmail: recipientEmail,
        }),
    })

    if (response.status === 200) {
        const share = await response.json()

        return share
    } else {
        const errorBody = await response.json()
        throw new Error(`Error sharing file \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}

/**
 * Unshare a file with the given email
 *
 * @param fileId - The mongoId of the file
 * @param recipientEmail - The email of the recipient
 * @returns The share document
 */
export async function unShareFile(fileId: string, recipientEmail: string) {
    if (!fileId || !recipientEmail) {
        throw new Error('Missing required parameters')
    }

    const response = await fetch('/api/shares', {
        method: 'DELETE',
        body: JSON.stringify({
            fileId: fileId,
            recipientEmail: recipientEmail,
        }),
    })

    if (response.status === 200) {
        const share = await response.json()

        return share
    } else {
        const errorBody = await response.json()
        throw new Error(`Error sharing file \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}

/**
 * Change the name of the current users account
 *
 * @param name - The new name of the user
 * @returns The updated user document
 */
export async function changeUserSettings(name: string) {
    if (!name) {
        throw new Error('Missing name')
    }

    const response = await fetch('/api/users', {
        method: 'PATCH',
        body: JSON.stringify({
            name: name,
        }),
    })

    if (response.status === 200) {
        const updatedUser = await response.json()

        return updatedUser
    } else {
        const errorBody = await response.json()
        throw new Error(`Error changing user name \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}

/**
 * Retrieve a presigned URL for a file
 *
 * @param fileId - The mongoId of the file
 * @returns The presigned URL
 */
export async function retrievePresignedUrl(fileId: string) {
    if (!fileId) {
        throw new Error('Missing fileId')
    }

    const response = await fetch(`/api/files/${fileId}`, {
        method: 'GET',
    })

    if (response.status === 200) {
        const presignedUrl = await response.json()

        return presignedUrl
    } else {
        const errorBody = await response.json()
        throw new Error(`Error retrieving presigned URL \n${errorBody.error} \nStatus Code: ${response.status}`)
    }
}
