export function useFormat() {
  function formatNumberToReal(number: number) {
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatDateMinimalBR(date: Date) {
    return Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(date);
  }

  return { formatNumberToReal, formatDateMinimalBR };
}
