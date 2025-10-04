// script.js — adaptado para mostrar MUNICIPIOS (NOMGEO)

// 1. Inicializar el mapa y centrarlo en Guerrero (SIN MARCA DE AGUA)
const map = L.map('map', {
  attributionControl: false, 
  //zoomControl:false,// Elimina el control de atribución
  //scrollWheelZoom: false, // Permite zoom con la rueda del ratón
  //doubleClickZoom: false, // Deshabilita el zoom con doble clic
  center: [17.6, -99.5] , // Centro en Guerrero
});

// This prevents the zoom level from ever exceeding 19
map.on('zoomend', function() {
    if (map.getZoom() < 8) {
        map.setView([17.6, -99.5], 8)
    }
});

// 2. Añadir capa base OpenStreetMap (SIN ATRIBUCIÓN)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '' // Sin marca de agua
}).addTo(map);

// Variables globales
let geojsonLayer = null;
let selectedLayer = null;

// --- Estilos ---
function style(feature) {
  return {
    fillColor: '#3388ff',
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.6
  };
}
function highlightStyle() {
  return {
    weight: 3,
    color: '#333',
    dashArray: '',
    fillOpacity: 0.85
  };
}
function selectedStyle() {
  return {
    fillColor: '#ff9933',
    weight: 3,
    color: '#cc5500',
    dashArray: '',
    fillOpacity: 0.9
  };
}

// --- Control de info (topright) ---
const info = L.control({ position: 'topright' });

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

// Actualizamos el panel de información para mostrar el nombre del municipio.
info.update = function (props) {
  const name = props?.NOMGEO || '—';
  this._div.innerHTML = `<h4>Municipio de Guerrero</h4>` + (props ? `<b>${name}</b>` : '');
};

info.addTo(map);

// --- Eventos por feature ---
function highlightFeature(e) {
  const layer = e.target;
  if (selectedLayer && layer === selectedLayer) return;
  layer.setStyle(highlightStyle());
  layer.bringToFront();
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  const layer = e.target;
  if (selectedLayer && layer === selectedLayer) {
    layer.setStyle(selectedStyle());
    return;
  }
  geojsonLayer.resetStyle(layer);
  info.update();
}

function zoomToFeature(e) {
  const layer = e.target;

  if (selectedLayer && selectedLayer !== layer) {
    geojsonLayer.resetStyle(selectedLayer);
  }

  if (selectedLayer === layer) {
    selectedLayer = null;
    geojsonLayer.resetStyle(layer);
    map.closePopup();
    info.update();
  } else {
    selectedLayer = layer;
    layer.setStyle(selectedStyle());
    layer.bringToFront();
    info.update(layer.feature.properties);

    // IMPRIMIR EN CONSOLA EL MUNICIPIO SELECCIONADO
    const props = layer.feature.properties || {};
    const mun = props?.NOMGEO ? props.NOMGEO : 'Municipio desconocido';
    console.log('=== MUNICIPIO SELECCIONADO ===');
    console.log('Nombre:', mun);
    console.log('Propiedades completas:', props);
    console.log('==============================');

    layer.bindPopup(`<strong>${mun}</strong>`, { maxWidth: 300 }).openPopup();

    map.fitBounds(layer.getBounds(), { maxZoom: 10 });
  }
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
  layer.on('add', () => {
    if (layer._path) layer._path.style.cursor = 'pointer';
  });
}

// --- CARGA ROBUSTA DEL GEOJSON LOCAL ---
const geojsonURL = 'groo.json';

fetch(geojsonURL)
  .then(resp => {
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return resp.json();
  })
  .then(data => {
    if (!data || !data.features) throw new Error('GeoJSON no tiene la estructura esperada.');

    console.log('GeoJSON de municipios cargado. Primer feature.properties =>', data.features[0].properties);

    geojsonLayer = L.geoJson(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);

    try {
      map.fitBounds(geojsonLayer.getBounds());
    } catch (err) {
      console.warn('No se pudo ajustar bounds del GeoJSON:', err);
    }
  })
  .catch(err => {
    console.error(`Error al cargar o parsear ${geojsonURL}:`, err);
    alert(`No se pudo cargar "${geojsonURL}". Verifica la consola (F12) y asegúrate de usar un servidor local.`);
  });

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

  const size = Math.random() * 4 + 2;
  particle.style.width = size + "px";
  particle.style.height = size + "px";

  particle.style.left = "-100px";
  particle.style.top = Math.random() * window.innerHeight + "px";

  particle.style.animationDuration = Math.random() * 4 + 6 + "s";
  particle.style.animationDelay = Math.random() * 2 + "s";

  windContainer.appendChild(particle);

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

  const width = Math.random() * 100 + 50;
  line.style.width = width + "px";

  line.style.left = "-200px";
  line.style.top = Math.random() * window.innerHeight + "px";

  line.style.animationDuration = Math.random() * 3 + 5 + "s";
  line.style.animationDelay = Math.random() * 1 + "s";

  windContainer.appendChild(line);

  setTimeout(() => {
    if (line.parentNode) {
      line.parentNode.removeChild(line);
    }
  }, 8000);
}

// Función para iniciar la animación de viento
function startWindAnimation() {
  windInterval = setInterval(() => {
    if (Math.random() < 0.7) {
      createWindParticle();
    }

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

  if (uvIndex >= 8) {
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

  body.classList.remove(
    "air-quality-good",
    "air-quality-moderate",
    "air-quality-unhealthy",
    "air-quality-very-unhealthy",
    "air-quality-hazardous"
  );

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
  if (airQuality > 100) {
    if (windInterval) {
      clearInterval(windInterval);
    }
    windInterval = setInterval(() => {
      if (Math.random() < 0.9) {
        createWindParticle();
      }

      if (Math.random() < 0.5) {
        createWindLine();
      }
    }, 200);
  } else {
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

// Function to update all weather data displays
function updateWeatherData(weatherData) {
  const { uvIndex, airQuality } = weatherData;

  document.getElementById("uv-value").textContent = uvIndex;

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

  document.getElementById("air-value").textContent = airQuality;

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

  updateSunAnimation(uvIndex);
  updateAirQualityBackground(airQuality);
  updateWindAnimation(airQuality);
    // Actualizar íconos de feather
  feather.replace();
}

// Inicializar datos del clima
createSunFlares();
startWindAnimation();
updateWeatherData();

console.log('Sistema cargado. Haz clic en cualquier municipio para ver su nombre en la consola.');
