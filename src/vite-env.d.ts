/// <reference types="vite/client" />

interface Window {
    showSaveFilePicker(options?: any): Promise<any>;
    showOpenFilePicker(options?: any): Promise<any[]>;
}
/// <reference types="vite-plugin-pwa/client" />
