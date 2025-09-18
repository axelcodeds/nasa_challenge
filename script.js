// Funcion para simular la API del clima, por que no he buscado una, solo me he dedicado a la App web jajaja
// function fetchWeatherData() {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({
//                 uvIndex: Math.floor(Math.random() * 12), // 0-11
//                 airQuality: Math.floor(Math.random() * 300) + 1, // 1-300
//                 temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
//                 humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
//                 condition: ['Soleado', 'Parcialmente nublado', 'Nublado', 'Lluvioso'][Math.floor(Math.random() * 4)]
//             });
//         }, 1000);
//     });
// }

//Librerías
AOS.init();
feather.replace();

// Coordenadas de Chilpancingo de los Bravo, Guerrero
const CHILPANCINGO_LAT = 17.5506;
const CHILPANCINGO_LON = -99.5050;

// Función para obtener datos meteorológicos de NASA POWER
async function fetchNASAWeatherData() {
    // Usar fecha actual para datos más recientes
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Formato YYYYMMDD
    const dateStr = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
    
    const nasaUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_UV_INDEX,T2M,RH2M,CLRSKY_SFC_UV_INDEX&community=RE&longitude=${CHILPANCINGO_LON}&latitude=${CHILPANCINGO_LAT}&start=${dateStr}&end=${dateStr}&format=JSON`;
    
    try {
        console.log('Consultando NASA POWER API...');
        const response = await fetch(nasaUrl);
        
        if (!response.ok) {
            throw new Error(`NASA API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('NASA Response:', data);
        
        return data;
    } catch (error) {
        console.error('Error fetching NASA data:', error);
        return null;
    }
}

// Función para obtener calidad del aire de Open-Meteo
async function fetchAirQualityData() {
    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${CHILPANCINGO_LAT}&longitude=${CHILPANCINGO_LON}&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;
    
    try {
        console.log('Consultando Open-Meteo Air Quality API...');
        const response = await fetch(airUrl);
        
        if (!response.ok) {
            throw new Error(`Air Quality API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Air Quality Response:', data);
        
        return data;
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        return null;
    }
}

// Función para obtener datos meteorológicos actuales como fallback
async function fetchCurrentWeatherData() {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${CHILPANCINGO_LAT}&longitude=${CHILPANCINGO_LON}&current=temperature_2m,relative_humidity_2m,weather_code,uv_index&timezone=auto`;
    
    try {
        console.log('Consultando Open-Meteo Weather API...');
        const response = await fetch(weatherUrl);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Current Weather Response:', data);
        
        return data;
    } catch (error) {
        console.error('Error fetching current weather data:', error);
        return null;
    }
}

// Conversión de PM2.5 (µg/m³) a AQI (escala EPA US)
function convertPM25toAQI(pm25) {
    if (pm25 == null || pm25 < 0) return 0;
    
    if (pm25 <= 12.0) return Math.round((50/12) * pm25);
    if (pm25 <= 35.4) return Math.round(((100-51)/(35.4-12.1)) * (pm25-12.1) + 51);
    if (pm25 <= 55.4) return Math.round(((150-101)/(55.4-35.5)) * (pm25-35.5) + 101);
    if (pm25 <= 150.4) return Math.round(((200-151)/(150.4-55.5)) * (pm25-55.5) + 151);
    if (pm25 <= 250.4) return Math.round(((300-201)/(250.4-150.5)) * (pm25-150.5) + 201);
    if (pm25 <= 350.4) return Math.round(((400-301)/(350.4-250.5)) * (pm25-250.5) + 301);
    if (pm25 <= 500.4) return Math.round(((500-401)/(500.4-350.5)) * (pm25-350.5) + 401);
    return 500;
}

// Función para limpiar valores inválidos
function cleanValue(value, fallback = "--") {
    return (value == null || value === -999 || value === -9999 || isNaN(value)) ? fallback : Math.round(value);
}

// Función para obtener código de condición climática
function getWeatherCondition(temperature, humidity, airQuality) {
    if (airQuality <= 50 && temperature > 25) return "Soleado";
    if (airQuality <= 100) return "Parcialmente nublado";
    if (airQuality <= 150) return "Nublado";
    if (humidity > 80) return "Lluvioso";
    return "Nublado";
}

// Función principal para obtener todos los datos del clima
async function fetchWeatherData() {
    console.log('Iniciando consulta de datos meteorológicos...');
    
    try {
        // Obtener datos en paralelo, pero con manejo individual de errores
        const [nasaData, airData, currentWeather] = await Promise.allSettled([
            fetchNASAWeatherData(),
            fetchAirQualityData(),
            fetchCurrentWeatherData()
        ]);
        
        let uvIndex = "--";
        let temperature = "--";
        let humidity = "--";
        let airQuality = 0;
        
        // Procesar datos de NASA (si están disponibles)
        if (nasaData.status === 'fulfilled' && nasaData.value && nasaData.value.properties && nasaData.value.properties.parameter) {
            console.log('Procesando datos de NASA...');
            const params = nasaData.value.properties.parameter;
            
            // Índice UV
            if (params.ALLSKY_SFC_UV_INDEX) {
                const uvData = Object.values(params.ALLSKY_SFC_UV_INDEX)[0];
                uvIndex = cleanValue(uvData, "--");
                console.log('UV de NASA:', uvIndex);
            }
            
            // Temperatura
            if (params.T2M) {
                const tempData = Object.values(params.T2M)[0];
                temperature = cleanValue(tempData, "--");
                console.log('Temperatura de NASA:', temperature);
            }
            
            // Humedad
            if (params.RH2M) {
                const humData = Object.values(params.RH2M)[0];
                humidity = cleanValue(humData, "--");
                console.log('Humedad de NASA:', humidity);
            }
        } else {
            console.log('No se pudieron obtener datos de NASA, usando fallback...');
        }
        
        // Usar datos actuales como fallback
        if ((uvIndex === "--" || temperature === "--" || humidity === "--") && 
            currentWeather.status === 'fulfilled' && currentWeather.value && currentWeather.value.current) {
            console.log('Usando datos de fallback de Open-Meteo...');
            const current = currentWeather.value.current;
            
            if (uvIndex === "--" && current.uv_index != null) {
                uvIndex = Math.round(current.uv_index);
                console.log('UV de fallback:', uvIndex);
            }
            if (temperature === "--" && current.temperature_2m != null) {
                temperature = Math.round(current.temperature_2m);
                console.log('Temperatura de fallback:', temperature);
            }
            if (humidity === "--" && current.relative_humidity_2m != null) {
                humidity = Math.round(current.relative_humidity_2m);
                console.log('Humedad de fallback:', humidity);
            }
        }
        
        // Procesar datos de calidad del aire
        if (airData.status === 'fulfilled' && airData.value && airData.value.current) {
            const pm25 = airData.value.current.pm2_5;
            airQuality = convertPM25toAQI(pm25);
            console.log('PM2.5:', pm25, '-> AQI:', airQuality);
        } else {
            console.log('No se pudieron obtener datos de calidad del aire');
        }
        
        // Determinar condición climática
        const condition = getWeatherCondition(
            temperature === "--" ? 25 : temperature,
            humidity === "--" ? 50 : humidity,
            airQuality
        );
        
        console.log('Datos procesados:', { uvIndex, airQuality, temperature, humidity, condition });
        
        return {
            uvIndex,
            airQuality,
            temperature,
            humidity,
            condition
        };
        
    } catch (error) {
        console.error("Error general obteniendo datos:", error);
        return {
            uvIndex: "--",
            airQuality: 0,
            temperature: "--",
            humidity: "--",
            condition: "Sin datos"
        };
    }
}

// Actualizar interfaz de usuario
async function updateWeatherUI() {
    console.log('Actualizando interfaz...');
    
    // Mostrar indicador de carga
    document.getElementById('uv-value').textContent = "...";
    document.getElementById('air-value').textContent = "...";
    
    const data = await fetchWeatherData();
    
    // Actualizar índice UV
    const uvValue = data.uvIndex;
    document.getElementById('uv-value').textContent = uvValue;
    
    if (uvValue !== "--") {
        document.getElementById('uv-meter').style.width = `${Math.min(uvValue * 8.33, 100)}%`;
    } else {
        document.getElementById('uv-meter').style.width = "0%";
    }
    
    let uvLevel, uvClass, uvRecommendation;
    if (uvValue === "--") {
        uvLevel = "Sin datos";
        uvClass = "bg-gray-500";
        uvRecommendation = "No hay datos disponibles del índice UV.";
    } else if (uvValue <= 2) {
        uvLevel = "Bajo";
        uvClass = "uv-low";
        uvRecommendation = "Protección solar no necesaria. Puedes disfrutar del día con seguridad.";
    } else if (uvValue <= 5) {
        uvLevel = "Moderado";
        uvClass = "uv-moderate";
        uvRecommendation = "Usa protección solar SPF 30+, gorra y gafas de sol. Busca sombra al mediodía.";
    } else if (uvValue <= 7) {
        uvLevel = "Alto";
        uvClass = "uv-high";
        uvRecommendation = "Protección solar necesaria. Usa SPF 30+, gorra, gafas y camisa. Reduce exposición al mediodía.";
    } else if (uvValue <= 10) {
        uvLevel = "Muy Alto";
        uvClass = "uv-very-high";
        uvRecommendation = "Protección solar extrema necesaria. Evita el sol entre 10am-4pm. Usa SPF 50+, ropa protectora y sombra.";
    } else {
        uvLevel = "Extremo";
        uvClass = "uv-extreme";
        uvRecommendation = "¡Peligro! Evita el sol al mediodía. Protección máxima necesaria. Permanece en interiores si es posible.";
    }
    
    const uvLevelElement = document.getElementById('uv-level');
    uvLevelElement.textContent = uvLevel;
    uvLevelElement.className = `px-4 py-2 rounded-full text-white font-medium ${uvClass}`;
    document.getElementById('uv-recommendation').textContent = uvRecommendation;

    // Actualizar calidad del aire
    const airValue = data.airQuality;
    document.getElementById('air-value').textContent = airValue;
    document.getElementById('air-meter').style.width = `${Math.min(airValue / 3, 100)}%`;
    
    let airLevel, airClass, airRecommendation;
    if (airValue <= 50) {
        airLevel = "Buena";
        airClass = "air-good";
        airRecommendation = "La calidad del aire es satisfactoria y la contaminación del aire presenta poco o ningún riesgo.";
    } else if (airValue <= 100) {
        airLevel = "Moderada";
        airClass = "air-moderate";
        airRecommendation = "La calidad del aire es aceptable; sin embargo, algunos contaminantes pueden ser moderadamente preocupantes para un número muy pequeño de personas que son inusualmente sensibles a la contaminación del aire.";
    } else if (airValue <= 150) {
        airLevel = "Dañina para grupos sensibles";
        airClass = "air-unhealthy-sensitive";
        airRecommendation = "Los miembros de grupos sensibles pueden experimentar efectos en la salud. El público en general no es probable que se vea afectado.";
    } else if (airValue <= 200) {
        airLevel = "Dañina";
        airClass = "air-unhealthy";
        airRecommendation = "Todos pueden comenzar a experimentar efectos en la salud; los miembros de grupos sensibles pueden experimentar efectos más graves.";
    } else if (airValue <= 300) {
        airLevel = "Muy Dañina";
        airClass = "air-very-unhealthy";
        airRecommendation = "Advertencias de salud de condiciones de emergencia. Es más probable que toda la población se vea afectada.";
    } else {
        airLevel = "Peligrosa";
        airClass = "air-hazardous";
        airRecommendation = "Alerta de salud: todos pueden experimentar efectos más graves para la salud. Evita actividades al aire libre.";
    }
    
    const airLevelElement = document.getElementById('air-level');
    airLevelElement.textContent = airLevel;
    airLevelElement.className = `px-4 py-2 rounded-full text-white font-medium ${airClass}`;
    document.getElementById('air-recommendation').textContent = airRecommendation;

    // Actualizar otros datos del clima
    document.getElementById('temperature').textContent = `${data.temperature}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('condition').textContent = data.condition;

    // Crear notificaciones basadas en las condiciones
    createNotifications(uvLevel, airLevel, uvRecommendation, airRecommendation);
    
    console.log('Interfaz actualizada correctamente');
}

function createNotifications(uvLevel, airLevel, uvRec, airRec) {
    const notificationsContainer = document.getElementById('notifications');
    notificationsContainer.innerHTML = '';

    // Notificación UV
    if (uvLevel === "Alto" || uvLevel === "Muy Alto" || uvLevel === "Extremo") {
        const notification = document.createElement('div');
        notification.className = 'notification bg-white rounded-lg shadow-lg p-4 flex items-start';
        notification.innerHTML = `
            <div class="mr-3 p-2 rounded-full bg-yellow-100 text-yellow-600">
                <i data-feather="sun"></i>
            </div>
            <div>
                <h4 class="font-semibold text-gray-800">Alerta de radiación UV</h4>
                <p class="text-sm text-gray-600">${uvRec}</p>
            </div>
        `;
        notificationsContainer.appendChild(notification);
    }

    // Notificación de la calidad del aire
    if (airLevel === "Dañina para grupos sensibles" || airLevel === "Dañina" || airLevel === "Muy Dañina" || airLevel === "Peligrosa") {
        const notification = document.createElement('div');
        notification.className = 'notification bg-white rounded-lg shadow-lg p-4 flex items-start mt-3';
        notification.innerHTML = `
            <div class="mr-3 p-2 rounded-full bg-red-100 text-red-600">
                <i data-feather="alert-triangle"></i>
            </div>
            <div>
                <h4 class="font-semibold text-gray-800">Alerta de calidad del aire</h4>
                <p class="text-sm text-gray-600">${airRec}</p>
            </div>
        `;
        notificationsContainer.appendChild(notification);
    }

    feather.replace();
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicación iniciada');
    updateWeatherUI();
});

// Actualización automática cada 10 minutos
setInterval(updateWeatherUI, 600000);