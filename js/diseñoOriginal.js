<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Árbol Genealógico Responsivo</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
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
    }
    text {
      font-family: Arial, sans-serif;
      font-size: 14px;
      fill: #fff;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    line {
      stroke: #333;
      stroke-width: 2;
    }
  </style>
</head>
<body>
  <div class="tree-container">
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <!-- Rectángulos (nodos del árbol) -->
      <rect x="350" y="50" width="100" height="50" rx="5" />
      <rect x="150" y="200" width="100" height="50" rx="5" />
      <rect x="550" y="200" width="100" height="50" rx="5" />
      <rect x="50" y="350" width="100" height="50" rx="5" />
      <rect x="250" y="350" width="100" height="50" rx="5" />
      <rect x="450" y="350" width="100" height="50" rx="5" />
      <rect x="650" y="350" width="100" height="50" rx="5" />

      <!-- Texto dentro de los rectángulos -->
      <text x="400" y="75">Abuelo</text>
      <text x="200" y="225">Padre</text>
      <text x="600" y="225">Tío</text>
      <text x="100" y="375">Hijo 1</text>
      <text x="300" y="375">Hijo 2</text>
      <text x="500" y="375">Hijo 3</text>
      <text x="700" y="375">Hijo 4</text>

      <!-- Líneas de conectores -->
      <line x1="400" y1="100" x2="200" y2="200" />
      <line x1="400" y1="100" x2="600" y2="200" />
      <line x1="200" y1="250" x2="100" y2="350" />
      <line x1="200" y1="250" x2="300" y2="350" />
      <line x1="600" y1="250" x2="500" y2="350" />
      <line x1="600" y1="250" x2="700" y2="350" />
    </svg>
  </div>
</body>
</html>