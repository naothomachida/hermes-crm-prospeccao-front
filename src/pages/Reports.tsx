import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, CheckCircle2, XCircle, Download, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Title, Label, IconButton } from '../components/ui/Base';

const DATA_PERFORMANCE = [
  { month: 'Jan', value: 45000 },
  { month: 'Fev', value: 52000 },
  { month: 'Mar', value: 48000 },
  { month: 'Abr', value: 61000 },
  { month: 'Mai', value: 55000 },
  { month: 'Jun', value: 67000 },
];

const DATA_CONVERSION = [
  { name: 'Ganhos', value: 12, color: '#10b981' },
  { name: 'Perdidos', value: 4, color: '#ef4444' },
  { name: 'Em Aberto', value: 20, color: '#6366f1' },
];

export const ReportsPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="flex justify-between items-center">
      <Title className="text-sm">Análise de Performance</Title>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-black text-slate-600 hover:bg-white uppercase tracking-widest"><Calendar size={14} /> Últimos 6 Meses</button>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-colors"><Download size={14} /> Exportar PDF</button>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <Label className="block mb-8">Faturamento Estimado (Pipeline)</Label>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA_PERFORMANCE}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8f9fa" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#2F4F4F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-4 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
        <Label className="block self-start mb-8">Taxa de Conversão</Label>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={DATA_CONVERSION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {DATA_CONVERSION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full space-y-3 mt-4">
          {DATA_CONVERSION.map(item => (
            <div key={item.name} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
              </div>
              <span className="text-[10px] font-black text-slate-900">{item.value} neg.</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);
