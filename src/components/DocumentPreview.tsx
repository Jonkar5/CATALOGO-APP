import { useDoorStore } from '../store/useDoorStore';
import { Button } from './ui/Button';
import { Printer } from 'lucide-react';
import { roundToTwo } from '../utils/math';



const ITEMS_PER_PAGE = 3;

function DocumentHeader({ clientInfo, today }: { clientInfo: any, today: string }) {
    return (
        <div className="flex justify-between items-start mb-8 print:mb-4">
            <div className="flex-1">
                <h1 className="text-lg font-black tracking-tighter text-blue-600 uppercase mb-2">Presupuesto Comercial</h1>
                <div className="flex items-center gap-4 text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
                    <span>{today}</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    <span>Ref: {new Date().getTime().toString().slice(-6)}</span>
                </div>
            </div>
            <div className="text-right">
                <img src="/logo.jpg" alt="Logo" className="h-16 w-auto object-contain mb-2 ml-auto" />
                <p className="text-neutral-900 font-bold text-base leading-tight">{clientInfo.companyName || 'Tu Empresa S.L.'}</p>
            </div>
        </div>
    );
}

function ClientInfoBox({ clientInfo }: { clientInfo: any }) {
    return (
        <div className="grid grid-cols-2 gap-6 mb-8 print:mb-6 border-y border-neutral-100 py-4">
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2 border-b border-neutral-200 pb-1">Datos del Cliente</h4>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-900 uppercase">{clientInfo.name || '---'}</p>
                    <p className="text-[10px] text-neutral-500 flex items-center gap-2">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        {clientInfo.address || 'Sin dirección especificada'}
                    </p>
                    <p className="text-[10px] text-neutral-500 flex items-center gap-2">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.81 12.81 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                        {clientInfo.phone || '---'}
                    </p>
                </div>
            </div>
            <div className="p-3">
                <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2 border-b border-neutral-200 pb-1">Términos de Validez</h4>
                <div className="space-y-1 text-[10px] text-neutral-500">
                    <p className="flex justify-between"><span>Validez:</span> <span className="font-bold text-neutral-700">{clientInfo.validityText || '15 días naturales'}</span></p>
                    <p className="flex justify-between"><span>Instalación:</span> <span className="font-bold text-neutral-700">{clientInfo.installationText || 'No incluida (salvo indicación)'}</span></p>
                    <p className="flex justify-between"><span>Impuestos:</span> <span className="font-bold text-neutral-700">{clientInfo.taxText || 'IVA 21% Desglosado'}</span></p>
                </div>
            </div>
        </div>
    );
}

export function DocumentPreview() {
    const { doors, clientInfo, generalNotes } = useDoorStore();

    const today = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handlePrint = () => {
        setTimeout(() => {
            window.print();
        }, 300);
    };

    if (doors.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center justify-center text-center h-[600px] text-neutral-400">
                <Printer className="w-12 h-12 mb-4 opacity-20" />
                <p>Añade productos para generar el presupuesto.</p>
            </div>
        );
    }

    // Split doors into chunks (pages)
    const pages = [];
    for (let i = 0; i < doors.length; i += ITEMS_PER_PAGE) {
        pages.push(doors.slice(i, i + ITEMS_PER_PAGE));
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Toolbar */}
            <div className="flex justify-end items-center bg-white p-4 rounded-xl border border-neutral-100 shadow-sm print:hidden">
                <Button onClick={handlePrint} variant="primary" className="gap-2">
                    <Printer size={18} />
                    Generar / Imprimir
                </Button>
            </div>

            {/* Render Pages */}
            <div className="w-full overflow-x-auto pb-12 px-4 md:px-0">
                {pages.map((pageDoors, pageIndex) => (
                    <div
                        key={pageIndex}
                        id="printable-area"
                        className={`bg-white mx-auto shadow-2xl print:shadow-none print:w-[210mm] min-w-[794px] w-[794px] min-h-[1123px] relative overflow-visible transition-all flex flex-col ${pageIndex < pages.length - 1 ? 'print:break-after-page mb-8 print:mb-0' : ''}`}
                    >
                        <div className="p-10 print:p-6 flex-1 flex flex-col">

                            <DocumentHeader clientInfo={clientInfo} today={today} />

                            {/* Only show Client Info on the first page */}
                            {pageIndex === 0 && <ClientInfoBox clientInfo={clientInfo} />}

                            {/* Products Area for this Page */}
                            <div className="relative flex-1 flex flex-col gap-6">
                                {pageDoors.map((door) => {
                                    const costsSum = door.concepts?.reduce((acc, c) => acc + (c.amount || 0), 0) || 0;
                                    const baseImponible = roundToTwo(costsSum * (1 + (door.margin || 0) / 100));

                                    // To keep it simple and working: Render items in flow.
                                    return (
                                        <div key={door.id} className="flex gap-6 items-center bg-white p-4 rounded-xl border border-neutral-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] h-[240px]">
                                            {/* Left: Image */}
                                            <div className="w-[30%] shrink-0 h-full">
                                                <div className="h-full bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100 flex items-center justify-center relative group">
                                                    {door.images?.[0] ? (
                                                        <img
                                                            src={door.images[0]}
                                                            alt={door.name}
                                                            className="w-full h-full object-contain p-2"
                                                            draggable="false"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-neutral-300">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                            <span className="text-[9px] font-bold uppercase tracking-wider">Sin Imagen</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 left-2 bg-blue-600/10 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                        Vista Técnica
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Specs and Pricing */}
                                            <div className="flex-1 flex flex-col justify-between h-full py-1">
                                                <div className="flex justify-between items-start border-b border-neutral-100 pb-3 mb-2">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight leading-none mb-1">{door.name}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Modelo</span>
                                                            <p className="text-xs font-bold text-neutral-900">{door.model}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[8px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Base Imponible</p>
                                                        <div className="flex items-end justify-end gap-1">
                                                            <span className="text-2xl font-black text-blue-600 leading-tight">{baseImponible.toFixed(2).split('.')[0]}</span>
                                                            <span className="text-sm font-black text-blue-600 mb-1">.{baseImponible.toFixed(2).split('.')[1]}€</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 py-1">
                                                    <div className="grid grid-cols-1 gap-y-2">
                                                        {(door.specs || []).slice(0, 5).map((spec) => {
                                                            const isHighlighted = ['material', 'dimensiones', 'medidas'].some(k => spec.name.toLowerCase().includes(k));
                                                            return (
                                                                <div key={spec.id} className="flex items-center gap-3 border-l-2 border-neutral-100 pl-3">
                                                                    <span className="text-[7px] font-black text-neutral-400 uppercase tracking-widest min-w-[70px]">{spec.name}</span>
                                                                    <span className={`${isHighlighted ? 'text-xs md:text-sm font-extrabold text-neutral-900' : 'text-[10px] text-neutral-800 font-bold'} truncate`}>{spec.value || '-'}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="mt-2 pt-3 border-t border-neutral-50 flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">I.V.A. (21%) NO INCLUIDO</span>
                                                    </div>
                                                    <div className="flex gap-3 text-[8px] font-black text-neutral-300 uppercase tracking-[0.15em]">
                                                        <span className="flex items-center gap-1"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> Premium</span>
                                                        <span className="flex items-center gap-2"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> Garantia</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* General Notes Section - Only on the last page */}
                            {pageIndex === pages.length - 1 && generalNotes && (
                                <div className="mt-6 pt-4 border-t border-neutral-200 print:break-inside-avoid shrink-0 pb-0 mb-0 print:mb-0">
                                    <h4 className="text-[8px] font-black text-neutral-300 uppercase tracking-[0.3em] mb-2">Información Adicional y Condiciones</h4>
                                    <div className="text-[9px] text-neutral-400 whitespace-pre-wrap leading-relaxed border-l border-neutral-100 pl-4 pr-4 font-normal">
                                        {generalNotes}
                                    </div>
                                </div>
                            )}

                            {/* Page Number */}
                            <div className="mt-auto pt-4 text-right text-[9px] text-neutral-300 font-medium print:block hidden">
                                Página {pageIndex + 1} de {pages.length}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
