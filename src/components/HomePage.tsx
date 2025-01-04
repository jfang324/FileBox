'use client'
import FileList from '@/components/FileList'
import Menu from '@/components/Menu'
import SettingsDialog from '@/components/SettingsDialog'
import ShareDialog from '@/components/ShareDialog'
import UploadDialog from '@/components/UploadDialog'
import { useToast } from '@/hooks/use-toast'
import { FileDocument } from '@/interfaces/FileDocument'
import {
    deleteFile,
    initializeUserDetails,
    retrieveFiles,
    retrievePresignedUrl,
    retrieveUserDetails,
} from '@/lib/clientUtils'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect, useMemo, useRef, useState } from 'react'

const HomePage = () => {
    //state associated with the account
    const { toast } = useToast()
    const { user, error, isLoading } = useUser()
    const [userMongoId, setUserMongoId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    // refs for triggering dialogs & menus
    const menuTriggerRef = useRef<HTMLButtonElement>(null)
    const fileUploadTriggerRef = useRef<HTMLButtonElement>(null)
    const settingsTriggerRef = useRef<HTMLButtonElement>(null)
    const shareTriggerRef = useRef<HTMLButtonElement>(null)

    //state associated with the file list & visibility
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [fileTypeFilter, setFileTypeFilter] = useState<string>('all')
    const [files, setFiles] = useState<(FileDocument & { owner: string })[]>([])
    const [visibleFiles, setVisibleFiles] = useState<(FileDocument & { owner: string })[]>([])

    // state associated with file sharing
    const [sharedFileId, setSharedFileId] = useState<string>('')
    const [sharedFileName, setSharedFileName] = useState<string>('')

    //state associated with file selection
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [activeSection, setActiveSection] = useState<'my-files' | 'shared'>('my-files')

    //calculates the available file types
    const fileTypes = useMemo(() => {
        const types = new Set(files.map((file) => file.extension).filter(Boolean))
        return ['all', ...Array.from(types)]
    }, [files])

    /**
     * Updates the files list and selected files
     *
     * @param id - The mongoId of the user
     * @param section - The active section
     */
    const updateFiles = async (id: string, section: 'my-files' | 'shared') => {
        const userFiles = await retrieveFiles(id, section)
        setFiles(userFiles)
        setSelectedFiles([])
    }

    //initialize user details and files
    useEffect(() => {
        const init = async () => {
            if (isLoading || error || !user) {
                return
            }

            try {
                const userDetails = await retrieveUserDetails()
                initializeUserDetails(setUserMongoId, setName, setEmail, userDetails)
                await updateFiles(userDetails._id as string, activeSection)
            } catch (error) {
                toast({ title: 'Error', description: `${error}` })
            }
        }
        init()
    }, [user, error, isLoading, activeSection, toast])

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

        setSelectedFiles(Array.from(existingSet))
    }

    /**
     * Handles file deletion and refreshing files
     */
    const handleDeleteSelected = async () => {
        if (userMongoId && selectedFiles.length > 0) {
            try {
                await Promise.all(selectedFiles.map((fileId) => deleteFile(fileId)))
                await updateFiles(userMongoId, activeSection)
            } catch (error) {
                toast({ title: 'Error', description: `${error}` })
            }
        } else {
            toast({
                title: 'Error',
                description: `Error deleting files \n${selectedFiles.length} files selected \nuserMongoId: ${userMongoId}`,
            })
        }
    }

    /**
     * Handles changing the active section
     *
     * @param section - The new active section
     */
    const handleSectionChange = async (section: 'my-files' | 'shared') => {
        setActiveSection(section)
        await updateFiles(userMongoId, section)
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
                toast({ title: 'Error', description: `${error}` })
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
                searchTerm={searchTerm}
                handleSearch={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                fileTypeFilter={fileTypeFilter}
                handleFileTypeFilter={(type: string) => setFileTypeFilter(type)}
                fileTypes={fileTypes}
                files={visibleFiles}
                selectedFiles={selectedFiles}
                triggerShare={triggerShare}
                triggerMenu={() => menuTriggerRef.current?.click()}
                handleSelectFile={handleSelectFile}
                handleDeleteSelected={handleDeleteSelected}
                handleDownload={handleDownload}
            />
            <Menu
                activeSection={activeSection}
                triggerRef={menuTriggerRef}
                triggerUpload={() => fileUploadTriggerRef.current?.click()}
                triggerSettings={() => settingsTriggerRef.current?.click()}
                handleSectionChange={handleSectionChange}
                handleLogout={handleLogout}
            />
            <UploadDialog triggerRef={fileUploadTriggerRef} onSuccess={() => updateFiles(userMongoId, activeSection)} />
            <SettingsDialog
                authId={user!.sub as string}
                userEmail={email}
                userName={name}
                triggerRef={settingsTriggerRef}
                onSuccess={() => updateFiles(userMongoId, activeSection)}
            />
            <ShareDialog
                fileId={sharedFileId}
                fileName={sharedFileName}
                userEmail={email}
                triggerRef={shareTriggerRef}
            />
        </div>
    )
}

export default HomePage
