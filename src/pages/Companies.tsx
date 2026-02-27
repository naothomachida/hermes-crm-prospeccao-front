import React from 'react';
import { motion } from 'framer-motion';
import { Building2, User, MapPin, Mail, Phone } from 'lucide-react';

interface CompaniesPageProps {
  entities: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string, type: string) => void;
  onDuplicate: (item: any, type: string) => void;
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({ entities, onEdit, onDelete, onDuplicate }) => {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
      >
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Tipo / Nome</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Documento</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Contato</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Localização</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {entities.length > 0 ? entities.map(e => (
              <tr key={e.id} onClick={() => onEdit(e)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${e.type === 'PJ' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                      {e.type === 'PJ' ? <Building2 size={16} /> : <User size={16} />}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{e.name}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{e.type === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{e.document || 'N/A'}</td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Mail size={10} className="text-slate-300" /> {e.email || 'N/A'}
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Phone size={10} className="text-slate-300" /> {e.phone || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-slate-300" />
                    {e.city || 'N/A'}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(event) => { event.stopPropagation(); onEdit(e); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                      <span className="text-[9px] font-black">EDITAR</span>
                    </button>
                    <button onClick={(event) => { event.stopPropagation(); onDelete(e.id, 'entities'); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                      <span className="text-[9px] font-black">EXCLUIR</span>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">Nenhum registro encontrado</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};
