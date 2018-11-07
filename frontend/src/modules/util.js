export const parseDateStr = (dateStr) => {
  const date = new Date(dateStr);
  const m = date.getMonth()+1;
  const d = date.getDate();
  const time = date.toLocaleTimeString();
  return `${m}/${d} ${time}`;
};