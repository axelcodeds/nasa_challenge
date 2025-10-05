## **Documentación del Proyecto: AURA Guerrero**

### **Resumen del Proyecto**

**AURA Guerrero** (**A**ire, **U**bicación y **R**iesgo **A**mbiental) es una aplicación web de código abierto diseñada para democratizar el acceso a datos cruciales sobre la calidad del aire y los niveles de radiación UV en el estado de Guerrero, México. La plataforma presenta esta información de manera intuitiva sobre un mapa interactivo a nivel municipal, permitiendo a los ciudadanos, autoridades y turistas tomar decisiones informadas para proteger su salud y bienestar. El proyecto responde directamente al desafío "From EarthData to Action" de la NASA, sentando las bases para un sistema de alerta temprana de riesgos ambientales.

-----

### **Funcionalidad de la Aplicación**

La plataforma es de uso simple e intuitivo, enfocada en la accesibilidad.

#### **Para el Usuario:**

1.  **Visualización Inmediata:** Al cargar la página, el usuario ve un mapa del estado de Guerrero con una imagen satelital de fondo y las divisiones municipales claramente delineadas.
2.  **Consulta Interactiva:** El usuario puede hacer clic en cualquier municipio de su interés.
3.  **Datos en Tiempo Real:** Al hacer clic, una ventana emergente (`popup`) aparece en el centro del municipio seleccionado, mostrando los siguientes datos en tiempo real:
      * **Índice de Rayos UV:** Un valor numérico con una interpretación simple (Bajo, Moderado, Alto).
      * **Calidad del Aire:** Medida a través de la concentración de Ozono a nivel de superficie, un indicador clave de la contaminación.
      * **Recomendaciones de Salud:** Basado en los datos, se ofrece una sugerencia simple (ej. "Nivel UV Alto: Se recomienda usar protector solar").

#### **Funcionamiento Técnico:**

1.  **Carga de Geometría:** La aplicación carga un archivo `Guerrero.geojson` que contiene los polígonos de todos los municipios.
2.  **Cálculo de Coordenadas:** Al hacer clic en un municipio, la librería Leaflet.js calcula las coordenadas geográficas (latitud y longitud) del centro de ese polígono.
3.  **Llamada a la API:** Esas coordenadas se envían a la **API de Calidad del Aire de Open-Meteo**, que es una API abierta que agrega datos de modelos meteorológicos globales. La solicitud es la siguiente:
    ```
    https://air-quality-api.open-meteo.com/v1/air-quality?latitude=LAT&longitude=LON&current=uv_index,ozone
    ```
4.  **Visualización de Datos:** La respuesta de la API (en formato JSON) es procesada y mostrada en el `popup` sobre el mapa.
5.  **Contexto Satelital:** El mapa utiliza como capa base el servicio **Esri World Imagery**, que se nutre de imágenes satelitales de la NASA, proporcionando un contexto visual realista.

-----

### **Tecnologías Utilizadas**

  * **Frontend:** HTML5, CSS3, JavaScript
  * **Librería de Mapeo:** Leaflet.js
  * **Formato de Datos Geoespaciales:** GeoJSON
  * **APIs de Datos:**
      * **Open-Meteo Air-Quality API:** Para datos de Índice UV y Ozono.
      * **Esri World Imagery (basado en datos de la NASA):** Para la capa de imagen satelital.

-----

### **Propuesta de Proyecto (Formato para Jurado)**

#### **1. Introducción y Justificación**

La contaminación del aire y la radiación ultravioleta son amenazas invisibles para la salud pública. En el estado de Guerrero, con su diversa geografía y centros urbanos y turísticos importantes como Acapulco, la falta de información ambiental accesible, gratuita y localizada a nivel municipal representa un riesgo significativo. Los ciudadanos y visitantes carecen de herramientas simples para tomar decisiones diarias, como cuándo es seguro hacer ejercicio al aire libre o la necesidad de protección solar. **AURA Guerrero** nace para cerrar esta brecha informativa.

#### **2. Objetivos**

  * **Objetivo General:** Desarrollar una herramienta de monitoreo ambiental accesible y centrada en el usuario para el estado de Guerrero, que traduzca datos complejos en información accionable para la protección de la salud.
  * **Objetivos Específicos:**
      * Integrar datos en tiempo real de calidad del aire (Ozono) e Índice UV.
      * Presentar la información geográficamente a nivel municipal en un mapa interactivo.
      * Proporcionar recomendaciones de salud basadas en los niveles de riesgo.
      * Diseñar una interfaz de usuario intuitiva que no requiera conocimientos técnicos.

#### **3. Estado del Arte**

Actualmente, existen soluciones de monitoreo a nivel nacional (como el SINAICA en México) y aplicaciones globales (ej. AccuWeather). Sin embargo, estas a menudo carecen de la granularidad y el enfoque específico para los municipios de Guerrero, o presentan los datos de una manera no intuitiva para el público general. **AURA Guerrero** se diferencia por su **enfoque hiper-local y su simplicidad radical**, diseñado como un servicio público digital para una región específica.

#### **4. Metodología y Pasos Futuros**

El proyecto se concibe en fases, alineado con las metas del "NASA Space Apps Challenge":

  * **Fase 1 (Prototipo Actual - Completada):** Se ha desarrollado un prototipo funcional que valida el concepto principal: la capacidad de consultar datos ambientales por municipio en un mapa interactivo, utilizando APIs abiertas y confiables.

  * **Fase 2 (Integración de Datos NASA - Siguiente Paso):** El siguiente paso crucial es reemplazar o complementar los datos de Open-Meteo con los de la misión **TEMPO de la NASA**. El flujo de trabajo, alineado con el reto, será:

    1.  **Ingesta Automatizada:** Un backend en la nube (ej. AWS Lambda) descargará diariamente los archivos de datos de TEMPO (NO2, Ozono) de Earthdata Search.
    2.  **Procesamiento Geoespacial:** Un script de Python (usando Xarray, GeoPandas) procesará estos datos, calculando el valor promedio para cada municipio de Guerrero.
    3.  **Exposición de Datos:** Los datos procesados se almacenarán (ej. en Amazon S3) y se consumirán desde el frontend, ofreciendo una visualización basada 100% en datos directos de la NASA.

  * **Fase 3 (Modelo Predictivo y Alertas):** Con los datos históricos de la NASA, se desarrollará un modelo de machine learning (series temporales) para pronosticar la calidad del aire con 24 horas de antelación y se implementará un sistema de alertas proactivas (email, notificaciones push) para los usuarios.

-----

### **Estrategia de Difusión**

Para que AURA Guerrero tenga un impacto real, proponemos una estrategia de difusión multi-canal:

  * **Alianzas Institucionales:** Colaborar con la **Secretaría de Salud de Guerrero** y la **Secretaría de Educación** para promover la herramienta en centros de salud, clínicas y escuelas.
  * **Sector Turístico:** Trabajar con hoteles y agencias de turismo en destinos clave como Acapulco, Ixtapa-Zihuatanejo y Taxco para informar a los visitantes sobre las condiciones diarias.
  * **Medios Locales:** Difundir la plataforma a través de comunicados de prensa a periódicos, estaciones de radio y canales de televisión locales.
  * **Campaña Digital:** Utilizar redes sociales para publicar reportes diarios de calidad del aire y UV, dirigiendo tráfico a la aplicación.
  * **Acceso Público:** Colocar códigos QR en espacios públicos (parques, playas, centros deportivos) que enlacen directamente a la aplicación web.