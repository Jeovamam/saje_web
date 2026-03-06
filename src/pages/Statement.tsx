import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import BottomNav from '../components/BottomNav';

// 1. DEFINIÇÃO DOS ÍCONES (O que estava faltando e quebrou a página)
const CATEGORY_ICONS: { [key: string]: string } = {
  aluguel: 'home',
  mercado: 'shopping_cart',
  saude: 'medical_services',
  vestuario: 'apparel',
  transporte: 'directions_car',
  lazer: 'celebration',
  alimentacao: 'restaurant',
  agua: 'water_drop',
  energia: 'bolt',
  salario: 'payments',
  outros: 'sell'
};

export default function Statement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());

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

          // 🧮 LÓGICA DE SALDO: Receita (+) e Despesa (-)
          const totals = (data as any[]).reduce((acc, t) => {
            if (t.transaction_type === 'income') {
              acc.income += t.amount;
              acc.balance += t.amount;
            } else {
              acc.expense += Math.abs(t.amount);
              acc.balance += t.amount; // Despesa já vem negativa do banco
            }
            return acc;
          }, { balance: 0, income: 0, expense: 0 });

          setTransactions(data || []);
          setSummary(totals);
        }
      } catch (err) {
        console.error("Erro ao carregar extrato:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDate]);

  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = filteredTransactions.reduce((acc: any, t) => {
    const categoryKey = (t.category || 'Outros').toLowerCase();
    if (!acc[categoryKey]) {
      acc[categoryKey] = { total: 0, icon: CATEGORY_ICONS[categoryKey] || 'sell', items: [] };
    }
    acc[categoryKey].total += t.amount;
    acc[categoryKey].items.push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-main text-slate-100 font-display flex justify-center no-scrollbar overflow-y-auto pb-24">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-transparent border-x border-white/5">
        
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

          <div className="flex gap-8 overflow-x-auto no-scrollbar border-b border-white/5">
            {getTabs().map((tab) => {
              const isActive = tab.date.getMonth() === selectedDate.getMonth();
              return (
                <button 
                  key={tab.label} 
                  onClick={() => setSelectedDate(tab.date)}
                  className={`pb-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${isActive ? 'text-primary border-b-2 border-primary' : 'text-slate-600'}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        <main className="p-6 space-y-8">
          {/* Card de Resumo Financeiro Real */}
          <div className="saje-card rounded-[32px] p-8 text-center border-primary/20 bg-primary/[0.02] shadow-neon-soft">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Saldo em {selectedDate.toLocaleDateString('pt-BR', { month: 'long' })}</p>
            <h2 className={`text-4xl font-black ${summary.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
              R$ {summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
              <div className="text-left">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Receitas</p>
                <p className="text-sm font-black text-primary">+ R$ {summary.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Despesas</p>
                <p className="text-sm font-black text-red-400">- R$ {summary.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          {/* Listagem de Itens */}
          <div className="space-y-10">
            {Object.entries(grouped).length === 0 ? (
              <div className="py-20 text-center text-slate-600 font-bold uppercase text-xs tracking-widest">Sem lançamentos</div>
            ) : (
              Object.entries(grouped).map(([name, data]: any) => (
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
                          <span className={item.paid_by === 'me' ? "text-blue-400" : "text-purple-400"}> {item.paid_by === 'me' ? 'EU' : 'SAVIAYA'}</span>
                        </p>
                      </div>
                      <span className={`text-xs font-bold ${item.transaction_type === 'income' ? 'text-primary' : 'text-red-400'}`}>
                        {item.transaction_type === 'income' ? '+' : '-'} R$ {Math.abs(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </main>
<BottomNav />
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass border-t border-white/10 px-8 py-4 flex justify-between items-center z-50 rounded-t-[32px]">
          <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-all"><span className="material-symbols-outlined">home</span><span className="text-[8px] font-black uppercase">Home</span></button>
          <button onClick={() => navigate('/statement')} className="flex flex-col items-center gap-1 text-primary transition-all"><span className="material-symbols-outlined">receipt_long</span><span className="text-[8px] font-black uppercase">Extrato</span></button>
          <button onClick={() => navigate('/new-transaction')} className="size-12 bg-primary text-background-dark rounded-full flex items-center justify-center shadow-neon-strong -translate-y-6 border-4 border-background-dark active:scale-90 transition-all"><span className="material-symbols-outlined font-black">add</span></button>
          <button onClick={() => navigate('/insights')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-all"><span className="material-symbols-outlined">equalizer</span><span className="text-[8px] font-black uppercase">Insights</span></button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-all"><span className="material-symbols-outlined">person</span><span className="text-[8px] font-black uppercase">Perfil</span></button>
        </nav>
      </div>
    </div>
  );
}