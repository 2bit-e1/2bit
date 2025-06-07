import project_1 from "./1";
import project_2 from "./2";
import project_3 from "./3";
import project_4 from "./4";
import project_5 from "./5";
import project_6 from "./6";
import project_7 from "./7";
import project_8 from "./8";
import project_9 from "./9";

export default [
  project_1,
  project_2,
  project_3,
  project_4,
  project_5,
  project_6,
  project_7,
  project_8,
  project_9
]



// const fs = require("fs");
// const https = require("https");

// const dir = "./src/data/projects";

// fs.readdirSync(dir).map((fileName, ind) => {
//   const filePath = dir + `/${fileName}`
//   const newFilePath = dir + `/${ind + 1}.js`
//   fs.renameSync(filePath, newFilePath);

//   // const data = fs.readFileSync(dir + `/project_1.js`, 'utf8');
//   // fs.writeFileSync(filePath, data);
// });