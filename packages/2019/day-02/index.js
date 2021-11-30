const input = [
  1, 12, 2, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 1, 9, 19, 1, 13, 19, 23,
  2, 23, 9, 27, 1, 6, 27, 31, 2, 10, 31, 35, 1, 6, 35, 39, 2, 9, 39, 43, 1, 5,
  43, 47, 2, 47, 13, 51, 2, 51, 10, 55, 1, 55, 5, 59, 1, 59, 9, 63, 1, 63, 9,
  67, 2, 6, 67, 71, 1, 5, 71, 75, 1, 75, 6, 79, 1, 6, 79, 83, 1, 83, 9, 87, 2,
  87, 10, 91, 2, 91, 10, 95, 1, 95, 5, 99, 1, 99, 13, 103, 2, 103, 9, 107, 1, 6,
  107, 111, 1, 111, 5, 115, 1, 115, 2, 119, 1, 5, 119, 0, 99, 2, 0, 14, 0,
];

const run = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case 1:
        arr[arr[i + 3]] = arr[arr[i + 1]] + arr[arr[i + 2]];
        i += 3;
        break;
      case 2:
        arr[arr[i + 3]] = arr[arr[i + 1]] * arr[arr[i + 2]];
        i += 3;
        break;
      case 99:
        return arr;
      default:
        break;
    }
  }
};

console.log("total part 1", run([...input])[0]);

const part2 = () => {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const newArr = [...input];
      newArr[1] = i;
      newArr[2] = j;
      const currentResult = run(newArr);

      if (currentResult[0] === 19690720) {
        return 100 * i + j;
      }
    }
  }
};

console.log("total part 2", part2());
