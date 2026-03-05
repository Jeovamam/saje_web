import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { full_name: formData.name } }
    });

    if (error) {
      alert("Erro ao cadastrar: " + error.message);
    } else {
      alert("Cadastro realizado! Verifique seu e-mail.");
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary selection:text-slate-900">
      <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto border-x border-white/10 shadow-2xl bg-background-dark overflow-hidden">
        
        {/* Header com Progresso */}
        <div className="p-6 pt-8">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-start -ml-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-icons-round">arrow_back_ios</span>
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">Passo 1 de 2</span>
              <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-primary neon-glow"></div>
              </div>
            </div>
            <div className="size-10"></div>
          </div>
        </div>

        {/* Título */}
        <div className="px-8 pt-4 pb-8">
          <h1 className="text-4xl font-black tracking-tight mb-2 leading-tight">
            Crie sua<br/><span className="text-primary neon-text">conta Saje</span>
          </h1>
          <p className="text-slate-400 text-sm">O primeiro passo para a inteligência financeira do casal.</p>
        </div>

        {/* Formuário */}
        <form onSubmit={handleRegister} className="px-8 flex-1 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Nome completo</label>
            <div className="relative group transition-transform duration-300 hover:scale-[1.01]">
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-slate-100 placeholder:text-slate-600 focus:border-primary/50 outline-none transition-all glass-nav" 
                placeholder="Seu nome e sobrenome" 
                type="text"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-xl">person</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">E-mail</label>
            <div className="relative group transition-transform duration-300 hover:scale-[1.01]">
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-slate-100 placeholder:text-slate-600 focus:border-primary/50 outline-none transition-all glass-nav" 
                placeholder="exemplo@email.com" 
                type="email"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <span className="material-icons-round absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-xl">mail</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Criar senha</label>
            <div className="relative group transition-transform duration-300 hover:scale-[1.01]">
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-slate-100 placeholder:text-slate-600 focus:border-primary/50 outline-none transition-all glass-nav" 
                placeholder="••••••••" 
                type="password"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-xl">lock</span>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input 
              required
              type="checkbox" 
              className="mt-1 size-5 rounded-md border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-background-dark" 
            />
            <label className="text-xs text-slate-400 leading-relaxed">
              Aceito os <span className="text-primary font-medium">termos de uso</span> e <span className="text-primary font-medium">política de privacidade</span> do Saje.
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl shadow-neon-strong active:scale-95 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-tight mt-4 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Próximo"}
            <span className="material-icons-round font-bold">arrow_forward</span>
          </button>
        </form>

        {/* Footer */}
        <div className="p-8 text-center">
          <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">
            Já tenho uma conta. <span className="text-primary font-bold">Fazer login</span>
          </Link>
          <div className="flex justify-center pt-8">
            <div className="w-32 h-1.5 bg-white/10 rounded-full"></div>
          </div>
        </div>

        {/* Efeitos de Fundo (Blur) */}
        <div className="fixed top-0 right-0 -z-10 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-0 left-0 -z-10 w-48 h-48 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      </div>
    </div>
  );
}