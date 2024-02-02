export const environment = {
  production: false,
  /*  userApiUrl: process.env["USER_API_URL"] || "http://localhost:8082",
    loginApiUrl: process.env["LOGIN_API_URL"] || "http://localhost:8081",
    vehiclesApiUrl: process.env["VEHICLES_API_URL"] || "http://localhost:8083",
    chargerpointsApiUrl: process.env["CHARGERPOINTS_API_URL"] || "http://localhost:8088",*/

  /*
  * Lo de arriba deberia funcionar, pero no entiendo por que me sigue dando process is not defined error.
  * Troubleshooting:
  * 1. Paso de variables de entorno mediante docker-compose.yml y los valores son vacios.
  * 2. Webpack configurado pero sigue sin capturar las variables de entorno en contenedores (probablemente porque build context != run context)
  * 3. Se puede hacer echo de las variables de entorno en el terminal de docker desktop, pero no en el dockerfile ni en el runtime de la app.
  *
  * Por eso lo dejo hardcodeado...
  * FUCK angular, (AND FUCK angular material).
  *
  */
  userApiUrl: "http://localhost:8082/users",
  loginApiUrl: "http://localhost:8081/login",
  vehiclesApiUrl: "http://localhost:8083/vehicles",
  chargerpointsApiUrl: "http://localhost:8088/chargerpoints",
  rechargeApiUrl : "http://localhost:8090/recharge"
};
