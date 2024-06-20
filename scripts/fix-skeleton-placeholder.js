const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../node_modules/react-native-skeleton-placeholder/lib/skeleton-placeholder.js"
);
const searchValue = "@react-native-masked-view/masked-view";
const replaceValue = "@react-native-masked-view/masked-view"; // Ensuring the correct path

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(searchValue, replaceValue);

  fs.writeFile(filePath, result, "utf8", (err) => {
    if (err) return console.log(err);
  });
});
