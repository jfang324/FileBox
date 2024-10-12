'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, Share2 } from 'lucide-react'

interface FileEntryProps {
    id: string
    name: string
    extension: string
    size: number
    owner: string
    isSelected: boolean
    triggerShare: (fileId: string, fileName: string) => void
    handleSelect: (id: string) => void
    handleDownload: (fileId: string) => void
}

const FileEntry = ({
    id,
    name,
    extension,
    size,
    owner,
    isSelected,
    triggerShare,
    handleSelect,
    handleDownload,
}: FileEntryProps) => {
    return (
        <li className="p-3 hover:bg-gray-100 transition duration-150 ease-in-out">
            <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                    <Checkbox
                        className="my-auto rounded"
                        id={`file-${id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleSelect(id)}
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {name}
                            {extension ? `.${extension}` : ''}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {(size / (1024 * 1024)).toFixed(2)} MB • Owned by {owner}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                    <Button
                        variant="outline"
                        className="flex items-center space-x-1 rounded"
                        onClick={() => handleDownload(id)}
                    >
                        <Download size={16} />
                        <span>Download</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center space-x-1 rounded"
                        onClick={() => triggerShare(id, `${name}.${extension}`)}
                    >
                        <Share2 size={16} />
                        <span>Share</span>
                    </Button>
                </div>
            </div>
        </li>
    )
}

export default FileEntry
