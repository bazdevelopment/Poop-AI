import dayjs from '../lib/dayjs';

export function formatDate(
  dateString: string,
  dateFormat: string,
  locale: string,
) {
  const date = dayjs(dateString).locale(locale);
  return date.format(dateFormat);
}
