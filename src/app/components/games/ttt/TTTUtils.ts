import { PlayerEnum, PlayerOptionsEnum } from "./TTTConfig";

export const getDefaultBoard = (n: number) => new Array(n * n).fill(null);

// n: size of square, i: row number (assumption first row is 0)
export const leftDiagonal = (i: number, n: number) => i + n * i;

// n: size of square,
export const rightDiagonal = (i: number, n: number) => (i + 1) * (n - 1);

// get all indexes of diagonals
export const getAllDiagonalIndexes = (n: number) => {
  const left = [];
  const right = [];
  for (let i = 0; i < n; i++) {
    left.push(leftDiagonal(i, n));
    right.push(rightDiagonal(i, n));
  }
  return { left, right };
};

// given a number get all index related to that row and column
export const getAllXYIndexes = (n: number, value: number) => {
  const xValue = value % n;
  const yValue = Math.floor(value / n);
  const x = [];
  const y = [];
  for (let i = 0; i < n; i++) {
    x.push(n * yValue + i);
    y.push(xValue + n * i);
  }
  return { x, y };
};

//
export const checkAllIndexes = (
  board: (PlayerOptionsEnum | null)[],
  indexes: number[],
  move: PlayerOptionsEnum
) => {
  const filteredBoard = board.filter((_, i) => indexes?.includes(i));
  return filteredBoard?.every((val) => val === (move ?? filteredBoard?.[0]));
};

//
export const getNotNullCount = (board: (PlayerOptionsEnum | null)[]) =>
  board?.filter((val) => val !== null)?.length ?? 0;

//
export const checkMinNValues = (
  board: (PlayerOptionsEnum | null)[],
  n: number
) => getNotNullCount(board) >= n;

//
export const getOppPlayer = (value: PlayerEnum) =>
  value === PlayerEnum.USER ? PlayerEnum.PLAYER : PlayerEnum.USER;

//
export const getOppPlayerOption = (value: PlayerOptionsEnum) =>
  value === PlayerOptionsEnum.X ? PlayerOptionsEnum.O : PlayerOptionsEnum.X;
