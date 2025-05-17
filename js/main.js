let P0 = 0;
let k = 0;
let chartExponencial = null;
let chartLogistica = null;
let rLog = 0;

let numerator = 0;
let denominator = 0;

document.getElementById('formExponencial').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener valores del formulario
  P0 = parseFloat(document.getElementById('p0').value);
  const t = parseFloat(document.getElementById('t').value);
  const Pt = parseFloat(document.getElementById('pt').value);

  // Validar que los valores sean números y positivos
  if (isNaN(P0) || isNaN(t) || isNaN(Pt) || P0 <= 0 || t <= 0 || Pt <= 0) {
    alert('Por favor, ingresa valores numéricos positivos en todos los campos.');
    return;
  }

  // Calcular k usando la fórmula k = (1/t) * ln(Pt/P0)
  k = Math.log(Pt / P0) / t;

  // Mostrar la sección de resultados
  document.getElementById('resultadoExponencial').style.display = 'block';

  // Mostrar pasos de resolución
  const pasos = `
    <p>Modelo: \\( \\frac{dP}{dt} = kP \\)</p>
    <p>Solución general: \\( P(t) = P_0 e^{kt} \\)</p>
    <p>Para encontrar la constante \\( k \\), usamos los datos proporcionados:</p>
    <ol>
      <li>Partimos de la fórmula general: \\( P(t) = P_0 e^{kt} \\)</li>
      <li>Despejamos \\( k \\): \\( k = \\frac{1}{t} \\ln \\left( \\frac{P(t)}{P_0} \\right) \\)</li>
      <p>Esto se obtiene tomando el logaritmo natural en ambos lados de la ecuación \\( P(t) = P_0 e^{kt} \\) y luego dividiendo por \\( t \\):</p>
      <p class="text-center">\\( \\ln P(t) = \\ln P_0 + kt \\Rightarrow kt = \\ln P(t) - \\ln P_0 = \\ln \\left( \\frac{P(t)}{P_0} \\right) \\Rightarrow k = \\frac{1}{t} \\ln \\left( \\frac{P(t)}{P_0} \\right) \\)</p>
      <li>Reemplazamos los valores dados: \\( k = \\frac{1}{${t}} \\ln \\left( \\frac{${Pt}}{${P0}} \\right) \\)</li>
      <li>Calculamos el valor numérico: \\( k = ${k.toFixed(4)} \\)</li>
    </ol>
    <p>Con este valor de \\( k \\), podemos predecir la población en cualquier tiempo \\( t \\) usando la fórmula general.</p>
  `;
  document.getElementById('pasosResolucion').innerHTML = pasos;

  // Renderizar las ecuaciones con MathJax
  if (window.MathJax) {
    MathJax.typesetPromise();
  }

  // Graficar la población
  graficar();
});

// Evento para calcular error exponencial con fórmula corregida (denominador valor real)
document.getElementById('calcularErrorExponencialBtn').addEventListener('click', function() {
  const valorReal = parseFloat(document.getElementById('valorRealExponencial').value);
  const tiempo = parseFloat(document.getElementById('t').value);

  if (isNaN(valorReal) || valorReal <= 0) {
    alert('Por favor, ingresa un valor real válido y positivo para la población.');
    return;
  }
  if (isNaN(tiempo) || tiempo < 0) {
    alert('Por favor, ingresa un tiempo válido.');
    return;
  }
  if (P0 === 0 || k === 0) {
    alert('Primero calcula el modelo exponencial antes de calcular el error.');
    return;
  }

  const poblacionCalculada = P0 * Math.exp(k * tiempo);
  const errorPorcentaje = (Math.abs(valorReal - poblacionCalculada) / valorReal);

  const resultado = `Error porcentual: ${errorPorcentaje.toFixed(2)}%`;
  document.getElementById('resultadoErrorExponencial').innerHTML = resultado;
});

// Modelo Logístico
document.getElementById('formLogistica').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener valores del formulario
  const P0Log = parseFloat(document.getElementById('p0Log').value);
  const PtLog = parseFloat(document.getElementById('ptLog').value);
  const KLog = parseFloat(document.getElementById('kLog').value);
  const tLog = parseFloat(document.getElementById('tLog').value);

  // Validar valores
  if (isNaN(P0Log) || isNaN(PtLog) || isNaN(KLog) || isNaN(tLog) || 
      P0Log <= 0 || PtLog <= 0 || KLog <= 0 || tLog <= 0) {
    alert('Por favor, ingresa valores numéricos positivos en todos los campos.');
    return;
  }

  if (PtLog >= KLog) {
    alert('P(t) debe ser menor que la capacidad de carga K.');
    return;
  }

  // Calcular r (usando variables globales numerator/denominator)
  numerator = (KLog / PtLog) - 1;
  denominator = (KLog - P0Log) / P0Log;
  
  if (numerator <= 0 || denominator <= 0) {
    alert('No se puede calcular r con los valores ingresados.');
    return;
  }

  rLog = - (1 / tLog) * Math.log(numerator / denominator);

  // Mostrar resultados
  document.getElementById('resultadoLogistica').style.display = 'block';
  
  const pasosLog = `
    <p>Modelo: \\( \\frac{dP}{dt} = rP \\left(1 - \\frac{P}{K}\\right) \\)</p>
    <p>Solución general: \\( P(t) = \\frac{K}{1 + \\left(\\frac{K - P_0}{P_0}\\right) e^{-rt}} \\)</p>
    <p>Tasa de crecimiento calculada: \\( r = ${rLog.toFixed(4)} \\)</p>
  `;
  document.getElementById('pasosResolucionLog').innerHTML = pasosLog;

  // Renderizar MathJax
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
  // Graficar la población logística con el valor calculado de r
  graficarLogistica(P0Log, rLog, KLog, tLog);
});

// Evento para calcular error logístico con fórmula corregida (denominador valor real)
document.getElementById('calcularErrorLogisticaBtn').addEventListener('click', function() {
  const valorReal = parseFloat(document.getElementById('valorRealLogistica').value);
  const tiempo = parseFloat(document.getElementById('tLog').value);
  const P0Log = parseFloat(document.getElementById('p0Log').value);
  const KLog = parseFloat(document.getElementById('kLog').value);

  if (isNaN(valorReal) || valorReal <= 0) {
    alert('Por favor, ingresa un valor real válido y positivo para la población.');
    return;
  }
  if (isNaN(tiempo) || tiempo < 0) {
    alert('Por favor, ingresa un tiempo válido.');
    return;
  }
  if (rLog === 0) {
    alert('Primero calcula el modelo logístico antes de calcular el error.');
    return;
  }

  // Calcular P(t) logístico
  const poblacionCalculadaLog = KLog / (1 + ((KLog - P0Log) / P0Log) * Math.exp(-rLog * tiempo));
  const errorPorcentaje = (Math.abs(valorReal - poblacionCalculadaLog) / valorReal) ;

  const resultado = `Error porcentual: ${errorPorcentaje.toFixed(2)}%`;
  document.getElementById('resultadoErrorLogistica').innerHTML = resultado;
});

function mostrarSeccion(id) {
  // Ocultar todas las secciones
  const secciones = ['inicio', 'exponencial', 'logistica', 'laplace', 'exponencial-nuevo', 'logistica-nuevo'];
  secciones.forEach(seccion => {
    const elemento = document.getElementById(seccion);
    if (elemento) {
      elemento.style.display = 'none';
    }
  });
  // Mostrar la sección seleccionada
  const seccionMostrar = document.getElementById(id);
  if (seccionMostrar) {
    seccionMostrar.style.display = 'block';
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  }
}

function calcularValor() {
  const tiempoConsulta = parseFloat(document.getElementById('tiempoConsulta').value);
  if (isNaN(tiempoConsulta) || tiempoConsulta < 0) {
    alert('Por favor, ingresa un tiempo válido (número positivo).');
    return;
  }
  const poblacionCalculada = P0 * Math.exp(k * tiempoConsulta);
  const resultadoTexto = `Para t = ${tiempoConsulta}, la población calculada es P(t) = ${poblacionCalculada.toFixed(4)}.`;
  document.getElementById('resultadoConsulta').textContent = resultadoTexto;
}

function calcularValorLog() {
  const tiempoConsultaLog = parseFloat(document.getElementById('tiempoConsultaLog').value);
  
  if (isNaN(tiempoConsultaLog) || tiempoConsultaLog < 0) {
    alert('Ingresa un tiempo válido (número positivo).');
    return;
  }

  // Obtener valores necesarios
  const P0Log = parseFloat(document.getElementById('p0Log').value);
  const KLog = parseFloat(document.getElementById('kLog').value);

  // Validar que rLog ya fue calculado
  if (rLog === 0) {
    alert('Primero calcula el modelo logístico antes de consultar P(t).');
    return;
  }

  // Calcular P(t)
  const poblacionCalculadaLog = KLog / (1 + ((KLog - P0Log) / P0Log) * Math.exp(-rLog * tiempoConsultaLog));
  document.getElementById('resultadoConsultaLog').textContent = 
    `Para t = ${tiempoConsultaLog}, P(t) = ${poblacionCalculadaLog.toFixed(4)}`;
}


document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const section = this.getAttribute('data-section');
    if (section) {
      mostrarSeccion(section);
    }
  });
});

document.querySelectorAll('.navbar-nav .dropdown-item').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const section = this.getAttribute('data-section');
    if (section) {
      mostrarSeccion(section);
    }
  });
});

function graficar() {
  const tMax = parseFloat(document.getElementById("t").value);
  const ctx = document.getElementById("graficaPoblacion").getContext("2d");

  const labels = [];
  const data = [];

  for (let i = 0; i <= tMax; i++) {
    labels.push(i);
    data.push(P0 * Math.exp(k * i));
  }

  if (chartExponencial) chartExponencial.destroy();

  const legendLabel = `P(t) = ${P0.toFixed(2)} * e^(${k.toFixed(4)} * t)`;

  chartExponencial = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: legendLabel,
        data: data,
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Tiempo (t)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Población'
          }
        }
      }
    }
  });
}

function graficarLogistica(P0Log, rLog, KLog, tLog) {
  const ctx = document.getElementById("graficaPoblacionLog").getContext("2d");

  const labels = [];
  const data = [];

  for (let i = 0; i <= tLog; i++) {
    labels.push(i);
    const val = KLog / (1 + ((KLog - P0Log) / P0Log) * Math.exp(-rLog * i));
    data.push(val);
  }

  if (chartLogistica) chartLogistica.destroy();

  const legendLabel = `P(t) = ${KLog.toFixed(2)} / (1 + ((${KLog.toFixed(2)} - ${P0Log.toFixed(2)}) / ${P0Log.toFixed(2)}) * e^(-${rLog.toFixed(4)} * t))`;

  chartLogistica = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: legendLabel,
        data: data,
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Tiempo (t)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Población'
          }
        }
      }
    }
  });
}

// Mostrar la sección "inicio" por defecto al cargar la página
mostrarSeccion('inicio');

// Manejo del formulario y cálculo para la sección "exponencial-nuevo"
document.getElementById('formExponencialNuevo').addEventListener('submit', function(event) {
  event.preventDefault();

  const P0Nuevo = parseFloat(document.getElementById('p0Nuevo').value);
  const rNuevo = parseFloat(document.getElementById('rNuevo').value);

  if (isNaN(P0Nuevo) || P0Nuevo <= 0) {
    alert('Por favor, ingresa un valor numérico positivo para P(0).');
    return;
  }
  if (isNaN(rNuevo)) {
    alert('Por favor, ingresa un valor numérico para r.');
    return;
  }

  // Guardar valores globales para uso en cálculo posterior
  P0 = P0Nuevo;
  k = rNuevo;

  // Mostrar sección de resultados
  document.getElementById('resultadoExponencialNuevo').style.display = 'block';

  // Mostrar pasos de resolución
  const pasosNuevo = `
    <p>Modelo: \\( \\frac{dP}{dt} = rP \\)</p>
    <p>Solución general: \\( P(t) = P_0 e^{rt} \\)</p>
    <p>Con los valores ingresados:</p>
    <ul>
      <li>\\( P_0 = ${P0Nuevo} \\)</li>
      <li>\\( r = ${rNuevo} \\)</li>
    </ul>
    <p>La función de población es:</p>
    <p class="text-center">\\( P(t) = ${P0Nuevo} e^{${rNuevo} t} \\)</p>
  `;
  document.getElementById('pasosResolucionNuevo').innerHTML = pasosNuevo;

  // Renderizar MathJax
  if (window.MathJax) {
    MathJax.typesetPromise();
  }

  // Graficar la población
  graficarNuevo();
});

// Función para calcular P(t) en la sección "exponencial-nuevo"
function calcularValorNuevo() {
  const tiempoConsultaNuevo = parseFloat(document.getElementById('tiempoConsultaNuevo').value);
  if (isNaN(tiempoConsultaNuevo) || tiempoConsultaNuevo < 0) {
    alert('Por favor, ingresa un tiempo válido (número positivo).');
    return;
  }
  const poblacionCalculada = P0 * Math.exp(k * tiempoConsultaNuevo);
  const resultadoTexto = `Para t = ${tiempoConsultaNuevo}, la población calculada es P(t) = ${poblacionCalculada.toFixed(4)}.`;
  document.getElementById('resultadoConsultaNuevo').textContent = resultadoTexto;
}

// Función para graficar la población en la sección "exponencial-nuevo"
function graficarNuevo() {
  const tiempoMax = 20; // rango fijo para graficar
  const ctx = document.getElementById('graficaPoblacionNuevo').getContext('2d');

  const labels = [];
  const data = [];

  for (let i = 0; i <= tiempoMax; i++) {
    labels.push(i);
    data.push(P0 * Math.exp(k * i));
  }

  if (chartExponencial) chartExponencial.destroy();

  const legendLabel = `P(t) = ${P0.toFixed(2)} * e^{${k.toFixed(4)} * t}`;

  chartExponencial = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: legendLabel,
        data: data,
        borderColor: 'rgba(40, 167, 69, 1)', // verde bootstrap
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Tiempo (t)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Población'
          }
        }
      }
    }
  });
}

// Evento para calcular error porcentual en la sección "exponencial-nuevo"
document.getElementById('calcularErrorExponencialNuevoBtn').addEventListener('click', function() {
  const valorReal = parseFloat(document.getElementById('valorRealExponencialNuevo').value);
  const tiempo = parseFloat(document.getElementById('tiempoConsultaNuevo').value);

  if (isNaN(valorReal) || valorReal <= 0) {
    alert('Por favor, ingresa un valor real válido y positivo para la población.');
    return;
  }
  if (isNaN(tiempo) || tiempo < 0) {
    alert('Por favor, ingresa un tiempo válido.');
    return;
  }
  if (P0 === 0 || k === 0) {
    alert('Primero calcula el modelo exponencial antes de calcular el error.');
    return;
  }

  const poblacionCalculada = P0 * Math.exp(k * tiempo);
  const errorPorcentaje = (Math.abs(valorReal - poblacionCalculada) / valorReal) * 100;

  const resultado = `Error porcentual: ${errorPorcentaje.toFixed(2)}%`;
  document.getElementById('resultadoErrorExponencialNuevo').innerHTML = resultado;
});
