export const geminiService = {
  async getFinancialInsights(_transactions: any[]) {
    // 🔥 Versão mock — apenas para não quebrar o app
    return "Seu padrão de gastos está equilibrado. Continue assim!";
  },

  async parseVoiceCommand(text: string) {
    // 🔥 Parser simples simulado

    const amountMatch = text.match(/(\d+)/);
    const amount = amountMatch ? Number(amountMatch[1]) : 0;

    return {
      amount,
      description: text,
      type: text.toLowerCase().includes("ganhei")
        ? "INCOME"
        : "EXPENSE",
    };
  },
};