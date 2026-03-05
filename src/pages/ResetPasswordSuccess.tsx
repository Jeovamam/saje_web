import { useNavigate } from 'react-router-dom';

export default function ResetPasswordSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display transition-colors duration-300 antialiased">
      <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto border-x border-primary/10 bg-background-dark overflow-hidden">
        
        {/* Top App Bar Space */}
        <div className="flex items-center p-4 pb-2 justify-between">
          <button 
            onClick={() => navigate('/login')}
            className="text-slate-100 flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
          </button>
          <div className="flex-grow"></div>
          <div className="w-12"></div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-grow items-center justify-center px-6">
          {/* Success Illustration/Icon Container */}
          <div className="w-full max-w-[280px] aspect-square flex items-center justify-center relative mb-8">
            {/* Outer Glow Effect */}
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            
            {/* Circular Frame */}
            <div className="relative w-48 h-48 rounded-full border-4 border-primary flex items-center justify-center bg-background-dark/50 shadow-[0_0_30px_rgba(63,249,6,0.3)]">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '96px', fontVariationSettings: "'wght' 600" }}>
                check_circle
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="tracking-tight text-3xl font-bold leading-tight text-center pb-4 neon-text">
            Senha redefinida!
          </h1>

          {/* Description */}
          <p className="text-slate-400 text-base font-normal leading-relaxed text-center max-w-sm mb-12">
            Tudo pronto! Sua nova senha foi salva e vocês já podem voltar a cuidar das finanças juntos.
          </p>

          {/* Action Button */}
          <div className="w-full max-w-sm">
            <button 
              onClick={() => navigate('/login')}
              className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-background-dark text-lg font-bold leading-normal tracking-wide shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              <span>Fazer Login</span>
            </button>
          </div>
        </div>

        {/* Bottom Spacer for iOS Home Indicator */}
        <div className="h-10"></div>
      </div>
    </div>
  );
}