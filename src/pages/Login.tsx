import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { PrimaryButton, Label } from '../components/ui/Base';
import { ProspectLogo } from '../components/ui/ProspectLogo';

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
    <div className="min-h-screen font-sans flex flex-col md:flex-row overflow-hidden bg-white">
      {/* Left Side: Logo & Branding */}
      <div className="md:flex-1 bg-black flex flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bs-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center"
        >
          <ProspectLogo size="xl" className="mb-8" />
          <div className="text-center">
            <h1 className="text-5xl font-black text-white uppercase tracking-[0.5em] leading-none mb-4">PROSPECT</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] opacity-60">Business Solutions Intelligence</p>
          </div>
        </motion.div>

        {/* Decorative Element */}
        <div className="absolute bottom-10 left-10 opacity-20">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
            © 2026 Business Solutions · v2.4.0
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Acessar Plataforma</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Insira suas credenciais corporativas abaixo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-500">Usuário ou E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  placeholder="ex: gabriel@bsit.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-12 pr-4 py-5 text-[11px] font-black outline-none focus:border-bs-primary focus:ring-4 focus:ring-bs-primary/5 transition-all uppercase placeholder:text-slate-300 text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-500">Senha de Acesso</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-12 pr-4 py-5 text-[11px] font-black outline-none focus:border-bs-primary focus:ring-4 focus:ring-bs-primary/5 transition-all placeholder:text-slate-300 text-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-black focus:ring-0" />
                <span className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-slate-600 transition-colors">Lembrar acesso</span>
              </label>
              <button type="button" className="text-[10px] font-black text-slate-400 uppercase hover:text-black transition-colors">Esqueceu a senha?</button>
            </div>

            <div className="pt-4">
              <PrimaryButton 
                type="submit"
                className="w-full justify-center py-6 rounded-lg bg-black hover:bg-slate-900 border-none shadow-2xl shadow-black/10 text-xs tracking-[0.2em]"
                icon={loading ? undefined : ArrowRight}
              >
                {loading ? 'AUTENTICANDO...' : 'ENTRAR NO SISTEMA'}
              </PrimaryButton>
            </div>
          </form>

          {/* Mobile Footer (visible only on small screens) */}
          <div className="mt-12 text-center md:hidden">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
              © 2026 Business Solutions · v2.4.0
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
