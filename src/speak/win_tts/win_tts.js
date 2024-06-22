const { exec } = require("child_process");
const { ipcMain } = require("electron");

const path = require("path");

function speak(text) {
  const scriptPath = path.join(__dirname, "win_tts.ps1");
  const command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -text "${text}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
}
ipcMain.on("voice", (event, word) => {
  console.log(word);
  speak(word);
});
module.exports = [speak];
// # Microsoft Zira Desktop
// # Microsoft David Desktop
