import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [mainGoal, setMainGoal] = useState<any>(null);

  useEffect(() => {
    async function loadHouseholdData() {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('household_id').eq('id', user?.id).single();

      if (profile?.household_id) {
        // 1. Busca todos os membros do Household (Você e Saviaya)
        const { data: team } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('household_id', profile.household_id);
        
        // 2. Busca a Meta Principal do Lar (Dinâmico)
        const { data: goal } = await supabase
          .from('goals')
          .select('*')
          .eq('household_id', profile.household_id)
          .eq('is_main_goal', true)
          .single();

        if (team) setMembers(team);
        if (goal) setMainGoal(goal);
      }
      setLoading(false);
    }
    loadHouseholdData();
  }, []);

  // Cálculo de progresso da meta
  const progress = mainGoal ? (mainGoal.current_amount / mainGoal.target_amount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex justify-center pb-32">
      <div className="relative flex w-full max-w-md flex-col border-x border-white/5">
        
        {/* Topo Dinâmico */}
        <header className="p-8 flex justify-between items-center">
          <h1 className="text-2xl font-black italic">Nosso Perfil</h1>
          <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">Premium</span>
          </div>
        </header>

        {/* 👫 Membros do Lar (Cada um com sua foto) */}
        <section className="flex justify-center -space-x-4 mb-10">
          {members.map((m, i) => (
            <div key={i} className="relative">
              <div 
                className="size-24 rounded-full border-4 border-background-dark overflow-hidden bg-slate-800 shadow-neon-soft"
                style={{ backgroundImage: `url(${m.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.full_name}`})`, backgroundSize: 'cover' }}
              />
              <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-md px-2 py-0.5 rounded-md text-[8px] font-black uppercase text-white border border-white/10">
                {m.full_name?.split(' ')[0]}
              </p>
            </div>
          ))}
        </section>

        {/* 🚀 HUB DE SONHOS (Botões Solicitados) */}
        <section className="px-6 space-y-4 mb-10">
          <button 
            onClick={() => navigate('/goals')}
            className="w-full p-6 saje-card rounded-[32px] flex items-center justify-between border-primary/20 hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">flag</span>
              <div className="text-left">
                <p className="text-sm font-black text-white">Metas e Sonhos</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase">Gestão de objetivos financeiros</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-600">chevron_right</span>
          </button>

          <button 
            onClick={() => navigate('/vision-board')}
            className="w-full p-6 saje-card rounded-[32px] flex items-center justify-between border-white/10 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-white text-3xl">filter_frames</span>
              <div className="text-left">
                <p className="text-sm font-black text-white">Quadro dos Sonhos</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase">Mural visual de conquistas</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-600">chevron_right</span>
          </button>
        </section>

        {/* 📊 META PRINCIPAL (Agora Dinâmica) */}
        <section className="px-6">
          <div className="saje-card p-6 rounded-[32px] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
            {mainGoal ? (
              <>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Meta em Destaque</p>
                    <h3 className="text-lg font-black text-white">{mainGoal.title}</h3>
                  </div>
                  <span className="text-2xl font-black text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary shadow-neon-soft transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
              </>
            ) : (
              <p className="text-center text-xs text-slate-500 font-bold uppercase py-4">Nenhuma meta em destaque selecionada</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}