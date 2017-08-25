/**
 * Konfiguracja aplikacji
 */


const config = {
    api: {
        hubUrl: process.env.WEB_API_URL || window.location.origin + "/hubs/MainHub"
    },
    reports: {
        host: "http://localhost:50833",
        generator: "/generator",
        viewer: "/viewer/${id}"
    }
};

export default config;




