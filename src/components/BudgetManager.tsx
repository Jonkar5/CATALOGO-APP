import { useState } from 'react';
import { useDoorStore } from '../store/useDoorStore';
import { saveBudgetToFileSystem, loadBudgetFromFileSystem } from '../utils/budgetFileManager';
import type { SavedBudget } from '../types';

export function BudgetManager() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [budgetName, setBudgetName] = useState('');
    const { doors, clientInfo, generalNotes, importBudget } = useDoorStore();

    const handleSaveAs = async () => {
        if (!budgetName.trim()) {
            alert('Por favor, introduce un nombre para el presupuesto.');
            return;
        }

        const budget: SavedBudget = {
            id: crypto.randomUUID(),
            name: budgetName,
            timestamp: Date.now(),
            doors,
            clientInfo,
            generalNotes,
        };

        try {
            const saved = await saveBudgetToFileSystem(budget, budgetName);
            if (saved) {
                setShowSaveModal(false);
                setBudgetName('');
            }
        } catch (err) {
            alert('Error al guardar el archivo.');
        }
    };

    const handleOpen = async () => {
        try {
            const budget = await loadBudgetFromFileSystem();
            if (budget && confirm(`¿Cargar el presupuesto "${budget.name}"? Los cambios actuales no guardados se perderán.`)) {
                importBudget(budget);
            }
        } catch (err) {
            console.error(err);
            alert('Error al cargar el archivo. Asegúrate de que es un presupuesto válido.');
        }
    };

    return (
        <div className="flex gap-2 items-center">
            {/* DEBUG: <span>DEBUG: UI LOADED</span> */}
            <button
                onClick={handleOpen}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
            >
                <span role="img" aria-label="open">📂</span>
                Abrir Presupuesto
            </button>

            <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-100"
            >
                <span role="img" aria-label="save">💾</span>
                Guardar Como (Directo)...
            </button>

            {showSaveModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] print:hidden">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 w-full max-w-md">
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">Guardar Presupuesto</h3>
                        <p className="text-sm text-neutral-500 mb-4">
                            Introduce un nombre para identificar este presupuesto. Podrás guardarlo directamente en tu carpeta de Clientes en OneDrive.
                        </p>

                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Nombre del Presupuesto</label>
                            <input
                                type="text"
                                autoFocus
                                className="w-full p-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                                placeholder="Ej: Presupuesto Juan Perez 2024"
                                value={budgetName}
                                onChange={(e) => setBudgetName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveAs()}
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="px-4 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveAs}
                                className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Fallback for crypto.randomUUID
if (typeof crypto.randomUUID !== 'function') {
    (crypto as any).randomUUID = function () {
        return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };
}

