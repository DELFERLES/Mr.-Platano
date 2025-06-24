// --- State and Data ---
let materiales = [
  {
    nombre: '',
    cantidad: 0,
    costo: 0,
    costoMoneda: 'bs',  // 'bs' o 'usd'
    gramosTotales: 0,
    gramosUsados: 0
  }
];

let additionalExpensesList = [
  { descripcion: '', monto: 0, moneda: 'bs' }
];

// --- Render Material List ---
function renderMaterialList() {
  const matList = document.getElementById("materialList");
  if (!matList) return; // Evitar error si el nodo no existe
  matList.innerHTML = '';
  // Nombres de campos han sido eliminados por solicitud del usuario

  materiales.forEach((mat, idx) => {
    const row = document.createElement('div');
    row.className = "material-row dynamic-row"; // Added dynamic-row class
    row.tabIndex = 0;
    row.setAttribute('aria-label', 'Material usado');

    // Nombre
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Material";
    nameInput.value = mat.nombre;
    nameInput.autocomplete = "off";
    nameInput.inputMode = "text";
    nameInput.maxLength = 32;
    nameInput.addEventListener('input', e => {
      materiales[idx].nombre = e.target.value;
      updateSummary();
    });
    row.appendChild(nameInput);

    // Cantidad
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.placeholder = "Cantidad";
    qtyInput.min = "0";
    qtyInput.step = "any";
    qtyInput.inputMode = "decimal";
    qtyInput.value = mat.cantidad || '';
    qtyInput.title = "Cantidad de paquetes presentados";
    qtyInput.addEventListener('input', e => {
      materiales[idx].cantidad = parseFloat(e.target.value) || 0;
      updateSummary();
    });
    row.appendChild(qtyInput);

    // Costo unitario y moneda
    const costoWrapper = document.createElement('div');
    costoWrapper.className = 'costo-wrapper';
    // Input
    const costInput = document.createElement("input");
    costInput.type = "number";
    costInput.placeholder = "Costo";
    costInput.min = "0";
    costInput.step = "0.01";
    costInput.inputMode = "decimal";
    costInput.value = mat.costo || '';
    costInput.addEventListener('input', e => {
      materiales[idx].costo = parseFloat(e.target.value) || 0;
      updateSummary();
    });
    costoWrapper.appendChild(costInput);
    // Selector de moneda
    const monedaSelect = document.createElement('select');
    monedaSelect.innerHTML = `<option value="bs">Bs</option><option value="usd">$</option>`;
    monedaSelect.value = mat.costoMoneda || 'bs';
    monedaSelect.addEventListener('change', e => {
      materiales[idx].costoMoneda = e.target.value;
      updateSummary();
    });
    costoWrapper.appendChild(monedaSelect);
    row.appendChild(costoWrapper);

    // Gramos totales por unidad de compra
    const gramosTotalesInput = document.createElement("input");
    gramosTotalesInput.type = "number";
    gramosTotalesInput.placeholder = "g totales";
    gramosTotalesInput.min = "0";
    gramosTotalesInput.step = "any";
    gramosTotalesInput.inputMode = "decimal";
    gramosTotalesInput.value = mat.gramosTotales || '';
    gramosTotalesInput.addEventListener('input', e => {
      materiales[idx].gramosTotales = parseFloat(e.target.value) || 0;
      updateSummary();
    });
    row.appendChild(gramosTotalesInput);

    // Gramos usados
    const gramosUsadosInput = document.createElement("input");
    gramosUsadosInput.type = "number";
    gramosUsadosInput.placeholder = "g usados";
    gramosUsadosInput.min = "0";
    gramosUsadosInput.step = "any";
    gramosUsadosInput.inputMode = "decimal";
    gramosUsadosInput.value = mat.gramosUsados || '';
    gramosUsadosInput.addEventListener('input', e => {
      materiales[idx].gramosUsados = parseFloat(e.target.value) || 0;
      updateSummary();
    });
    row.appendChild(gramosUsadosInput);

    // Eliminar (sólo si hay >1 material)
    if (materiales.length > 1) {
      const delBtn = document.createElement('button');
      delBtn.type = "button";
      delBtn.title = "Eliminar este material";
      delBtn.innerHTML = "✖";
      delBtn.setAttribute('aria-label', 'Eliminar este material');
      delBtn.style.marginLeft = '0.11em';
      delBtn.addEventListener('click', () => {
        materiales.splice(idx, 1);
        renderMaterialList();
        updateSummary();
      });
      row.appendChild(delBtn);
    }

    matList.appendChild(row);
  });
}

// --- Render Additional Expenses List ---
function renderAdditionalExpensesList() {
  const expenseListDiv = document.getElementById("additionalExpenseList");
  if (!expenseListDiv) return;
  expenseListDiv.innerHTML = '';

  additionalExpensesList.forEach((exp, idx) => {
    const row = document.createElement('div');
    row.className = "additional-expense-row dynamic-row"; // Use the new class
    row.tabIndex = 0;
    row.setAttribute('aria-label', 'Gasto adicional');

    // Description Input
    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.placeholder = "Descripción del gasto";
    descInput.value = exp.descripcion;
    descInput.autocomplete = "off";
    descInput.inputMode = "text";
    descInput.maxLength = 40;
    descInput.addEventListener('input', e => {
      additionalExpensesList[idx].descripcion = e.target.value;
      updateSummary();
    });
    row.appendChild(descInput);

    // Amount and Currency Wrapper
    const amountWrapper = document.createElement('div');
    amountWrapper.className = 'amount-wrapper';

    // Amount Input
    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.placeholder = "Monto";
    amountInput.min = "0";
    amountInput.step = "0.01";
    amountInput.inputMode = "decimal";
    amountInput.value = exp.monto || '';
    amountInput.addEventListener('input', e => {
      additionalExpensesList[idx].monto = parseFloat(e.target.value) || 0;
      updateSummary();
    });
    amountWrapper.appendChild(amountInput);

    // Currency Selector
    const monedaSelect = document.createElement('select');
    monedaSelect.innerHTML = `<option value="bs">Bs</option><option value="usd">$</option>`;
    monedaSelect.value = exp.moneda || 'bs';
    monedaSelect.addEventListener('change', e => {
      additionalExpensesList[idx].moneda = e.target.value;
      updateSummary();
    });
    amountWrapper.appendChild(monedaSelect);
    row.appendChild(amountWrapper);

    // Remove Button (only if >1 expense)
    if (additionalExpensesList.length > 1) {
      const delBtn = document.createElement('button');
      delBtn.type = "button";
      delBtn.title = "Eliminar este gasto adicional";
      delBtn.innerHTML = "✖";
      delBtn.setAttribute('aria-label', 'Eliminar este gasto adicional');
      delBtn.style.marginLeft = '0.11em';
      delBtn.addEventListener('click', () => {
        additionalExpensesList.splice(idx, 1);
        renderAdditionalExpensesList();
        updateSummary();
      });
      row.appendChild(delBtn);
    }

    expenseListDiv.appendChild(row);
  });
}

// --- DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById('addMaterialBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      materiales.push({ nombre: '', cantidad: 0, costo: 0, costoMoneda: 'bs', gramosTotales: 0, gramosUsados: 0 });
      renderMaterialList();
      updateSummary();
    });
  }

  const addAdditionalExpenseBtn = document.getElementById('addAdditionalExpenseBtn');
  if (addAdditionalExpenseBtn) {
    addAdditionalExpenseBtn.addEventListener('click', () => {
      additionalExpensesList.push({ descripcion: '', monto: 0, moneda: 'bs' });
      renderAdditionalExpensesList();
      updateSummary();
    });
  }

  // Escucha todos los inputs relevantes SOLO SI EXISTEN
  const form = document.getElementById('costForm');
  if (form) form.addEventListener('input', updateSummary);

  const tasaInput = document.getElementById('usdToVes');
  if (tasaInput) tasaInput.addEventListener('input', updateSummary);

  // Actualiza también al cambiar moneda de mano de obra/otros gastos
  const laborCurr = document.getElementById('laborCurrency');
  if(laborCurr) laborCurr.addEventListener('change', updateSummary);

  // --- Event listener for redirecting to BCV website ---
  const goToBcvBtn = document.getElementById('goToBcvBtn');
  if (goToBcvBtn) {
    goToBcvBtn.addEventListener('click', () => {
      window.open('https://www.bcv.org.ve/glosario/cambio-oficial', '_blank');
    });
  }

  // --- Event listener for Print Summary button (now toggles print preview) ---
  const printSummaryBtn = document.getElementById('printSummaryBtn');
  const closePrintPreviewBtn = document.getElementById('closePrintPreviewBtn');

  if (printSummaryBtn && closePrintPreviewBtn) {
    printSummaryBtn.addEventListener('click', () => {
      document.body.classList.add('print-preview');
      // Scroll to the top of the summary section when preview opens
      const summarySection = document.getElementById('summarySection');
      if (summarySection) {
        summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    closePrintPreviewBtn.addEventListener('click', () => {
      document.body.classList.remove('print-preview');
    });
  }

  renderMaterialList();
  renderAdditionalExpensesList(); // Call the new render function
  updateSummary();
});

// --- Utils ---
function numberWithTwo(num) {
  if (isNaN(num)) return "0.00";
  return num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function displayDualCurrency(bs, usd, showDollar=true, showBolivar=true) {
  let res = '';
  if(showBolivar) res += `Bs ${numberWithTwo(bs)}`;
  if(showDollar && showBolivar) res += " / ";
  if(showDollar) res += `$${numberWithTwo(usd)}`;
  return res;
}

// --- Summary Calculation and Rendering ---
function updateSummary() {
  // Segura: si falta algún nodo no romper
  const tasaIn = document.getElementById('usdToVes');
  const laborIn = document.getElementById('laborCost');
  const laborCurrency = document.getElementById('laborCurrency');
  const numPackIn = document.getElementById('numPackages');
  const profitIn = document.getElementById('profitPercent');
  const publicExtraIn = document.getElementById('publicExtra');
  const summarySection = document.getElementById('summarySection');

  if (!tasaIn || !laborIn || !numPackIn || !profitIn || !publicExtraIn || !summarySection) return;

  let tasa = parseFloat(tasaIn.value) || 1;
  const matSumLines = [];
  let totalMateriales = 0;
  let totalMaterialesUSD = 0;
  let gramsTable = '';
  let anyGrams = false;

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = today.toLocaleDateString('es-ES', options);

  // Date in summary now green
  let resumenHTML = `<div style="text-align:right; margin-bottom: 0.8em; font-size: 0.9em; color: var(--primary-green);">Fecha: ${formattedDate}</div>`;

  if (tasa > 0) {
    resumenHTML += `<span class="usdve-rate">Tasa: Bs ${numberWithTwo(tasa)} = $1 (BCV)</span>`;
  }

  // Tabla opcional de gramos usados por material
  if (anyGrams) {
    resumenHTML += `<table class="mat-cost-summary-table">
      <thead>
        <tr>
          <th>Material</th>
          <th>Unid.</th>
          <th>g Tot.</th>
          <th>g Us.</th>
          <th>Costo (Bs)</th>
        </tr>
      </thead>
      <tbody>
        ${gramsTable}
      </tbody>
    </table>`;
  }

  materiales.forEach(mat => {
    // Determina costos por renglón según moneda elegida
    let costUnitBs = 0, costUnitUSD = 0;

    if (mat.costoMoneda === 'usd') {
      costUnitUSD = mat.costo || 0;
      costUnitBs = (mat.costo || 0) * tasa;
    } else { // bolivares
      costUnitBs = mat.costo || 0;
      costUnitUSD = (mat.costo || 0) / tasa;
    }

    if (
      mat.nombre || mat.cantidad > 0 || costUnitBs > 0 || mat.gramosTotales > 0 || mat.gramosUsados > 0 || costUnitUSD > 0
    ) {
      let costTotalInsumo = (mat.cantidad || 0) * (costUnitBs || 0);
      let costTotalInsumoUSD = (mat.cantidad || 0) * (costUnitUSD || 0);

      let gramosTotComps = (mat.cantidad || 0) * (mat.gramosTotales || 0);
      let costRealUsado = 0;
      let costRealUsadoUSD = 0;

      if (
        mat.gramosTotales > 0
        && gramosTotComps > 0
        && mat.gramosUsados > 0
        && costTotalInsumo > 0
      ) {
        costRealUsado = (mat.gramosUsados / gramosTotComps) * costTotalInsumo;
        costRealUsadoUSD = (mat.gramosUsados / gramosTotComps) * costTotalInsumoUSD;
        costRealUsado = isNaN(costRealUsado) ? 0 : costRealUsado;
        costRealUsadoUSD = isNaN(costRealUsadoUSD) ? 0 : costRealUsadoUSD;
        anyGrams = true;
      } else {
        costRealUsado = costTotalInsumo;
        costRealUsadoUSD = costTotalInsumoUSD;
      }

      // Fondo verde oscuro en línea de materiales
      matSumLines.push(
        `<div class="material-line-dark" style="background:#23551E !important;border-radius:11px;padding:0.39em 0.15em;margin-bottom:0.17em;display:flex;justify-content:space-between;align-items:center;gap:0.65em;font-size:0.97em;">
          <span style="color:#ffe955;font-weight:700;">
            ${mat.nombre||'Material'}
            <span style="color:#fff;font-weight:500;font-size:0.95em;">
              ${mat.cantidad ? (numberWithTwo(mat.cantidad) + ' x ') : ''}
              ${mat.costoMoneda === 'usd' ? '$' : 'Bs'}${numberWithTwo(mat.costo||0)}
              ${mat.gramosTotales ? (' (' + numberWithTwo(mat.gramosTotales||0) + ' g/u)') : ''}
            </span>
          </span>
          <span style="color:#FFFDE2;white-space:nowrap;font-size:0.95em;">
            ${mat.gramosUsados > 0 ? `g Us.: <b style="color:#ffe955">${numberWithTwo(mat.gramosUsados)}</b>g = ` : ''}
            <span class="highlight" style="color:#ffe955;">Bs ${numberWithTwo(costRealUsado)}</span>
            <span class="summary-currency" style="margin-left:0.19em;color:#ffe955;">/ $${numberWithTwo(costRealUsadoUSD)}</span>
          </span>
        </div>`
      );
      totalMateriales += costRealUsado;
      totalMaterialesUSD += costRealUsadoUSD;

      gramsTable += `<tr>
        <td>${mat.nombre||''}</td>
        <td>${mat.cantidad||0}</td>
        <td>${numberWithTwo(mat.gramosTotales||0)}</td>
        <td>${numberWithTwo(mat.gramosUsados||0)}</td>
        <td>${numberWithTwo(costRealUsado)}</td>
      </tr>`;
    }
  });

  // Calculate total from additionalExpensesList
  let totalAddExpensesBs = 0;
  let totalAddExpensesUSD = 0;
  let addExpenseSummaryLines = '';

  additionalExpensesList.forEach(exp => {
    let expenseBs = 0;
    let expenseUSD = 0;
    if (exp.moneda === 'usd') {
      expenseUSD = exp.monto || 0;
      expenseBs = (exp.monto || 0) * tasa;
    } else {
      expenseBs = exp.monto || 0;
      expenseUSD = (exp.monto || 0) / tasa;
    }
    totalAddExpensesBs += expenseBs;
    totalAddExpensesUSD += expenseUSD;

    if (exp.descripcion || exp.monto > 0) {
      addExpenseSummaryLines += `
        <div class="material-line-dark" style="background:#23551E !important;border-radius:11px;padding:0.39em 0.15em;margin-bottom:0.17em;display:flex;justify-content:space-between;align-items:center;gap:0.65em;font-size:0.97em;">
          <span style="color:#ffe955;font-weight:700;">
            ${exp.descripcion||'Gasto Adicional'}
            <span style="color:#fff;font-weight:500;font-size:0.95em;">
              (${exp.moneda === 'usd' ? '$' : 'Bs'}${numberWithTwo(exp.monto||0)})
            </span>
          </span>
          <span style="color:#FFFDE2;white-space:nowrap;font-size:0.95em;">
            <span class="highlight" style="color:#ffe955;">Bs ${numberWithTwo(expenseBs)}</span>
            <span class="summary-currency" style="margin-left:0.19em;color:#ffe955;">/ $${numberWithTwo(expenseUSD)}</span>
          </span>
        </div>
      `;
    }
  });

  // --- MONEDA para MANO DE OBRA ---
  let labor = parseFloat(laborIn.value) || 0;
  let laborUSD = 0, laborBs = 0;
  if (laborCurrency && laborCurrency.value === "usd") {
    laborUSD = labor;
    laborBs = labor * tasa;
  } else {
    laborBs = labor;
    laborUSD = labor / tasa;
  }

  const numPackages = parseInt(numPackIn.value) || 0;
  const profitPercent = parseFloat(profitIn.value) || 0;
  const publicExtra = parseFloat(publicExtraIn.value) || 0;

  // Suma total en Bs y USD
  const totalGastos = totalMateriales + laborBs + totalAddExpensesBs;
  const totalGastosUSD = (totalMaterialesUSD + laborUSD + totalAddExpensesUSD);

  // Cada línea de materiales en su propio bloque oscuro (SIEMPRE fondo verde oscuro)
  resumenHTML += matSumLines.join('');
  
  // Individual Additional Expenses lines
  if (addExpenseSummaryLines) {
    resumenHTML += `<h3 style="color:#388E3C;margin-bottom:0.06em;margin-top:0.7em;font-size:0.98em;padding-left:0.1em;font-weight:700;letter-spacing:0.5px;">Gastos Adicionales Individuales</h3>`;
    resumenHTML += addExpenseSummaryLines;
  }

  // --- Bloque predominante en verde oscuro para totales principales ---
  resumenHTML += `<div class="summary-main-lines">`;

  resumenHTML += `<div class="line"><span>Costo Materiales</span><span class="highlight">${displayDualCurrency(totalMateriales, totalMaterialesUSD)}</span></div>`;
  resumenHTML += `<div class="line"><span>Mano de obra</span><span>${displayDualCurrency(laborBs, laborUSD)}</span></div>`;
  resumenHTML += `<div class="line"><span>Total Gastos Adicionales</span><span class="highlight">${displayDualCurrency(totalAddExpensesBs, totalAddExpensesUSD)}</span></div>`;
  
  // Updated: Total Gastos del Producto on a single line, aligned right, with distinct background
  resumenHTML += `<div class="line" style="background:#ffe955;color:var(--primary-green);border-radius:8px;padding:0.11em 0.45em;margin:0.14em 0;">
    <span style="font-weight:700;">Total Gastos del Producto</span>
    <span style="font-weight:700;">Bs ${numberWithTwo(totalGastos)} / $${numberWithTwo(totalGastosUSD)}</span>
  </div>`;

  if (numPackages > 0) {
    const costoPorPaqueteBs = totalGastos / numPackages;
    const costoPorPaqueteUSD = totalGastosUSD / numPackages;

    resumenHTML += `<div class="line"><span>Cantidad de paquetes</span><span>${numPackages}</span></div>`;
    resumenHTML += `<div class="line"><span>Costo por paquete</span><span class="highlight">${displayDualCurrency(costoPorPaqueteBs, costoPorPaqueteUSD)}</span></div>`;

    // Precio de venta (con ganancia %)
    const gananciaUnidadBs = costoPorPaqueteBs * (profitPercent / 100);
    const gananciaUnidadUSD = costoPorPaqueteUSD * (profitPercent / 100);
    const precioVentaBs = costoPorPaqueteBs + gananciaUnidadBs;
    const precioVentaUSD = costoPorPaqueteUSD + gananciaUnidadUSD;

    resumenHTML += `<div class="line"><span>Ganancia deseada por paquete</span><span>${displayDualCurrency(gananciaUnidadBs, gananciaUnidadUSD)} <span class="summary-currency">(${numberWithTwo(profitPercent)}%)</span></span></div>`;

    resumenHTML += `<div class="line"><span><b>Precio de venta sugerido</b></span><span class="highlight">${displayDualCurrency(precioVentaBs, precioVentaUSD)}</span></div>`;

    let precioPublicoBs = precioVentaBs;
    let precioPublicoUSD = precioVentaUSD;
    if (publicExtra > 0) {
      precioPublicoBs = precioVentaBs * (1 + publicExtra / 100);
      precioPublicoUSD = precioVentaUSD * (1 + publicExtra / 100);
      resumenHTML += `<div class="line public-price"><span><b>Precio de venta al público</b> (+${numberWithTwo(publicExtra)}%)</span><span class="highlight">${displayDualCurrency(precioPublicoBs, precioPublicoUSD)}</span></div>`;
    } else {
      resumenHTML += `<div class="line public-price" style="border:0;">
        <span><b>Precio público por paquete</b></span>
        <span class="highlight">${displayDualCurrency(precioVentaBs, precioVentaUSD)}</span>
      </div>`;
    }

    // --- NUEVAS LÍNEAS: GANANCIA TOTAL Y GANANCIA NETA TOTAL ---
    const totalGanancia = gananciaUnidadBs * numPackages;
    const totalGananciaUSD = gananciaUnidadUSD * numPackages;
    resumenHTML += `<div class="line" style="background:#ffe955;color:var(--primary-green);border-radius:8px;padding:0.11em 0.45em;margin:0.14em 0;">
      <span style="font-weight:700;">Ganancia total</span>
      <span style="font-weight:700;">${displayDualCurrency(totalGanancia, totalGananciaUSD)}</span>
    </div>`;

    const gananciaNeta = (precioPublicoBs - costoPorPaqueteBs) * numPackages;
    const gananciaNetaUSD = (precioPublicoUSD - costoPorPaqueteUSD) * numPackages;
    resumenHTML += `<div class="line" style="background:#ffe955da;color:var(--primary-green);border-radius:8px;padding:0.13em 0.53em;font-weight:700;">
      <span>Ganancia neta total</span>
      <span>${displayDualCurrency(gananciaNeta, gananciaNetaUSD)}</span>
    </div>`;

    resumenHTML += `</div>`; // Cierra summary-main-lines
  } else {
    resumenHTML += `</div>`;
    resumenHTML += `<div class="summary-main-message"><b>Ingrese la cantidad de paquetes para calcular el costo por unidad y propuesta de venta.</b></div>`;
  }

  summarySection.innerHTML = resumenHTML;
}