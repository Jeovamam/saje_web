import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import BottomNav from '../components/BottomNav';

// 1. DEFINIÇÃO DAS CATEGORIAS (Para o Dropdown funcionar na hora)
const CATEGORIES = {
  expense: [
    { id: 'aluguel', name: 'Aluguel', nature: 'fixed' },
    { id: 'agua', name: 'Água', nature: 'fixed' },
    { id: 'energia', name: 'Energia', nature: 'fixed' },
    { id: 'internet', name: 'Internet', nature: 'fixed' },
    { id: 'iptu', name: 'IPTU', nature: 'fixed' },
    { id: 'ipva', name: 'IPVA', nature: 'fixed' },
    { id: 'mercado', name: 'Mercado', nature: 'variable' },
    { id: 'saude', name: 'Saúde', nature: 'variable' },
    { id: 'transporte', name: 'Transporte', nature: 'variable' },
    { id: 'lazer', name: 'Lazer', nature: 'variable' },
  ],
  income: [
    { id: 'salario', name: 'Salário', nature: 'fixed' },
    { id: 'extra', name: 'Renda Extra', nature: 'variable' },
    { id: 'investimentos', name: 'Investimentos', nature: 'variable' },
  ]
};

export default function NewTransaction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // 2. TODOS OS 8 ESTADOS ORIGINAIS (Preservados um a um)
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('0,00');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('mercado');
  const [nature, setNature] = useState<'fixed' | 'variable'>('variable');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState<'me' | 'partner' | 'shared'>('me');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'debit' | 'credit' | 'cash'>('pix');

  // 🚀 A INTELIGÊNCIA: Troca automática de Natureza ao mudar o Dropdown
  const handleCategoryChange = (catId: string) => {
    setCategory(catId);
    const selected = CATEGORIES[type].find(c => c.id === catId);
    if (selected) {
      setNature(selected.nature as any);
    }
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
        category: CATEGORIES[type].find(c => c.id === category)?.name,
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
      alert("Erro: " + err.message);
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
          <h2 className="text-lg font-bold">Nova Transação</h2>
          <button onClick={handleSubmit} disabled={loading} className="text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 pb-12 space-y-8 mt-6">
          
          <div className="flex h-12 w-full items-center rounded-2xl bg-white/5 p-1.5 border border-white/10">
            <button type="button" onClick={() => setType('expense')} className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-primary text-background-dark shadow-neon-strong' : 'text-slate-500'}`}>Despesa</button>
            <button type="button" onClick={() => setType('income')} className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-primary text-background-dark shadow-neon-strong' : 'text-slate-500'}`}>Receita</button>
          </div>

          <div className="flex flex-col items-center justify-center py-8 saje-card rounded-[32px] animate-glow">
            <span className="text-primary/60 text-[10px] font-black uppercase tracking-widest mb-2">Valor Total</span>
            <div className="flex items-center text-primary text-5xl font-black neon-text">
              <span className="text-2xl mr-2 opacity-60">R$</span>
              <input type="text" value={amount} onChange={handleAmountChange} className="bg-transparent border-none text-center focus:ring-0 w-full font-black p-0 outline-none" autoFocus />
            </div>
          </div>

          {/* 📍 DROPDOWN DE CATEGORIA (Sugestão do Jeovã) */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Categoria</label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full glass rounded-2xl py-5 px-6 outline-none border-none text-white font-bold appearance-none cursor-pointer"
              >
                {CATEGORIES[type].map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">{cat.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-primary">expand_more</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Natureza</label>
                <div className="flex h-11 bg-white/5 rounded-xl p-1 border border-white/10">
                  <button type="button" onClick={() => setNature('variable')} className={`flex-1 rounded-lg text-[9px] font-black uppercase transition-all ${nature === 'variable' ? 'bg-slate-700 text-primary shadow-lg' : 'text-slate-500'}`}>Variável</button>
                  <button type="button" onClick={() => setNature('fixed')} className={`flex-1 rounded-lg text-[9px] font-black uppercase transition-all ${nature === 'fixed' ? 'bg-slate-700 text-primary shadow-lg' : 'text-slate-500'}`}>Fixo</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Data</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full glass rounded-xl py-3 px-3 text-[10px] font-bold border-none outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Descrição</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Mercado" className="w-full glass rounded-2xl py-5 px-6 outline-none text-sm" />
            </div>

            {/* RESPONSÁVEL (Expandido linha por linha) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Responsável</label>
              <div className="grid grid-cols-3 gap-3">
                <button type="button" onClick={() => setPaidBy('me')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${paidBy === 'me' ? 'bg-primary/10 border-primary text-primary shadow-neon-soft' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined">person</span><span className="text-[8px] font-black uppercase">Eu</span>
                </button>
                <button type="button" onClick={() => setPaidBy('partner')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${paidBy === 'partner' ? 'bg-primary/10 border-primary text-primary shadow-neon-soft' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined">favorite</span><span className="text-[8px] font-black uppercase">Jota</span>
                </button>
                <button type="button" onClick={() => setPaidBy('shared')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${paidBy === 'shared' ? 'bg-primary/10 border-primary text-primary shadow-neon-soft' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined">group</span><span className="text-[8px] font-black uppercase">Nós</span>
                </button>
              </div>
            </div>

            {/* PAGAMENTO (Expandido linha por linha) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Pagamento</label>
              <div className="grid grid-cols-4 gap-2">
                <button type="button" onClick={() => setPaymentMethod('pix')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'pix' ? 'bg-primary/20 border-primary text-primary' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-base">qr_code_2</span><span className="text-[7px] font-black uppercase">Pix</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('debit')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'debit' ? 'bg-primary/20 border-primary text-primary' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-base">credit_card</span><span className="text-[7px] font-black uppercase">Débito</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('credit')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'credit' ? 'bg-primary/20 border-primary text-primary' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-base">payments</span><span className="text-[7px] font-black uppercase">Crédito</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('cash')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'cash' ? 'bg-primary/20 border-primary text-primary' : 'glass border-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-base">savings</span><span className="text-[7px] font-black uppercase">Dinheiro</span>
                </button>
              </div>
            </div>
          </div>
<BottomNav />
          <button type="submit" disabled={loading || amount === '0,00'} className="w-full glass-button text-primary font-black py-6 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-neon-strong active:scale-95 transition-all">
            {loading ? "SALVANDO..." : "CONFIRMAR LANÇAMENTO"}
          </button>
        </form>
      </div>
    </div>
  );
}