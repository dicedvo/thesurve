/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_TOKEN: string
    readonly FIREBASE_API_KEY: string
    readonly FIREBASE_PROJECT_ID: string
    readonly FIREBASE_APP_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}