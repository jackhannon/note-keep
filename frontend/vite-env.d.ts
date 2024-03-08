/// <reference types="vite/client" />
declare module "*.module.css"


interface ImportMeta {
  readonly env: {
    readonly VITE_APP_API_URL: string;
    // Add other environment variables here if needed
  };
}