import { getUserFileRecipient } from '@/lib/apiUtils'
import { createShare, deleteShare } from '@/services/shareService'
import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/shares
 *
 * Create a new share between the file and the recipient
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getSession()
        const requestBody = await req.json()
        const { user, file, recipient } = await getUserFileRecipient(session, requestBody)

        const userMongoId = user._id!.toString()
        const fileOwnerMongoId = file.ownerId.toString()

        if (fileOwnerMongoId !== userMongoId) {
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match file ownerId' },
                { status: 403 }
            )
        }

        const share = await createShare(file._id!.toString(), recipient._id!.toString())

        return NextResponse.json(share, { status: 200 })
    } catch (error: any) {
        console.error('Error creating share:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error creating share' }, { status: error.status || 500 })
    }
}

/**
 * DELETE /api/shares
 *
 * Delete a share between the file and the recipient
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getSession()
        const requestBody = await req.json()
        const { user, file, recipient } = await getUserFileRecipient(session, requestBody)

        const userMongoId = user._id!.toString()
        const fileOwnerMongoId = file.ownerId.toString()

        if (fileOwnerMongoId !== userMongoId) {
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match file ownerId' },
                { status: 403 }
            )
        }

        const share = await deleteShare(file._id!.toString(), recipient._id!.toString())

        return NextResponse.json(share, { status: 200 })
    } catch (error: any) {
        console.error('Error deleting share:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error deleting share' }, { status: error.status || 500 })
    }
}
