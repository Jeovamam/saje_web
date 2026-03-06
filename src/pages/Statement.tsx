import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paid_by: 'me' | 'partner' | 'shared';
  created_by: string;
}

const CATEGORY_ICONS: { [key: string]: string } = {
  aluguel: 'home',
  mercado: 'shopping_cart',
  saude: 'medical_services',
  vestuario: 'apparel',
  transporte: 'directions_car',
  lazer: 'celebration',
  alimentacao: 'restaurant',
};

export default function Statement() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ total: 0, me: 0, partner: 0 });
  
  // 📅 ESTADO DO MÊS: Inicializa com o mês atual
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Gera os 3 meses para as abas (Anterior, Atual, Próximo) baseado na data selecionada
  const getTabs = () => {
    return [-1, 0, 1].map(offset => {
      const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1);
      return {
        label: d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        date: d
      };
    });
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('profiles').select('household_id').eq('id', user?.id).single();

        if (profile?.household_id) {
          // Calcula o primeiro e último dia do mês selecionado
          const year = selectedDate.getFullYear();
          const month = selectedDate.getMonth();
          const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
          const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('household_id', profile.household_id)
            .gte('date', firstDay)
            .lte('date', lastDay)
            .order('date', { ascending: false });

          if (error) throw error;

          const typedData = data as Transaction[];
          setTransactions(typedData);

          const totals = typedData.reduce((acc, t) => {
            const val = Math.abs(t.amount);
            acc.total += val;
            if (t.created_by === user?.id) acc.me += val;
            else acc.partner += val;
            return acc;
          }, { total: 0, me: 0, partner: 0 });

          setSummary(totals);
        }
      } catch (err) {
        console.error("Erro ao filtrar meses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDate]); // 🚀 Recarrega sempre que o mês mudar

  const grouped = transactions.reduce((acc: any, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { total: 0, icon: CATEGORY_ICONS[t.category] || 'sell', items: [] };
    }
    acc[t.category].total += Math.abs(t.amount);
    acc[t.category].items.push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex flex-col pb-24">
      
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-6 pt-8 pb-4 border-b border-primary/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight">Despesas</h2>
          <div className="flex gap-2">
             {/* Botão de Hoje para resetar rápido */}
             <button onClick={() => setSelectedDate(new Date())} className="text-[10px] font-black uppercase text-primary border border-primary/20 px-3 py-1 rounded-lg">Hoje</button>
             <span className="material-symbols-outlined text-primary">more_horiz</span>
          </div>
        </div>

        {/* 📅 TABS DINÂMICAS: Agora elas funcionam! */}
        <div className="flex gap-8 overflow-x-auto no-scrollbar border-b border-white/5">
          {getTabs().map((tab) => {
            const isActive = tab.date.getMonth() === selectedDate.getMonth() && tab.date.getFullYear() === selectedDate.getFullYear();
            return (
              <button 
                key={tab.label} 
                onClick={() => setSelectedDate(tab.date)}
                className={`pb-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${isActive ? 'text-primary border-b-2 border-primary' : 'text-slate-600 hover:text-slate-400'}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Resumo com Loading State */}
      <div className="px-6 py-8">
        <div className={`transition-opacity duration-300 ${loading ? 'opacity-30' : 'opacity-100'}`}>
          <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8 flex flex-col items-center text-center shadow-neon-soft">
            <div className="flex items-center gap-2 text-primary/60 mb-2">
              <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total em {selectedDate.toLocaleDateString('pt-BR', { month: 'long' })}</span>
            </div>
            <h1 className="text-4xl font-black neon-text mb-4">
              R$ {summary.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h1>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-blue-400"></div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">VOCÊ: R$ {summary.me.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-purple-400"></div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">JOTA: R$ {summary.partner.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className={`px-6 space-y-10 transition-all ${loading ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
        {Object.keys(grouped).length === 0 ? (
          <div className="py-20 text-center text-slate-600 font-bold uppercase text-xs tracking-widest">Nenhuma despesa neste mês</div>
        ) : (
          Object.entries(grouped).map(([categoryName, data]: any) => (
            <div key={categoryName} className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-primary border border-white/10">
                    <span className="material-symbols-outlined text-xl">{data.icon}</span>
                  </div>
                  <h3 className="font-black uppercase text-xs tracking-widest">{categoryName}</h3>
                </div>
                <span className="font-black text-sm">R$ {data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              {/* ... Itens de transação repetem a lógica anterior ... */}
            </div>
          ))
        )}
      </div>

      {/* Navegação Inferior ... */}
    </div>
  );
}