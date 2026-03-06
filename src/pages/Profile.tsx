import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    async function loadHouseholdData() {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: myProfile } = await supabase.from('profiles').select('household_id').eq('id', user?.id).single();

      if (myProfile?.household_id) {
        // Busca os dois perfis vinculados ao mesmo Lar
        const { data: members } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, id')
          .eq('household_id', myProfile.household_id);
        
        if (members) setPartners(members);
      }
      setLoading(false);
    }
    loadHouseholdData();
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex justify-center no-scrollbar overflow-y-auto pb-32">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-transparent border-x border-white/5">
        
        {/* Header Premium */}
        <header className="p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Nosso Lar</p>
            <h1 className="text-2xl font-black italic tracking-tighter text-white">Jeovã & Saviaya</h1>
          </div>
          <button className="size-10 glass rounded-xl flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </header>

        {/* 👫 Cards dos Parceiros (Lado a Lado) */}
        <section className="grid grid-cols-2 gap-4 px-6 mb-8">
          {partners.map((p, i) => (
            <div key={p.id} className="saje-card p-5 rounded-[32px] flex flex-col items-center gap-3 border border-white/5 bg-white/[0.02]">
              <div 
                className="size-20 rounded-full border-2 border-primary/20 p-1 shadow-neon-soft"
                style={{ backgroundImage: `url(${p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div className="text-center">
                <p className="text-xs font-black text-white">{p.full_name?.split(' ')[0]}</p>
                <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-0.5">
                  {i === 0 ? 'Estrategista' : 'Guardiã'}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* 🚀 Botões de Gestão de Sonhos */}
        <section className="px-6 space-y-4 mb-8">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Planejamento</h2>
          
          <button 
            onClick={() => navigate('/goals')}
            className="w-full h-20 saje-card rounded-[28px] flex items-center gap-5 px-6 border-primary/20 bg-primary/[0.03] active:scale-95 transition-all"
          >
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-neon-soft">
              <span className="material-symbols-outlined text-3xl">flag</span>
            </div>
            <div className="text-left">
              <h3 className="font-black text-sm text-white">Metas e Sonhos</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Acompanhe o progresso financeiro</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/vision-board')}
            className="w-full h-20 saje-card rounded-[28px] flex items-center gap-5 px-6 border-white/10 bg-white/[0.02] active:scale-95 transition-all"
          >
            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-3xl">temp_preferences_custom</span>
            </div>
            <div className="text-left">
              <h3 className="font-black text-sm text-white">Quadro dos Sonhos</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Visualize suas conquistas em imagens</p>
            </div>
          </button>
        </section>

        {/* 🏠 Status da Casa (Contexto Real do Usuário) */}
        <section className="px-6 mb-10">
          <div className="saje-card p-6 rounded-[32px] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase text-slate-300 tracking-widest">Conclusão da Casa</h3>
              <span className="text-primary font-black text-xs">75%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary shadow-neon-soft transition-all" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[9px] text-slate-500 mt-3 italic">"A liberdade financeira é a fundação da nossa paz em Palmas."</p>
          </div>
        </section>

        {/* Menu Inferior */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass border-t border-white/10 px-8 py-4 flex justify-between items-center z-50 rounded-t-[32px]">
          <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-all"><span className="material-symbols-outlined">home</span><span className="text-[8px] font-black uppercase">Home</span></button>
          <button onClick={() => navigate('/statement')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-all"><span className="material-symbols-outlined">receipt_long</span><span className="text-[8px] font-black uppercase">Extrato</span></button>
          <button onClick={() => navigate('/new-transaction')} className="size-12 bg-primary text-background-dark rounded-full flex items-center justify-center shadow-neon-strong -translate-y-6 border-4 border-background-dark active:scale-90 transition-all"><span className="material-symbols-outlined font-black">add</span></button>
          <button onClick={() => navigate('/insights')} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-all"><span className="material-symbols-outlined">equalizer</span><span className="text-[8px] font-black uppercase">Insights</span></button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-primary transition-all"><span className="material-symbols-outlined">person</span><span className="text-[8px] font-black uppercase">Perfil</span></button>
        </nav>
      </div>
    </div>
  );
}