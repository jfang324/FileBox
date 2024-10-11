'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Trash2, ListCollapse } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { FileDocument } from '@/interfaces/FileDocument'
import FileEntry from '@/components/FileEntry'
import LeftColumn from '@/components/LeftColumn'

interface FileListProps {
    activeSection: string
    handleSectionChange: (section: 'my-files' | 'shared') => void
    searchTerm: string
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
    fileTypeFilter: string
    handleFileTypeFilter: (type: string) => void
    fileTypes: string[]
    files: Array<FileDocument & { owner: string }>
    selectedFiles: Set<string>
    triggerUpload: () => void
    triggerSettings: () => void
    triggerShare: (fileId: string, fileName: string) => void
    handleSelectFile: (id: string) => void
    handleDeleteSelected: () => void
    handleDownload: (id: string) => void
    handleLogout: () => void
}

const FileList = ({
    activeSection,
    handleSectionChange,
    searchTerm,
    handleSearch,
    fileTypeFilter,
    handleFileTypeFilter,
    fileTypes,
    files,
    selectedFiles,
    triggerUpload,
    triggerSettings,
    triggerShare,
    handleSelectFile,
    handleDeleteSelected,
    handleDownload,
    handleLogout,
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
                    <Sheet>
                        <SheetTrigger className="border border-black bg-blue-800 hover:bg-blue-900 text-white p-1 rounded">
                            <ListCollapse size={22} />
                        </SheetTrigger>
                        <SheetContent side={'left'} className="bg-white w-full lg:w-1/4 border border-black p-0">
                            <LeftColumn
                                activeSection={activeSection}
                                handleSectionChange={handleSectionChange}
                                triggerUpload={triggerUpload}
                                triggerSettings={triggerSettings}
                                handleLogout={handleLogout}
                            />
                        </SheetContent>
                    </Sheet>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelected}
                        disabled={selectedFiles.size === 0 || activeSection !== 'my-files'}
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
                            isSelected={selectedFiles.has(file._id as string)}
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
