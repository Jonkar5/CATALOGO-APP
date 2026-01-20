import type { SavedBudget } from '../types';

/**
 * Note: In a standard web browser, we cannot directly write to an arbitrary absolute path 
 * like 'C:\Users\...\OneDrive\...' for security reasons.
 * 
 * However, we can trigger a download which the user can save to that folder, 
 * or use the File System Access API (showSaveFilePicker) which allows the user 
 * to pick that specific folder once and then we can save there.
 */

export const exportBudgetAsJSON = (budget: SavedBudget, fileName: string) => {
    const dataStr = JSON.stringify(budget, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
};

export const loadBudgetFromJSON = (): Promise<SavedBudget> => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event: any) => {
                try {
                    const json = JSON.parse(event.target.result);
                    resolve(json as SavedBudget);
                } catch (err) {
                    reject(new Error('Formato de archivo inválido.'));
                }
            };
            reader.readAsText(file);
        };

        input.click();
    });
};
