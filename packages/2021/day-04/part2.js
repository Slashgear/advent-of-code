const fs = require("fs");
const { difference, isBoardWin } = require("./utils");

const run = async () => {
  const input = fs.readFileSync("./data.txt").toString("utf-8");
  const sequenceAndBoards = input.split("\n\n");

  const sequence = sequenceAndBoards[0]
    .split(",")
    .map((item) => parseInt(item, 10));
  const boards = sequenceAndBoards.slice(1).map((board) =>
    board.split("\n").map((line) =>
      line
        .split(" ")
        .filter((i) => i)
        .map((num) => parseInt(num, 10))
    )
  );

  const getLastWinBoard = (numbers, boards) => {
    const iteration = [];
    let boardSet = new Set(boards);
    let lastWinBoard = null;
    for (let number of numbers) {
      iteration.push(number);
      for (let board of boardSet) {
        if (isBoardWin(iteration, board)) {
          boardSet.delete(board);
          lastWinBoard = board;
        }
      }
      if (boardSet.size === 0) {
        return [iteration, lastWinBoard];
      }
    }
    return null;
  };
  const [lastBoardIteration, lastWinBoard] = getLastWinBoard(sequence, boards);
  if (!lastBoardIteration || !lastWinBoard) return;
  console.log(
    Array.from(
      difference(lastWinBoard.flat(), lastBoardIteration).values()
    ).reduce((a, b) => a + b, 0) *
      lastBoardIteration[lastBoardIteration.length - 1]
  );
};

run();
