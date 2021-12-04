const fs = require("fs");
const { getWinBoard, difference } = require("./utils");

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

  const [iteration, winBoard] = getWinBoard(sequence, boards);
  if (!iteration || !winBoard) return;
  console.log(
    Array.from(difference(winBoard.flat(), iteration).values()).reduce(
      (a, b) => a + b
    ) * iteration[iteration.length - 1]
  );

};

run();
