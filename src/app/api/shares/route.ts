import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { getFileById } from '@/services/fileService'
import { getUserByAuthId, getUserByEmail } from '@/services/userService'
import { createShare, deleteShare } from '@/services/shareService'

/**
 * POST /api/shares
 *
 * Create a new share between the file and the recipient
 */
const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const requestBody = await req.json()
        if (!requestBody.fileId || !requestBody.recipientEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const user = await getUserByAuthId(session.user.sub)
        const file = await getFileById(requestBody.fileId)
        if (!user || !user._id || !file || !file._id) {
            return NextResponse.json({ error: `${!user ? 'User' : 'File'} not found` }, { status: 404 })
        }

        const recipient = await getUserByEmail(requestBody.recipientEmail)
        if (!recipient || !recipient._id) {
            return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
        }

        const userMongoId = user._id.toString()
        const fileOwnerMongoId = file.ownerId.toString()

        if (fileOwnerMongoId !== userMongoId) {
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match file ownerId' },
                { status: 403 }
            )
        }

        const share = await createShare(file._id.toString(), recipient._id.toString())

        return NextResponse.json(share, { status: 200 })
    } catch (error: any) {
        console.error('Error creating share:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error creating share' }, { status: 500 })
    }
}

/**
 * DELETE /api/shares
 *
 * Delete a share between the file and the recipient
 */
const DELETE = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const requestBody = await req.json()
        if (!requestBody.fileId || !requestBody.recipientEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const user = await getUserByAuthId(session.user.sub)
        const file = await getFileById(requestBody.fileId)
        if (!user || !user._id || !file || !file._id) {
            return NextResponse.json({ error: `${!user ? 'User' : 'File'} not found` }, { status: 404 })
        }

        const recipient = await getUserByEmail(requestBody.recipientEmail)
        if (!recipient || !recipient._id) {
            return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
        }

        const userMongoId = user._id.toString()
        const fileOwnerMongoId = file.ownerId.toString()

        if (fileOwnerMongoId !== userMongoId) {
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match file ownerId' },
                { status: 403 }
            )
        }

        const share = await deleteShare(file._id.toString(), recipient._id.toString())

        return NextResponse.json(share, { status: 200 })
    } catch (error: any) {
        console.error('Error deleting share:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error deleting share' }, { status: 500 })
    }
}

export { POST, DELETE }
