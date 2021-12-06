const transpose = (matrix) => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};

const difference = (setA, setB) => {
  let diff = new Set(setA);
  for (let element of setB) {
    diff.delete(element);
  }
  return diff;
};

const isBoardWin = (numbers, board) => {
  const numberSet = new Set(numbers);
  const transposeBoard = transpose(board);
  const horizontal = board.reduce((result, line) => {
    const setB = new Set(line);
    return result || difference(setB, numberSet).size === 0;
  }, false);
  const vertical = transposeBoard.reduce((result, line) => {
    const setB = new Set(line);
    return result || difference(setB, numberSet).size === 0;
  }, false);
  return horizontal || vertical;
};

const getWinBoard = (numbers, boards) => {
  const iteration = [];
  for (let number of numbers) {
    iteration.push(number);
    const winBoard = boards.reduce((result, board) => {
      if (isBoardWin(iteration, board)) {
        return board;
      }
      return result;
    }, null);
    if (winBoard) return [iteration, winBoard];
  }
  return [null, null];
};

module.exports = {
  getWinBoard,
  isBoardWin,
  difference,
  transpose,
};
