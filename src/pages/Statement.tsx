import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Statement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gradient-main text-slate-100 font-display flex justify-center no-scrollbar overflow-y-auto pb-24">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-transparent border-x border-white/5">
        
        {/* Header com Busca (Conforme seu protótipo) */}
        <header className="p-6 space-y-6 sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight">Despesas</h1>
            <button onClick={() => navigate('/new-transaction')} className="size-10 glass rounded-full flex items-center justify-center text-primary border-primary/20">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>

          {/* Campo de Busca Glass */}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Buscar despesas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all text-sm placeholder:text-slate-600"
            />
          </div>

          {/* Navegador de Meses */}
          <div className="flex gap-6 overflow-x-auto no-scrollbar py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <button className="opacity-40">Setembro 2023</button>
            <button className="text-primary border-b-2 border-primary pb-2">Outubro 2023</button>
            <button className="opacity-40">Novembro 2023</button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-8">
          {/* Card de Total Premium */}
          <div className="saje-card rounded-[32px] p-8 text-center animate-glow border-primary/10">
            <div className="flex items-center justify-center gap-2 mb-2 text-primary/60">
              <span className="material-symbols-outlined text-sm">payments</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total de Despesas</span>
            </div>
            <h2 className="text-4xl font-black text-white">R$ 4.500,00</h2>
            <div className="flex justify-center gap-4 mt-4 text-[9px] font-bold">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                <span className="text-slate-400">VOCÊ: R$ 2.000,00</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"></div>
                <span className="text-slate-400">JOTA: R$ 2.500,00</span>
              </div>
            </div>
          </div>

          {/* Lista de Gastos (Exemplo de Categoria) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 glass rounded-xl flex items-center justify-center text-orange-500 border-orange-500/20">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight">Alimentação</h3>
              </div>
              <span className="text-sm font-black">R$ 1.250,00</span>
            </div>
            
            <div className="pl-12 space-y-4 border-l border-white/5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-200">Supermercado Extra</p>
                  <p className="text-[9px] text-slate-500 uppercase font-black">12 Out • <span className="text-blue-400/60">EU</span></p>
                </div>
                <span className="text-xs font-bold text-red-400">- R$ 450,00</span>
              </div>
            </div>
          </section>
        </main>

        {/* 📱 MENU INFERIOR (Conforme Protótipo) */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass border-t border-white/10 px-8 py-4 flex justify-between items-center z-50 rounded-t-[32px]">
          <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[8px] font-black uppercase">Home</span>
          </button>
          <button onClick={() => navigate('/expenses')} className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[8px] font-black uppercase">Despesas</span>
          </button>
          <button onClick={() => navigate('/insights')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">equalizer</span>
            <span className="text-[8px] font-black uppercase">Insights</span>
          </button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[8px] font-black uppercase">Perfil</span>
          </button>
        </nav>

      </div>
    </div>
  );
}