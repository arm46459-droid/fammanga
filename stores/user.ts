import { defineStore } from 'pinia'

interface User {
    id: number
    username: string
    email: string
    role: 'user' | 'admin'
    avatar?: string
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        token: null as string | null,
        isAuthenticated: false,
    }),

    actions: {
        setUser(user: User, token: string) {
            this.user = user
            this.token = token
            this.isAuthenticated = true

            // Save to localStorage
            if (process.client) {
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
            }
        },

        logout() {
            this.user = null
            this.token = null
            this.isAuthenticated = false

            // Clear localStorage
            if (process.client) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        },

        loadFromStorage() {
            if (process.client) {
                const token = localStorage.getItem('token')
                const userStr = localStorage.getItem('user')

                if (token && userStr) {
                    this.token = token
                    this.user = JSON.parse(userStr)
                    this.isAuthenticated = true
                }
            }
        },
    },

    getters: {
        isAdmin(): boolean {
            return this.user?.role === 'admin'
        },
    },
})
