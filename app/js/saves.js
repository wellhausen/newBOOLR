let saves = [];

let openedSaveFile;

// Read save files from "saves" folder
async function readSaveFiles() {
  saves = await window.ipc.invoke('get-saved-boards-list');
}

function clearBoard() {
  setLocalStorage();

  openedSaveFile = undefined;

  zoom = zoomAnimation = 100;
  offset = { x: 0, y: 0 };

  variables = {};
  variableReferences = {};

  path = [];

  chat.hide();
  boolrConsole.hide();
  contextMenu.hide();
  waypointsMenu.hide();
  hoverBalloon.hide();
  customComponentToolbar.hide();
  notifications.innerHTML = "";

  components = [];
  wires = [];

  redoStack = [];
  undoStack = [];

  setTimeout(() => newBoardMenu.onopen());
}

async function openSaveFile(save) {
  const content = await window.ipc.invoke('read-board', save.fileName);

  const saveFile = JSON.parse(content);
  if (!Array.isArray(saveFile)) {
    clearBoard();

    offset.x = saveFile.offset.x || 0;
    offset.y = saveFile.offset.y || 0;
    zoom = zoomAnimation = saveFile.zoom || 100;

    variables = saveFile.variables || {};
    variableReferences = saveFile.variableReferences || {};

    const parsed = parse(saveFile.data);

    addSelection(parsed.components, parsed.wires);
  } else {
    clearBoard();

    const parsed = parse(saveFile);
    console.log(parsed);
    addSelection(parsed.components, parsed.wires);
  }

  openedSaveFile = save;
  document.title = save.name + " - BOOLR";
}

async function createFileName(name) {
  return await window.ipc.invoke('check-board-name', name);
}

async function createSaveFile(name) {
  if (!name || name.length == 0) name = "New board";

  // Create safe file name
  const fileName = await createFileName(name);

  const save = {
    name,
    offset,
    zoom,
    variables,
    variableReferences,
    data: stringify(components, wires),
  };

  const fileInfo = await window.ipc.invoke('create-board-file', fileName, JSON.stringify(save));
  fileInfo.name = name;

  saves.push(fileInfo);

  openedSaveFile = saves.slice(-1)[0];
  document.title = save.name + " - BOOLR";
}

function save(msg = false) {
  toolbar.message("Saving...");
  setTimeout(async () => {
    if (!components || components.length == 0) return;
    if (!openedSaveFile) return dialog.createBoard();

    const save = {
      name: openedSaveFile.name,
      offset,
      zoom,
      variables,
      variableReferences,
      data: stringify(components, wires),
    };

    try {
      await window.ipc.invoke('write-board', openedSaveFile.fileName, JSON.stringify(save));
      if (msg) {
        toolbar.message("Saved changes to " + openedSaveFile.fileName);
      }
    } catch (err) {
      if (err) console.error(err);
    }
  });
}
