/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_R2_BUCKET: string
  readonly VITE_R2_BASE_URL: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
