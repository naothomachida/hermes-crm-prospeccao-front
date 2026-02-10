import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { PrimaryButton, Label } from '../components/ui/Base';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#1e1e2d] font-sans flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo Section Centralizada */}
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center font-black text-[#1e1e2d] text-5xl italic shadow-[0_0_40px_rgba(255,215,0,0.1)] mb-6 border-4 border-white/10"
          >
            p
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em] leading-none mb-2">Prospecção BSIT</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Business Solutions Intelligence</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 border border-white/5">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-400">Usuário ou E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="email" 
                  placeholder="E-MAIL CORPORATIVO"
                  className="w-full bg-slate-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 text-[11px] font-black outline-none focus:border-indigo-500 transition-all uppercase placeholder:text-slate-300 text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 text-[11px] font-black outline-none focus:border-indigo-500 transition-all placeholder:text-slate-300 text-slate-700"
                />
              </div>
            </div>

            <div className="pt-2">
              <PrimaryButton 
                className="w-full justify-center py-5 rounded-2xl text-[11px] shadow-indigo-500/20"
                icon={loading ? undefined : ArrowRight}
              >
                {loading ? 'AUTENTICANDO...' : 'ENTRAR NO SISTEMA'}
              </PrimaryButton>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
            © 2026 Business Solutions · v2.4.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};
