import { S3Client } from '@aws-sdk/client-s3'

const bucketRegion = process.env.BUCKET_REGION || ''
const accessKey = process.env.ACCESS_KEY || ''
const secretAccessKey = process.env.SECRET_ACCESS_KEY || ''

if (!bucketRegion || !accessKey || !secretAccessKey) {
    throw new Error('AWS credentials or bucket region is not set')
}

let cached = global.s3

if (!cached) {
    cached = global.s3 = { client: null }
}

/**
 * Create a S3 client if it doesn't exist
 */
const getS3Client = (): S3Client => {
    if (cached.client) {
        return cached.client
    }

    cached.client = new S3Client({
        region: bucketRegion,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretAccessKey,
        },
    })

    return cached.client
}

export default getS3Client
