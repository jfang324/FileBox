'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { uploadFile } from '@/lib/clientUtils'
import { File } from 'lucide-react'
import React, { useRef, useState } from 'react'

/**
 * Upload dialog component props
 *
 * @param triggerRef - Ref to trigger dialog
 * @param onSuccess - Function to call when upload is successful. Should update file list
 */
interface UploadDialogProps {
    triggerRef: React.RefObject<HTMLButtonElement>
    onSuccess: () => void
}

const UploadDialog = ({ triggerRef, onSuccess }: UploadDialogProps) => {
    const [file, setFile] = useState<File | undefined>()
    const inputRef = useRef<HTMLInputElement>(null)

    // Changes the file if it is valid
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile && selectedFile.size > 0 && selectedFile.size < 1024 * 1024 * 10) {
            setFile(selectedFile)
        } else {
            alert('File size must be less than 10 MB')
        }
    }

    // Uploads the file
    const handleUpload = async () => {
        if (file) {
            try {
                const uploadResult = await uploadFile(file)
                if (uploadResult) {
                    alert(`${uploadResult.name}.${uploadResult.extension} uploaded`)
                    onSuccess()
                }
            } catch (error) {
                alert(error)
            }
        } else {
            alert('File not selected')
        }
    }

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
