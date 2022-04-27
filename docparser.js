const path = require("path");
const fs = require("fs");

let filenames = [];

fs.readdir(path.join(__dirname, "docs"), async function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  await Promise.all(
    files.map(async function (file) {
      if (!file) return null;

      // Read file content
      const data = fs.readFileSync(__dirname + "/docs/" + file, "utf-8");

      // Match: find patterns starting with Use
      let singleMatches = data.match(/(?<=Use ).*/gm) || [];
      singleMatches = singleMatches.map((item) => `- Use ${item}\n\n`); // Style matched with markdown

      // Match: find patterns starting open quotes
      let examplesMatches = data.match(/`([^`]*?)`/g) || [];
      examplesMatches = examplesMatches
        .filter(
          // Filter unnecesary data
          (item) =>
            item != "``" &&
            !item.startsWith("`theme.") &&
            !item.startsWith("`tailwind.") &&
            !item.startsWith("`diff-js ")
        )
        .filter(Boolean)
        .map((item) => {
          // Style matched with markdown
          if (item.startsWith("`html")) {
            return `\n### Example html\n\n${item}\n\n`;
          }
          return `- ${item}\n\n`;
        });

      const totalMatches = [].concat(singleMatches, examplesMatches);

      filenames.push({
        title: file.split(".mdx")[0],
        markdown: totalMatches.join(""),
        filename: file,
        markdownAlt: data,
      });
    })
  );

  fs.writeFileSync("./src/data.json", JSON.stringify(filenames), function (err) {
    if (err) return console.log(err);
    console.log("File saved!");
  });
});
