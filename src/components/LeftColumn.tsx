'use client'

import { Button } from '@/components/ui/button'
import { FolderOpen, Share2, Trash, Upload, LogOut, File } from 'lucide-react'

interface LeftColumnProps {
    activeSection: string
    triggerUpload: () => void
    triggerSettings: () => void
    handleSectionChange: (section: 'my-files' | 'shared') => void
    handleLogout: () => void
}

const LeftColumn = ({
    activeSection,
    triggerUpload,
    triggerSettings,
    handleSectionChange,
    handleLogout,
}: LeftColumnProps) => {
    return (
        <div className="w-full h-full bg-white shadow-md flex flex-col border">
            <div className="p-4 flex-grow overflow-y-auto">
                <div className="flex justify-start items-center p-1 py-2">
                    <File />
                    <h2 className="text-xl font-semibold text-gray-800 my-auto"> &nbsp;FileBox</h2>
                </div>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => handleSectionChange('my-files')}
                                className={`flex items-center space-x-2 w-full p-2 rounded ${
                                    activeSection === 'my-files'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <FolderOpen size={20} />
                                <span>My Files</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleSectionChange('shared')}
                                className={`flex items-center space-x-2 w-full p-2 rounded ${
                                    activeSection === 'shared'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Share2 size={20} />
                                <span>Shared with Me</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={triggerUpload}
                                className="flex items-center space-x-2 w-full p-2 rounded text-gray-600 hover:bg-gray-100"
                            >
                                <Upload size={20} />
                                <span>Upload File</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={triggerSettings}
                                className="flex items-center space-x-2 w-full p-2 rounded text-gray-600 hover:bg-gray-100"
                            >
                                <Trash size={20} />
                                <span>Settings</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="p-4 border-gray-200">
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 rounded"
                >
                    <LogOut size={20} />
                    <span>Log Out</span>
                </Button>
            </div>
        </div>
    )
}

export default LeftColumn
