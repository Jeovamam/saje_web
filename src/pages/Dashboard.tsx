import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // 📊 ESTADOS FINANCEIROS
  const [balance, setBalance] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [healthScore, setHealthScore] = useState(0);
  const [offset, setOffset] = useState(251.2); // Controle do círculo

  useEffect(() => {
    async function fetchFinancialData() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('profiles').select('household_id').eq('id', user?.id).single();

        if (profile?.household_id) {
          // 1. Busca todas as transações para o Saldo Consolidado
          const { data: allTrans } = await supabase
            .from('transactions')
            .select('amount, transaction_type, transaction_date')
            .eq('household_id', profile.household_id);

          if (allTrans) {
            // Cálculo do Saldo (Soma algébrica: Receita(+) e Despesa(-))
            const totalBalance = allTrans.reduce((acc, t) => acc + t.amount, 0);
            setBalance(totalBalance);

            // Filtro para o Mês Atual
            const now = new Date();
            const currentMonth = allTrans.filter(t => {
              const d = new Date(t.transaction_date);
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });

            const expenses = currentMonth
              .filter(t => t.transaction_type === 'expense')
              .reduce((acc, t) => acc + Math.abs(t.amount), 0);
            
            const income = currentMonth
              .filter(t => t.transaction_type === 'income')
              .reduce((acc, t) => acc + t.amount, 0);

            setMonthlyExpenses(expenses);
            setMonthlyIncome(income);

            // Cálculo do Score (Regra: (1 - (Despesa/Receita)) * 100)
            const score = income > 0 ? Math.round((1 - (expenses / income)) * 100) : 0;
            const finalScore = Math.max(0, Math.min(100, score));
            setHealthScore(finalScore);
            
            // Dispara animação do círculo (timeout para garantir o render)
            setTimeout(() => {
              setOffset(251.2 - (251.2 * finalScore) / 100);
            }, 300);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFinancialData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-main text-slate-100 font-display flex justify-center no-scrollbar overflow-y-auto pb-32">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-transparent border-x border-white/5">
        
        {/* Header Superior */}
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
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
          </div>
        </header>

        {/* 🟢 Gráfico Circular de Saúde (Pontas Arredondadas + Animação) */}
        <section className="flex flex-col items-center py-8">
          <div className="relative size-48">
            <svg className="size-full" viewBox="0 0 100 100">
              <circle className="text-white/5" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
              <circle 
                className="text-primary transition-all" 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                strokeDashoffset={offset}
                strokeLinecap="round" // 👈 Pontas Arredondadas
                stroke="currentColor" 
                fill="transparent" r="40" cx="50" cy="50" 
                style={{ 
                  transform: 'rotate(-90deg)', 
                  transformOrigin: '50% 50%', 
                  transition: 'stroke-dashoffset 2s ease-out',
                  filter: 'drop-shadow(0 0 8px rgba(13, 242, 13, 0.4))' // Brilho Neon
                }} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{healthScore}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Saúde</span>
            </div>
          </div>
        </section>

        {/* Saldo Consolidado */}
        <section className="text-center mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Saldo Consolidado</p>
          <h2 className="text-4xl font-black text-white">
            <span className="text-xl text-slate-500 mr-2 font-bold">R$</span>
            {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
        </section>

        {/* Grade de Estatísticas Dinâmicas */}
        <section className="grid grid-cols-2 gap-4 px-6 mb-6">
          <div className="saje-card p-5 rounded-3xl space-y-4 border border-white/5">
            <div className="flex justify-between items-start">
              <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined text-sm">trending_down</span>
              </div>
            </div>
            <div>
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Gastos do Mês</p>
              <p className="text-lg font-black text-red-400">R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="saje-card p-5 rounded-3xl space-y-4 border border-white/5">
            <div className="flex justify-between items-start">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-sm">trending_up</span>
              </div>
            </div>
            <div>
              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Renda do Mês</p>
              <p className="text-lg font-black text-primary">R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </section>

        {/* Caixa de Análise IA */}
        <section className="px-6 mb-10">
          <div className="saje-card p-6 rounded-[32px] border-primary/20 bg-primary/[0.02]">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-xl">temp_preferences_custom</span>
              <h3 className="text-xs font-black uppercase text-primary tracking-widest">Análise do Lar</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-medium italic">
              {healthScore > 70 
                ? "Sua saúde financeira está excelente! Momento ideal para planejar aquele investimento com a Saviaya." 
                : "Atenção aos gastos variáveis. Que tal revisarem as metas do mês juntos?"}
            </p>
          </div>
        </section>

        {/* 📱 Navegação Flutuante (Bottom Nav) */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 glass border border-white/10 rounded-[40px] px-8 flex items-center justify-between z-50">
          <button onClick={() => navigate('/statement')} className="text-slate-500 hover:text-primary transition-all">
            <span className="material-symbols-outlined text-3xl">wallet</span>
          </button>

          <button 
            onClick={() => navigate('/new-transaction')}
            className="size-16 bg-primary text-background-dark rounded-full flex items-center justify-center shadow-neon-strong -translate-y-8 border-[6px] border-background-dark active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined font-black text-3xl">add</span>
          </button>

          {/* 📍 Botão do Perfil (Conecta com a Saviaya) */}
          <button onClick={() => navigate('/profile')} className="text-slate-500 hover:text-primary transition-all">
            <span className="material-symbols-outlined text-3xl">group</span>
          </button>
        </nav>

      </div>
    </div>
  );
}