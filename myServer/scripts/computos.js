// Escapa caracteres especiales para evitar inyección de HTML en los datos del usuario.
function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Genera el documento HTML completo que envuelve la interfaz del simulador.
function crearPagina(nombre, prestamo, meses, interes, cadSalida) {
  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulador Financiero - UAO</title>
    <link rel="stylesheet" href="/default.css">
  </head>
  <body>
    ${contenidoPagina(nombre, prestamo, meses, interes, cadSalida)}
  </body>
</html>`;
}

// Crea el contenido principal de la página con el formulario y la salida calculada.
function contenidoPagina(
  nombre = "Lina Rios",
  prestamo = 6000000,
  meses = 12,
  interes = 15.5,
  cadSalida = "",
) {
  return `
    <header class="encabezado">
        <div class="encabezado-contenido">

            <div class="logo-container">
                <img src="/logouao.png" alt="Universidad Autónoma de Occidente" />
            </div>

            <div class="encabezado-texto">
                <span class="etiqueta">ESTRUCTURAS DE DATOS Y ALGORITMOS I</span>
                <h1>Caso 2</h1>
                <p>Cómputo de cuotas mensuales</p>
            </div>

        </div>
    </header>


    <!-- CONTENIDO PRINCIPAL -->
    <main class="contenedor">

        <section class="card">

            <!-- TÍTULO -->
            <div class="card-header">
                <div class="icono">$</div>

                <div>
                    <h2>Simulador de Cuotas</h2>
                    <p>
                        Calcula cuotas mensuales y consulta los préstamos registrados.
                    </p>
                </div>
            </div>


            <!-- INTRODUCCIÓN -->
            <div class="introduccion">
                <p>
                    Este aplicativo permite el cómputo de la cuota mensual con
                    los datos suministrados y la generación de un par de
                    reportes.
                </p>
            </div>


            <!-- FORMULARIO -->
            <form action="/procesaCuota" method="post" enctype="application/x-www-form-urlencoded">

                <div class="formulario">

                    <!-- NOMBRE -->
                    <div class="campo">
                        <label for="elNombre">
                            Nombre
                        </label>

                        <input type="text" value="${escaparHTML(nombre)}" id="elNombre" name="elNombre"
                            placeholder="Ingrese el nombre" required />
                    </div>


                    <!-- PRÉSTAMO -->
                    <div class="campo">
                        <label for="elPrestamo">
                            Préstamo
                        </label>

                        <div class="input-icono">
                            <span>$</span>

                            <input type="number" value="${escaparHTML(prestamo)}" id="elPrestamo" name="elPrestamo" min="1"
                                placeholder="Valor del préstamo" required />
                        </div>
                    </div>


                    <!-- INTERÉS -->
                    <div class="campo">
                        <label for="elInteres">
                            Interés (%)
                        </label>

                        <div class="input-icono">
                            <span>%</span>

                            <input type="number" value="${escaparHTML(interes)}" id="elInteres" name="elInteres" min="0.01" step="any"
                                placeholder="Porcentaje" required />
                        </div>
                    </div>


                    <!-- MESES -->
                    <div class="campo">
                        <label for="losMeses">
                            Plazo
                        </label>

                        <div class="input-icono">
                            <span>#</span>

                            <input type="number" value="${escaparHTML(meses)}" id="losMeses" name="losMeses" min="1"
                                placeholder="Cantidad de meses" required />
                        </div>
                    </div>

                </div>


                <!-- RESULTADO -->
                <div class="resultado">

                    <div class="resultado-header">
                        <span>Resultado</span>
                    </div>

                    <textarea name="laRespuesta" aria-label="Respuesta del simulador" readonly
                        placeholder="El resultado de la operación aparecerá aquí...">${escaparHTML(cadSalida)}</textarea>

                </div>


                <!-- ACCIONES -->
                <div class="acciones">

                    <div class="selector-container">

                        <label for="laOpcion">
                            Funcionalidad
                        </label>

                        <select name="laOpcion" id="laOpcion" aria-label="Funcionalidad a ejecutar">
                            <option value="Calcular" selected>
                                Calcular cuota
                            </option>

                            <option value="ListarTodos">
                                Listar todos
                            </option>

                            <option value="ListarGanan">
                                Listar préstamos mayores a $1.000.000
                            </option>
                        </select>

                    </div>


                    <button id="procesar" type="submit">
                        <span>Ejecutar funcionalidad</span>
                        <span class="flecha">→</span>
                    </button>

                </div>

            </form>

        </section>

    </main>


    <!-- PIE DE PÁGINA -->
    <footer class="footer">

        <div class="footer-linea"></div>

        <p>
            Creado por
            <strong>Diego Vega</strong>,
            <strong>Katherine Andrea Fernandez</strong>,
            <strong>Giannella Quintero</strong> y
            <strong>Carlos Andres Rodriguez</strong>.
        </p>

        <p>
            Curso de Estructuras de Datos y Algoritmos I
            <span>•</span>
            Universidad Autónoma de Occidente
        </p>

    </footer>`;
}

// Calcula la cuota mensual de un préstamo con interés compuesto usando la fórmula de amortización.
function calcularCuotaMensual(prestamo, interes, meses) {
  const auxiliar = Math.pow(1 + interes, meses);
  const resultado = prestamo * ((interes * auxiliar) / (auxiliar - 1));
  return Math.round(resultado * 100) / 100;
}

// Construye un texto con el listado completo de los préstamos ya procesados.
function reporteTotal(info) {
  let mensaje = "";
  if (info.length === 0) {
    mensaje = "No hay préstamos procesados";
  } else {
    mensaje = "Listado de préstamos procesados son:\n\n";
  }
  info.forEach((dato) => {
    mensaje += `${dato.nombre} -- $ ${dato.prestamo} - $ ${dato.cuota.toFixed(2)} - ${dato.meses} meses - ${dato.interes}%\n`;
  });
  return mensaje;
}

// Filtra los préstamos mayores a un millón para generar un reporte específico.
function reporteMasGanan(info) {
  let mensaje = "";
  const aux = info.filter((dato) => dato.prestamo > 1000000);
  if (aux.length === 0) {
    mensaje = "No hay préstamos mayores a $1.000.000";
  } else {
    mensaje = "Listado de préstamos mayores a $1.000.000:\n\n";
  }
  aux.forEach((dato) => {
    mensaje += `${dato.nombre} -- $ ${dato.prestamo} - $ ${dato.cuota.toFixed(2)}\n`;
  });
  return mensaje;
}

// Exporta las funciones que serán utilizadas desde el servidor principal.
module.exports = {
  crearPagina,
  calcularCuotaMensual,
  reporteTotal,
  reporteMasGanan,
};
