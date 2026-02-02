
// Formata data para "há X min", "há X h", "há X dias"
export function formatRelativeTime(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return "agora";
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays} ${diffDays === 1 ? "dia" : "dias"}`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
// Formata o número de comentários para "9+"
export function FormatCount(comments: number, limit: number = 9) {
    if (comments <= 0) return "";
    if (comments > limit) return `${limit}+`;
    return String(comments);
}