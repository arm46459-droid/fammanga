import { useUserStore } from '~/stores/user'

interface LoginCredentials {
    username: string
    password: string
}

interface RegisterData {
    username: string
    email: string
    password: string
}

export const useAuth = () => {
    const userStore = useUserStore()
    const router = useRouter()
    const alert = useAlert()

    // Initialize auth state from storage
    const initAuth = () => {
        userStore.loadFromStorage()
    }

    // Login function
    const login = async (credentials: LoginCredentials) => {
        try {
            const { data, error } = await useFetch('/api/auth/login', {
                method: 'POST',
                body: credentials,
            })

            if (error.value) {
                throw new Error(error.value.data?.statusMessage || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
            }

            if (data.value?.success) {
                const user = {
                    ...data.value.user,
                    avatar: data.value.user.avatar || undefined
                }
                userStore.setUser(user, data.value.token)

                await alert.success('เข้าสู่ระบบสำเร็จ', `ยินดีต้อนรับ ${data.value.user.username}`)

                // Redirect based on role
                if (data.value.user.role === 'admin') {
                    router.push('/admin/dashboard')
                } else {
                    router.push('/user/dashboard')
                }

                return true
            }

            return false
        } catch (err: any) {
            await alert.error('เข้าสู่ระบบไม่สำเร็จ', err.message)
            return false
        }
    }

    // Register function
    const register = async (data: RegisterData) => {
        try {
            const { data: response, error } = await useFetch('/api/auth/register', {
                method: 'POST',
                body: data,
            })

            if (error.value) {
                throw new Error(error.value.data?.statusMessage || 'เกิดข้อผิดพลาดในการสมัครสมาชิก')
            }

            if (response.value?.success) {
                await alert.success('สมัครสมาชิกสำเร็จ', 'กรุณาเข้าสู่ระบบ')
                router.push('/login')
                return true
            }

            return false
        } catch (err: any) {
            await alert.error('สมัครสมาชิกไม่สำเร็จ', err.message)
            return false
        }
    }

    // Register Admin function
    const registerAdmin = async (data: RegisterData & { adminKey: string }) => {
        try {
            const { data: response, error } = await useFetch('/api/auth/register-admin', {
                method: 'POST',
                body: data,
            })

            if (error.value) {
                throw new Error(error.value.data?.statusMessage || 'เกิดข้อผิดพลาดในการสมัครสมาชิก')
            }

            if (response.value?.success) {
                await alert.success('สมัครสมาชิกผู้ดูแลระบบสำเร็จ', 'กรุณาเข้าสู่ระบบ')
                router.push('/admin/login')
                return true
            }

            return false
        } catch (err: any) {
            await alert.error('สมัครสมาชิกไม่สำเร็จ', err.message)
            return false
        }
    }

    // Logout function
    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${userStore.token}`,
                },
            })
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            userStore.logout()
            await alert.success('ออกจากระบบสำเร็จ')
            router.push('/')
        }
    }

    // Get auth headers for API calls
    const getAuthHeaders = () => {
        return {
            Authorization: `Bearer ${userStore.token}`,
        }
    }

    return {
        user: computed(() => userStore.user),
        token: computed(() => userStore.token),
        isAuthenticated: computed(() => userStore.isAuthenticated),
        isAdmin: computed(() => userStore.isAdmin),
        initAuth,
        login,
        register,
        registerAdmin,
        logout,
        getAuthHeaders,
    }
}
