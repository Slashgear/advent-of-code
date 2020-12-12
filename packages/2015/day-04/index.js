const run = async () => {
  var md5 = (string) =>
    require("crypto").createHash("md5").update(string).digest("hex");

  for (var i = 0; md5("yzbqklnj" + i).slice(0, 5) !== "00000"; i++);

  console.log("5 zero", i);
};

const part2 = async () => {
  var md5 = (string) =>
    require("crypto").createHash("md5").update(string).digest("hex");

  for (var i = 0; md5("yzbqklnj" + i).slice(0, 6) !== "000000"; i++);

  console.log("6 zero", i);
};

run();
part2();
