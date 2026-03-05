import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { XCircle } from 'lucide-react';

// 1. Tipografia Padronizada
export const Title = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <h2 className={`font-black uppercase tracking-tight text-slate-800 ${className}`}>{children}</h2>
);

export const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 ${className}`}>{children}</span>
);

// 2. Botões
export const PrimaryButton = ({ children, icon: Icon, onClick, className = "", type = "button" }: { children: React.ReactNode, icon?: LucideIcon, onClick?: () => void, className?: string, type?: "button" | "submit" | "reset" }) => (
  <button 
    type={type}
    onClick={onClick}
    className={`bg-indigo-600 text-white px-6 py-2 rounded-lg font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95 ${className}`}
  >
    {Icon && <Icon size={14} />}
    {children}
  </button>
);

export const CircularButton = ({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[10px] uppercase shadow-sm border transition-all active:scale-90 ${
      active 
        ? 'bg-bs-primary text-black border-bs-primary shadow-md shadow-yellow-500/20' 
        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
    }`}
  >
    {label}
  </button>
);

export const IconButton = ({ icon: Icon, active = false, onClick, badge }: { icon: LucideIcon, active?: boolean, onClick?: () => void, badge?: string | number }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-lg transition-all relative ${active ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
  >
    <Icon size={18} />
    {badge && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white">{badge}</span>
    )}
  </button>
);

// 3. Badges e Ícones de Card
export const IconBadge = ({ icon: Icon, colorClass = "bg-blue-50 text-blue-600" }: { icon: LucideIcon, colorClass?: string }) => (
  <div className={`p-1.5 rounded-lg ${colorClass}`}>
    <Icon size={12} />
  </div>
);

export const ViewBadge = ({ count }: { count: number }) => (
  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${count > 10 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
    Aberto {count}x
  </div>
);

// 4. Modal Reformulado como Drawer Lateral (Full Height, Canto Direito, Sem arredondamento)
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children, 
  footer,
  wide = false
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  subtitle?: string,
  children: React.ReactNode,
  footer?: React.ReactNode,
  wide?: boolean
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm">
        {/* Background Click Area */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-default"
        />

        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className={`bg-white w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} shadow-[-20px_0_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-full relative z-10`}
        >
          {/* Header Fixo */}
          <div className="bg-black p-8 text-white flex justify-between items-center shrink-0 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD700] flex items-center justify-center font-black text-black text-2xl italic shadow-[0_0_20px_rgba(255,215,0,0.2)]">p</div>
              <div>
                <Title className="text-sm text-white tracking-widest leading-none mb-1">{title}</Title>
                {subtitle && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-white">
              <XCircle size={24} />
            </button>
          </div>

          {/* Corpo com Scroll */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white">
            {children}
          </div>

          {/* Footer Fixo */}
          {footer && (
            <div className="p-8 border-t border-gray-100 bg-gray-50 shrink-0">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
