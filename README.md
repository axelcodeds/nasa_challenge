## **Project Documentation: AURA Guerrero**

### **Project Summary**

**AURA Guerrero** (**A**ir, **U**bicación [Location], and **R**isk **A**mbiental [Environmental Risk]) is an open-source web application designed to democratize access to crucial data on air quality and UV radiation levels in the state of Guerrero, Mexico. The platform presents this information intuitively on an interactive map at the municipal level, enabling citizens, authorities, and tourists to make informed decisions to protect their health and well-being. The project directly responds to NASA's "From EarthData to Action" challenge, laying the groundwork for an early warning system for environmental risks.

### **Project Demostration**
https://nasa-challenge-psi.vercel.app/

-----

### **Application Functionality**

The platform is simple and intuitive to use, focused on accessibility.

#### **For the User:**

1.  **Immediate Visualization:** Upon loading the page, the user sees a map of the state of Guerrero with a satellite image background and the municipal divisions clearly outlined.
2.  **Interactive Query:** The user can click on any municipality of interest.
3.  **Real-Time Data:** Upon clicking, a popup window appears at the center of the selected municipality, displaying the following real-time data:
      * **UV Index:** A numerical value with a simple interpretation (Low, Moderate, High).
      * **Air Quality:** Measured through surface-level Ozone concentration, a key indicator of pollution.
      * **Health Recommendations:** Based on the data, a simple suggestion is offered (e.g., "High UV Level: Using sunscreen is recommended").

#### **Technical Operation:**

1.  **Geometry Loading:** The application loads a `Guerrero.geojson` file containing the polygons of all municipalities.
2.  **Coordinate Calculation:** When a municipality is clicked, the Leaflet.js library calculates the geographic coordinates (latitude and longitude) of the center of that polygon.
3.  **API Call:** These coordinates are sent to the **Open-Meteo Air Quality API**, an open API that aggregates data from global meteorological models. The request is as follows:
    ```
    https://air-quality-api.open-meteo.com/v1/air-quality?latitude=LAT&longitude=LON&current=uv_index,ozone
    ```
4.  **Data Visualization:** The API response (in JSON format) is processed and displayed in the popup on the map.
5.  **Satellite Context:** The map uses the **Esri World Imagery** service as a base layer, which is fed by NASA satellite imagery, providing a realistic visual context.

-----

### **Technologies Used**

  * **Frontend:** HTML5, CSS3, JavaScript, TailwindCSS
  * **Mapping Library:** Leaflet.js
  * **Geospatial Data Format:** GeoJSON
  * **Data APIs:**
      * **Open-Meteo Air-Quality API:** For UV Index and Ozone data.
      * **Esri World Imagery (based on NASA data):** For the satellite imagery layer.

-----

### **Project Proposal (Format for Jury)**

#### **1. Introduction and Justification**

Air pollution and ultraviolet radiation are invisible threats to public health. In the state of Guerrero, with its diverse geography and important urban and tourist centers like Acapulco, the lack of accessible, free, and localized environmental information at the municipal level represents a significant risk. Citizens and visitors lack simple tools for making daily decisions, such as when it is safe to exercise outdoors or the need for sun protection. **AURA Guerrero** was born to close this information gap.

#### **2. Objectives**

  * **General Objective:** To develop an accessible, user-centered environmental monitoring tool for the state of Guerrero, translating complex data into actionable information for health protection.
  * **Specific Objectives:**
      * Integrate real-time air quality (Ozone) and UV Index data.
      * Present the information geographically at the municipal level on an interactive map.
      * Provide health recommendations based on risk levels.
      * Design an intuitive user interface that does not require technical knowledge.

#### **3. State of the Art**

Currently, monitoring solutions exist at the national level (such as SINAICA in Mexico) and global applications (e.g., AccuWeather). However, these often lack the granularity and specific focus for the municipalities of Guerrero, or present data in a non-intuitive way for the general public. **AURA Guerrero** differentiates itself through its **hyper-local focus and radical simplicity**, designed as a digital public service for a specific region.

#### **4. Methodology and Next Steps**

The project is conceived in phases, aligned with the goals of the "NASA Space Apps Challenge":

  * **Phase 1 (Current Prototype - Completed):** A functional prototype has been developed that validates the main concept: the ability to query environmental data by municipality on an interactive map, using open and reliable APIs.

  * **Phase 2 (NASA Data Integration - Next Step):** The next crucial step is to replace or complement Open-Meteo data with data from the **NASA TEMPO mission**. The workflow, aligned with the challenge, will be:

    1.  **Automated Ingest:** A cloud backend (e.g., AWS Lambda) will daily download TEMPO data files (NO2, Ozone) from Earthdata Search.
    2.  **Geospatial Processing:** A Python script (using Xarray, GeoPandas) will process this data, calculating the average value for each municipality in Guerrero.
    3.  **Data Exposure:** The processed data will be stored (e.g., in Amazon S3) and consumed by the frontend, offering a visualization based 100% on direct NASA data.

  * **Phase 3 (Predictive Model and Alerts):** Using historical NASA data, a machine learning model (time series) will be developed to forecast air quality 24 hours in advance, and a system of proactive alerts (email, push notifications) for users will be implemented.

-----

### **Dissemination Strategy**

For AURA Guerrero to have a real impact, we propose a multi-channel dissemination strategy:

  * **Institutional Alliances:** Collaborate with the **Guerrero Ministry of Health** and the **Ministry of Education** to promote the tool in health centers, clinics, and schools.
  * **Tourism Sector:** Work with hotels and tourism agencies in key destinations like Acapulco, Ixtapa-Zihuatanejo, and Taxco to inform visitors about daily conditions.
  * **Local Media:** Disseminate the platform through press releases to local newspapers, radio stations, and television channels.
  * **Digital Campaign:** Use social media to publish daily air quality and UV reports, driving traffic to the application.
  * **Public Access:** Place QR codes in public spaces (parks, beaches, sports centers) that link directly to the web application.