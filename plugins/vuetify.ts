import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        components,
        directives,
        theme: {
            defaultTheme: 'dark',
            themes: {
                light: {
                    dark: false,
                    colors: {
                        primary: '#E91E63', // Pink
                        secondary: '#9C27B0', // Purple
                        accent: '#FF4081',
                        error: '#F44336',
                        warning: '#FF9800',
                        info: '#2196F3',
                        success: '#4CAF50',
                        background: '#FFFFFF',
                        surface: '#FFFFFF',
                    },
                },
                dark: {
                    dark: true,
                    colors: {
                        primary: '#E91E63', // Pink
                        secondary: '#9C27B0', // Purple
                        accent: '#FF4081',
                        error: '#F44336',
                        warning: '#FF9800',
                        info: '#2196F3',
                        success: '#4CAF50',
                        background: '#121212',
                        surface: '#1E1E1E',
                    },
                },
            },
        },
    })

    app.vueApp.use(vuetify)
})
