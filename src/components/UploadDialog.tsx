'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { scanFile, uploadFile } from '@/lib/clientUtils'
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
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [isScanning, setIsScanning] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    // Changes the file if it is valid
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile && selectedFile.size > 0 && selectedFile.size < 1024 * 1024 * 10) {
            setFile(selectedFile)
        } else {
            toast({ title: 'Error', description: 'File size must be less than 10 MB' })
        }
    }

    // Uploads the file
    const handleUpload = async () => {
        if (file) {
            try {
                setIsUploading(true)
                const uploadResult = await uploadFile(file)
                setIsUploading(false)

                if (uploadResult) {
                    toast({ title: 'Success', description: `${uploadResult.name}.${uploadResult.extension} uploaded` })
                    onSuccess()
                }
            } catch (error) {
                toast({ title: 'Error', description: `${error}` })
            }
        } else {
            toast({ title: 'Error', description: 'File not selected' })
        }
    }

    // Scans the file
    const handleScan = async () => {
        if (file) {
            try {
                setIsScanning(true)
                const scanResult = await scanFile(file)
                setIsScanning(false)

                if (scanResult.complete) {
                    toast({
                        title: 'Success',
                        description: `VirusTotal scan complete for [${scanResult.fileName}] \nMalicious: ${scanResult.data.malicious} \nSuspicious: ${scanResult.data.suspicious} \nUndetected: ${scanResult.data.undetected}`,
                    })
                } else {
                    toast({
                        title: 'Error',
                        description: `VirusTotal scan for [${scanResult.fileName}] not complete yet, please try again later`,
                    })
                }
            } catch (error) {
                toast({ title: 'Error', description: `${error}` })
            }
        } else {
            toast({ title: 'Error', description: 'File not selected' })
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
                    <div className="flex flex-col gap-2">
                        <Button
                            type="button"
                            className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded"
                            onClick={handleUpload}
                            disabled={isUploading}
                        >
                            {!isUploading ? 'Upload' : 'Uploading...'}
                        </Button>
                        <Button
                            type="button"
                            className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded"
                            onClick={handleScan}
                            disabled={isScanning}
                        >
                            {!isScanning ? 'Scan for Viruses' : 'Scanning...'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UploadDialog
