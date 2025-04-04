<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Árbol Genealógico Interactivo</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }
    .tree-container {
      width: 90%;
      max-width: 800px;
      height: auto;
      border: 1px solid #ccc;
      background-color: #fff;
      overflow: visible;
    }
    svg {
      width: 100%;
      height: auto;
    }
    rect {
      fill: #4CAF50;
      stroke: #333;
      stroke-width: 2;
      cursor: move;
    }
    text {
      font-family: Arial, sans-serif;
      font-size: 14px;
      fill: #fff;
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none; /* Evita que el texto interfiera con el movimiento */
    }
    line {
      stroke: #333;
      stroke-width: 2;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="tree-container">
    <svg id="tree-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <!-- Rectángulos (nodos del árbol) -->
      <g id="abuelo">
        <rect x="350" y="50" width="100" height="50" rx="5" />
        <text x="400" y="75">Abuelo</text>
      </g>
      <g id="padre">
        <rect x="150" y="200" width="100" height="50" rx="5" />
        <text x="200" y="225">Padre</text>
      </g>
      <g id="tio">
        <rect x="550" y="200" width="100" height="50" rx="5" />
        <text x="600" y="225">Tío</text>
      </g>

      <!-- Líneas de conectores -->
      <line id="line-abuelo-padre" x1="400" y1="100" x2="200" y2="200" />
      <line id="line-abuelo-tio" x1="400" y1="100" x2="600" y2="200" />
    </svg>
  </div>
  <button id="add-child">Agregar Hijo</button>

  <script>
    const svg = document.getElementById('tree-svg');
    const addChildButton = document.getElementById('add-child');
    let selectedElement = null;
    let offset = { x: 0, y: 0 };

    // Función para agregar un nuevo hijo
    addChildButton.addEventListener('click', () => {
      const newId = `hijo-${Date.now()}`;
      const newX = Math.random() * 700 + 50; // Posición aleatoria en X
      const newY = Math.random() * 400 + 200; // Posición aleatoria en Y

      // Crear un nuevo grupo (g) para el hijo
      const newChild = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      newChild.setAttribute('id', newId);

      // Crear rectángulo y texto
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', newX);
      rect.setAttribute('y', newY);
      rect.setAttribute('width', 100);
      rect.setAttribute('height', 50);
      rect.setAttribute('rx', 5);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', Number(newX) + 50);
      text.setAttribute('y', Number(newY) + 25);
      text.textContent = 'Hijo';

      // Agregar rectángulo y texto al grupo
      newChild.appendChild(rect);
      newChild.appendChild(text);

      // Agregar el nuevo hijo al SVG
      svg.appendChild(newChild);

      // Crear una línea conectora desde el padre al nuevo hijo
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 200); // Conectar desde el padre
      line.setAttribute('y1', 225);
      line.setAttribute('x2', Number(newX) + 50);
      line.setAttribute('y2', Number(newY) + 25);
      line.setAttribute('id', `line-${newId}`);

      // Agregar la línea al SVG
      svg.appendChild(line);

      // Hacer el nuevo hijo arrastrable
      makeDraggable(newChild, line);
    });

    // Función para hacer un elemento arrastrable
    function makeDraggable(element, line) {
      element.addEventListener('mousedown', (e) => {
        selectedElement = element;
        const rect = element.getBoundingClientRect();
        offset.x = e.clientX - rect.x;
        offset.y = e.clientY - rect.y;
      });

      svg.addEventListener('mousemove', (e) => {
        if (selectedElement) {
          const x = e.clientX - offset.x;
          const y = e.clientY - offset.y;

          // Mover el elemento
          selectedElement.setAttribute('transform', `translate(${x}, ${y})`);

          // Actualizar la línea conectora
          const rect = selectedElement.querySelector('rect');
          const text = selectedElement.querySelector('text');
          const lineId = `line-${selectedElement.id}`;
          const lineElement = document.getElementById(lineId);

          if (lineElement) {
            lineElement.setAttribute('x2', x + 50); // Centro del rectángulo
            lineElement.setAttribute('y2', y + 25);
          }
        }
      });

      svg.addEventListener('mouseup', () => {
        selectedElement = null;
      });
    }

    // Hacer los elementos existentes arrastrables
    document.querySelectorAll('g').forEach((group) => {
      const line = document.getElementById(`line-${group.id}`);
      makeDraggable(group, line);
    });
  </script>
</body>
</html>