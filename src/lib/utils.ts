export const generateRandomNumber = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

export const getRandomElements = <T>(arr: T[], num: number) =>
  arr.sort(() => Math.random() - 0.5).slice(0, num);
