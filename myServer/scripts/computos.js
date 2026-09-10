// Escapa caracteres especiales para evitar inyección de HTML en los datos del usuario.
function escaparHTML(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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
function contenidoPagina(nombre = 'Lina Rios', prestamo = 6000000, meses = 12, interes = 15.5, cadSalida = '') {
  return `<header>
            <img src="/logouao.png" alt="Logo 50 años" />
            <h1>Caso 1 - Cómputo de cuotas mensuales</h1>
        </header>
    <main>
      <section>
        <p class="introduccion">Este aplicativo permite el cómputo de la cuota mensual con los datos suministrados y la generación de un par de reportes.</p>
        <form action="/procesaCuota" method="post" enctype="application/x-www-form-urlencoded">
          <table>
            <caption>Simulador de Cuotas</caption>
            <tr><td><label for="elNombre">Nombre</label></td><td><input type="text" value="${escaparHTML(nombre)}" id="elNombre" name="elNombre" required></td></tr>
            <tr><td><label for="elPrestamo">Préstamo $</label></td><td><input type="number" value="${escaparHTML(prestamo)}" id="elPrestamo" name="elPrestamo" min="1" required></td></tr>
            <tr><td><label for="elInteres">Interés (%)</label></td><td><input type="number" value="${escaparHTML(interes)}" id="elInteres" name="elInteres" min="0.01" step="any" required></td></tr>
            <tr><td><label for="losMeses">Meses</label></td><td><input type="number" value="${escaparHTML(meses)}" id="losMeses" name="losMeses" min="1" required></td></tr>
          </table>
          <textarea name="laRespuesta" aria-label="Respuesta del simulador" readonly>${escaparHTML(cadSalida)}</textarea>
          <div class="acciones">
            <select name="laOpcion" aria-label="Funcionalidad a ejecutar">
              <option value="Calcular" selected>Calcular cuota</option>
              <option value="ListarTodos">Listar todos</option>
              <option value="ListarGanan">Listar préstamos mayores a $1.000.000</option>
            </select>
            <button id="procesar" type="submit">Ejecutar funcionalidad</button>
          </div>
        </form>
      </section>
    </main>
    <footer>
      <hr>
      <p>Creado por Diego Vega, Andrea Fernandez y Giannella Quintero para el curso de Estructuras de Datos y Algoritmos 1 de la Universidad Autónoma de Occidente.</p>
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
  let mensaje = '';
  if (info.length === 0) {
    mensaje = 'No hay préstamos procesados';
  } else {
    mensaje = 'Listado de préstamos procesados son:\n\n';
  }
  info.forEach((dato) => {
    mensaje += `${dato.nombre} -- $ ${dato.prestamo} - $ ${dato.cuota.toFixed(2)} - ${dato.meses} meses - ${dato.interes}%\n`;
  });
  return mensaje;
}

// Filtra los préstamos mayores a un millón para generar un reporte específico.
function reporteMasGanan(info) {
  let mensaje = '';
  const aux = info.filter((dato) => dato.prestamo > 1000000);
  if (aux.length === 0) {
    mensaje = 'No hay préstamos mayores a $1.000.000';
  } else {
    mensaje = 'Listado de préstamos mayores a $1.000.000:\n\n';
  }
  aux.forEach((dato) => {
    mensaje += `${dato.nombre} -- $ ${dato.prestamo} - $ ${dato.cuota.toFixed(2)}\n`;
  });
  return mensaje;
}

// Exporta las funciones que serán utilizadas desde el servidor principal.
module.exports = { crearPagina, calcularCuotaMensual, reporteTotal, reporteMasGanan };
