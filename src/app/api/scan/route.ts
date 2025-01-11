import { getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

const VT_UPLOAD_URL = process.env.VIRUS_TOTAL_UPLOAD_URL || ''
const VT_REPORT_URL = process.env.VIRUS_TOTAL_REPORT_URL || ''
const VT_API_KEY = process.env.VIRUS_TOTAL_API_KEY || ''

/**
 * POST /api/scan
 *
 * Proxy request to VirusTotal upload URL
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file')

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'File missing' }, { status: 400 })
        }

        const uploadResponse = await fetch(VT_UPLOAD_URL, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'x-apikey': VT_API_KEY,
            },
            body: formData,
        })

        if (uploadResponse.status !== 200) {
            const errorBody = await uploadResponse.json()
            throw new Error(`Error uploading file \n${errorBody.error} \nStatus Code: ${uploadResponse.status}`)
        }

        const uploadResponseData = await uploadResponse.json()
        const file_id = uploadResponseData.data.id
        const maxRetries = 10
        const retryDelay = 4000

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const reportResponse = await fetch(`${VT_REPORT_URL}/${file_id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'x-apikey': VT_API_KEY,
                },
            })

            if (reportResponse.status === 200) {
                const reportResponseData = await reportResponse.json()

                if (reportResponseData.data.attributes.status === 'completed') {
                    const reportStats = reportResponseData.data.attributes.stats

                    return NextResponse.json({
                        complete: true,
                        fileName: file.name,
                        data: {
                            malicious: reportStats.malicious,
                            suspicious: reportStats.suspicious,
                            undetected: reportStats.undetected,
                        },
                    })
                } else {
                    console.log(
                        `report not ready yet, attempt ${attempt + 1} of ${maxRetries}, waiting ${
                            (retryDelay * (attempt + 1)) / 1000
                        }s`
                    )
                    await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
                }
            } else {
                const errorBody = await reportResponse.json()
                throw new Error(`Error uploading file \n${errorBody.error} \nStatus Code: ${reportResponse.status}`)
            }
        }

        return NextResponse.json({
            complete: false,
            fileName: file.name,
            data: {
                malicious: 0,
                suspicious: 0,
                undetected: 0,
            },
        })
    } catch (error: any) {
        console.error('Error proxying request to VirusTotal:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error proxying request to VirusTotal' }, { status: 500 })
    }
}
