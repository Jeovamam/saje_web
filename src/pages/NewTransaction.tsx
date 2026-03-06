import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

// Interface para garantir a tipagem dos dados vindos do Supabase
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
  
  // 1. ESTADOS DO FORMULÁRIO (Preservando sua lógica original)
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('0,00');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [nature, setNature] = useState<'fixed' | 'variable'>('variable');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState<'me' | 'partner' | 'shared'>('me');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'debit' | 'credit' | 'cash'>('pix');

  // 🔄 CARGA DINÂMICA: Busca categorias do Lar no Supabase
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('profiles').select('household_id').eq('id', user?.id).single();
        
        if (profile?.household_id) {
          const { data } = await supabase
            .from('categories')
            .select('id, name, icon, type, default_nature')
            .eq('household_id', profile.household_id)
            .eq('type', type);
          
          const fetchedCats = (data as Category[]) || [];
          setCategories(fetchedCats);
          
          // Define a primeira categoria e sua natureza automaticamente ao carregar
          if (fetchedCats.length > 0) {
            setCategoryName(fetchedCats[0].name);
            setNature(fetchedCats[0].default_nature);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      }
    }
    loadCategories();
  }, [type]);

  // 🚀 AÇÃO: Troca automática de Natureza (Fixo/Variável) ao selecionar ícone
  const handleCategorySelect = (cat: Category) => {
    setCategoryName(cat.name);
    setNature(cat.default_nature); 
  };

  // Máscara de Moeda R$
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
        category: categoryName,
        expense_nature: nature,
        transaction_type: type,
        transaction_date: date,
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
    <div className="min-h-screen bg-gradient-main text-slate-100 font-display flex justify-center no-scrollbar overflow-y-auto selection:bg-primary selection:text-background-dark">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-transparent border-x border-white/5">
        
        {/* Header Glassmorphism */}
        <header className="flex items-center p-6 justify-between sticky top-0 z-50 glass mb-4">
          <button type="button" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="text-lg font-bold tracking-tight">Nova Transação</h2>
          <button onClick={handleSubmit} disabled={loading} className="text-primary disabled:opacity-50 hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 pb-12 space-y-8">
          
          {/* Alternador Despesa/Receita */}
          <div className="flex h-12 w-full items-center rounded-2xl bg-white/5 p-1.5 border border-white/10">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-primary text-background-dark shadow-neon-strong' : 'text-slate-500'}`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 h-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-primary text-background-dark shadow-neon-strong' : 'text-slate-500'}`}
            >
              Receita
            </button>
          </div>

          {/* Valor Digital Neon Pulsante */}
          <div className="flex flex-col items-center justify-center py-8 saje-card rounded-[32px] animate-glow">
            <span className="text-primary/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Valor Total</span>
            <div className="flex items-center text-primary text-5xl font-black neon-text">
              <span className="text-2xl mr-2 opacity-60">R$</span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="bg-transparent border-none text-center focus:ring-0 w-full font-black p-0 outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Categorias Dinâmicas (Scroll Invisível) */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Categoria</h3>
            <div className="flex w-full overflow-x-auto no-scrollbar gap-5 pb-2 min-h-[90px]">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`flex flex-col items-center gap-2 shrink-0 transition-all ${categoryName === cat.name ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-60'}`}
                  >
                    <div className={`size-14 flex items-center justify-center rounded-2xl border-2 transition-all ${categoryName === cat.name ? 'bg-primary text-background-dark border-primary shadow-neon-strong' : 'glass border-white/10 text-primary'}`}>
                      <span className="material-symbols-outlined">{cat.icon}</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-tighter">{cat.name}</p>
                  </button>
                ))
              ) : (
                <div className="w-full text-center py-4 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Aguardando Categorias do Banco...</p>
                </div>
              )}
            </div>
          </div>

          {/* Natureza e Data em Grid Glass */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Natureza</label>
                <div className="flex h-11 bg-white/5 rounded-xl p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setNature('variable')}
                    className={`flex-1 rounded-lg text-[9px] font-black uppercase transition-all ${nature === 'variable' ? 'bg-slate-700 text-primary shadow-lg' : 'text-slate-500'}`}
                  >
                    Variável
                  </button>
                  <button
                    type="button"
                    onClick={() => setNature('fixed')}
                    className={`flex-1 rounded-lg text-[9px] font-black uppercase transition-all ${nature === 'fixed' ? 'bg-slate-700 text-primary shadow-lg' : 'text-slate-500'}`}
                  >
                    Fixo
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full glass rounded-xl py-3 px-3 text-[10px] font-bold border-none outline-none text-white appearance-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Conta de Luz"
                className="w-full glass rounded-2xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-sm text-white"
              />
            </div>

            {/* Responsável (Pago Por) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Responsável</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'me', label: 'Eu', icon: 'person' },
                  { id: 'partner', label: 'Jota', icon: 'favorite' },
                  { id: 'shared', label: 'Nós', icon: 'group' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaidBy(item.id as any)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${paidBy === item.id ? 'bg-primary/10 border-primary text-primary shadow-neon-soft' : 'glass border-white/5 text-slate-500'}`}
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span className="text-[8px] font-black uppercase">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Método de Pagamento */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Pagamento</label>
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
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === item.id ? 'bg-primary/20 border-primary text-primary' : 'glass border-white/5 text-slate-500'}`}
                  >
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                    <span className="text-[7px] font-black uppercase">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botão Salvar Premium */}
          <button
            type="submit"
            disabled={loading || amount === '0,00'}
            className="w-full glass-button text-primary font-black py-6 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-neon-strong active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
          >
            {loading ? "PROCESSANDO..." : "CONFIRMAR LANÇAMENTO"}
          </button>
        </form>
      </div>
    </div>
  );
}