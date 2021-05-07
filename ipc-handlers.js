const fs = require('fs');
const { join } = require('path');
const { BrowserWindow, ipcMain } = require("electron");

const savesFolder = __dirname + "/app/saves/";

exports.handlers = {
  register: function () {    
    ipcMain.handle('get-saved-boards-list', () => {
      const saves = [];
      const updatedSaves = [];
      const files = fs
        .readdirSync(savesFolder)
        .filter((file) => /\.board$/.test(file));
  
      files.forEach((file) => {
        const found = saves.find((save) => save.fileName == file);
        if (found) return updatedSaves.push(found);
  
        function getName(file) {
          try {
            return JSON.parse(fs.readFileSync(savesFolder + file, "utf-8")).name;
          } catch (e) {
            return false;
          }
        }
  
        updatedSaves.push({
          name: getName(file) || file,
          fileSize: fs.statSync(savesFolder + file).size,
          fileName: file,
          location: savesFolder + file,
        });
      });
  
      return updatedSaves;
    });
  
    ipcMain.handle('check-board-name', (_, fileName) => {
      fileName = fileName.replace(".board", "");
      fileName = fileName.replace(/[^a-z0-9|.]+/gi, "-").toLowerCase() || "new-board";
  
      let i = 0;
      while (
        fs
          .readdirSync(savesFolder)
          .includes(fileName + (i > 0 ? ` (${i})` : "") + ".board")
      )
        ++i;
      if (i > 0) fileName += " (" + i + ")";
  
      fileName += ".board";
  
      return fileName;
    });
  
    ipcMain.handle('create-board-file', (_, fileName, content) => {
      fs.writeFileSync(join(savesFolder, fileName), content, "utf-8");
  
      return {
        fileSize: fs.statSync(join(savesFolder, fileName)).size,
        fileName,
        location: join(savesFolder, fileName),
      };
    });
  
    ipcMain.handle('read-board', (_, fileName) => {
      return fs.readFileSync(join(savesFolder, fileName), "utf-8")
    });
  
    ipcMain.handle('write-board', async (_, fileName, content) => {
      await fs.promises.writeFile(join(savesFolder, fileName), content, "utf-8");
    });
  
    ipcMain.handle('remove-board', async (_, fileName) => {
      await fs.promises.unlink(join(savesFolder, fileName));
    });
  
    ipcMain.handle('read-custom-components', async () => {
      const p = join(__dirname, 'app', 'data', 'customcomponents.json');
      return await fs.promises.readFile(p, 'utf-8');
    });
  
    ipcMain.handle('save-custom-components', async (_, data) => {
      const p = join(__dirname, 'app', 'data', 'customcomponents.json');
      await fs.promises.writeFile(p, data, 'utf-8');
    });
  
    ipcMain.handle('rename-board', async (_, oldFileName, newFileName) => {
      const oldy = join(savesFolder, oldFileName);
      const newy = join(savesFolder, newFileName);
      await fs.promises.rename(oldy, newy);
    });
  
    ipcMain.on('open-dev-tools', () => {
      BrowserWindow.getFocusedWindow().webContents.openDevTools();
    });
  }
};
