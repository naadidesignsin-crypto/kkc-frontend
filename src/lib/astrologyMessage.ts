export function astrologyNameIcon(gender: string): string {
  return gender === 'Male' ? '👨' : gender === 'Female' ? '👩' : '👤';
}
export function astrologyBirthDate(value: string): string {
  const [year, month, day] = value.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return year && months[Number(month) - 1] && day ? day + ' ' + months[Number(month) - 1] + ' ' + year : value;
}
export function astrologyBirthTime(value: string): string {
  if (!/^\d{2}:\d{2}$/.test(value)) return value;
  const [hour, minute] = value.split(':');
  return (Number(hour) % 12 || 12) + ':' + minute + (Number(hour) < 12 ? ' AM' : ' PM') + ' (local to birthplace)';
}
