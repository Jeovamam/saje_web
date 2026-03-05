import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Erro ao atualizar: " + error.message);
    } else {
      navigate('/reset-password-success');
    }
    setLoading(false);
  };

  // Lógica simples de validação visual
  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasSpecial = /[0-9!@#$%^&*]/.test(password);

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 selection:bg-primary selection:text-background-dark">
      <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto border-x border-primary/10 shadow-2xl bg-background-dark overflow-x-hidden">
        
        {/* Top Navigation */}
        <div className="flex items-center p-4 pb-2 justify-between">
          <button 
            onClick={() => navigate('/login')}
            className="text-slate-100 flex size-12 shrink-0 items-center justify-start focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">Redefinir Senha</h2>
        </div>

        {/* Header Content */}
        <div className="px-6 pt-8 pb-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
            </div>
          </div>
          <h3 className="tracking-tight text-2xl font-bold leading-tight text-center pb-2">Definir Nova Senha</h3>
          <p className="text-slate-400 text-base font-normal leading-relaxed text-center">
            Escolha uma senha forte para manter as finanças do casal seguras.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6 px-6 py-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-bold">
              {error}
            </div>
          )}

          {/* New Password Input */}
          <div className="flex flex-col gap-2">
            <p className="text-slate-300 text-sm font-semibold tracking-wide">Nova Senha</p>
            <div className="flex w-full items-stretch rounded-xl overflow-hidden border border-primary/20 bg-primary/5 focus-within:ring-2 focus-within:ring-primary transition-all">
              <input 
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-100 h-14 px-4 text-base focus:ring-0 placeholder:text-primary/30" 
                placeholder="••••••••" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 text-primary/60 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Password Strength Meter */}
          <div className="flex flex-col gap-2 -mt-2">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary/40">Força da Senha</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Forte</p>
            </div>
            <div className="flex gap-1.5 h-1.5 w-full">
              <div className={`flex-1 rounded-full ${password.length > 0 ? 'bg-primary shadow-[0_0_8px_rgba(63,249,6,0.4)]' : 'bg-primary/10'}`}></div>
              <div className={`flex-1 rounded-full ${hasMinLength ? 'bg-primary shadow-[0_0_8px_rgba(63,249,6,0.4)]' : 'bg-primary/10'}`}></div>
              <div className={`flex-1 rounded-full ${hasMixedCase ? 'bg-primary shadow-[0_0_8px_rgba(63,249,6,0.4)]' : 'bg-primary/10'}`}></div>
              <div className={`flex-1 rounded-full ${hasSpecial ? 'bg-primary shadow-[0_0_8px_rgba(63,249,6,0.4)]' : 'bg-primary/10'}`}></div>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-2">
            <p className="text-slate-300 text-sm font-semibold tracking-wide">Confirmar Nova Senha</p>
            <div className="flex w-full items-stretch rounded-xl overflow-hidden border border-primary/20 bg-primary/5 focus-within:ring-2 focus-within:ring-primary transition-all">
              <input 
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-100 h-14 px-4 text-base focus:ring-0 placeholder:text-primary/30" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          {/* Security Requirements */}
          <div className="flex flex-col gap-3 py-2">
            <div className="flex items-center gap-3 text-sm">
              <span className={`material-symbols-outlined text-lg ${hasMinLength ? 'text-primary' : 'text-primary/20'}`}>
                {hasMinLength ? 'check_circle' : 'circle'}
              </span>
              <span className={hasMinLength ? 'text-slate-300' : 'text-slate-500'}>Pelo menos 8 caracteres</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className={`material-symbols-outlined text-lg ${hasMixedCase ? 'text-primary' : 'text-primary/20'}`}>
                {hasMixedCase ? 'check_circle' : 'circle'}
              </span>
              <span className={hasMixedCase ? 'text-slate-300' : 'text-slate-500'}>Letras maiúsculas e minúsculas</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className={`material-symbols-outlined text-lg ${hasSpecial ? 'text-primary' : 'text-primary/20'}`}>
                {hasSpecial ? 'check_circle' : 'circle'}
              </span>
              <span className={hasSpecial ? 'text-slate-300' : 'text-slate-500'}>Números e caracteres especiais</span>
            </div>
          </div>

          <div className="mt-auto pt-10">
            <button 
              type="submit"
              disabled={loading || !hasMinLength}
              className="w-full bg-primary text-background-dark font-bold text-lg h-16 rounded-xl shadow-[0_0_20px_rgba(63,249,6,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Redefinir Senha'}
              <span className="material-symbols-outlined font-bold">shield_lock</span>
            </button>
            <p className="text-primary/40 text-xs text-center mt-6 uppercase tracking-widest font-medium">Saje Secure Protocol 2.4</p>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-48 h-48 bg-primary/5 blur-[80px] pointer-events-none rounded-full"></div>
      </div>
    </div>
  );
}