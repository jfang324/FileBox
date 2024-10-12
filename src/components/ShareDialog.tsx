'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { shareFile, unShareFile } from '@/lib/utils'
import { Mail, Share2 } from 'lucide-react'

interface ShareDialogProps {
    fileId: string
    fileName: string
    userEmail: string
    triggerRef: React.RefObject<HTMLButtonElement>
}

const ShareDialog = ({ fileId, fileName, userEmail, triggerRef }: ShareDialogProps) => {
    // Shares the file with the recipient
    const handleShare = async (fileId: string, recipientEmail: string, action: 'share' | 'unshare') => {
        if (fileId && recipientEmail) {
            if (recipientEmail === userEmail) {
                alert('You cannot share a file with yourself')
            } else if (action === 'share') {
                try {
                    await shareFile(fileId, recipientEmail)
                    alert(`${fileName} shared with ${recipientEmail}`)
                } catch (error) {
                    alert(error)
                }
            } else {
                try {
                    await unShareFile(fileId, recipientEmail)
                    alert(`${fileName} unshared with ${recipientEmail}`)
                } catch (error) {
                    alert(error)
                }
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button ref={triggerRef} className="hidden">
                    Share File
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share: {fileName}</DialogTitle>
                </DialogHeader>
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const email = formData.get('email') as string
                        const action = formData.get('action') as 'share' | 'unshare'
                        handleShare(fileId, email, action)
                    }}
                >
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Recipient Email
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Enter recipient's email"
                                className="bg-white text-gray-800 rounded"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="action" className="text-sm font-medium">
                            Action
                        </Label>
                        <Select name="action" defaultValue="share">
                            <SelectTrigger className="w-full rounded">
                                <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-black rounded">
                                <SelectItem value="share" className="hover:opacity-75">
                                    Share
                                </SelectItem>
                                <SelectItem value="unshare" className="hover:opacity-75">
                                    Unshare
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded">
                        <Share2 className="h-4 w-4 mr-2" />
                        Confirm
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ShareDialog
