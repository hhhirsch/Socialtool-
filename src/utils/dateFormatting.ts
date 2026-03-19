export function formatGermanDate(value: string): string {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return '';
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}.${month}.${year}`;
  }

  const germanMatch = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(trimmedValue);
  if (germanMatch) {
    return trimmedValue;
  }

  const parsedDate = new Date(trimmedValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return trimmedValue;
  }

  return new Intl.DateTimeFormat('de-DE').format(parsedDate);
}
