let savedCustomComponents = [];

function saveCustomComponent(component) {
  const clone = cloneComponent(component);
  clone.name = component.name;
  savedCustomComponents.push(clone);
  toolbar.message("Saved component " + component.name);
}

async function saveCustomComponents() {
  const stringified = stringify(savedCustomComponents);
  await window.ipc.invoke("save-custom-components", stringified);
}

async function getCustomComponents() {
  const data = await window.ipc.invoke("read-custom-components");
  savedCustomComponents = parse(data).components;
}
