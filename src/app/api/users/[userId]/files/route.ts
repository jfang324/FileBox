import { getUserFiles } from '@/services/fileService'
import { getUserByAuthId } from '@/services/userService'
import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

/*
 * GET /api/users/:userId/files
 *
 * Get all files owned by the user
 */
export async function GET(req: NextRequest, { params }: { params: { userId: string } }): Promise<NextResponse> {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const user = await getUserByAuthId(session.user.sub)
        if (!user || !user._id) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const userMongoId = user._id.toString()
        const filesOwnerMongoId = params.userId

        if (filesOwnerMongoId !== userMongoId) {
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match provided userId' },
                { status: 403 }
            )
        }

        const files = await getUserFiles(userMongoId)

        return NextResponse.json(files, { status: 200 })
    } catch (error: any) {
        console.error('Error getting user files:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error getting user files' }, { status: 500 })
    }
}
