import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();

  const [offset, setOffset] = useState(251.2); // Começa com o círculo vazio

  useEffect(() => {
    // Dispara a animação após o componente ser montado
    const timer = setTimeout(() => {
      setOffset(251.2 - (251.2 * 84) / 100); // 84% de preenchimento
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-main text-slate-100 font-display flex justify-center no-scrollbar overflow-y-auto pb-32">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-transparent border-x border-white/5">
        
        {/* Top Bar: Logo & Settings */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-background-dark shadow-neon-soft">
              <span className="material-symbols-outlined font-black">attach_money</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none">Saje</h1>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60">Inteligência Conjugal</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="size-10 glass rounded-xl flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
            <button className="size-10 glass rounded-xl flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
          </div>
        </header>

        {/* Financial Health Ring (O "84 Saúde" da imagem) */}
        <section className="flex flex-col items-center py-8">
          <div className="relative size-48">
            <svg className="size-full" viewBox="0 0 100 100">
              <circle 
                className="text-white/5" 
                strokeWidth="8" 
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
              />
              <circle 
                className="text-primary" 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                strokeDashoffset={offset} // Valor animado via estado
                strokeLinecap="round" // Pontas arredondadas preservadas
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
                style={{ 
                  transform: 'rotate(-90deg)', 
                  transformOrigin: '50% 50%',
                  filter: 'drop-shadow(0 0 6px rgba(13, 242, 13, 0.5))',
                  transition: 'stroke-dashoffset 1.8s ease-out' // Suavidade da animação
                }} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">84</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Saúde</span>
            </div>
          </div>
        </section>

        {/* Consolidated Balance */}
        <section className="text-center space-y-1 mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Saldo Consolidado</p>
          <h2 className="text-4xl font-black text-white">
            <span className="text-xl text-slate-500 mr-2 font-bold">R$</span>
            7.701,25
          </h2>
        </section>

        {/* Stats Grid: Gastos e Projeção */}
        <section className="grid grid-cols-2 gap-4 px-6 mb-6">
          <div className="saje-card p-5 rounded-3xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined text-sm">trending_down</span>
              </div>
              <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">-12%</span>
            </div>
            <div>
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Gastos do Mês</p>
              <p className="text-lg font-black">R$ 680,50</p>
            </div>
          </div>

          <div className="saje-card p-5 rounded-3xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-sm">trending_up</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+5%</span>
            </div>
            <div>
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Projeção Final</p>
              <p className="text-lg font-black">R$ 5.240</p>
            </div>
          </div>
        </section>

        {/* AI Analysis Box */}
        <section className="px-6 mb-10">
          <div className="saje-card p-6 rounded-[32px] border-primary/20 bg-primary/[0.02]">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-xl">temp_preferences_custom</span>
              <h3 className="text-xs font-black uppercase text-primary tracking-widest">Análise das Transações</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-medium italic">
              "Sua renda total este mês superou o esperado. Ótimo momento para investir o excedente em sua meta de viagem."
            </p>
          </div>
        </section>

        {/* 📱 Floating Bottom Navigation */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 glass border border-white/10 rounded-[40px] px-8 flex items-center justify-between z-50">
          <button onClick={() => navigate('/statement')} className="text-slate-500 hover:text-primary transition-all">
            <span className="material-symbols-outlined text-3xl">wallet</span>
          </button>

          {/* Central Add Button */}
          <button 
            onClick={() => navigate('/new-transaction')}
            className="size-16 bg-primary text-background-dark rounded-full flex items-center justify-center shadow-neon-strong -translate-y-8 border-[6px] border-background-dark active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined font-black text-3xl">add</span>
          </button>

          {/* 📍 Botão do Perfil (O ícone de duas pessoas da imagem) */}
          <button onClick={() => navigate('/profile')} className="text-slate-500 hover:text-primary transition-all">
            <span className="material-symbols-outlined text-3xl">group</span>
          </button>
        </nav>

      </div>
    </div>
  );
}