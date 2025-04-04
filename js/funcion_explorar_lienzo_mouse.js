// Obtén el elemento SVG
const svg = document.getElementById('tree-svg');

// Establece el límite del lienzo
const limiteX = 800;
const limiteY = 600;

// Establece la posición inicial del lienzo
let posX = 0;
let posY = 0;

// Establece la velocidad de desplazamiento
const velocidad = 5;

// Función para mover el lienzo
function moverLienzo(dx, dy) {
  // Actualiza la posición del lienzo
  posX += dx;
  posY += dy;

  // Asegúrate de que el lienzo no se salga de los límites
  if (posX < 0) {
    posX = 0;
  } else if (posX > limiteX) {
    posX = limiteX;
  }

  if (posY < 0) {
    posY = 0;
  } else if (posY > limiteY) {
    posY = limiteY;
  }

  // Actualiza la posición del lienzo
  svg.setAttribute('viewBox', `${posX} ${posY} ${limiteX} ${limiteY}`);
}

// Agrega eventos de mouse para mover el lienzo
svg.addEventListener('wheel', (e) => {
  // Mueve el lienzo hacia arriba o abajo
  if (e.deltaY > 0) {
    moverLienzo(0, velocidad);
  } else {
    moverLienzo(0, -velocidad);
  }
});

svg.addEventListener('mousedown', (e) => {
  // Establece la posición inicial del mouse
  let mouseX = e.clientX;
  let mouseY = e.clientY;

  // Agrega un evento de mousemove para mover el lienzo
  document.addEventListener('mousemove', (e) => {
    // Mueve el lienzo hacia la posición del mouse
    moverLienzo(e.clientX - mouseX, e.clientY - mouseY);
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Agrega un evento de mouseup para detener el movimiento del lienzo
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', () => {});
  });
});