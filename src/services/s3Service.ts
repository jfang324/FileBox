import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import getS3Client from '@/config/s3'

const bucketName = process.env.BUCKET_NAME || ''

/**
 * Upload a file to S3
 *
 * @param fileId - The mongoId of the file
 * @param file - The file to upload
 * @returns The result from the upload operation
 */
export const uploadS3File = async (fileId: string, file: File) => {
    if (!fileId || !file) {
        return
    }

    const s3 = getS3Client()

    try {
        const params = {
            Bucket: bucketName,
            Key: fileId,
            Body: Buffer.from(await file.arrayBuffer()),
            ContentType: file.type,
        }

        return await s3.send(new PutObjectCommand(params))
    } catch (error) {
        console.error('Error uploading file to S3:', error)
        throw new Error('Failed to upload file to S3')
    }
}

/**
 * Delete a file from S3
 *
 * @param fileId - The mongoId of the file
 * @returns The result from the delete operation
 */
export const deleteS3File = async (fileId: string) => {
    if (!fileId) {
        throw new Error('Missing fileId')
    }

    const s3 = getS3Client()

    try {
        const params = {
            Bucket: bucketName,
            Key: fileId,
        }

        return await s3.send(new DeleteObjectCommand(params))
    } catch (error) {
        console.error('Error deleting file from S3:', error)
        throw new Error('Failed to delete file from S3')
    }
}

/**
 * Get a presigned URL for a file in S3
 *
 * @param fileId - The mongoId of the file
 * @returns The presigned URL
 */
export const getS3PresignedUrl = async (fileId: string) => {
    if (!fileId) {
        throw new Error('Missing fileId')
    }

    const s3 = getS3Client()

    try {
        const params = {
            Bucket: bucketName,
            Key: fileId,
        }

        return await getSignedUrl(s3, new GetObjectCommand(params), { expiresIn: 3600 })
    } catch (error) {
        console.error('Error getting S3 presigned URL:', error)
        throw new Error('Failed to get S3 presigned URL')
    }
}
