import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { HealthScore } from '../components/HealthScore';
import { MetricCard } from '../components/MetricCard';
import TransactionModal from '../components/TransactionModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data] = useState({
    balance: 7701.25,
    healthScore: 84,
    expenses: 680.50,
    projection: 5240.00
  });

  // Função permanente de Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Erro ao sair: " + error.message);
    }
    // O App.tsx detectará a mudança de sessão e redirecionará para /login automaticamente
  };

  useEffect(() => {
    async function loadDashboardData() {
      console.log("Saje: Pronto para integração.");
    }
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen pb-32 px-6 bg-background-dark max-w-md mx-auto relative">
      {/* Header com Logout Permanente */}
      <header className="py-6 flex items-center justify-between sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center neon-glow">
            <span className="material-icons-round text-slate-900 text-3xl font-bold">attach_money</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Saje</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Inteligência Conjugal</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Botão de Logout */}
          <button 
            onClick={handleLogout}
            className="w-11 h-11 rounded-2xl flex items-center justify-center bg-surface-dark border border-slate-700 hover:border-red-500/50 transition-colors group"
            title="Sair do Saje"
          >
            <span className="material-icons-round text-slate-300 group-hover:text-red-500 transition-colors">logout</span>
          </button>
          <button className="w-11 h-11 rounded-2xl flex items-center justify-center bg-surface-dark border border-slate-700">
            <span className="material-icons-round text-slate-300 text-xl">settings</span>
          </button>
        </div>
      </header>

      <main className="space-y-10">
        <section className="flex flex-col items-center justify-center pt-4">
          <HealthScore score={data.healthScore} />
        </section>

        <section className="text-center">
          <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">Saldo Consolidado</h2>
          <div className="text-5xl font-extrabold tracking-tight">
            <span className="text-3xl font-bold opacity-60">R$</span> {data.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <MetricCard 
            title="Gastos do Mês" 
            value={`R$ ${data.expenses.toLocaleString('pt-BR')}`} 
            variation="-12%" 
            isNegative={true}
            icon="south_west"
          />
          <MetricCard 
            title="Projeção Final" 
            value={`R$ ${data.projection.toLocaleString('pt-BR')}`} 
            variation="+5%" 
            icon="north_east"
          />
        </section>

        <section className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6">
          <div className="flex gap-4">
            <div className="mt-1">
              <span className="material-icons-round text-primary">auto_awesome</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary mb-2">Análise das Transações</h4>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "Sua renda total este mês superou o esperado. Ótimo momento para investir o excedente em sua meta de viagem."
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Navegação Inferior */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 glass-nav rounded-[2.5rem] flex items-center justify-between px-10 shadow-2xl z-50">
        <button className="text-slate-400 hover:text-primary transition-colors">
          <span className="material-icons-round text-2xl">account_balance_wallet</span>
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 -top-10">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-neon-strong hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-icons-round text-slate-900 text-4xl font-bold">add</span>
          </button>
        </div>

        <button className="text-slate-400 hover:text-primary transition-colors">
          <span className="material-icons-round text-2xl">group</span>
        </button>
      </nav>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}