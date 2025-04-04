const svg = document.getElementById("tree-svg");
const loadJsonButton = document.getElementById("load-json");

// Variables para el panning
let isPanning = false;
let startPoint = { x: 0, y: 0 };
let viewBox = { x: 0, y: 0, width: 800, height: 600 };

// Variables para el zoom
const zoomIntensity = 0.1;
let currentScale = 1;

// Función para cargar el JSON externo
async function loadJson() {
  try {
    const response = await fetch("tree-data.json"); // Ruta al archivo JSON
    if (!response.ok) throw new Error("Error al cargar el JSON");
    const data = await response.json();
    drawTree(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Función para crear un nodo (rectángulo + texto)
function createNode(x, y, width, height, id, name) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", id);

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("rx", 5);

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x + width / 2);
  text.setAttribute("y", y + height / 2);
  text.textContent = name;

  group.appendChild(rect);
  group.appendChild(text);

  return group;
}

// Función para crear una línea conectora
function createLine(x1, y1, x2, y2, id) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("id", id);
  return line;
}

// Función para dibujar el árbol
function drawTree(data) {
  const nodeWidth = 100;
  const nodeHeight = 50;
  const verticalSpacing = 100;
  const horizontalSpacing = 150;

  // Mapa para almacenar la posición de cada nodo
  const nodePositions = {};

  // Función recursiva para dibujar nodos y conectores
  function drawNode(node, parentId, level, index) {
    const { id, name } = node;

    // Calcular la posición del nodo
    let x, y;
    if (!parentId) {
      // Nodo raíz
      x = 350;
      y = 50;
    } else {
      // Nodo hijo: se coloca debajo del padre
      const parentPosition = nodePositions[parentId];
      const siblingsCount = data.filter((n) => n.padre === parentId).length;
      x =
        parentPosition.x +
        (index - (siblingsCount - 1) / 2) * horizontalSpacing;
      y = parentPosition.y + verticalSpacing;
    }

    // Guardar la posición del nodo
    nodePositions[id] = { x, y };

    // Crear el nodo
    const nodeElement = createNode(x, y, nodeWidth, nodeHeight, id, name);
    svg.appendChild(nodeElement);

    // Conectar con el padre (si existe)
    if (parentId) {
      const parentPosition = nodePositions[parentId];
      const line = createLine(
        parentPosition.x + nodeWidth / 2,
        parentPosition.y + nodeHeight,
        x + nodeWidth / 2,
        y,
        `line-${id}`
      );
      svg.appendChild(line);
    }

    // Dibujar hijos (si existen)
    const children = data.filter((n) => n.padre === id);
    children.forEach((child, i) => {
      drawNode(child, id, level + 1, i);
    });

    // Hacer el nodo arrastrable
    makeDraggable(nodeElement);
  }

  // Dibujar el árbol desde el nodo raíz
  const rootNode = data.find((node) => !node.padre);
  if (rootNode) {
    drawNode(rootNode, null, 0, 0);
  }
}

// Función para hacer un elemento arrastrable
function makeDraggable(element) {
  let selectedElement = null;
  let offset = { x: 0, y: 0 };

  element.addEventListener("mousedown", (e) => {
    selectedElement = element;
    const rect = element.getBoundingClientRect();
    offset.x = e.clientX - rect.x;
    offset.y = e.clientY - rect.y;
  });

  svg.addEventListener("mousemove", (e) => {
    if (selectedElement) {
      const x = e.clientX - offset.x;
      const y = e.clientY - offset.y;

      // Mover el elemento
      selectedElement.setAttribute("transform", `translate(${x}, ${y})`);

      // Actualizar las líneas conectores
      const lineId = `line-${selectedElement.id}`;
      const lineElement = document.getElementById(lineId);

      if (lineElement) {
        const rect = selectedElement.querySelector("rect");
        const centerX = x + parseFloat(rect.getAttribute("width")) / 2;
        const centerY = y + parseFloat(rect.getAttribute("height")) / 2;

        lineElement.setAttribute("x2", centerX);
        lineElement.setAttribute("y2", centerY);
      }
    }
  });

  svg.addEventListener("mouseup", () => {
    selectedElement = null;
  });
}

// Funcionalidad de panning
svg.addEventListener("mousedown", (e) => {
  if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
    // Botón central o clic + Ctrl
    isPanning = true;
    startPoint = { x: e.clientX, y: e.clientY };
  }
});

svg.addEventListener("mousemove", (e) => {
  if (isPanning) {
    const dx = (e.clientX - startPoint.x) / currentScale;
    const dy = (e.clientY - startPoint.y) / currentScale;
    viewBox.x -= dx;
    viewBox.y -= dy;
    svg.setAttribute(
      "viewBox",
      `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
    );
    startPoint = { x: e.clientX, y: e.clientY };
  }
});

svg.addEventListener("mouseup", () => {
  isPanning = false;
});

svg.addEventListener("mouseleave", () => {
  isPanning = false;
});

// Funcionalidad de zoom
svg.addEventListener("wheel", (e) => {
  e.preventDefault();
  const rect = svg.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const wheelDelta = e.deltaY < 0 ? 1 : -1;
  const zoomFactor = Math.exp(wheelDelta * zoomIntensity);

  // Ajustar el viewBox para hacer zoom
  viewBox.width *= zoomFactor;
  viewBox.height *= zoomFactor;
  viewBox.x -= (mouseX / currentScale) * (zoomFactor - 1);
  viewBox.y -= (mouseY / currentScale) * (zoomFactor - 1);

  svg.setAttribute(
    "viewBox",
    `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
  );
  currentScale *= zoomFactor;
});

// Cargar el JSON al hacer clic en el botón
//loadJsonButton.addEventListener('click', loadJson);
document.addEventListener("DOMContentLoaded", async () => {
  await loadJson();
});
