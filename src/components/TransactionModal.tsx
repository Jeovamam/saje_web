

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
      <div className="w-full max-w-lg card-gradient rounded-[2.5rem] p-8 shadow-neon-strong animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Nova Transação</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <span className="material-icons-round text-slate-400">close</span>
          </button>
        </div>

        <form className="space-y-6">
          {/* Seletor de Tipo (Despesa/Receita) */}
          <div className="flex bg-surface-dark p-1 rounded-2xl">
            <button type="button" className="flex-1 py-3 rounded-xl bg-primary text-slate-900 font-bold">Despesa</button>
            <button type="button" className="flex-1 py-3 rounded-xl text-slate-400 font-bold hover:text-slate-100">Receita</button>
          </div>

          {/* Valor */}
          <div className="text-center py-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Valor Total</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-primary">R$</span>
              <input 
                type="number" 
                placeholder="0,00"
                className="bg-transparent text-5xl font-black w-48 focus:outline-none border-none text-center p-0"
                autoFocus
              />
            </div>
          </div>

          {/* Descrição e Categoria */}
          <div className="space-y-4">
            <div className="bg-surface-dark/50 border border-white/5 rounded-2xl p-4">
              <input 
                type="text" 
                placeholder="Descrição (ex: Supermercado)" 
                className="bg-transparent w-full focus:outline-none border-none p-0 text-lg"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-dark/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <span className="material-icons-round text-primary text-xl">category</span>
                <span className="text-slate-400 text-sm font-medium">Categoria</span>
              </div>
              <div className="bg-surface-dark/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <span className="material-icons-round text-primary text-xl">calendar_today</span>
                <span className="text-slate-100 text-sm font-medium">Hoje</span>
              </div>
            </div>
          </div>

          {/* Botão Salvar */}
          <button 
            type="submit"
            className="w-full bg-primary hover:bg-[#6ee000] text-slate-900 font-black py-5 rounded-3xl shadow-neon transition-all active:scale-95"
          >
            SALVAR TRANSAÇÃO
          </button>
        </form>
      </div>
    </div>
  );
}