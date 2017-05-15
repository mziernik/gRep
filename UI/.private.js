/**
 * Prywatne ustawienia projektu / aplikacji
 */

module.exports = {

   // outPath: "/../CKTechnik/CKTechnik/wwwroot", // katalog docelowy pliku bundle.js

    devServer: {
        host: "localhost",
        port: 8080
    },

    // zmienne środowiskowe przekazywane do aplikacji
    environment: {
        NODE_ENV: "development",
        WEB_API_URL: "http://localhost:52676/hubs/MainHub"
    }
};
