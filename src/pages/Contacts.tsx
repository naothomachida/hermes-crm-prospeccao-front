import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2 } from 'lucide-react';

interface ContactsPageProps {
  contacts: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string, type: string) => void;
  onDuplicate: (item: any, type: string) => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ contacts, onEdit, onDelete, onDuplicate }) => {
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
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Nome / Cargo</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Empresa</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Contato</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts.length > 0 ? contacts.map(c => (
              <tr key={c.id} onClick={() => onEdit(c)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{c.name}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{c.role || 'Sem Cargo'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{c.company || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Mail size={10} className="text-indigo-400" /> {c.email || 'N/A'}
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Phone size={10} className="text-indigo-400" /> {c.phone || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(c); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                      <span className="text-[9px] font-black">EDITAR</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(c.id, 'contacts'); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                      <span className="text-[9px] font-black">EXCLUIR</span>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-8 py-12 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">Nenhuma pessoa cadastrada</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};
