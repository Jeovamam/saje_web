// src/components/HealthScore.tsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Remova a linha do import { COLORS }
const PRIMARY_COLOR = "#7CFF01"; // Sua cor Saje Neon
const BG_COLOR = "#1E293B";      // Cor do fundo do círculo

export const HealthScore = ({ score }: { score: number }) => {
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  return (
    <div className="relative w-56 h-56 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={75}
            outerRadius={90}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={PRIMARY_COLOR} className="neon-glow" />
            <Cell fill={BG_COLOR} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-black leading-none">{score}</span>
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mt-2">Saúde</span>
      </div>
    </div>
  );
};