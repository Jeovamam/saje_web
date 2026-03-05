import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordSuccess() {
  const navigate = useNavigate();

  const handleOpenEmail = () => {
    // Tenta abrir o cliente de e-mail padrão
    window.location.href = "mailto:";
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display transition-colors duration-300">
      <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto border-x border-white/5 bg-background-dark overflow-hidden">
        
        {/* Header Section */}
        <header className="flex items-center p-4">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors text-slate-100"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1 text-center pr-10">
            <span className="text-primary font-bold text-xl tracking-tight neon-text">Saje</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 w-full">
          {/* Illustration/Icon Area */}
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative flex items-center justify-center bg-primary/10 border border-primary/20 size-32 rounded-3xl">
              <span className="material-symbols-outlined text-primary !text-[64px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48" }}>
                forward_to_inbox
              </span>
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-slate-100 text-3xl font-bold leading-tight text-center mb-4 font-display">
            E-mail enviado!
          </h1>
          <p className="text-slate-400 text-base font-normal leading-relaxed text-center mb-10">
            Confira sua caixa de entrada. Enviamos as instruções para você criar uma nova senha e voltar ao Saje.
          </p>

          {/* Actions */}
          <div className="w-full flex flex-col gap-4">
            <button 
              onClick={handleOpenEmail}
              className="w-full bg-primary hover:opacity-90 text-background-dark h-14 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Abrir meu E-mail</span>
              <span className="material-symbols-outlined text-xl">open_in_new</span>
            </button>
            
            <button 
              className="w-full h-14 rounded-xl font-medium text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1 active:opacity-70"
            >
              <span>Não recebeu?</span>
              <span className="text-primary font-bold">Reenviar e-mail</span>
            </button>
          </div>
        </main>

        {/* Footer Decoration */}
        <footer className="p-6">
          <div className="flex justify-center gap-2">
            <div className="h-1 w-8 rounded-full bg-primary"></div>
            <div className="h-1 w-1 rounded-full bg-primary/30"></div>
            <div className="h-1 w-1 rounded-full bg-primary/30"></div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-6 font-display uppercase tracking-widest">
            Financeira Inteligente • Saje
          </p>
        </footer>

      </div>
    </div>
  );
}