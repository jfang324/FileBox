import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from './ui/button'
import { Input } from '@/components/ui/input'
import { File } from 'lucide-react'

interface UploadDialogProps {
    userMongoId: string
    file: File | undefined
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleUpload: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>
    inputRef: React.RefObject<HTMLInputElement>
    triggerRef: React.RefObject<HTMLButtonElement>
}

const UploadDialog = ({
    userMongoId,
    file,
    handleFileChange,
    handleUpload,
    inputRef,
    triggerRef,
}: UploadDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button ref={triggerRef} className="hidden">
                    Upload
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px] border-none">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="userId" className="text-sm font-medium">
                            User ID
                        </Label>
                        <Input
                            id="userId"
                            type="text"
                            disabled={true}
                            value={userMongoId}
                            className="bg-gray-100 text-gray-600 rounded"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file" className="text-sm font-medium">
                            File
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded"
                                onClick={() => inputRef.current?.click()}
                            >
                                <File className="h-4 w-4 mr-2" />
                                Choose File
                            </Button>
                            <span className="text-sm text-gray-500">{file ? file.name : 'No file chosen'}</span>
                        </div>
                        <Input id="file" type="file" ref={inputRef} className="hidden" onChange={handleFileChange} />
                    </div>
                    <Button
                        type="button"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded"
                        onClick={handleUpload}
                    >
                        Upload
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UploadDialog
