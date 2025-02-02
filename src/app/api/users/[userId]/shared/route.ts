import { fileRetrievalValidation } from '@/lib/apiUtils'
import { getSharedFiles } from '@/services/shareService'
import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/users/:userId/shared
 *
 * Get all files shared with the user
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
    try {
        const session = await getSession()
        const { userId } = await params
        fileRetrievalValidation(session, userId)

        const files = await getSharedFiles(userId)

        return NextResponse.json(files, { status: 200 })
    } catch (error: any) {
        console.error('Error getting user files:', error.message || error)
        return NextResponse.json(
            { error: error.message || 'Error getting user files' },
            { status: error.status || 500 }
        )
    }
}
