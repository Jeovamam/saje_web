import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, Link } from 'react-router-dom'; // Adicionado o Link aqui

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Erro ao entrar: " + error.message);
    } else {
      navigate('/dashboard'); // Ajustado para ir para a rota certa
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-sans selection:bg-primary selection:text-slate-900">
      <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto border-x border-white/5 shadow-2xl bg-background-dark px-8">
        
        {/* Header/Logo */}
        <div className="pt-20 pb-12 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2 group transition-transform duration-500 hover:scale-105">
            <div className="size-12 bg-primary rounded-2xl flex items-center justify-center neon-glow">
              <span className="material-icons-round text-slate-900 text-3xl font-bold">account_balance_wallet</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter neon-text">Saje</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Inteligência financeira para casais</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">E-MAIL</label>
            <input 
              required
              className="w-full glass-nav bg-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:border-primary/50 transition-all outline-none border border-white/10" 
              placeholder="seu@email.com" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-1">SENHA</label>
            <div className="relative">
              <input 
                required
                className="w-full glass-nav bg-white/5 rounded-2xl py-4 px-5 text-white placeholder:text-slate-600 focus:border-primary/50 transition-all outline-none border border-white/10" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <span className="material-icons-round text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-end -mt-2">
            <a className="text-xs text-slate-500 hover:text-primary transition-colors font-medium" href="#">Esqueci minha senha</a>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background-dark font-black py-4 rounded-2xl shadow-neon-strong active:scale-95 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-tight mt-4 disabled:opacity-50"
          >
            {loading ? "Processando..." : "Entrar"}
          </button>
        </form>

        {/* Divisor Social */}
        <div className="mt-12">
          <div className="relative flex items-center justify-center mb-8">
            <div className="w-full border-t border-white/5"></div>
            <span className="absolute bg-background-dark px-4 text-[10px] uppercase font-bold tracking-widest text-slate-600">Ou continue com</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl py-3.5 hover:bg-white/10 transition-all active:scale-[0.98]">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale opacity-70 group-hover:grayscale-0" alt="Google" />
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl py-3.5 hover:bg-white/10 transition-all active:scale-[0.98]">
              <span className="material-icons-round text-xl">apple</span>
              <span className="text-sm font-semibold">Apple</span>
            </button>
          </div>
        </div>

        {/* Footer Consolidado */}
        <div className="mt-auto pb-10 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Novo por aqui? 
            <Link to="/register" className="text-primary font-bold ml-1 hover:underline">
              Criar conta
            </Link>
          </p>
          {/* Home Indicator (PWA style) */}
          <div className="flex justify-center mt-8">
            <div className="w-32 h-1.5 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}