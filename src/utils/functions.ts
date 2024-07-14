export const firstDayMonth = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), 1);
}

export const lastDayMonth = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth() + 1, 0);
}

export const dateToString = (dateProp: any) => {
  const date = new Date(dateProp);

  return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} / ${date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1} / ${date.getFullYear()}`
}