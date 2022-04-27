const path = require("path");
const fs = require("fs");
const axios = require("axios");
const docList = require("./docList.json");

let filenames = [];

async function run() {
  await Promise.all(
    docList.map(async function (file) {
      if (!file) return null;

      // Read file content
      const data = await getMarkdown(file);

      filenames.push({
        title: file.split(".mdx")[0],
        markdown: "",
        filename: file,
        markdownAlt: data,
      });
    })
  );

  fs.writeFileSync("./src/data.json", JSON.stringify(filenames), function (err) {
    if (err) return console.log(err);
    console.log("File saved!");
  });
}

function getMarkdown(file) {
  return axios("https://raw.githubusercontent.com/tailwindlabs/tailwindcss.com/master/src/pages/docs/" + file).then(
    ({ data }) => data
  );
}

run();
