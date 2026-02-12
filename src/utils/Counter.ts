export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString))
}
// Formata o número de comentários para "9+"
export function FormatCount(comments: number, limit: number = 9) {
    if (comments <= 0) return "";
    if (comments > limit) return `${limit}+`;
    return String(comments);
}