import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Função para verificar se a aba está ativa
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass border-t border-white/10 px-8 py-4 flex justify-between items-center z-50 rounded-t-[32px]">
      
      {/* Home */}
      <button 
        onClick={() => navigate('/home')} 
        className={`flex flex-col items-center gap-1 transition-all ${isActive('/home') ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/home') ? "'FILL' 1" : "" }}>home</span>
        <span className="text-[8px] font-black uppercase">Início</span>
      </button>

      {/* Extrato */}
      <button 
        onClick={() => navigate('/statement')} 
        className={`flex flex-col items-center gap-1 transition-all ${isActive('/statement') ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/statement') ? "'FILL' 1" : "" }}>receipt_long</span>
        <span className="text-[8px] font-black uppercase">Extrato</span>
      </button>

      {/* Botão Central de Adicionar */}
      <button 
        onClick={() => navigate('/new-transaction')}
        className="size-12 bg-primary text-background-dark rounded-full flex items-center justify-center shadow-neon-strong -translate-y-6 border-4 border-background-dark active:scale-90 transition-all"
      >
        <span className="material-symbols-outlined font-black">add</span>
      </button>

      {/* Insights */}
      <button 
        onClick={() => navigate('/insights')} 
        className={`flex flex-col items-center gap-1 transition-all ${isActive('/insights') ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/insights') ? "'FILL' 1" : "" }}>equalizer</span>
        <span className="text-[8px] font-black uppercase">Insights</span>
      </button>

      {/* Perfil */}
      <button 
        onClick={() => navigate('/profile')} 
        className={`flex flex-col items-center gap-1 transition-all ${isActive('/profile') ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/profile') ? "'FILL' 1" : "" }}>person</span>
        <span className="text-[8px] font-black uppercase">Perfil</span>
      </button>

    </nav>
  );
}