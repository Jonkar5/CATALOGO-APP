import type { SavedBudget } from '../types';

/**
 * Using the File System Access API allows the user to pick a specific location 
 * (like the OneDrive folder) and we can save directly there.
 */

export const saveBudgetToFileSystem = async (budget: SavedBudget, suggestedName: string) => {
    try {
        // Check if the API is supported
        if ('showSaveFilePicker' in window) {
            const handle = await (window as any).showSaveFilePicker({
                suggestedName: `${suggestedName}.json`,
                types: [{
                    description: 'Presupuesto JSON',
                    accept: { 'application/json': ['.json'] },
                }],
            });

            const writable = await handle.createWritable();
            await writable.write(JSON.stringify(budget, null, 2));
            await writable.close();
            return true;
        } else {
            // Fallback to traditional download if API not supported
            const dataStr = JSON.stringify(budget, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', `${suggestedName}.json`);
            linkElement.click();
            return true;
        }
    } catch (err) {
        if ((err as Error).name === 'AbortError') return false;
        console.error('Error saving file:', err);
        throw err;
    }
};

export const loadBudgetFromFileSystem = async (): Promise<SavedBudget | null> => {
    try {
        if ('showOpenFilePicker' in window) {
            const [handle] = await (window as any).showOpenFilePicker({
                types: [{
                    description: 'Presupuesto JSON',
                    accept: { 'application/json': ['.json'] },
                }],
                multiple: false
            });

            const file = await handle.getFile();
            const content = await file.text();
            return JSON.parse(content) as SavedBudget;
        } else {
            // Fallback to traditional file input
            return new Promise((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = async (e: any) => {
                    const file = e.target.files[0];
                    if (!file) {
                        resolve(null);
                        return;
                    }
                    const text = await file.text();
                    resolve(JSON.parse(text) as SavedBudget);
                };
                input.click();
            });
        }
    } catch (err) {
        if ((err as Error).name === 'AbortError') return null;
        console.error('Error loading file:', err);
        throw err;
    }
};
