import command from "../config.json" assert { type: "json" };
import { HELP } from "./commands/help";
import { BANNER } from "./commands/banner";
import { ABOUT } from "./commands/about";
import { DEFAULT } from "./commands/default";
import { PROJECTS } from "./commands/projects";
import { PROBLEM } from "./commands/problem";
import { createWhoami } from "./commands/whoami";
import { CONTACT } from "./commands/contact";

//mutWriteLines gets deleted and reassigned
let mutWriteLines = document.getElementById("write-lines");
let tempInput = "";
let userInput: string;
let isSudo = false;
let isPasswordInput = false;
let passwordCounter = 0;
// let bareMode = false;
let previousDirectory = "~";
let currentDirectory = "~";
//WRITELINESCOPY is used to during the "clear" command
const WRITELINESCOPY = mutWriteLines;
const TERMINAL = document.getElementById("terminal");
const USERINPUT = document.getElementById("user-input") as HTMLInputElement;
const INPUT_HIDDEN = document.getElementById("input-hidden");
const PASSWORD = document.getElementById("password-input");
const PASSWORD_INPUT = document.getElementById(
  "password-field"
) as HTMLInputElement;
const PRE_HOST = document.getElementById("pre-host");
const PRE_USER = document.getElementById("pre-user");
const HOST = document.getElementById("host");
const USER = document.getElementById("user");
const CPWD = document.getElementById("cpwd");
const PRE_CPWD = document.getElementById("pre-cpwd");
const PROMPT = document.getElementById("prompt");
const COMMANDS = [
  "help",
  "whoami",
  "repo",
  "banner",
  "cat",
  "ls",
  "pwd",
  "clear",
  "ipconfig",
  "send message",
  "cat about",
  "cat contacts",
  "cat meddapp",
  "cat estore",
  "cat deepai",
  "cat backend",
  "cd projects",
  "cat projects",
  "cat problems",
  "cd problems",
  "cd contacts",
  "run email",
  "run github",
  "run linkedin",
  "run problems",
  "run contacts",
];

const SUDO_PASSWORD = command.password;
const REPO_LINK = command.repoLink;
const HISTORY_KEY = "history";

function setHistory(item: string): void {
  const existingHistory = getHistory();
  existingHistory.push(item);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(existingHistory));
}

function getHistory(): string[] {
  const storedHistoryStr = localStorage.getItem(HISTORY_KEY);

  if (storedHistoryStr) {
    const storedHistory = JSON.parse(storedHistoryStr) as string[];
    return storedHistory;
  } else {
    return []; // Initialize with an empty list
  }
}

let HISTORY = getHistory();
let historyIdx = HISTORY.length;

const scrollToBottom = () => {
  const MAIN = document.getElementById("main");
  if (!MAIN) return;
  MAIN.scrollTop = MAIN.scrollHeight;
};

function userInputHandler(e: KeyboardEvent) {
  const key = e.key;
  switch (key) {
    case "Enter":
      e.preventDefault();
      if (!isPasswordInput) {
        enterKey();
      } else {
        passwordHandler();
      }
      scrollToBottom();
      break;
    case "Escape":
      USERINPUT.value = "";
      break;
    case "ArrowUp":
      arrowKeys(key);
      e.preventDefault();
      break;
    case "ArrowDown":
      arrowKeys(key);
      break;
    case "Tab":
      tabKey();
      e.preventDefault();
      break;
  }
}

function enterKey() {
  if (!mutWriteLines || !PROMPT) return;
  const resetInput = "";
  let newUserInput;
  userInput = USERINPUT.value;
  newUserInput = `<br/>$<span class='output'> ${userInput}</span>`;
  setHistory(userInput);
  HISTORY = getHistory();
  historyIdx = HISTORY.length;

  //if clear then early return
  if (userInput === "clear") {
    commandHandler(userInput.toLowerCase().trim());
    USERINPUT.value = resetInput;
    userInput = resetInput;
    return;
  }
  changeDirectory();
  const div = document.createElement("div");
  div.innerHTML = `<span id="prompt">${PROMPT.innerHTML}</span> ${newUserInput}`;

  if (mutWriteLines.parentNode) {
    mutWriteLines.parentNode.insertBefore(div, mutWriteLines);
  }

  /*
  if input is empty or a collection of spaces, 
  just insert a prompt before #write-lines
  */
  if (userInput.trim().length !== 0) {
    commandHandler(userInput.toLowerCase().trim());
  }

  USERINPUT.value = resetInput;
  userInput = resetInput;
}

function tabKey() {
  let currInput = USERINPUT.value;

  for (const ele of COMMANDS) {
    if (ele.startsWith(currInput)) {
      USERINPUT.value = ele;
      return;
    }
  }
}

function arrowKeys(e: string) {
  switch (e) {
    case "ArrowDown":
      if (historyIdx !== HISTORY.length) {
        historyIdx += 1;
        USERINPUT.value = HISTORY[historyIdx];
        if (historyIdx === HISTORY.length) USERINPUT.value = tempInput;
      }
      break;
    case "ArrowUp":
      if (historyIdx === HISTORY.length) tempInput = USERINPUT.value;
      if (historyIdx !== 0) {
        historyIdx -= 1;
        USERINPUT.value = HISTORY[historyIdx];
      }
      break;
  }
}

function commandHandler(input: string) {
  if (input.startsWith("cd") && input.trim() !== "cd") {
    const listOfFiles = input.trim().split(" ", 3);
    const fileName = listOfFiles[1];
    if (currentDirectory === "~") {
      switch (fileName) {
        case "projects":
          previousDirectory = currentDirectory;
          currentDirectory = " /projects";
          writeLines(["<br>"]);
          break;
        case "problems":
          previousDirectory = currentDirectory;
          currentDirectory = " /problems";
          writeLines(["<br>"]);
          break;

        case "contacts":
          previousDirectory = currentDirectory;
          currentDirectory = " /contacts";
          writeLines(["<br>"]);
          break;
        case "..":
          writeLines(["already at root.", "<br>"]);
          break;
        default:
          writeLines(["Directory not found.", "<br>"]);
      }
    } else if (fileName === "..") {
      previousDirectory = currentDirectory;
      currentDirectory = "~";
      writeLines(["<br>"]);
    } else {
      // writeLines(["NOd", "<br>"]);
      // writeLines(["<br>"]);
      writeLines(["Directory not found.", "<br>"]);
    }
    changeDirectory();
    initEventListeners();
    console.log("Current Directory: ", currentDirectory);
    console.log("Previous Directory: ", previousDirectory);
    return;
  }
  if (input.startsWith("run") && input.trim() !== "run") {
    const listOfFiles = input.trim().split(" ", 3);
    const fileName = listOfFiles[1];
    if (currentDirectory === " /contacts") {
      switch (fileName) {
        case "email":
          writeLines([
            `Email: <a href="mailto:${command.social.email}">${command.social.email}</a>`,
            "<br>",
          ]);
          break;
        case "github":
          writeLines(["Redirecting to github.com...", "<br>"]);
          setTimeout(() => {
            window.open(command.social.github, "_blank");
          }, 500);
          break;
        case "linkedin":
          writeLines(["Redirecting to linkedin.com...", "<br>"]);
          setTimeout(() => {
            window.open(command.social.linkedin, "_blank");
          }, 500);
          break;
        default:
          writeLines(["File not found.", "<br>"]);
      }
    } else if (currentDirectory === "~") {
      switch (fileName) {
        case "contacts":
          writeLines(CONTACT);
          break;
        case "problems":
          writeLines(PROBLEM);
          break;
        default:
          writeLines(["File not found.", "<br>"]);
      }
    } else if (currentDirectory === " /projects") {
      switch (fileName) {
        case "meddapp":
          writeLines(["yet to be implemented", "<br>"]);
          break;
        case "estore":
          writeLines(["yet to be implemented", "<br>"]);
          break;
        case "deepai":
          writeLines(["yet to be implemented", "<br>"]);
          break;
        case "backend":
          writeLines(["yet to be implemented", "<br>"]);
          break;
        default:
          writeLines(["File not found.", "<br>"]);
      }
    } else {
      writeLines(["File not found.", "<br>"]);
    }
    return;
  }
  if (input.startsWith("cat") && input.trim() !== "cat") {
    const listOfFiles = input.trim().split(" ", 3);
    const fileName = listOfFiles[1];
    if (currentDirectory === "~") {
      switch (fileName) {
        case "about":
          displayTextWithout(ABOUT);
          writeLines(["<br>"]);
          break;
        case "contacts":
          var json = JSON.stringify(command.social, null, 2);
          displayTextWithout(json);
          break;
        case "problems":
          var json = JSON.stringify(command.problems, null, 2);
          displayTextWithout(json);
          break;
        case "projects":
          var json = JSON.stringify(command.projects, null, 2);
          displayTextWithout(json);
          break;
        default:
          writeLines(["File not found.", "<br>"]);
      }
    } else if (currentDirectory === " /projects") {
      switch (fileName) {
        case "meddapp":
          displayTextWithout(command.projects[0][1]);
          writeLines(["<br>"]);
          break;
        case "estore":
          displayTextWithout(command.projects[1][1]);
          writeLines(["<br>"]);
          break;
        case "deepai":
          displayTextWithout(command.projects[2][1]);
          writeLines(["<br>"]);
          break;
        case "backend":
          displayTextWithout(command.projects[3][1]);
          writeLines(["<br>"]);
          break;
        default:
          writeLines(["File not found.", "<br>"]);
      }
    } else {
      writeLines(["File not found.", "<br>"]);
    }
    return;
  }

  function check() {
    var ipp = localStorage.getItem("ip");
    if (!ipp) {
      return "Not Found";
    }
    return ipp;
  }
  switch (input) {
    case "ipconfig":
      writeLines([check(), "<br>"]);
      break;
    case "clear":
      setTimeout(() => {
        if (!TERMINAL || !WRITELINESCOPY) return;
        TERMINAL.innerHTML = "";
        TERMINAL.appendChild(WRITELINESCOPY);
        mutWriteLines = WRITELINESCOPY;
      });
      break;
    case "send message":
      writeLines([
        "Usage: <span class='command'>'send message -m &lt;message&gt; -e &lt;email&gt;'</span>",
        "<br>",
      ]);
      break;
    case "banner":
      writeLines(BANNER);
      break;
    case "help":
      writeLines(HELP);
      break;
    case "whoami":
      writeLines(createWhoami());
      break;
    case "projects":
      writeLines(PROJECTS);
      break;
    case "problems":
      writeLines(PROBLEM);
      break;
    case "repo":
      writeLines(["Redirecting to github.com repo", "<br>"]);
      setTimeout(() => {
        window.open(REPO_LINK, "_blank");
      }, 500);
      break;

    case "sudo":
      if (!PASSWORD) return;
      isPasswordInput = true;
      USERINPUT.disabled = true;

      if (INPUT_HIDDEN) INPUT_HIDDEN.style.display = "none";
      PASSWORD.style.display = "block";
      setTimeout(() => {
        PASSWORD_INPUT.focus();
      }, 100);

      break;
    case "ls":
      if (isSudo) {
        writeLines(["system", "<br>"]);
      } else {
        if (currentDirectory === "~") {
          writeLines([
            '<pre style="font-weight: bold">projects   problems.deb   about.deb   contact.deb</pre>',
            "<br>",
          ]);
          writeLines([
            "try: <span class='command'>'cat &lt;file&gt; without file Extension'</span>",
            "<br>",
          ]);
        } else if (currentDirectory === " /projects") {
          const projectNames = command.projects.map((item) => item[0]);
          let set = "";
          projectNames.forEach((item) => {
            set += item + "   ";
          });
          writeLines([`<pre>${set}</pre>`, "<br>"]);
          writeLines([
            "try: <span class='command'>'cat &lt;file&gt; without file Extension'</span>",
            "<br>",
          ]);
        } else if (currentDirectory === " /contacts") {
          writeLines(["<pre>email   github   linkedin</pre>", "<br>"]);
          writeLines([
            "try: <span class='command'>'run &lt;file&gt; without file Extension'</span>",
            "<br>",
          ]);
        } else if (currentDirectory === " /problems") {
          writeLines(["<pre>leetcode    codeforces</pre>", "<br>"]);
        }
      }
      break;
    case "pwd":
      writeLines([`${currentDirectory}`, "<br>"]);
      break;
    case "run":
      writeLines([
        "Usage: <span class='command'>'run &lt;file&gt;'</span>",
        "<br>",
      ]);
      break;
    case "cat":
      writeLines([
        "Usage: <span class='command'>'cat &lt;file&gt;'</span>",
        "<br>",
      ]);
      writeLines([
        "type <span class='command'>'ls'</span> for a list of directories.",
        "<br>",
      ]);
      break;

    default:
      writeLines(DEFAULT);
      break;
  }
}

function writeLines(message: string[]) {
  message.forEach((item, idx) => {
    displayText(item, idx);
  });
}

function displayText(item: string, idx: number) {
  setTimeout(() => {
    if (!mutWriteLines) return;
    const p = document.createElement("p");
    p.innerHTML = item;

    mutWriteLines.parentNode!.insertBefore(p, mutWriteLines);
    scrollToBottom();
  }, 40 * idx);
}

function displayTextWithout(item: string) {
  if (!mutWriteLines) return;
  const p = document.createElement("pre");
  p.innerHTML = item;
  p.style.whiteSpace = "pre-wrap";
  // p.style.fontFamily = "bold sans-serif";
  p.style.wordSpacing = "3px";
  mutWriteLines.parentNode!.insertBefore(p, mutWriteLines);
  scrollToBottom();
}
function revertPasswordChanges() {
  if (!INPUT_HIDDEN || !PASSWORD) return;
  PASSWORD_INPUT.value = "";
  USERINPUT.disabled = false;
  INPUT_HIDDEN.style.display = "block";
  PASSWORD.style.display = "none";
  isPasswordInput = false;

  setTimeout(() => {
    USERINPUT.focus();
  }, 200);
}

function passwordHandler() {
  if (passwordCounter === 2) {
    if (!INPUT_HIDDEN || !mutWriteLines || !PASSWORD) return;
    writeLines([
      "<br>",
      "INCORRECT PASSWORD.",
      "PERMISSION NOT GRANTED.",
      "<br>",
    ]);
    revertPasswordChanges();
    passwordCounter = 0;
    return;
  }

  if (PASSWORD_INPUT.value === SUDO_PASSWORD) {
    if (!mutWriteLines || !mutWriteLines.parentNode) return;
    writeLines([
      "<br>",
      "PERMISSION GRANTED.",
      "Try <span class='command'>'rm -rf'</span>",
      "<br>",
    ]);
    revertPasswordChanges();
    isSudo = true;
    return;
  } else {
    PASSWORD_INPUT.value = "";
    passwordCounter++;
  }
}

const changeDirectory = () => {
  if (CPWD) {
    CPWD.innerText = currentDirectory;
  }
  if (PRE_CPWD) {
    PRE_CPWD.innerText = currentDirectory;
  }
};
const initEventListeners = () => {
  if (HOST) {
    HOST.innerText = command.hostname;
  }
  if (CPWD) {
    CPWD.innerText = currentDirectory;
  }

  if (USER) {
    USER.innerText = command.username;
  }

  if (PRE_HOST) {
    PRE_HOST.innerText = command.hostname;
  }

  if (PRE_USER) {
    PRE_USER.innerText = command.username;
  }
  if (PRE_CPWD) {
    PRE_CPWD.innerText = "~";
  }

  window.addEventListener("load", () => {
    writeLines(BANNER);
  });

  USERINPUT.addEventListener("keypress", userInputHandler);
  USERINPUT.addEventListener("keydown", userInputHandler);
  PASSWORD_INPUT.addEventListener("keypress", userInputHandler);

  window.addEventListener("click", () => {
    USERINPUT.focus();
  });
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  console.log(
    `%cPassword: ${command.password}`,
    "color: red; font-size: 20px;"
  );
};

initEventListeners();
