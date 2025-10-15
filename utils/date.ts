export function formatLocalDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekIdentifierMondayStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay(); // Sunday - 0, Monday - 1, etc.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // move to Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return formatLocalDateYYYYMMDD(d);
}
