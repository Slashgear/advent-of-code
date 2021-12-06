const fs = require("fs");

const run = async () => {
  const input = fs.readFileSync("./data.txt").toString("utf-8");
  const parseRegexp = /(?<x1>\d+),(?<y1>\d+) -> (?<x2>\d+),(?<y2>\d+)/;

  const values = input.split('\n').map(row => {
    const {
      groups: { x1, x2, y1, y2 },
    } = parseRegexp.exec(row);

    return {
      x1: parseInt(x1, 10),
      x2: parseInt(x2, 10),
      y1: parseInt(y1, 10),
      y2: parseInt(y2, 10),
    }
  });


  const filteredSegments = values.filter(
    (s) => s.x1 === s.x2 || s.y1 === s.y2
  );

  let count = 0;
  const memory = new Map();
  function addPoint(key) {
    let content = memory.get(key);
    if (!content) {
      content = 0;
    }
    content++;
    if (content === 2) {
      count++;
    }
    memory.set(key, content);
  }
  for (const segment of filteredSegments) {
    // go from start to end
    const isHorizontal = segment.y1 === segment.y2;
    let currentPoint = { x: segment.x1, y: segment.y1 };

    // for each point in the segment, add it to memory
    while (currentPoint.x !== segment.x2 || currentPoint.y !== segment.y2) {
      addPoint([currentPoint.x, currentPoint.y].join(`,`));

      if (isHorizontal) {
        currentPoint.x += currentPoint.x < segment.x2 ? 1 : -1;
      } else {
        currentPoint.y += currentPoint.y < segment.y2 ? 1 : -1;
      }
    }
    addPoint([currentPoint.x, currentPoint.y].join(`,`));
  }

  console.log(count);
};

run();
