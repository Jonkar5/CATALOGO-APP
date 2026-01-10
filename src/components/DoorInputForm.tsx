import React, { useState, useMemo } from 'react';
import type { PriceConcept, TechnicalSpec } from '../types';
import { useDoorStore } from '../store/useDoorStore';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ImageUploader } from './ImageUploader';
import { SpecsManager } from './SpecsManager';
import { Plus, Trash2 } from 'lucide-react';
import { roundToTwo } from '../utils/math';

const IVA_PERCENT = 21;

const INITIAL_CONCEPTS_LIST = [
    'Producto', 'Accesorios', 'Transporte', 'Montaje'
];

const INITIAL_SPECS: TechnicalSpec[] = [
    { id: '1', name: 'Material', value: '' },
    { id: '2', name: 'Dimensiones', value: '' }
];

export function DoorInputForm() {
    const { addDoor, updateDoor, editingDoorId, doors, setEditingDoorId } = useDoorStore();

    // State for different sections
    const [basicInfo, setBasicInfo] = useState({
        name: '',
        model: '',
        images: ['', ''] as string[],
        margin: 30
    });

    const [specs, setSpecs] = useState<TechnicalSpec[]>(INITIAL_SPECS);

    const [concepts, setConcepts] = useState<PriceConcept[]>(
        INITIAL_CONCEPTS_LIST.map((name, i) => ({
            id: String(i + 1),
            name,
            amount: 0
        }))
    );

    const [newConceptName, setNewConceptName] = useState('');

    // Load data if editing
    React.useEffect(() => {
        if (editingDoorId) {
            const door = doors.find(d => d.id === editingDoorId);
            if (door) {
                setBasicInfo({
                    name: door.name,
                    model: door.model,
                    images: door.images || ['', ''],
                    margin: door.margin || 30
                });
                setSpecs(door.specs || INITIAL_SPECS);
                setConcepts(door.concepts || INITIAL_CONCEPTS_LIST.map((name, i) => ({ id: String(i + 1), name, amount: 0 })));
            }
        }
    }, [editingDoorId, doors]);

    // Memoized Calculations
    const totals = useMemo(() => {
        const base = roundToTwo(concepts.reduce((acc, c) => acc + (Number(c.amount) || 0), 0));
        const marginFactor = 1 + (Number(basicInfo.margin) || 0) / 100;
        const totalWithMargin = roundToTwo(base * marginFactor);
        const iva = roundToTwo(totalWithMargin * (IVA_PERCENT / 100));
        const total = roundToTwo(totalWithMargin + iva);

        return { base, totalWithMargin, iva, total };
    }, [concepts, basicInfo.margin]);

    const handleConceptChange = (id: string, field: keyof PriceConcept, value: any) => {
        const finalValue = field === 'amount' ? roundToTwo(Number(value) || 0) : value;
        setConcepts(prev => prev.map(c => c.id === id ? { ...c, [field]: finalValue } : c));
    };

    const addConcept = () => {
        if (!newConceptName.trim()) return;
        setConcepts(prev => [...prev, { id: String(Date.now()), name: newConceptName, amount: 0 }]);
        setNewConceptName('');
    };

    const removeConcept = (id: string) => {
        setConcepts(prev => prev.filter(c => c.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!basicInfo.name || !basicInfo.model) {
            alert('Por favor, rellena el Nombre y el Modelo del producto.');
            return;
        }

        const doorData = {
            ...basicInfo,
            specs,
            concepts: concepts.filter(c => c.name.trim() !== '' || c.amount > 0)
        };

        if (editingDoorId) {
            updateDoor(editingDoorId, doorData);
        } else {
            // Generate a simple unique ID that works everywhere
            const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);

            console.log('Añadiendo puerta:', newId, doorData);

            addDoor({
                id: newId,
                ...doorData
            });
        }

        // Reset
        setEditingDoorId(null);
        setBasicInfo({ name: '', model: '', images: ['', ''], margin: 30 });
        setSpecs(INITIAL_SPECS);
        setConcepts(INITIAL_CONCEPTS_LIST.map((name, i) => ({ id: String(i + 1), name, amount: 0 })));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-900 mb-5 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500 rounded-full" />
                    {editingDoorId ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Foto 1 (Principal)</span>
                            <ImageUploader
                                currentImage={basicInfo.images[0]}
                                onImageSelect={(img) => setBasicInfo(p => ({
                                    ...p,
                                    images: [img, p.images[1]]
                                }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Foto 2 (Detalle)</span>
                            <ImageUploader
                                currentImage={basicInfo.images[1]}
                                onImageSelect={(img) => setBasicInfo(p => ({
                                    ...p,
                                    images: [p.images[0], img]
                                }))}
                            />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nombre / Referencia"
                            placeholder="Ej. Producto Premium"
                            value={basicInfo.name}
                            onChange={(e) => setBasicInfo(p => ({ ...p, name: e.target.value }))}
                        />
                        <Input
                            label="Modelo"
                            placeholder="Ej. Modelo 2024"
                            value={basicInfo.model}
                            onChange={(e) => setBasicInfo(p => ({ ...p, model: e.target.value }))}
                        />
                    </div>

                    {/* Technical Specs */}
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                        <SpecsManager specs={specs} onChange={setSpecs} />
                    </div>

                    {/* Concepts & Pricing */}
                    <div className="p-4 bg-blue-50/50 rounded-xl space-y-4 border border-blue-100">
                        <h3 className="text-sm font-semibold text-neutral-900 flex justify-between items-center">
                            <span>Desglose de Costes</span>
                            <span className="text-xs font-normal text-neutral-500">Subtotal Base: {totals.base.toFixed(2)}€</span>
                        </h3>

                        <div className="space-y-3">
                            {concepts.map((concept) => (
                                <div key={concept.id} className="flex gap-3 items-end">
                                    <Input
                                        value={concept.name}
                                        onChange={(e) => handleConceptChange(concept.id, 'name', e.target.value)}
                                        className="bg-white"
                                    />
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={concept.amount}
                                        onChange={(e) => handleConceptChange(concept.id, 'amount', e.target.valueAsNumber || 0)}
                                        className="w-32 bg-white text-right font-mono"
                                        placeholder="0.00"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeConcept(concept.id)}
                                        className="h-11 px-3 text-neutral-400 hover:text-red-500 hover:bg-white rounded-xl transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Concept */}
                        <div className="flex gap-3 items-end pt-2 border-t border-blue-100/50">
                            <Input
                                placeholder="Nuevo concepto..."
                                value={newConceptName}
                                onChange={(e) => setNewConceptName(e.target.value)}
                                className="bg-white/50 focus:bg-white"
                            />
                            <Button type="button" onClick={addConcept} variant="secondary" size="md">
                                + Concepto
                            </Button>
                        </div>
                    </div>

                    {/* Margin & Final Price Section */}
                    <div className="p-5 bg-white rounded-xl shadow-lg border-2 border-blue-600/10 space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                            <div className="w-48">
                                <Input
                                    label="Margen Comercial (%)"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={basicInfo.margin}
                                    onChange={(e) => setBasicInfo(p => ({ ...p, margin: e.target.valueAsNumber || 0 }))}
                                />
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Resumen Venta</p>
                                <p className="text-xl font-medium text-neutral-600">Base: {totals.totalWithMargin.toFixed(2)} €</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-1">
                                <div className="px-3 py-1 bg-neutral-100 rounded text-xs text-neutral-500 font-bold inline-block uppercase">
                                    IVA EXPLÍCITO ({IVA_PERCENT}%)
                                </div>
                                <p className="text-neutral-500 font-medium">IVA: {totals.iva.toFixed(2)} €</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-neutral-500 mb-0.5 font-semibold">TOTAL FINAL (INC. IVA)</p>
                                <p className="text-4xl font-black text-blue-600">{totals.total.toFixed(2)} €</p>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                        <Plus className="w-5 h-5 mr-2" />
                        {editingDoorId ? 'Guardar Cambios' : 'Añadir Producto al Catálogo'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
