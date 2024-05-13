const helpObj = {
  commands: [
    ["'whoami'", "A perplexing question."],
    ["'sudo'", "???"],
    ["'repo'", "View the Github Repository."],
    ["'banner'", "Display the banner."],
    ["'clear'", "Clear the terminal."],
    // ["'email'", "lets talk ..."],
    // ["'linkedin'", "Connect with me."],
    // ["'github'", "Check my other projects."],
    ["'ipconfig'", "I can see you 😂"],
    ["'send message'", "🫣"],
  ],
};

const createHelp = (): string[] => {
  const help: string[] = [];
  help.push("<br>");

  helpObj.commands.forEach((ele) => {
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(2);
    string += "<span class='command'>";
    string += ele[0];
    string += "</span>";
    string += SPACE.repeat(17 - ele[0].length);
    string += ele[1];
    help.push(string);
  });

  help.push("<br>");
  help.push("Press <span class='keys'>[Tab]</span> for auto completion.");
  help.push("Press <span class='keys'>[Esc]</span> to clear the input line.");
  help.push(
    "Press <span class='keys'>[↑][↓]</span> to scroll through your history of commands."
  );
  help.push("<br>");
  return help;
};

export const HELP = createHelp();
