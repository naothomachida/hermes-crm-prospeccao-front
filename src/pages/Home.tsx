import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, Clock, Users, ChevronRight, Eye } from 'lucide-react';
import { Title, Label, IconBadge } from '../components/ui/Base';

const RECENT_ACTIVITIES = [
  { id: 1, type: 'won', text: 'Negócio fechado com TechPhone', time: 'Há 2 horas', value: 'R$ 580,00' },
  { id: 2, type: 'view', text: 'OPTIMUM visualizou a proposta 15x', time: 'Há 4 horas', hot: true },
  { id: 3, type: 'meeting', text: 'Reunião agendada: Inova S.A', time: 'Amanhã, 10:00' },
  { id: 4, type: 'new', text: 'Novo Prospect cadastrado: Global Logistics', time: 'Ontem' },
];

export const HomePage = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
    {/* Resumo de Métricas */}
    <div className="grid grid-cols-4 gap-6">
      {[
        { label: 'Pipeline Total', value: 'R$ 178.500', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Meta Mensal', value: '72%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Novos Leads', value: '24', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Visualizações', value: '148', icon: Eye, color: 'text-orange-600', bg: 'bg-orange-50' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <Label>{stat.label}</Label>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-12 gap-6">
      {/* Atividades Recentes */}
      <div className="col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-4 border-b border-gray-50 flex justify-between items-center">
          <Title className="text-sm">Atividades Recentes</Title>
          <button className="text-[10px] font-black text-orange-600 uppercase hover:underline flex items-center gap-1">Ver Tudo <ChevronRight size={12} /></button>
        </div>
        <div className="divide-y divide-gray-50">
          {RECENT_ACTIVITIES.map(activity => (
            <div key={activity.id} className="px-8 py-4 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${activity.hot ? 'bg-orange-500 animate-pulse' : 'bg-gray-200'}`} />
                <div>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{activity.text}</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{activity.time}</p>
                </div>
              </div>
              {activity.value && <span className="text-xs font-black text-green-600">{activity.value}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Convite / Próximos Passos */}
      <div className="col-span-5 bg-bs-secondary rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-black/10">
        <div className="relative z-10">
          <h3 className="text-xl font-black uppercase tracking-tight mb-2">Pronto para acelerar?</h3>
          <p className="text-gray-300 text-xs font-medium uppercase tracking-widest leading-relaxed mb-8 opacity-80">Você tem 8 leads com alta intenção de compra aguardando contato.</p>
          <button className="bg-bs-primary text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-white transition-all">Iniciar Prospecção</button>
        </div>
        <TrendingUp size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
      </div>
    </div>
  </motion.div>
);
