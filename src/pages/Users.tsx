import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, UserCheck, Trash2, Edit3, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Title, Label } from '../components/ui/Base';

interface UsersPageProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (id: string, type: string) => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ users, onEdit, onDelete }) => {
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
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Membro da Equipe</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">E-mail</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Cargo / Nível</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length > 0 ? users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={u.avatar} 
                        alt={u.name} 
                        className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{u.name}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">ID: {u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest lowercase">
                    <Mail size={12} className="text-slate-300" />
                    {u.email}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    u.role === 'Administrador' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {u.role === 'Administrador' ? <ShieldCheck size={10} /> : <User size={10} />}
                    {u.role}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Ativo</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => onDelete(u.id, 'users')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-8 py-12 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">Nenhum membro cadastrado</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Info Card */}
      <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h3 className="text-lg font-black uppercase tracking-tight mb-2">Gestão de Acessos</h3>
          <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest leading-relaxed max-w-md">
            Como administrador, você pode gerenciar as permissões e níveis de visibilidade de cada membro da sua equipe comercial.
          </p>
        </div>
        <Shield size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
      </div>
    </div>
  );
};
