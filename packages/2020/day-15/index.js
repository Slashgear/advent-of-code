const INPUT = "8,0,17,4,1,12";

const solution = (solveForTurn) => {
  const parsedInput = INPUT.split(",").map(Number);
  const memory = new Map();
  let lastSpoken = null;
  let count = 0;
  while (count < solveForTurn) {
    if (count < parsedInput.length) {
      if (lastSpoken !== null) memory.set(lastSpoken, count);
      lastSpoken = parsedInput[count];
    } else {
      if (memory.has(lastSpoken)) {
        const lastIndex = memory.get(lastSpoken);
        memory.set(lastSpoken, count);
        lastSpoken = count - lastIndex;
      } else {
        memory.set(lastSpoken, count);
        lastSpoken = 0;
      }
    }
    count++;
  }
  return lastSpoken;
};

console.log("Solution for part 1", solution(2020));
console.log("Solution for part 2", solution(30000000));
