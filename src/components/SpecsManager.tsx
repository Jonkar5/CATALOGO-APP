import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { TechnicalSpec } from '../types';

interface SpecsManagerProps {
    specs: TechnicalSpec[];
    onChange: (specs: TechnicalSpec[]) => void;
}

export function SpecsManager({ specs, onChange }: SpecsManagerProps) {
    const [newSpecName, setNewSpecName] = React.useState('');
    const [newSpecValue, setNewSpecValue] = React.useState('');

    const addSpec = () => {
        if (!newSpecName.trim() || !newSpecValue.trim()) return;

        const newSpec: TechnicalSpec = {
            id: Date.now().toString(),
            name: newSpecName.trim(),
            value: newSpecValue.trim()
        };

        onChange([...specs, newSpec]);
        setNewSpecName('');
        setNewSpecValue('');
    };

    const removeSpec = (id: string) => {
        onChange(specs.filter(spec => spec.id !== id));
    };

    const updateSpec = (id: string, field: 'name' | 'value', newValue: string) => {
        onChange(specs.map(spec =>
            spec.id === id ? { ...spec, [field]: newValue } : spec
        ));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-700">Especificaciones Técnicas</h3>

            {/* Existing Specs */}
            <div className="space-y-2">
                {specs.map(spec => (
                    <div key={spec.id} className="flex gap-2 items-center">
                        <Input
                            value={spec.name}
                            onChange={(e) => updateSpec(spec.id, 'name', e.target.value)}
                            placeholder="Nombre"
                            className="flex-1"
                        />
                        <Input
                            value={spec.value}
                            onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                            placeholder="Valor"
                            className="flex-1"
                        />
                        <button
                            onClick={() => removeSpec(spec.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                            title="Eliminar especificación"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add New Spec */}
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <Input
                        label="Nueva Especificación"
                        value={newSpecName}
                        onChange={(e) => setNewSpecName(e.target.value)}
                        placeholder="ej: Material"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        label="Valor"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        placeholder="ej: Madera de roble"
                        onKeyPress={(e) => e.key === 'Enter' && addSpec()}
                    />
                </div>
                <Button
                    onClick={addSpec}
                    variant="secondary"
                    className="shrink-0"
                    disabled={!newSpecName.trim() || !newSpecValue.trim()}
                >
                    <Plus size={18} />
                </Button>
            </div>
        </div>
    );
}
