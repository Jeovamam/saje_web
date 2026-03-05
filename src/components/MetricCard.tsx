// src/components/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: string;
  variation: string;
  isNegative?: boolean;
  icon: string; // Mudamos de ReactNode para string
}

export function MetricCard({ title, value, variation, isNegative, icon }: MetricCardProps) {
  return (
    <div className="card-gradient rounded-[2rem] p-5 flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isNegative ? 'bg-red-500/10' : 'bg-primary/10'}`}>
          {/* Agora o componente usa a prop 'icon' que você passa no Dashboard */}
          <span className={`material-icons-round ${isNegative ? 'text-red-500' : 'text-primary'}`}>
            {icon}
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isNegative ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
          {variation}
        </span>
      </div>
      <div>
        <h3 className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}