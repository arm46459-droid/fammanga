export const useManga = () => {
    const { getAuthHeaders } = useAuth()
    const alert = useAlert()

    // Fetch manga list
    const fetchMangaList = async (params?: {
        page?: number
        limit?: number
        search?: string
        genre?: string
        status?: string
        sort?: string
    }) => {
        try {
            const { data, error } = await useFetch('/api/manga', {
                params,
            })

            if (error.value) {
                throw new Error('ไม่สามารถดึงข้อมูลมังงะได้')
            }

            return data.value
        } catch (err: any) {
            await alert.error('เกิดข้อผิดพลาด', err.message)
            return null
        }
    }

    // Fetch manga detail
    const fetchMangaDetail = async (id: number | string) => {
        try {
            const { data, error } = await useFetch(`/api/manga/${id}`)

            if (error.value) {
                throw new Error('ไม่สามารถดึงข้อมูลมังงะได้')
            }

            return data.value
        } catch (err: any) {
            await alert.error('เกิดข้อผิดพลาด', err.message)
            return null
        }
    }

    // Fetch chapters
    const fetchChapters = async (mangaId: number | string) => {
        try {
            const { data, error } = await useFetch(`/api/manga/${mangaId}/chapters`)

            if (error.value) {
                throw new Error('ไม่สามารถดึงข้อมูลตอนได้')
            }

            return data.value
        } catch (err: any) {
            await alert.error('เกิดข้อผิดพลาด', err.message)
            return null
        }
    }

    // Fetch chapter content
    const fetchChapterContent = async (mangaId: number | string, chapterId: number | string) => {
        try {
            const { data, error } = await useFetch(`/api/chapters/${mangaId}/${chapterId}`)

            if (error.value) {
                throw new Error('ไม่สามารถดึงข้อมูลตอนได้')
            }

            return data.value
        } catch (err: any) {
            await alert.error('เกิดข้อผิดพลาด', err.message)
            return null
        }
    }

    // Add to reading list
    const addToReadingList = async (mangaId: number) => {
        try {
            const response = await $fetch('/api/user/reading-list', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: { mangaId },
            })

            await alert.toast('เพิ่มลงรายการอ่านสำเร็จ', 'success')
            return response
        } catch (err: any) {
            await alert.error('เกิดข้อผิดพลาด', err.data?.statusMessage || 'ไม่สามารถเพิ่มลงรายการอ่านได้')
            return null
        }
    }

    // Remove from reading list
    const removeFromReadingList = async (mangaId: number) => {
        try {
            const response = await $fetch('/api/user/reading-list', {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: { mangaId },
            })

            await alert.toast('ลบออกจากรายการอ่านสำเร็จ', 'success')
            return response
        } catch (err: any) {
            await alert.error('เกิดข้อผิดพลาด', 'ไม่สามารถลบออกจากรายการอ่านได้')
            return null
        }
    }

    // Add to wishlist
    const addToWishlist = async (mangaId: number) => {
        try {
            const response = await $fetch('/api/user/wishlist', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: { mangaId },
            })

            await alert.toast('เพิ่มลงรายการที่อยากได้สำเร็จ', 'success')
            return response
        } catch (err: any) {
            await alert.error('เกิดข้อผิดพลาด', err.data?.statusMessage || 'ไม่สามารถเพิ่มลงรายการได้')
            return null
        }
    }

    // Remove from wishlist
    const removeFromWishlist = async (mangaId: number) => {
        try {
            const response = await $fetch('/api/user/wishlist', {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: { mangaId },
            })

            await alert.toast('ลบออกจากรายการที่อยากได้สำเร็จ', 'success')
            return response
        } catch (err: any) {
            await alert.error('เกิดข้อผิดพลาด', 'ไม่สามารถลบออกจากรายการได้')
            return null
        }
    }

    // Save reading progress
    const saveProgress = async (mangaId: number, chapterId: number, pageNumber: number = 1) => {
        try {
            const response = await $fetch('/api/user/progress', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: { mangaId, chapterId, pageNumber },
            })

            return response
        } catch (err: any) {
            console.error('Save progress error:', err)
            return null
        }
    }

    // Get reading progress
    const fetchProgress = async (mangaId?: number) => {
        try {
            const params = mangaId ? { mangaId } : {}
            const response = await $fetch('/api/user/progress', {
                method: 'GET',
                headers: getAuthHeaders(),
                params,
            })

            return response
        } catch (err: any) {
            console.error('Fetch progress error:', err)
            return null
        }
    }

    return {
        fetchMangaList,
        fetchMangaDetail,
        fetchChapters,
        fetchChapterContent,
        addToReadingList,
        removeFromReadingList,
        addToWishlist,
        removeFromWishlist,
        saveProgress,
        fetchProgress,
    }
}
