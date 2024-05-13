import command from "../../config.json" assert { type: "json" };

const problemSolve = (): string[] => {
  let string = "";
  const problems: string[] = [];
  const files = `${command.problems.length} File(s)`;
  const SPACE = "&nbsp;";

  problems.push("<br>");

  command.problems.forEach((ele) => {
    let link = `<a href="${ele[2]}" target="_blank">${ele[0]}</a>`;
    string += SPACE.repeat(2);
    string += link;
    string += SPACE.repeat(17 - ele[0].length);
    string += ele[1];
    problems.push(string);
    string = "";
  });

  problems.push("<br>");
  problems.push(files);
  problems.push("<br>");
  return problems;
};

export const PROBLEM = problemSolve();
