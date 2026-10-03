export function formatIntegerWithSpaces(value: number | string): string {
  const digits = String(value).replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function parseGroupedInteger(value: string): number {
  const digits = value.replace(/\D/g, '');
  return digits ? Number.parseInt(digits, 10) : Number.NaN;
}
