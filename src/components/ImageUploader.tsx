import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from './ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploaderProps {
    onImageSelect: (file: string) => void;
    currentImage?: string;
}

export function ImageUploader({ onImageSelect, currentImage }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            onImageSelect(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">
                Imagen de la Puerta
            </label>

            <AnimatePresence mode="wait">
                {currentImage ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group rounded-xl overflow-hidden aspect-video shadow-md border border-neutral-200"
                    >
                        <img src={currentImage} alt="Preview" className="w-full h-full object-cover" draggable="false" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                onClick={() => onImageSelect('')}
                                className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        className={cn(
                            "border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 bg-neutral-50 hover:bg-neutral-100",
                            isDragging ? "border-blue-500 bg-blue-50" : "border-neutral-200"
                        )}
                    >
                        <div className="p-3 bg-white rounded-full shadow-sm">
                            <Upload className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-neutral-700">haz clic o arrastra una imagen</p>
                            <p className="text-xs text-neutral-400 mt-1">PNG, JPG hasta 5MB</p>
                        </div>
                        <input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
