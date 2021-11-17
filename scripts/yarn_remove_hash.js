import * as fs from 'fs';

const content = fs.readFileSync("yarn.lock", "utf-8");
const packageToDelete = "yallist"

let lines = content.split("\n")

for (let [i, line] of Object.entries(lines)) {
    if (line.startsWith(packageToDelete + "@")) {
        lines[i]="";
        let y = i;
        while (lines[++y][0] ==" "){
            lines[y]= ""
        }
    }
}

fs.writeFileSync("yarn.lock", lines.join("\n"))