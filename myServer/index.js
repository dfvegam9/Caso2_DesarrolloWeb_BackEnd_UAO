// Importa las librerías necesarias para servir la página y manejar el cálculo.
const path = require('path');
const util = require('./scripts/computos');
const express = require('express');
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

// Crea la instancia del servidor web de Express.
const app = express();
const port = 1234;

// LiveReload
const liveReloadServer = livereload.createServer();

// Watch files
liveReloadServer.watch([
    __dirname + "/public",
    __dirname
]);

// Reload page
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Arreglo que guarda los préstamos procesados para poder listar resultados posteriores.
const infoCuotas = [];

// LiveReload middleware
app.use(connectLivereload());

// Permite leer los datos enviados desde formularios HTML (application/x-www-form-urlencoded).
app.use(express.urlencoded({ extended: true }));

// Sirve los archivos estáticos de la carpeta public, como CSS e imágenes.
app.use(express.static(path.join(__dirname, 'public')));

// GET: muestra la pantalla inicial del simulador cuando se accede a /procesaCuota.
app.get('/procesaCuota', (req, res) => {
    console.log('Petición GET /procesaCuota');
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// POST: recibe los datos del formulario, ejecuta la acción solicitada y devuelve la respuesta HTML.
app.post('/procesaCuota', (req, res) => {
    console.log('Petición POST /procesaCuota');

    // Extrae los valores enviados por el formulario.
    const opcion = req.body.laOpcion;
    const nombre = req.body.elNombre;
    const prestamo = Number(req.body.elPrestamo);
    const meses = Number(req.body.losMeses);
    const interes = Number(req.body.elInteres);
    let salida = '';

    // Decide qué funcionalidad ejecutar según la opción seleccionada por el usuario.
    switch (opcion) {
        case 'Calcular': {
            // Calcula la cuota mensual usando la fórmula financiera y la guarda en memoria.
            const cuota = util.calcularCuotaMensual(prestamo, interes / 100, meses);
            salida = `${nombre} debe pagar $ ${cuota.toFixed(2)} cada mes por el préstamo de $ ${prestamo} a ${meses} meses con el interés del ${interes}%`;
            infoCuotas.unshift({ nombre, prestamo, meses, interes, cuota });
            break;
        }
        case 'ListarTodos':
            // Muestra todos los préstamos que han sido calculados previamente.
            salida = util.reporteTotal(infoCuotas);
            break;
        default:
            // Muestra únicamente los préstamos mayores a $1.000.000.
            salida = util.reporteMasGanan(infoCuotas);
    }

    // Genera la página final con el resultado y el formulario nuevamente visible.
    const nuevaPagina = util.crearPagina(nombre, prestamo, meses, interes, salida);
    res.send(nuevaPagina);
});

// Inicia el servidor para escuchar peticiones en el puerto especificado.
app.listen(port, () => {
    console.log(`Servidor disponible en http://localhost:${port}/procesaCuota`);
});
