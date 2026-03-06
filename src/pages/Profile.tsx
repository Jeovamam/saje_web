import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatars, setAvatars] = useState({ partner1: '', partner2: '' });

  // 📸 Função de Compressão e Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, partner: 'partner1' | 'partner2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    
    // 🛠️ Compressão via Canvas (Nativo e leve)
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 400;
      const scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload para o Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('saje-assets')
          .upload(filePath, blob);

        if (uploadError) {
          alert("Erro no upload: " + uploadError.message);
        } else {
          const { data } = supabase.storage.from('saje-assets').getPublicUrl(filePath);
          setAvatars(prev => ({ ...prev, [partner]: data.publicUrl }));
          // Aqui você atualizaria o campo 'avatar_url' na sua tabela 'profiles'
        }
        setLoading(false);
      }, 'image/jpeg', 0.7); // 0.7 de qualidade = compressão eficiente
    };
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex justify-center no-scrollbar overflow-y-auto pb-24">
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-transparent border-x border-white/5">
        
        {/* Header Glassmorphism */}
        <header className="sticky top-0 z-50 flex items-center bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-white/10">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-start text-slate-400">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center">Perfil do Casal</h2>
          <button className="size-10 flex items-center justify-end text-slate-400">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center p-8 gap-6">
          <div className="flex -space-x-6">
            {['partner1', 'partner2'].map((p, i) => (
              <label key={p} className="relative group cursor-pointer">
                <div 
                  className="size-24 rounded-full ring-4 ring-background-dark overflow-hidden bg-slate-800 border-2 border-white/5"
                  style={{ backgroundImage: `url(${avatars[p as keyof typeof avatars] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`})`, backgroundSize: 'cover' }}
                >
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                  </div>
                </div>
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, p as any)} accept="image/*" />
              </label>
            ))}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold">João & Maria</h1>
              <span className="bg-primary/20 text-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-primary/30">Premium</span>
            </div>
            <p className="text-primary/70 text-sm font-medium mt-1">Saje Financial Intelligence</p>
          </div>

          <button className="w-full max-w-xs bg-primary text-background-dark h-12 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
            Editar Perfil do Casal
          </button>
        </section>

        {/* Bancos Conectados (Sugestão: Alterar para Carteiras/Cartões) */}
        <section className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold">Contas e Cartões</h2>
            <span className="text-primary text-xs font-semibold">2 Ativos</span>
          </div>
          
          <div className="space-y-3">
            {/* Card Nubank */}
            <div className="saje-card p-5 rounded-2xl flex flex-col gap-4 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-lg bg-[#8A05BE] flex items-center justify-center font-bold">Nu</div>
                  <div>
                    <h3 className="font-bold text-sm">Nubank</h3>
                    <p className="text-slate-500 text-[10px]">Conta Conjunta • 0123-4</p>
                  </div>
                </div>
                <div className="bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <div className="size-1 bg-primary rounded-full"></div>
                  <span className="text-primary text-[8px] font-black uppercase">Sincronizado</span>
                </div>
              </div>
            </div>

            <button className="w-full h-16 border-2 border-dashed border-primary/20 bg-primary/5 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold hover:bg-primary/10 transition-all">
              <span className="material-symbols-outlined">add_circle</span>
              <span>Conectar Nova Conta</span>
            </button>
          </div>
        </section>

        {/* Bottom Navigation (Copiado do Extrato para manter padrão) */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass border-t border-white/10 px-8 py-4 flex justify-between items-center z-50 rounded-t-[32px]">
          <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 text-slate-500">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[8px] font-black uppercase">Home</span>
          </button>
          <button onClick={() => navigate('/statement')} className="flex flex-col items-center gap-1 text-slate-500">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[8px] font-black uppercase">Extrato</span>
          </button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[8px] font-black uppercase">Perfil</span>
          </button>
        </nav>
      </div>
    </div>
  );
}