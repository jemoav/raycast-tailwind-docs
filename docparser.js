//requiring path and fs modules
const path = require("path");
const fs = require("fs");
//joining path of directory

const directoryPath = path.join(__dirname, "docs");
//passsing directoryPath and callback function
let filenames = [];
fs.readdir(directoryPath, async function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  await Promise.all(
    files.map(async function (file, index) {
      if (!file) return null;
      // Do whatever you want to do with the file

      const data = fs.readFileSync(__dirname + "/docs/" + file, "utf-8");
      let matches = [];

      matches = data.match(/(?<=Use ).*/gm) || [];
      matches = matches.map((item) => `- Use ${item}\n\n`);

      let newMatches = data.match(/`([^`]*?)`/g) || [];
      newMatches = newMatches
        .filter(
          (item) =>
            item != "``" &&
            !item.startsWith("`theme.") &&
            !item.startsWith("`tailwind.") &&
            !item.startsWith("`diff-js ")
        )
        .filter(Boolean)
        .map((item) => {
          if (item.startsWith("`html")) {
            return `\n### Example html\n\n${item}\n\n`;
          }
          return `- ${item}\n\n`;
        });
      // console.log("FILE",matches.length);

      if (file.includes("max-height.mdx")) {
        console.log("DATa", data);
        console.log("MATCHES", matches);
        console.log("NEWMATCHED", newMatches);
      }

      matches = matches.concat(newMatches);

      filenames.push({
        title: file.split(".mdx")[0],
        markdown: matches.join(""),
        filename: file,
      });
    })
  );

  fs.writeFileSync("./src/data2.json", JSON.stringify(filenames), function (err) {
    if (err) return console.log(err);
    console.log("Hello World > data2.json");
  });

  // console.log(JSON.stringify(filenames));
});
