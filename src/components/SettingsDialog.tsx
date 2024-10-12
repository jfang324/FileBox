import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { changeUserSettings } from '@/lib/clientUtils'
import { IdCard, Mail, User } from 'lucide-react'

interface SettingsDialogProps {
    authId: string
    userEmail: string
    userName: string
    triggerRef: React.RefObject<HTMLButtonElement>
    onSuccess: () => void
}

const SettingsDialog = ({ authId, userName, userEmail, triggerRef, onSuccess }: SettingsDialogProps) => {
    // Change the accounts settings
    const handleChangeSettings = async (name: string) => {
        if (name) {
            try {
                const userDetails = await changeUserSettings(name)
                if (userDetails) {
                    onSuccess()
                }
            } catch (error) {
                alert(error)
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button ref={triggerRef} className="hidden">
                    Edit Account Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Account Settings</DialogTitle>
                </DialogHeader>
                <form
                    className="space-y-4"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const name = formData.get('name') as string
                        await handleChangeSettings(name)
                    }}
                >
                    <div className="space-y-2">
                        <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
                            User ID
                        </Label>
                        <div className="flex items-center space-x-2">
                            <IdCard className="h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                disabled={true}
                                value={authId}
                                className="bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Account Name
                        </Label>
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder={userName}
                                className="bg-white text-gray-800 rounded"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <Input
                                id="email"
                                type="email"
                                disabled={true}
                                value={userEmail}
                                className="bg-gray-100 text-gray-600 rounded"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded">
                        Save Changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default SettingsDialog
