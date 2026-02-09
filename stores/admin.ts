import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
    state: () => ({
        uploadDialogOpen: false,
        activeSection: 'dashboard', // dashboard, manga, users
    }),
    actions: {
        openUploadDialog() {
            this.uploadDialogOpen = true
        },
        closeUploadDialog() {
            this.uploadDialogOpen = false
        },
        scrollToSection(sectionId: string) {
            const el = document.getElementById(sectionId)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
                this.activeSection = sectionId
            }
        }
    }
})
