// import { useState } from 'react'
import { DoorInputForm } from './components/DoorInputForm';
import { DocumentPreview } from './components/DocumentPreview';
import { useDoorStore } from './store/useDoorStore';
// import { roundToTwo } from './utils/math';

function DoorList() {
  const { doors, removeDoor, setEditingDoorId, moveDoor } = useDoorStore();

  if (doors.length === 0) return <p className="text-sm text-neutral-400">No hay productos todavía.</p>;

  return (
    <div className="space-y-3">
      {doors.map((door, index) => (
        <div key={door.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg group">
          <div className="w-12 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
            {door.images?.[0] ? (
              <img src={door.images[0]} alt={door.name} className="w-full h-full object-cover" draggable="false" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-300">N/A</div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-neutral-900">{door.name}</p>
            <p className="text-xs text-neutral-500">{door.model}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => moveDoor(door.id, 'up')}
              disabled={index === 0}
              className="p-2 text-neutral-400 hover:text-blue-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-neutral-400"
              title="Subir"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            </button>
            <button
              onClick={() => moveDoor(door.id, 'down')}
              disabled={index === doors.length - 1}
              className="p-2 text-neutral-400 hover:text-blue-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-neutral-400"
              title="Bajar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
            </button>
            <button
              onClick={() => setEditingDoorId(door.id)}
              className="p-2 text-neutral-400 hover:text-blue-500 transition-colors"
              title="Editar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
            <button
              onClick={() => removeDoor(door.id)}
              className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
              title="Borrar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ClientInfoEditor() {
  const { clientInfo, setClientInfo } = useDoorStore();

  const handleChange = (field: keyof typeof clientInfo, value: string) => {
    setClientInfo({ ...clientInfo, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
      <h3 className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">Configuración del Documento</h3>

      {/* Company Section */}
      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 border-b border-blue-50 pb-1">Tu Empresa</h4>
      <div className="mb-6">
        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Nombre de la Empresa (Cabecera)</label>
        <input
          type="text"
          className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          placeholder="Ej. Tu Empresa S.L."
          value={clientInfo.companyName || ''}
          onChange={(e) => handleChange('companyName', e.target.value)}
        />
      </div>

      {/* Customer Section */}
      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 border-b border-blue-50 pb-1">Datos del Cliente</h4>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Nombre del Cliente / Empresa</label>
          <input
            type="text"
            className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Ej. Juan Pérez / Empresa S.A."
            value={clientInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Dirección de Entrega / Instalación</label>
          <input
            type="text"
            className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Ej. Calle Mayor 123, Madrid"
            value={clientInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Teléfono de Contacto</label>
          <input
            type="text"
            className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Ej. 600 000 000"
            value={clientInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>

      {/* Validity Terms Section */}
      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 border-b border-blue-50 pb-1">Términos del Presupuesto</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Texto Validez</label>
          <input
            type="text"
            className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Ej. 15 días naturales"
            value={clientInfo.validityText || ''}
            onChange={(e) => handleChange('validityText', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Texto Instalación</label>
          <input
            type="text"
            className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Ej. No incluida (salvo indicación)"
            value={clientInfo.installationText || ''}
            onChange={(e) => handleChange('installationText', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Texto Impuestos</label>
          <input
            type="text"
            className="w-full p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            placeholder="Ej. IVA 21% Desglosado"
            value={clientInfo.taxText || ''}
            onChange={(e) => handleChange('taxText', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function GeneralNotesEditor() {
  const { generalNotes, setGeneralNotes } = useDoorStore();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
      <h3 className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">Notas Generales (Persistentes)</h3>
      <textarea
        className="w-full h-32 p-3 bg-neutral-50 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
        placeholder="Escribe aquí las notas que aparecerán al final del presupuesto..."
        value={generalNotes}
        onChange={(e) => setGeneralNotes(e.target.value)}
      />
    </div>
  )
}


function App() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8 print:p-0 print:bg-white print:min-h-0">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-3xl font-bold text-neutral-900">
          Generador de Catálogo de Productos
        </h1>
        <button
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
              useDoorStore.getState().resetAll();
            }
          }}
          className="group flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <span className="group-hover:translate-x-1 transition-transform">🗑️</span>
          Borrar Todo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block">
        {/* Input Form */}
        <div className="space-y-6 print:hidden">
          <ClientInfoEditor />
          <DoorInputForm />
          <GeneralNotesEditor />

          {/* List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
            <h3 className="text-sm font-medium text-neutral-500 mb-4 uppercase tracking-wider">Productos Añadidos</h3>
            <DoorList />
          </div>
        </div>

        {/* Document Preview */}
        <div className="print:w-full">
          <DocumentPreview />
        </div>
      </div>
    </div>
  )
}

export default App
