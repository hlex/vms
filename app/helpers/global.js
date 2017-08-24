export const changeCoin = (value) => {
  const baht10 = Math.floor(value / 10);
  const baht5 = Math.floor((value - (baht10 * 10)) / 5);
  const baht1 = Math.floor((value - (baht10 * 10) - (baht5 * 5)) / 1);
  return {
    baht1,
    baht5,
    baht10,
  };
};

export const createLog = (type = '', bgColor = 'green', color = '#fff') => {
  if (type === 'app') return 'background: #333; color: #fff';
  if (type === 'client') return 'background: green; color: #fff';
  return `background: ${bgColor}; color: ${color}`;
};
