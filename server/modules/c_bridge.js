const { execFile } = require("child_process");
const path = require("path");

function runCModule(moduleName, args = [], callback) {
  const EXEC_EXT = process.platform === "win32" ? ".exe" : "";
  const execPath = path.join(__dirname, "../../c_modules", moduleName + EXEC_EXT);

  execFile(execPath, args, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error running ${moduleName}:`, stderr || error.message);
      callback({ success: false, error: stderr || error.message });
    } else {
      callback({ success: true, output: stdout });
    }
  });
}

module.exports = { runCModule };
