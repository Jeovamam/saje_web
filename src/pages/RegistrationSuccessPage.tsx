import { useNavigate } from 'react-router-dom';

export default function RegistrationSuccessPage() {
  const navigate = useNavigate();

  // Função para abrir o provedor de e-mail (comum em apps mobile)
  const handleOpenEmail = () => {
    window.location.href = "mailto:";
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary selection:text-slate-900">
      <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto border-x border-white/5 shadow-2xl bg-background-dark overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-between p-4 pt-6">
          <button 
            onClick={() => navigate('/login')} 
            className="text-slate-400 hover:text-white transition-colors p-2"
          >
            <span className="material-icons-round text-2xl">close</span>
          </button>
          <div className="flex-1 flex justify-center">
            <span className="text-primary font-black text-xl tracking-tight neon-text">Saje</span>
          </div>
          <div className="size-12"></div> {/* Spacer para centralizar o logo */}
        </header>

        {/* Conteúdo Principal */}
        <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          {/* Ícone de Sucesso com Brilho Neon */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full"></div>
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-4 border-primary bg-background-dark neon-glow">
              <span className="material-icons-round text-primary text-6xl">check_circle</span>
            </div>
          </div>

          <h1 className="text-slate-100 tracking-tight text-3xl font-black leading-tight mb-4">
            Cadastro realizado!
          </h1>
          
          <p className="text-slate-400 text-base font-medium leading-relaxed mb-10 max-w-xs">
            Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada (e a de spam) para ativar sua conta.
          </p>

          <div className="w-full flex flex-col gap-6">
            <button 
              onClick={handleOpenEmail}
              className="w-full bg-primary text-background-dark font-black h-14 rounded-2xl shadow-neon-strong active:scale-95 hover:scale-[1.02] transition-all flex items-center justify-center text-lg uppercase tracking-tight"
            >
              Abrir meu E-mail
            </button>

            <div className="flex flex-col items-center gap-2">
              <p className="text-slate-500 text-sm font-medium">
                Não recebeu o e-mail?
              </p>
              <button className="text-primary font-bold text-sm hover:underline active:opacity-70 transition-all">
                Reenviar código
              </button>
            </div>
          </div>
        </main>

        {/* Footer com Dots de Progresso */}
        <footer className="pb-4 flex flex-col items-center">
          <div className="flex gap-2 items-center opacity-40 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          </div>
          
          {/* Home Indicator Bar */}
          <div className="w-32 h-1.5 bg-white/10 rounded-full mb-2"></div>
        </footer>
      </div>
    </div>
  );
}