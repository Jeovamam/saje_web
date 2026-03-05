import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://sajeweb.netlify.app/reset-password',
  });

  if (error) {
    alert(error.message);
  } else {
    // 💡 Redireciona para a página de "E-mail enviado"
    navigate('/forgot-password-success');
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display transition-colors duration-300 selection:bg-primary selection:text-background-dark">
      <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto border-x border-white/5 bg-background-dark overflow-x-hidden">
        
        {/* Top Navigation */}
        <div className="flex items-center p-4 pb-2 justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-100 flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          
          <div className="flex-1 flex justify-center pr-12">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(63,249,6,0.3)]">
                <span className="material-symbols-outlined text-background-dark font-bold">account_balance_wallet</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-100">Saje</span>
            </div>
          </div>
        </div>

        <main className="flex-1 flex flex-col px-6 pt-8 w-full">
          {/* Illustration Area */}
          <div className="mb-8">
            <div className="w-full bg-primary/5 rounded-2xl border border-primary/10 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
              <span className="material-symbols-outlined text-primary text-7xl mb-4 drop-shadow-[0_0_10px_rgba(63,249,6,0.5)]">lock_reset</span>
              <div className="text-primary/60 text-sm font-medium uppercase tracking-widest">Segurança Saje</div>
            </div>
          </div>

          {/* Header Content */}
          <div className="text-center mb-10">
            <h1 className="text-slate-100 text-3xl font-bold leading-tight mb-3">Esqueci minha senha</h1>
            <p className="text-slate-400 text-base font-normal leading-relaxed">
              Não se preocupe, acontece com os melhores casais. Digite seu e-mail para recuperar sua conta.
            </p>
          </div>

          {/* Feedback Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-slate-300 text-sm font-semibold ml-1">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 rounded-xl border border-primary/20 bg-primary/5 text-slate-100 placeholder:text-primary/30 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                  placeholder="exemplo@saje.com.br"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-xl shadow-[0_8px_20px_rgba(63,249,6,0.25)] transition-all active:scale-[0.98] mt-2 disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-auto pb-10 text-center pt-8">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline decoration-2 underline-offset-4"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Voltar para o Login
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}