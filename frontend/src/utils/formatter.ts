import moment from 'moment';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatCurrency = (amount?: number) =>
  formatter.format(amount ?? 0);

export const formatDateTime = (
  value?: string,
  format = 'YYYY-MM-DD HH:mm:ss',
) => {
  if (!value) {
    return null;
  }

  const date = new Date(+value);
  return moment(date.toString()).format(format);
};
