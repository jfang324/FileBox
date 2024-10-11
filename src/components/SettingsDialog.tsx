'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { User, Mail, Key } from 'lucide-react'

interface SettingsDialogProps {
    userMongoId: string
    userName: string
    userEmail: string
    settingsTriggerRef: React.RefObject<HTMLButtonElement>
    settingsInputRef: React.RefObject<HTMLInputElement>
    handleChangeSettings: (newName: string) => void
}

const SettingsDialog = ({
    userMongoId,
    userName,
    userEmail,
    settingsTriggerRef,
    settingsInputRef,
    handleChangeSettings,
}: SettingsDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button ref={settingsTriggerRef} className="hidden">
                    Edit Account Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Account Settings</DialogTitle>
                </DialogHeader>
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        const newName = formData.get('name') as string
                        handleChangeSettings(newName)
                    }}
                >
                    <div className="space-y-2">
                        <Label htmlFor="userId" className="text-sm font-medium">
                            User ID
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Key className="h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                disabled={true}
                                value={userMongoId}
                                className="bg-gray-100 text-gray-600 rounded"
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
                                ref={settingsInputRef}
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
