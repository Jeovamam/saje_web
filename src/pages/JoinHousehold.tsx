import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function JoinHousehold() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [inviterName, setInviterName] = useState('Alguém');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getInviteDetails() {
      // Busca o nome de quem convidou para personalizar a tela
      const { data, error } = await supabase
        .from('household_invites')
        .select('profiles(full_name)')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (data) {
        setInviterName((data.profiles as any).full_name.split(' ')[0]);
      }
      setLoading(false);
    }
    getInviteDetails();
  }, [token]);

  const handleAccept = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Se não estiver logado, manda para o cadastro salvando o token no storage
      localStorage.setItem('pending_invite_token', token || '');
      navigate('/signup');
      return;
    }

    try {
      const { error } = await supabase.rpc('accept_household_invite', { invite_token: token });
      if (error) throw error;
      navigate('/home');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-primary">Carregando convite...</div>;

  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 flex justify-center overflow-y-auto pb-10">
      <div className="relative flex w-full max-w-md flex-col bg-background-dark border-x border-primary/10">
        
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">asterisk</span>
            <span className="text-2xl font-bold tracking-tight">Saje</span>
          </div>
        </div>

        {/* Animação dos Círculos se Fundindo */}
        <div className="relative h-64 w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-full border border-primary/20 scale-125 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary/60 flex items-center justify-center backdrop-blur-sm">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center backdrop-blur-sm">
              <span className="material-symbols-outlined text-primary">favorite</span>
            </div>
          </div>
        </div>

        <div className="px-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold leading-tight mb-2">Você foi convidado(a)!</h1>
          <p className="text-slate-400 mb-8">
            <span className="font-semibold text-white">{inviterName}</span> quer compartilhar a vida financeira com você no Saje.
          </p>

          {/* Preview Card */}
          <div className="w-full bg-primary/5 border border-primary/20 rounded-3xl p-6 mb-8 text-left relative overflow-hidden">
            <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-primary/40">Preview</span>
            <div className="mb-4">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Score de Saúde do Casal</p>
              <div className="flex items-baseline gap-1 text-primary">
                <span className="text-4xl font-black">84</span><span className="text-sm font-bold">/100</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-sm">account_balance_wallet</span></div>
                <p className="text-xs font-bold">Controle em conjunto</p>
              </div>
              <div className="flex gap-3 items-center">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-sm">flag</span></div>
                <p className="text-xs font-bold">Metas compartilhadas</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAccept}
            className="w-full bg-primary text-background-dark font-black py-5 rounded-full text-lg shadow-neon-strong active:scale-95 transition-all mb-4"
          >
            Aceitar e Criar Conta
          </button>
          
          <button onClick={() => navigate('/login')} className="text-slate-500 text-sm font-bold hover:text-primary">
            Já tenho conta, apenas entrar
          </button>
        </div>
      </div>
    </div>
  );
}