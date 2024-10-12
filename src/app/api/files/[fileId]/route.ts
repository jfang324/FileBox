import { deleteFile, getFileById } from '@/services/fileService'
import { deleteS3File, getS3PresignedUrl } from '@/services/s3Service'
import { isShared } from '@/services/shareService'
import { getUserByAuthId } from '@/services/userService'
import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/files/:fileId
 *
 * Get a presigned URL for the file
 */
export async function GET(req: NextRequest, { params }: { params: { fileId: string } }): Promise<NextResponse> {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const user = await getUserByAuthId(session.user.sub)
        const file = await getFileById(params.fileId)
        if (!user || !user._id || !file || !file._id) {
            return NextResponse.json({ error: `${!user ? 'User' : 'File'} not found` }, { status: 404 })
        }

        const userMongoId = user._id.toString()
        const fileOwnerMongoId = file.ownerId.toString()
        const isSharedResult = await isShared(userMongoId, params.fileId)

        if (fileOwnerMongoId !== userMongoId && !isSharedResult) {
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match file ownerId and is not shared' },
                { status: 403 }
            )
        }

        const signedUrl = await getS3PresignedUrl(params.fileId)
        if (!signedUrl) {
            return NextResponse.json({ error: 'Failed to get S3 presigned URL' }, { status: 500 })
        }

        return NextResponse.json(signedUrl, { status: 200 })
    } catch (error: any) {
        console.error('Error getting file:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error getting file' }, { status: 500 })
    }
}

/**
 * DELETE /api/files/:fileId
 *
 * Delete a file from the database and S3 bucket
 */
export async function DELETE(req: NextRequest, { params }: { params: { fileId: string } }): Promise<NextResponse> {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const user = await getUserByAuthId(session.user.sub)
        const file = await getFileById(params.fileId)
        if (!user || !user._id || !file || !file._id) {
            return NextResponse.json({ error: `${!user ? 'User' : 'File'} not found` }, { status: 404 })
        }

        const userMongoId = user._id.toString()
        const fileOwnerMongoId = file.ownerId.toString()

        if (fileOwnerMongoId !== userMongoId) {
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match file ownerId' },
                { status: 403 }
            )
        }

        const deleteResult = await deleteFile(file._id.toString())
        if (!deleteResult) {
            return NextResponse.json({ error: 'Failed to delete file from database' }, { status: 500 })
        }

        const deleteS3Result = await deleteS3File(params.fileId)
        if (!deleteS3Result) {
            return NextResponse.json({ error: 'Failed to delete file from S3' }, { status: 500 })
        }

        return NextResponse.json(
            { message: `File ${params.fileId} deleted successfully. Deleted: ${deleteResult}` },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error deleting file:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error deleting file' }, { status: 500 })
    }
}
