import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { QRCodeSVG } from 'qrcode.react'; // Biblioteca para o QR dinâmico

export default function InvitePartner() {
  const navigate = useNavigate();
  const [inviteLink, setInviteLink] = useState('Gerando link...');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function generateInvite() {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('household_id').eq('id', user?.id).single();

      if (profile?.household_id) {
        // Cria o convite no banco
        const { data, error } = await supabase
          .from('household_invites')
          .insert([{ household_id: profile.household_id, inviter_id: user?.id }])
          .select('token')
          .single();

        if (data) {
          const url = `${window.location.origin}/join/${data.token}`;
          setInviteLink(url);
        }
      }
    }
    generateInvite();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`Oi Saviaya! Entre no nosso Saje para cuidarmos das nossas finanças juntos: ${inviteLink}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 antialiased flex flex-col items-center">
      <div className="relative flex h-screen w-full max-w-md flex-col bg-background-dark border-x border-primary/10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center p-6 pb-2 justify-between">
          <button onClick={() => navigate(-1)} className="text-slate-100 size-10 flex items-center justify-center hover:bg-primary/10 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
          <button className="text-primary size-10 flex items-center justify-center">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8 flex flex-col items-center">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 text-primary">
              <div className="relative">
                <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_2</span>
                <div className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative rounded-full h-4 w-4 bg-primary"></span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Convide seu par</h1>
            <p className="text-slate-400 text-sm max-w-[280px] mx-auto">
              A jornada para a liberdade financeira é melhor quando trilhada em dupla com a Saviaya.
            </p>
          </div>

          {/* QR Code Real */}
          <div className="w-full aspect-square max-w-[280px] p-6 mb-10 relative">
            <div className="absolute inset-0 border-2 border-dashed border-primary/40 rounded-[24px]"></div>
            <div className="bg-white p-4 rounded-2xl w-full h-full flex items-center justify-center shadow-[0_0_25px_rgba(13,242,13,0.15)]">
              <QRCodeSVG value={inviteLink} size={200} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black px-4 py-1 rounded-full tracking-widest uppercase">
              Escanear
            </div>
          </div>

          {/* Link Box */}
          <div className="w-full space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-primary/70 ml-1">Link de Convite</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/5 border border-primary/20 rounded-xl px-4 flex items-center h-14 overflow-hidden">
                <span className="text-slate-300 text-sm truncate">{inviteLink}</span>
              </div>
              <button onClick={copyToClipboard} className="bg-primary px-4 rounded-xl text-black active:scale-95 transition-all">
                <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
              </button>
            </div>
          </div>

          {/* Compartilhamento Social */}
          <div className="w-full mt-10">
            <p className="text-center text-xs text-slate-500 font-medium mb-4">Ou compartilhe via</p>
            <div className="flex justify-center gap-6">
              <button onClick={shareWhatsApp} className="flex flex-col items-center gap-2 group">
                <div className="size-14 rounded-full bg-white/5 border border-slate-800 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <span className="material-symbols-outlined text-white">chat</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">WhatsApp</span>
              </button>
              {/* Outros botões seguem a mesma lógica */}
            </div>
          </div>
        </div>

        <div className="p-8 text-center bg-white/[0.02] border-t border-primary/10">
          <p className="text-xs text-slate-500 italic">Aguardando Saviaya se conectar...</p>
        </div>
      </div>
    </div>
  );
}