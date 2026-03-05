import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, CheckCircle2, Calendar } from 'lucide-react';
import { IconBadge, ViewBadge } from './Base';
import { UserSelector } from './UserSelector';

interface Lead {
  id: string; 
  name: string; 
  company: string; 
  views: number; 
  value: number;
  ownerId?: string;
}

export const KanbanCard = ({ 
  lead, 
  users = [], 
  onUpdateOwner 
}: { 
  lead: Lead, 
  users?: any[], 
  onUpdateOwner?: (uid: string) => void 
}) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer group hover:border-bs-primary transition-all"
  >
    <div className="flex justify-between items-start mb-3">
      <h4 className="text-[11px] font-black text-orange-600 group-hover:text-orange-700 uppercase tracking-tight leading-tight flex-1 pr-4">
        {lead.name}
      </h4>
      <div className="flex gap-1 shrink-0">
        <IconBadge icon={CheckCircle2} colorClass="bg-green-50 text-green-600" />
        <IconBadge icon={Calendar} colorClass="bg-orange-50 text-orange-600" />
      </div>
    </div>
    
    <div className="mb-4">
      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{lead.company}</p>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{lead.name}</p>
      <p className="text-sm font-black text-slate-800 mt-2">R$ {lead.value.toLocaleString()}</p>
    </div>

    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
      <ViewBadge count={lead.views} />
      {onUpdateOwner ? (
        <UserSelector 
          users={users}
          selectedUserId={lead.ownerId}
          onSelect={onUpdateOwner}
          showName={false}
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-black text-slate-400">
          {users.find(u => u.id === lead.ownerId)?.name?.charAt(0) || 'NB'}
        </div>
      )}
    </div>
  </motion.div>
);

export const KanbanColumn = ({ stage, children }: { stage: any, children: React.ReactNode }) => (
  <div className="w-72 flex flex-col shrink-0 h-full">
    <div className={`mb-4 pb-2 border-t-2 ${stage.color} pt-2`}>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stage.name}</h3>
        <MoreVertical size={14} className="text-slate-300 cursor-pointer hover:text-slate-600" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] font-black text-slate-400">{stage.count}</span>
        <span className="text-xs font-black text-slate-400">·</span>
        <span className="text-[10px] font-black text-slate-800 tracking-tight">R$ {stage.total.toLocaleString()}</span>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar pb-20">
      {children}
    </div>
  </div>
);
