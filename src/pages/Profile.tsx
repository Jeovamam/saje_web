import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFamily() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Descobre qual é o seu Lar
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('household_id')
        .eq('id', user?.id)
        .single();

      if (myProfile?.household_id) {
        // 2. Busca TODOS os membros desse Lar (Resolve o problema da foto sumir)
        const { data: members } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('household_id', myProfile.household_id);
        
        if (members) setFamilyMembers(members);
      }
      setLoading(false);
    }
    fetchFamily();
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex justify-center pb-32">
      <div className="relative flex w-full max-w-md flex-col border-x border-white/5">
        
        <header className="p-8 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter">Nosso Saje</h1>
          <span className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/30 uppercase tracking-widest">Premium</span>
        </header>

        {/* 👫 Visualização do Casal (Fotos Individuais Lado a Lado) */}
        <section className="flex justify-center -space-x-4 mb-10">
          {familyMembers.map((member) => (
            <div key={member.id} className="relative group">
              <div 
                className="size-24 rounded-full border-4 border-background-dark overflow-hidden bg-slate-800 shadow-neon-soft transition-transform group-hover:scale-105"
                style={{ backgroundImage: `url(${member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[8px] font-black uppercase text-white">
                {member.full_name?.split(' ')[0]}
              </div>
            </div>
          ))}
        </section>

        {/* 🚀 HUB DE SONHOS E PLANEJAMENTO */}
        <section className="px-6 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2 mb-2">Planejamento do Lar</h2>
          
          <button 
            onClick={() => navigate('/goals')}
            className="w-full h-24 saje-card rounded-[32px] flex items-center gap-5 px-6 border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.05] transition-all"
          >
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-neon-soft">
              <span className="material-symbols-outlined text-3xl">flag</span>
            </div>
            <div className="text-left">
              <h3 className="font-black text-sm text-white">Metas e Sonhos</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Progresso financeiro do casal</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/vision-board')}
            className="w-full h-24 saje-card rounded-[32px] flex items-center gap-5 px-6 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
          >
            <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-3xl">photo_library</span>
            </div>
            <div className="text-left">
              <h3 className="font-black text-sm text-white">Quadro dos Sonhos</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Visualização das nossas conquistas</p>
            </div>
          </button>
        </section>

        {/* Card de Informação Genérica (Para qualquer household) */}
        <section className="px-6 mt-8">
           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] text-center italic text-xs text-slate-400">
             "Planejar o futuro juntos é o primeiro passo para vivê-lo."
           </div>
        </section>
<BottomNav />
        {/* Menu Inferior (Navegação Padrão) */}
        {/* ... (Seus botões de Início, Extrato, etc) ... */}
      </div>
    </div>
  );
}