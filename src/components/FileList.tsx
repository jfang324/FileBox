'use client'
import FileEntry from '@/components/FileEntry'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileDocument } from '@/interfaces/FileDocument'
import { Menu, Search, Trash2 } from 'lucide-react'

/**
 *  File list component props
 *
 * @param searchTerm - current search term
 * @param handleSearch - function to handle search
 * @param fileTypeFilter - current file type filter
 * @param handleFileTypeFilter - function to handle file type filter
 * @param fileTypes - file types
 * @param files - current files
 * @param selectedFiles - selected files
 * @param triggerShare - function to trigger file sharing dialog
 * @param triggerMenu - function to trigger menu
 * @param handleSelectFile - function to handle file selection
 * @param handleDeleteSelected - function to handle delete selected files
 * @param handleDownload - function to handle file download
 */
interface FileListProps {
    searchTerm: string
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
    fileTypeFilter: string
    handleFileTypeFilter: (type: string) => void
    fileTypes: string[]
    files: Array<FileDocument & { owner: string }>
    selectedFiles: string[]
    triggerShare: (fileId: string, fileName: string) => void
    triggerMenu: () => void
    handleSelectFile: (id: string) => void
    handleDeleteSelected: () => void
    handleDownload: (id: string) => void
}

const FileList = ({
    searchTerm,
    handleSearch,
    fileTypeFilter,
    handleFileTypeFilter,
    fileTypes,
    files,
    selectedFiles,
    triggerShare,
    triggerMenu,
    handleSelectFile,
    handleDeleteSelected,
    handleDownload,
}: FileListProps) => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-5 bg-blue-600">
                <div className="flex space-x-4 mb-4">
                    <div className="relative flex-grow">
                        <Input
                            type="text"
                            placeholder="Search files"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 bg-white text-gray-800 placeholder-gray-500 rounded"
                        />
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            size={20}
                        />
                    </div>
                    <Select value={fileTypeFilter} onValueChange={handleFileTypeFilter}>
                        <SelectTrigger className="w-[180px] bg-white rounded">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-black rounded">
                            {fileTypes.map((type) => (
                                <SelectItem className="cursor-pointer hover:opacity-50" key={type} value={type}>
                                    {type === 'all' ? 'All Types' : type.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-between items-center">
                    <div
                        className="border border-black cursor-pointer bg-blue-800 hover:bg-blue-900 text-white p-1 rounded"
                        onClick={triggerMenu}
                    >
                        <Menu size={20} />
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelected}
                        className="border border-black bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete Selected
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-white">
                <ul className="divide-y divide-gray-200">
                    {files.map((file: FileDocument & { owner: string }) => (
                        <FileEntry
                            key={file._id as string}
                            id={file._id as string}
                            name={file.name}
                            extension={file.extension}
                            size={file.size}
                            owner={file.owner}
                            isSelected={selectedFiles.includes(file._id as string)}
                            triggerShare={triggerShare}
                            handleSelect={handleSelectFile}
                            handleDownload={handleDownload}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default FileList
