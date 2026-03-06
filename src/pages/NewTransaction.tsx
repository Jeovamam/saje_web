import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'expense' | 'income';
  default_nature: 'fixed' | 'variable';
}

export default function NewTransaction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // 1. TODOS OS ESTADOS ORIGINAIS PRESERVADOS
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('0,00');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [nature, setNature] = useState<'fixed' | 'variable'>('variable');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState<'me' | 'partner' | 'shared'>('me');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'debit' | 'credit' | 'cash'>('pix');

  // 🔄 CARGA DINÂMICA
  useEffect(() => {
    async function fetchCategories() {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('household_id').eq('id', user?.id).single();
      
      if (profile?.household_id) {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('household_id', profile.household_id)
          .eq('type', type);
        
        const fetched = (data as Category[]) || [];
        setCategories(fetched);
        
        if (fetched.length > 0) {
          setCategoryName(fetched[0].name);
          setNature(fetched[0].default_nature);
        }
      }
    }
    fetchCategories();
  }, [type]);

  const onSelectCategory = (cat: Category) => {
    setCategoryName(cat.name);
    setNature(cat.default_nature); 
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = (Number(value) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('household_id').eq('id', user?.id).single();
      const numAmount = parseFloat(amount.replace(/\./g, "").replace(",", "."));

      const { error } = await supabase.from('transactions').insert([{
        description,
        amount: type === 'expense' ? -numAmount : numAmount,
        category: categoryName,
        expense_nature: nature,
        transaction_type: type,
        transaction_date: date,
        paid_by: paidBy,
        payment_method: paymentMethod,
        household_id: profile?.household_id,
        created_by: user?.id
      }]);

      if (error) throw error;
      navigate('/transaction-success');
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main text-slate-100 font-display flex justify-center no-scrollbar overflow-y-auto">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-transparent border-x border-white/5">
        
        <header className="flex items-center p-6 justify-between sticky top-0 z-50 glass">
          <button type="button" onClick={() => navigate(-1)} className="text-slate-400">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="text-lg font-bold tracking-tight">Nova Transação</h2>
          <button onClick={handleSubmit} disabled={loading} className="text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 pb-12 space-y-8 mt-4">
          
          <div className="flex h-12 w-full items-center rounded-2xl bg-white/5 p-1.5 border border-white/10">
            <button type="button" onClick={() => setType('expense')} className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase ${type === 'expense' ? 'bg-primary text-background-dark shadow-neon-strong' : 'text-slate-500'}`}>Despesa</button>
            <button type="button" onClick={() => setType('income')} className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase ${type === 'income' ? 'bg-primary text-background-dark shadow-neon-strong' : 'text-slate-500'}`}>Receita</button>
          </div>

          <div className="flex flex-col items-center justify-center py-8 saje-card rounded-[32px] animate-glow">
            <span className="text-primary/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Valor Total</span>
            <div className="flex items-center text-primary text-5xl font-black neon-text">
              <span className="text-2xl mr-2 opacity-60">R$</span>
              <input type="text" value={amount} onChange={handleAmountChange} className="bg-transparent border-none text-center focus:ring-0 w-full font-black p-0 outline-none" autoFocus />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Categoria</h3>
            <div className="flex w-full overflow-x-auto no-scrollbar gap-5 pb-2 min-h-[90px]">
              {categories.map((cat) => (
                <button key={cat.id} type="button" onClick={() => onSelectCategory(cat)} className={`flex flex-col items-center gap-2 shrink-0 transition-all ${categoryName === cat.name ? 'scale-110 opacity-100' : 'opacity-40'}`}>
                  <div className={`size-14 flex items-center justify-center rounded-2xl border-2 transition-all ${categoryName === cat.name ? 'bg-primary text-background-dark border-primary shadow-neon-strong' : 'glass border-white/10 text-primary'}`}>
                    <span className="material-symbols-outlined">{cat.icon}</span>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-tighter">{cat.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500">Natureza</label>
                <div className="flex h-11 bg-white/5 rounded-xl p-1 border border-white/10">
                  <button type="button" onClick={() => setNature('variable')} className={`flex-1 rounded-lg text-[9px] font-black uppercase ${nature === 'variable' ? 'bg-slate-700 text-primary shadow-lg' : 'text-slate-500'}`}>Variável</button>
                  <button type="button" onClick={() => setNature('fixed')} className={`flex-1 rounded-lg text-[9px] font-black uppercase ${nature === 'fixed' ? 'bg-slate-700 text-primary shadow-lg' : 'text-slate-500'}`}>Fixo</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500">Data</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full glass rounded-xl py-3 px-3 text-[10px] font-bold border-none outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500">Descrição</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Conta de Luz" className="w-full glass rounded-2xl py-5 px-6 outline-none text-sm" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Responsável</label>
              <div className="grid grid-cols-3 gap-3">
                <button type="button" onClick={() => setPaidBy('me')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${paidBy === 'me' ? 'bg-primary/10 border-primary text-primary shadow-neon-soft' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined">person</span>
                  <span className="text-[8px] font-black uppercase">Eu</span>
                </button>
                <button type="button" onClick={() => setPaidBy('partner')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${paidBy === 'partner' ? 'bg-primary/10 border-primary text-primary shadow-neon-soft' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined">favorite</span>
                  <span className="text-[8px] font-black uppercase">Jota</span>
                </button>
                <button type="button" onClick={() => setPaidBy('shared')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${paidBy === 'shared' ? 'bg-primary/10 border-primary text-primary shadow-neon-soft' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined">group</span>
                  <span className="text-[8px] font-black uppercase">Nós</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Pagamento</label>
              <div className="grid grid-cols-4 gap-2">
                <button type="button" onClick={() => setPaymentMethod('pix')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'pix' ? 'bg-primary/20 border-primary text-primary' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-base">qr_code_2</span>
                  <span className="text-[7px] font-black uppercase">Pix</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('debit')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'debit' ? 'bg-primary/20 border-primary text-primary' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-base">credit_card</span>
                  <span className="text-[7px] font-black uppercase">Débito</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('credit')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'credit' ? 'bg-primary/20 border-primary text-primary' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-base">payments</span>
                  <span className="text-[7px] font-black uppercase">Crédito</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('cash')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'cash' ? 'bg-primary/20 border-primary text-primary' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-base">savings</span>
                  <span className="text-[7px] font-black uppercase">Dinheiro</span>
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading || amount === '0,00'} className="w-full glass-button text-primary font-black py-6 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-neon-strong active:scale-95 transition-all flex items-center justify-center gap-3">
            {loading ? "SALVANDO..." : "CONFIRMAR LANÇAMENTO"}
          </button>
        </form>
      </div>
    </div>
  );
}