export const isUrduText = (text: string) => {
  const urduRegex = /[\u0600-\u06FF]/;
  return urduRegex.test(text);
};
