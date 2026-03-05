import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface Category {
  id: string;
  name: string;
  icon: string;
  defaultNature: 'fixed' | 'variable';
}

// 🔴 Categorias de Despesa com Natureza Padrão
const EXPENSE_CATEGORIES: Category[] = [
  { id: 'aluguel', name: 'Aluguel', icon: 'home', defaultNature: 'fixed' },
  { id: 'mercado', name: 'Mercado', icon: 'shopping_cart', defaultNature: 'variable' },
  { id: 'saude', name: 'Saúde', icon: 'medical_services', defaultNature: 'variable' },
  { id: 'vestuario', name: 'Vestuário', icon: 'apparel', defaultNature: 'variable' },
  { id: 'transporte', name: 'Transporte', icon: 'directions_car', defaultNature: 'variable' },
  { id: 'lazer', name: 'Lazer', icon: 'celebration', defaultNature: 'variable' },
];

// 🟢 Categorias de Receita
const INCOME_CATEGORIES: Category[] = [
  { id: 'salario', name: 'Salário', icon: 'payments', defaultNature: 'fixed' },
  { id: 'renda_extra', name: 'Renda Extra', icon: 'add_business', defaultNature: 'variable' },
  { id: 'reserva', name: 'Reserva', icon: 'savings', defaultNature: 'variable' },
  { id: 'investimentos', name: 'Investimentos', icon: 'trending_up', defaultNature: 'variable' },
];

export default function NewTransaction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Estados do Formulário
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('0,00');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('mercado');
  const [nature, setNature] = useState<'fixed' | 'variable'>('variable');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState<'me' | 'partner' | 'shared'>('me');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'debit' | 'credit' | 'cash'>('pix');

  // 🔄 Efeito: Troca a lista de categorias e a natureza automaticamente
  useEffect(() => {
    const allCats = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
    const selectedCat = allCats.find(c => c.id === category);
    if (selectedCat) {
      setNature(selectedCat.defaultNature);
    }
  }, [category]);

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Máscara de Moeda (R$)
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

      if (!profile?.household_id) throw new Error("Usuário sem Lar vinculado.");

      const numericAmount = parseFloat(amount.replace(/\./g, "").replace(",", "."));

      const { error } = await supabase.from('transactions').insert([{
  description,
  amount: type === 'expense' ? -numericAmount : numericAmount,
  category,
  expense_nature: nature,
  transaction_type: type, // 🚀 ADICIONE ESTA LINHA
  date,
  paid_by: paidBy,
  payment_method: paymentMethod,
  household_id: profile.household_id,
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
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex justify-center selection:bg-primary selection:text-background-dark">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-background-dark overflow-x-hidden border-x border-white/5">
        
        {/* Header Glassmorphism */}
        <header className="flex items-center p-4 pb-2 justify-between sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md">
          <button type="button" onClick={() => navigate(-1)} className="size-12 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="text-lg font-bold tracking-tight flex-1 text-center">Nova Transação</h2>
          <button onClick={handleSubmit} disabled={loading} className="size-12 flex items-center justify-end text-primary disabled:opacity-50">
            <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col pb-10">
          
          {/* Alternador Despesa/Receita */}
          <div className="flex px-6 py-4">
            <div className="flex h-12 flex-1 items-center rounded-2xl bg-white/5 p-1.5 border border-white/10">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 h-full rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-primary text-background-dark shadow-neon-strong' : 'text-slate-500'}`}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 h-full rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-primary text-background-dark shadow-neon-strong' : 'text-slate-500'}`}
              >
                Receita
              </button>
            </div>
          </div>

          {/* Valor Digital Neon */}
          <div className="flex flex-col items-center justify-center py-6">
            <span className="text-primary/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Valor Total</span>
            <div className="flex items-center text-primary text-5xl font-black neon-text">
              <span className="text-2xl mr-2 opacity-60">R$</span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="bg-transparent border-none text-center focus:ring-0 w-full font-black p-0"
                autoFocus
              />
            </div>
          </div>

          {/* Categorias Horizontais */}
          <div className="px-6 py-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Categoria</h3>
          </div>
          <div className="flex w-full overflow-x-auto no-scrollbar px-6 py-4 gap-5">
            {currentCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center gap-2 shrink-0 transition-all ${category === cat.id ? 'scale-110' : 'opacity-30 hover:opacity-100'}`}
              >
                <div className={`size-14 flex items-center justify-center rounded-full border-2 transition-all ${category === cat.id ? 'bg-primary text-background-dark border-primary shadow-neon-strong' : 'bg-white/5 border-white/10 text-primary'}`}>
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-tighter">{cat.name}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6 px-6 mt-4">
            {/* Natureza (Fixo vs Variável) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tipo de Gasto</label>
              <div className="flex h-11 bg-white/5 rounded-xl p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setNature('variable')}
                  className={`flex-1 rounded-lg text-[10px] font-bold uppercase transition-all ${nature === 'variable' ? 'bg-slate-700 text-primary shadow-lg' : 'text-slate-500'}`}
                >
                  Variável
                </button>
                <button
                  type="button"
                  onClick={() => setNature('fixed')}
                  className={`flex-1 rounded-lg text-[10px] font-bold uppercase transition-all ${nature === 'fixed' ? 'bg-slate-700 text-primary shadow-lg' : 'text-slate-500'}`}
                >
                  Fixo (Mensal)
                </button>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={type === 'expense' ? "Ex: Mercado" : "Ex: Salário Mensal"}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-slate-700 focus:border-primary/50 transition-all outline-none"
              />
            </div>

            {/* Data */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white focus:border-primary/50 transition-all outline-none"
              />
            </div>

            {/* Pago Por */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{type === 'expense' ? 'Pago por' : 'Recebido por'}</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'me', label: 'Eu', icon: 'person' },
                  { id: 'partner', label: 'Parceiro(a)', icon: 'favorite' },
                  { id: 'shared', label: 'Compartilhado', icon: 'group' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaidBy(item.id as any)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${paidBy === item.id ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modo de Pagamento */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Modo de Pagamento</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'pix', label: 'Pix', icon: 'qr_code_2' },
                  { id: 'debit', label: 'Débito', icon: 'credit_card' },
                  { id: 'credit', label: 'Crédito', icon: 'payments' },
                  { id: 'cash', label: 'Dinheiro', icon: 'savings' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${paymentMethod === item.id ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span className="text-[8px] font-black uppercase">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="p-6 mt-8">
            <button
              type="submit"
              disabled={loading || amount === '0,00'}
              className="w-full bg-primary text-background-dark font-black py-5 rounded-2xl shadow-neon-strong active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-tight disabled:opacity-50"
            >
              {loading ? "Salvando..." : (
                <>
                  <span className="material-symbols-outlined font-bold">add_circle</span>
                  Salvar Lançamento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}