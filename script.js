// Inicializar Feather icons
feather.replace();

// Inicializar AOS
AOS.init();

// Create sun flares
function createSunFlares() {
  const flaresContainer = document.getElementById("sun-flares");
  flaresContainer.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    const flare = document.createElement("div");
    flare.className = "sun-flare";

    // Position flares around the sun
    const angle = (i / 8) * Math.PI * 2;
    const distance = 70;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    flare.style.width = "40px";
    flare.style.height = "10px";
    flare.style.left = `calc(50% + ${x}px)`;
    flare.style.top = `calc(50% + ${y}px)`;
    flare.style.transformOrigin = "center";
    flare.style.transform += ` rotate(${angle * (180 / Math.PI)}deg)`;
    flare.style.animationDelay = `${i * 0.5}s`;

    flaresContainer.appendChild(flare);
  }
}

// Variables para la animación de viento
let windInterval;
const windContainer = document.getElementById("wind-container");

// Función para crear partículas de viento
function createWindParticle() {
  const particle = document.createElement("div");
  particle.className = "wind-particle";

  // Tamaño aleatorio
  const size = Math.random() * 4 + 2;
  particle.style.width = size + "px";
  particle.style.height = size + "px";

  // Posición inicial aleatoria
  particle.style.left = "-100px";
  particle.style.top = Math.random() * window.innerHeight + "px";

  // Duración de animación aleatoria
  particle.style.animationDuration = Math.random() * 4 + 6 + "s";
  particle.style.animationDelay = Math.random() * 2 + "s";

  windContainer.appendChild(particle);

  // Remover partícula después de la animación
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 10000);
}

// Función para crear líneas de viento
function createWindLine() {
  const line = document.createElement("div");
  line.className = "wind-line";

  // Ancho aleatorio
  const width = Math.random() * 100 + 50;
  line.style.width = width + "px";

  // Posición inicial aleatoria
  line.style.left = "-200px";
  line.style.top = Math.random() * window.innerHeight + "px";

  // Duración de animación aleatoria
  line.style.animationDuration = Math.random() * 3 + 5 + "s";
  line.style.animationDelay = Math.random() * 1 + "s";

  windContainer.appendChild(line);

  // Remover línea después de la animación
  setTimeout(() => {
    if (line.parentNode) {
      line.parentNode.removeChild(line);
    }
  }, 8000);
}

// Función para iniciar la animación de viento
function startWindAnimation() {
  // Crear partículas y líneas periódicamente
  windInterval = setInterval(() => {
    // Crear partículas
    if (Math.random() < 0.7) {
      createWindParticle();
    }

    // Crear líneas
    if (Math.random() < 0.3) {
      createWindLine();
    }
  }, 300);
}

// Function to update sun animation based on UV index
function updateSunAnimation(uvIndex) {
  const sun = document.getElementById("animated-sun");
  const warmingEffect = document.getElementById("uv-warming");
  const sunContainer = document.querySelector(".sun-container");
  const sunRays = document.querySelector(".sun-rays");
  const sunGlow = document.querySelector(".sun-glow");

  // Apply effects based on UV index
  if (uvIndex >= 8) {
    // Extreme UV - very intense sun
    sun.style.boxShadow =
      "0 0 100px #ffd700, " +
      "0 0 180px #ff8c00, " +
      "0 0 250px #ff4500, " +
      "0 0 320px #ff0000";
    sunContainer.style.filter = "drop-shadow(0 0 30px rgba(255, 69, 0, 0.9))";
    sunContainer.style.width = "140px";
    sunContainer.style.height = "140px";
    sunRays.style.opacity = "1";
    sunGlow.style.opacity = "0.8";
    warmingEffect.classList.add("active");
    warmingEffect.style.background =
      "radial-gradient(circle at top right, rgba(255, 69, 0, 0.7) 0%, rgba(255, 0, 0, 0.4) 30%, transparent 70%)";
  } else if (uvIndex >= 6) {
    // High UV - intense sun
    sun.style.boxShadow =
      "0 0 80px #ffd700, " + "0 0 140px #ff8c00, " + "0 0 200px #ff4500";
    sunContainer.style.filter = "drop-shadow(0 0 25px rgba(255, 140, 0, 0.8))";
    sunContainer.style.width = "130px";
    sunContainer.style.height = "130px";
    sunRays.style.opacity = "0.9";
    sunGlow.style.opacity = "0.7";
    warmingEffect.classList.add("active");
    warmingEffect.style.background =
      "radial-gradient(circle at top right, rgba(255, 140, 0, 0.6) 0%, rgba(255, 69, 0, 0.3) 30%, transparent 70%)";
  } else if (uvIndex >= 3) {
    // Moderate UV
    sun.style.boxShadow =
      "0 0 60px #ffd700, " + "0 0 100px #ff8c00, " + "0 0 150px #ff4500";
    sunContainer.style.filter = "drop-shadow(0 0 20px rgba(255, 215, 0, 0.7))";
    sunContainer.style.width = "120px";
    sunContainer.style.height = "120px";
    sunRays.style.opacity = "0.7";
    sunGlow.style.opacity = "0.6";
    warmingEffect.classList.add("active");
    warmingEffect.style.background =
      "radial-gradient(circle at top right, rgba(255, 215, 0, 0.4) 0%, rgba(255, 140, 0, 0.2) 30%, transparent 70%)";
  } else {
    // Low UV - less prominent
    sun.style.boxShadow = "0 0 30px #ffd700, " + "0 0 60px #ff8c00";
    sunContainer.style.filter = "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))";
    sunContainer.style.width = "100px";
    sunContainer.style.height = "100px";
    sunRays.style.opacity = "0.4";
    sunGlow.style.opacity = "0.3";
    warmingEffect.classList.remove("active");
  }
}

// Function to update air quality background
function updateAirQualityBackground(airQuality) {
  const body = document.body;

  // Remove all air quality classes
  body.classList.remove(
    "air-quality-good",
    "air-quality-moderate",
    "air-quality-unhealthy",
    "air-quality-very-unhealthy",
    "air-quality-hazardous"
  );

  // Add appropriate class based on air quality
  if (airQuality <= 50) {
    body.classList.add("air-quality-good");
  } else if (airQuality <= 100) {
    body.classList.add("air-quality-moderate");
  } else if (airQuality <= 150) {
    body.classList.add("air-quality-unhealthy");
  } else if (airQuality <= 200) {
    body.classList.add("air-quality-very-unhealthy");
  } else {
    body.classList.add("air-quality-hazardous");
  }
}

// Function to update wind animation intensity based on air quality
function updateWindAnimation(airQuality) {
  // Adjust wind animation based on air quality
  if (airQuality > 100) {
    // More intense wind for poor air quality
    if (windInterval) {
      clearInterval(windInterval);
    }
    windInterval = setInterval(() => {
      // Create more particles for poor air quality
      if (Math.random() < 0.9) {
        createWindParticle();
      }

      // Create more lines for poor air quality
      if (Math.random() < 0.5) {
        createWindLine();
      }
    }, 200);
  } else {
    // Normal wind for good air quality
    if (windInterval) {
      clearInterval(windInterval);
    }
    windInterval = setInterval(() => {
      if (Math.random() < 0.7) {
        createWindParticle();
      }

      if (Math.random() < 0.3) {
        createWindLine();
      }
    }, 300);
  }
}

// Function to generate random weather data
function generateRandomWeatherData() {
  // Random UV index between 0 and 12
  const uvIndex = Math.floor(Math.random() * 13);

  // Random air quality between 0 and 300
  const airQuality = Math.floor(Math.random() * 301);

  return {
    uvIndex,
    airQuality,
  };
}

// Function to update all weather data displays
function updateWeatherData(weatherData) {
  const { uvIndex, airQuality } = weatherData;

  // Update UV display
  document.getElementById("uv-value").textContent = uvIndex;

  // Determine UV level and color
  let uvLevel, uvColor, uvWidth;
  if (uvIndex <= 2) {
    uvLevel = "Bajo";
    uvColor = "bg-green-500";
    uvWidth = "16%";
  } else if (uvIndex <= 5) {
    uvLevel = "Moderado";
    uvColor = "bg-yellow-500";
    uvWidth = "40%";
  } else if (uvIndex <= 7) {
    uvLevel = "Alto";
    uvColor = "bg-orange-500";
    uvWidth = "60%";
  } else if (uvIndex <= 10) {
    uvLevel = "Muy Alto";
    uvColor = "bg-red-500";
    uvWidth = "80%";
  } else {
    uvLevel = "Extremo";
    uvColor = "bg-purple-600";
    uvWidth = "100%";
  }

  document.getElementById("uv-level").textContent = uvLevel;
  document.getElementById(
    "uv-level"
  ).className = `px-4 py-2 rounded-full text-white font-medium ${uvColor}`;
  document.getElementById("uv-meter").style.width = uvWidth;
  document.getElementById(
    "uv-meter"
  ).className = `h-2.5 rounded-full ${uvColor}`;

  // Update air quality display
  document.getElementById("air-value").textContent = airQuality;

  // Determine air quality level and color
  let airLevel, airColor, airWidth;
  if (airQuality <= 50) {
    airLevel = "Buena";
    airColor = "bg-green-500";
    airWidth = "16%";
  } else if (airQuality <= 100) {
    airLevel = "Moderada";
    airColor = "bg-yellow-500";
    airWidth = "33%";
  } else if (airQuality <= 150) {
    airLevel = "Dañina";
    airColor = "bg-orange-500";
    airWidth = "50%";
  } else if (airQuality <= 200) {
    airLevel = "Muy Dañina";
    airColor = "bg-red-500";
    airWidth = "66%";
  } else {
    airLevel = "Peligrosa";
    airColor = "bg-purple-600";
    airWidth = "100%";
  }

  document.getElementById("air-level").textContent = airLevel;
  document.getElementById(
    "air-level"
  ).className = `px-4 py-2 rounded-full text-white font-medium ${airColor}`;
  document.getElementById("air-meter").style.width = airWidth;
  document.getElementById(
    "air-meter"
  ).className = `h-2.5 rounded-full ${airColor}`;

  // Update animations
  updateSunAnimation(uvIndex);
  updateAirQualityBackground(airQuality);
  updateWindAnimation(airQuality);
}

// Simulation function that updates data every 10 seconds
function startSimulation() {
  // Initial update
  const initialData = generateRandomWeatherData();
  updateWeatherData(initialData);

  // Update every 10 seconds
  setInterval(() => {
    const newData = generateRandomWeatherData();
    updateWeatherData(newData);

    // Add a visual indicator that data has updated
    const status = document.getElementById("simulation-status");
    status.classList.remove("bg-blue-500");
    status.classList.add("bg-green-500");
    status.textContent = "Datos actualizados - Próximo cambio en 10 segundos";

    setTimeout(() => {
      status.classList.remove("bg-green-500");
      status.classList.add("bg-blue-500");
      status.textContent = "Simulación activa - Cambio cada 10 segundos";
    }, 2000);
  }, 10000);
}

// Initialize sun flares and start simulation
document.addEventListener("DOMContentLoaded", function () {
  createSunFlares();
  startWindAnimation(); // Start wind animation immediately
  startSimulation();
});
