import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

// ... (Interface e CATEGORY_ICONS permanecem iguais)

export default function Statement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // 🧮 Novo estado de sumário para separar as águas
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0, me: 0, partner: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ... (getTabs permanece igual)

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('profiles').select('household_id').eq('id', user?.id).single();

        if (profile?.household_id) {
          const year = selectedDate.getFullYear();
          const month = selectedDate.getMonth();
          const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
          const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('household_id', profile.household_id)
            .gte('transaction_date', firstDay)
            .lte('transaction_date', lastDay)
            .order('transaction_date', { ascending: false });

          if (error) throw error;

          // 🚀 CÁLCULO MATEMÁTICO CORRETO
          const totals = (data as any[]).reduce((acc, t) => {
            if (t.transaction_type === 'income') {
              acc.income += t.amount;
              acc.balance += t.amount;
            } else {
              acc.expense += Math.abs(t.amount);
              acc.balance += t.amount; // amount de despesa já é negativo no banco
            }

            // Separação por membro (opcional para o card de resumo)
            if (t.created_by === user?.id) acc.me += t.amount;
            else acc.partner += t.amount;

            return acc;
          }, { balance: 0, income: 0, expense: 0, me: 0, partner: 0 });

          setTransactions(data);
          setSummary(totals);
        }
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDate]);

  // 🔍 Filtro e Agrupamento (Apenas para DESPESAS na lista agrupada, ou Geral se preferir)
  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = filteredTransactions.reduce((acc: any, t) => {
    const categoryKey = (t.category || 'Outros').toLowerCase();
    if (!acc[categoryKey]) {
      acc[categoryKey] = { total: 0, icon: CATEGORY_ICONS[categoryKey] || 'sell', items: [] };
    }
    // Soma algébrica para o grupo refletir o real (Receita abate despesa no grupo)
    acc[categoryKey].total += t.amount;
    acc[categoryKey].items.push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-main text-slate-100 font-display flex justify-center no-scrollbar overflow-y-auto pb-24">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-transparent border-x border-white/5">
        
        {/* Header com Busca (Título dinâmico) */}
        <header className="p-6 space-y-6 sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight">Extrato</h1>
            <button onClick={() => setSelectedDate(new Date())} className="text-[10px] font-black uppercase text-primary border border-primary/20 px-3 py-1 rounded-lg">Hoje</button>
          </div>

          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Buscar lançamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all text-sm"
            />
          </div>

          {/* ... (Meses permanecem aqui) ... */}
        </header>

        <main className="p-6 space-y-8">
          {/* Card de Saldo Real */}
          <div className="saje-card rounded-[32px] p-8 text-center border-primary/20 bg-primary/[0.02] shadow-neon-soft">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Saldo do Mês</p>
            <h2 className={`text-4xl font-black ${summary.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
              R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
              <div className="text-left">
                <p className="text-[8px] font-black text-slate-500 uppercase">Receitas</p>
                <p className="text-sm font-black text-primary">+ R$ {summary.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-500 uppercase">Despesas</p>
                <p className="text-sm font-black text-red-400">- R$ {summary.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          {/* Lista de Transações Corrigida */}
          <div className="space-y-10">
            {Object.entries(grouped).map(([name, data]: any) => (
              <div key={name} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="size-10 glass rounded-xl flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{data.icon}</span>
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest">{name}</h3>
                  </div>
                  <span className={`text-sm font-black ${data.total >= 0 ? 'text-primary' : 'text-white'}`}>
                    R$ {Math.abs(data.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {data.items.map((item: any) => (
                  <div key={item.id} className="pl-12 flex justify-between items-center group">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{item.description}</p>
                      <p className="text-[9px] text-slate-500 font-black uppercase">
                        {new Date(item.transaction_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • 
                        <span className={item.paid_by === 'me' ? "text-blue-400" : "text-purple-400"}> {item.paid_by === 'me' ? 'EU' : 'JOTA'}</span>
                      </p>
                    </div>
                    <span className={`text-xs font-bold ${item.transaction_type === 'income' ? 'text-primary' : 'text-red-400'}`}>
                      {item.transaction_type === 'income' ? '+' : '-'} R$ {Math.abs(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>

        {/* ... (Nav permanece igual) ... */}
      </div>
    </div>
  );
}