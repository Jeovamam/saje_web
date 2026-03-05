import { useNavigate } from 'react-router-dom';

export default function TransactionSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex justify-center overflow-hidden">
      {/* CAMADA DE FUNDO (SIMULANDO A TELA DE TRANSAÇÃO DESFOCADA) 
          Usamos blur-md e grayscale para dar profundidade
      */}
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col opacity-40 blur-md grayscale-[0.2] pointer-events-none">
        <header className="flex items-center p-4 pb-2 justify-between">
          <span className="material-symbols-outlined text-2xl">close</span>
          <h2 className="text-lg font-bold flex-1 text-center">Nova Transação</h2>
          <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
        </header>

        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-primary/40 text-xs font-bold uppercase tracking-widest mb-1">Valor Total</span>
          <h1 className="text-primary/40 text-5xl font-extrabold tracking-tight">R$ 42,90</h1>
        </div>

        <div className="px-6 space-y-8">
           <div className="h-14 w-full bg-white/5 rounded-2xl"></div>
           <div className="h-14 w-full bg-white/5 rounded-2xl"></div>
           <div className="h-32 w-full bg-white/5 rounded-2xl"></div>
        </div>
      </div>

      {/* OVERLAY TRANSLÚCIDO (O EFEITO QUE VOCÊ QUER) 
          backdrop-blur-md faz o desfoque em tempo real do conteúdo atrás
      */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-dark/80 backdrop-blur-md max-w-md mx-auto w-full">
        
        {/* Círculo de Sucesso com Animação de Pulso */}
        <div className="relative flex items-center justify-center mb-10">
          <div className="absolute size-32 rounded-full bg-primary/20 animate-ping opacity-75"></div>
          <div className="relative size-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(63,249,6,0.4)]">
            <span className="material-symbols-outlined text-background-dark text-5xl font-black">check</span>
          </div>
        </div>

        {/* Texto de Feedback */}
        <div className="text-center px-8 space-y-2">
          <h2 className="text-primary text-3xl font-extrabold tracking-tight neon-text">Transação Salva!</h2>
          <p className="text-slate-400 text-sm font-medium">Sua saúde financeira agradece.</p>
        </div>

        {/* Ações Inferiores */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 flex flex-col gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary hover:brightness-110 active:scale-[0.98] text-background-dark font-extrabold py-4 rounded-2xl shadow-[0_8px_30px_rgba(63,249,6,0.3)] transition-all flex items-center justify-center gap-2"
          >
            Ir para o Extrato
            <span className="material-symbols-outlined text-xl">receipt_long</span>
          </button>
          
          <button 
            onClick={() => navigate('/new-transaction')}
            className="w-full bg-transparent hover:bg-white/5 text-slate-100 font-bold py-3 rounded-xl transition-all flex items-center justify-center"
          >
            Adicionar outra
          </button>
        </div>
        
        {/* Indicador de Home para iPhone */}
        <div className="h-2 w-32 bg-white/10 rounded-full absolute bottom-4 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
}