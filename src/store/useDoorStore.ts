import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Door, ClientInfo } from '../types';

interface DoorState {
    doors: Door[];
    generalNotes: string;
    editingDoorId: string | null;
    clientInfo: ClientInfo;
    addDoor: (door: Door) => void;
    removeDoor: (id: string) => void;
    updateDoor: (id: string, updated: Partial<Door>) => void;
    setGeneralNotes: (notes: string) => void;
    setClientInfo: (info: ClientInfo) => void;
    setEditingDoorId: (id: string | null) => void;
    resetAll: () => void;
}

export const useDoorStore = create<DoorState>()(
    persist(
        (set) => ({
            doors: [],
            generalNotes: '',
            editingDoorId: null,
            clientInfo: {
                name: '',
                address: '',
                phone: '',
                companyName: 'Tu Empresa S.L.',
                validityText: '15 días naturales',
                installationText: 'No incluida (salvo indicación)',
                taxText: 'IVA 21% Desglosado'
            },
            addDoor: (door) => set((state) => ({ doors: [...state.doors, door] })),
            removeDoor: (id) => set((state) => ({
                doors: state.doors.filter((d) => d.id !== id),
                editingDoorId: state.editingDoorId === id ? null : state.editingDoorId
            })),
            updateDoor: (id, updated) => set((state) => ({
                doors: state.doors.map((d) => (d.id === id ? { ...d, ...updated } : d)),
                editingDoorId: null
            })),
            setGeneralNotes: (notes) => set({ generalNotes: notes }),
            setClientInfo: (info) => set({ clientInfo: info }),
            setEditingDoorId: (id) => set({ editingDoorId: id }),
            resetAll: () => set({
                doors: [],
                generalNotes: '',
                editingDoorId: null,
                clientInfo: {
                    name: '',
                    address: '',
                    phone: '',
                    companyName: 'Tu Empresa S.L.',
                    validityText: '15 días naturales',
                    installationText: 'No incluida (salvo indicación)',
                    taxText: 'IVA 21% Desglosado'
                }
            }),
        }),
        {
            name: 'door-catalog-storage',
        }
    )
);
