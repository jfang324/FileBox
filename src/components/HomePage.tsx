'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FileDocument } from '@/interfaces/FileDocument'
import {
    retrieveUserDetails,
    retrieveFiles,
    uploadFile,
    deleteFile,
    changeUserName,
    initializeUserDetails,
    shareFile,
    unShareFile,
    retrievePresignedUrl,
} from '@/lib/utils'
import FileList from '@/components/FileList'
import UploadDialog from './UploadDialog'
import SettingsDialog from '@/components/SettingsDialog'
import ShareDialog from './ShareDialog'

const HomePage = () => {
    //state associated with the account
    const { user, error, isLoading } = useUser()
    const [mongoId, setMongoId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    //state & refs associated with file uploads
    const fileUploadTriggerRef = useRef<HTMLButtonElement>(null)
    const fileUploadInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | undefined>()

    //refs associated with the account settings
    const settingsTriggerRef = useRef<HTMLButtonElement>(null)
    const settingsInputRef = useRef<HTMLInputElement>(null)

    //state & refs associated with file sharing
    const shareTriggerRef = useRef<HTMLButtonElement>(null)
    const [sharedFileId, setSharedFileId] = useState<string>('')
    const [sharedFileName, setSharedFileName] = useState<string>('')

    //state associated with the file list & visibility
    const [files, setFiles] = useState<(FileDocument & { owner: string })[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [fileTypeFilter, setFileTypeFilter] = useState<string>('all')
    const [visibleFiles, setVisibleFiles] = useState<(FileDocument & { owner: string })[]>([])

    //state associated with file selection
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
    const [activeSection, setActiveSection] = useState<'my-files' | 'shared'>('my-files')

    //calculates the available file types
    const fileTypes = useMemo(() => {
        const types = new Set(files.map((file) => file.extension).filter(Boolean))
        return ['all', ...Array.from(types)]
    }, [files])

    //initialize user details and files
    useEffect(() => {
        const init = async () => {
            if (isLoading || error) {
                return
            }

            if (user) {
                try {
                    const userDetails = await retrieveUserDetails()
                    initializeUserDetails(setMongoId, setName, setEmail, userDetails)
                    const userFiles = await retrieveFiles(userDetails._id as string, activeSection)
                    setFiles(userFiles)
                    setVisibleFiles(userFiles)
                    setSelectedFiles(new Set())
                } catch (error) {
                    alert(error)
                }
            } else {
                alert('Error on initial load')
            }
        }
        init()
    }, [user, error, isLoading, activeSection])

    //keeps visible files updated & filtered
    useEffect(() => {
        const filterFiles = (term: string, type: string) => {
            let filteredFiles = files

            if (term !== '') {
                try {
                    const regex = new RegExp(term, 'i')
                    filteredFiles = filteredFiles.filter(
                        (file) => regex.test(file.name) || regex.test(file.extension) || regex.test(file.owner)
                    )
                } catch (error) {
                    console.error('Invalid regex:', error)
                }
            }

            if (type !== 'all') {
                filteredFiles = filteredFiles.filter((file) => file.extension === type)
            }

            setVisibleFiles(filteredFiles)
        }

        filterFiles(searchTerm, fileTypeFilter)
    }, [searchTerm, fileTypeFilter, files])

    /**
     * Handles file upload and refreshing files
     */
    const handleUpload = async () => {
        if (mongoId && file) {
            try {
                const fileDetails = await uploadFile(file)
                if (fileDetails) {
                    const updatedFiles = await retrieveFiles(mongoId, activeSection)
                    if (updatedFiles) {
                        setFiles(updatedFiles)
                    }
                }
            } catch (error) {
                alert(error)
            }
        } else {
            alert('File not selected or account doesn not exist in database')
        }
    }

    /**
     * Handles file selection
     *
     * @param id - The mongoId of the file
     */
    const handleSelectFile = (id: string) => {
        const existingSet = new Set(selectedFiles)

        if (existingSet.has(id)) {
            existingSet.delete(id)
        } else {
            existingSet.add(id)
        }

        setSelectedFiles(existingSet)
    }

    /**
     * Handles file deletion and refreshing files
     */
    const handleDeleteSelected = async () => {
        if (mongoId && selectedFiles.size > 0) {
            try {
                await Promise.all(Array.from(selectedFiles).map((fileId) => deleteFile(fileId)))
                const updatedFiles = await retrieveFiles(mongoId, activeSection)
                if (updatedFiles) {
                    setFiles(updatedFiles)
                }
                setSelectedFiles(new Set())
            } catch (error) {
                alert(error)
            }
        } else {
            alert(`Error deleting files. ${selectedFiles.size} files selected. mongoId: ${mongoId}`)
        }
    }

    /**
     * Handles changing account settings. Currently only changes name
     */
    const handleChangeSettings = async (newName: string) => {
        if (newName) {
            try {
                const userDetails = await changeUserName(newName)
                if (userDetails) {
                    initializeUserDetails(setMongoId, setName, setEmail, userDetails)
                    const userFiles = await retrieveFiles(userDetails._id as string, activeSection)
                    if (userFiles) {
                        setFiles(userFiles)
                        setVisibleFiles(userFiles)
                    }
                }
            } catch (error) {
                alert(error)
            }
        }
    }

    /**
     * Handles changing the active section
     *
     * @param section - The new active section
     */
    const handleSectionChange = async (section: 'my-files' | 'shared') => {
        setActiveSection(section)
        const userFiles = await retrieveFiles(mongoId, section)
        if (userFiles) {
            setFiles(userFiles)
        }
    }

    /**
     * Handles sharing a file with a recipient
     *
     * @param fileId - The mongoId of the file
     * @param recipientEmail - The email of the recipient
     * @param action - The action to perform. Either 'share' or 'unshare'
     */
    const handleShare = async (fileId: string, recipientEmail: string, action: 'share' | 'unshare') => {
        if (fileId && recipientEmail) {
            if (recipientEmail === email) {
                alert('You cannot share a file with yourself')
            } else if (action === 'share') {
                try {
                    await shareFile(fileId, recipientEmail)
                    alert(`${sharedFileName} shared with ${recipientEmail}`)
                } catch (error) {
                    alert(error)
                }
            } else {
                try {
                    await unShareFile(fileId, recipientEmail)
                    alert(`${sharedFileName} unshared with ${recipientEmail}`)
                } catch (error) {
                    alert(error)
                }
            }
        }
    }

    /**
     * Triggers the share dialogue after setting state
     *
     * @param fileId - The mongoId of the file
     * @param fileName - The name of the file
     */
    const triggerShare = (fileId: string, fileName: string) => {
        setSharedFileId(fileId)
        setSharedFileName(fileName)
        shareTriggerRef.current?.click()
    }

    /**
     * Gets the presigned url for the file and downloads it
     *
     * @param id - The mongoId of the file
     */
    const handleDownload = async (id: string) => {
        if (id) {
            try {
                const presignedUrl = await retrievePresignedUrl(id)
                if (presignedUrl) {
                    window.open(presignedUrl)
                }
            } catch (error) {
                alert(error)
            }
        }
    }

    /**
     * Handles user logout
     */
    const handleLogout = () => {
        window.location.href = '/api/auth/logout'
    }

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            <FileList
                activeSection={activeSection}
                handleSectionChange={handleSectionChange}
                searchTerm={searchTerm}
                handleSearch={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                fileTypeFilter={fileTypeFilter}
                handleFileTypeFilter={(type: string) => setFileTypeFilter(type)}
                fileTypes={fileTypes}
                files={visibleFiles}
                selectedFiles={selectedFiles}
                triggerUpload={() => fileUploadTriggerRef.current?.click()}
                triggerSettings={() => settingsTriggerRef.current?.click()}
                triggerShare={triggerShare}
                handleSelectFile={handleSelectFile}
                handleDeleteSelected={handleDeleteSelected}
                handleDownload={handleDownload}
                handleLogout={handleLogout}
            />
            <UploadDialog
                userMongoId={mongoId}
                file={file}
                handleFileChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0])}
                handleUpload={handleUpload}
                inputRef={fileUploadInputRef}
                triggerRef={fileUploadTriggerRef}
            />
            <SettingsDialog
                userMongoId={mongoId}
                userName={name}
                userEmail={email}
                handleChangeSettings={handleChangeSettings}
                settingsTriggerRef={settingsTriggerRef}
                settingsInputRef={settingsInputRef}
            />
            <ShareDialog
                fileId={sharedFileId}
                fileName={sharedFileName}
                handleShare={handleShare}
                triggerRef={shareTriggerRef}
            />
        </div>
    )
}

export default HomePage
