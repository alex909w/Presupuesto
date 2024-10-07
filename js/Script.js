document.addEventListener("DOMContentLoaded", () => {
    const totalIngresos = document.getElementById('total-ingresos');
    const totalEgresos = document.getElementById('total-egresos');
    const porcentajeEgresos = document.getElementById('porcentaje-egresos');
    const saldoTotal = document.getElementById('saldo-total'); // Saldo total
    const listaTransacciones = document.getElementById('lista-transacciones'); // Lista común
    const tipoTransaccion = document.getElementById('tipo-transaccion');
    const descripcionInput = document.getElementById('descripcion');
    const montoInput = document.getElementById('monto');
    const agregarBtn = document.getElementById('agregar-btn');
    const tituloMes = document.getElementById('titulo-mes'); // Elemento del título con mes y año
    const tabIngresosBtn = document.getElementById('tab-ingresos');
    const tabEgresosBtn = document.getElementById('tab-egresos');

    let ingresos = [];
    let egresos = [];
    let mostrandoIngresos = true; // Variable para controlar qué pestaña está activa

    // Función para obtener el mes y año actual y actualizar el título
    function actualizarTituloMes() {
        const fechaActual = new Date();
        const mes = fechaActual.toLocaleString('default', { month: 'long' }); // Obtener el mes actual
        const año = fechaActual.getFullYear(); // Obtener el año actual
        tituloMes.textContent = `Presupuesto de ${mes} ${año}`;
    }

    // Función para actualizar los totales y el porcentaje de egresos, y calcular el saldo total
    function actualizarTotales() {
        const totalIngreso = ingresos.reduce((sum, transaccion) => sum + transaccion.monto, 0);
        const totalEgreso = egresos.reduce((sum, transaccion) => sum + transaccion.monto, 0);

        // Calcular el saldo disponible
        const saldoDisponible = totalIngreso - totalEgreso;
        saldoTotal.textContent = `Saldo restante: ${saldoDisponible >= 0 ? '+' : ''}${saldoDisponible.toFixed(2)}`; // Mostrar saldo con formato

        // Calcular el porcentaje total de egresos respecto a los ingresos
        let porcentajeTotal = 0;
        if (totalIngreso > 0) {
            porcentajeTotal = (totalEgreso * 100) / totalIngreso;
        }

        // Actualizar los valores en la interfaz
        totalIngresos.textContent = `+${totalIngreso.toFixed(2)}`;
        totalEgresos.textContent = `-${totalEgreso.toFixed(2)}`;

        // Si no hay ingresos, mostrar porcentaje como (0%) y evitar cálculos erróneos
        if (totalIngreso > 0) {
            porcentajeEgresos.textContent = `(${porcentajeTotal.toFixed(2)}%)`;
        } else {
            porcentajeEgresos.textContent = "(0%)"; // No se puede calcular porcentaje sin ingresos
        }

        // Mostrar la transacción correspondiente dependiendo de la pestaña activa
        mostrarTransacciones();
    }

    // Función para mostrar las transacciones basadas en la pestaña activa (Ingresos o Egresos)
    function mostrarTransacciones() {
        listaTransacciones.innerHTML = ""; // Limpiar lista de transacciones

        if (mostrandoIngresos) {
            // Mostrar ingresos
            ingresos.forEach(transaccion => {
                const li = document.createElement('li');
                li.textContent = `${transaccion.descripcion}: +${transaccion.monto.toFixed(2)}`;
                listaTransacciones.appendChild(li);
            });

            // Mostrar total de ingresos al final
            const liTotalIngreso = document.createElement('li');
            liTotalIngreso.style.fontWeight = 'bold';
            const totalIngreso = ingresos.reduce((sum, trans) => sum + trans.monto, 0);
            liTotalIngreso.textContent = `Total Ingresos: +${totalIngreso.toFixed(2)}`;
            listaTransacciones.appendChild(liTotalIngreso);
        } else {
            // Mostrar egresos con porcentaje
            if (ingresos.length > 0) {
                egresos.forEach(transaccion => {
                    const totalIngreso = ingresos.reduce((sum, trans) => sum + trans.monto, 0); // Total de ingresos
                    const porcentajeEgreso = (transaccion.monto * 100) / totalIngreso; // Aplicación de la fórmula
                    const li = document.createElement('li');
                    li.style.display = 'flex'; // Usar flexbox
                    li.style.justifyContent = 'space-between'; // Separar texto y porcentaje
                    li.style.alignItems = 'center'; // Centrar verticalmente
                    li.textContent = `${transaccion.descripcion}: -${transaccion.monto.toFixed(2)}`;
                    const porcentajeSpan = document.createElement('span');
                    porcentajeSpan.textContent = `(${porcentajeEgreso.toFixed(2)}%)`;
                    li.appendChild(porcentajeSpan); // Agregar el porcentaje al li
                    listaTransacciones.appendChild(li);
                });
            } else {
                // Si no hay ingresos, no mostrar porcentajes para los egresos
                egresos.forEach(transaccion => {
                    const li = document.createElement('li');
                    li.textContent = `${transaccion.descripcion}: -${transaccion.monto.toFixed(2)} (No se puede calcular porcentaje sin ingresos)`;
                    listaTransacciones.appendChild(li);
                });
            }

            // Mostrar total de egresos al final
            const liTotalEgreso = document.createElement('li');
            liTotalEgreso.style.fontWeight = 'bold';
            const totalEgreso = egresos.reduce((sum, trans) => sum + trans.monto, 0);
            liTotalEgreso.textContent = `Total Egresos: -${totalEgreso.toFixed(2)}`;
            listaTransacciones.appendChild(liTotalEgreso);
        }
    }

    // Función para cambiar el color de los tabs
    function cambiarColorTab(tabActivo) {
        const tabs = ['tab-ingresos', 'tab-egresos'];
        tabs.forEach(tab => {
            const elemento = document.getElementById(tab);
            if (tab === tabActivo) {
                elemento.style.backgroundColor = '#2b313d'; // Color de fondo para el tab activo
                elemento.style.color = 'white'; // Color de texto para el tab activo
            } else {
                elemento.style.backgroundColor = '#d9d9d9'; // Color de fondo original para tabs inactivos
                elemento.style.color = 'black'; // Color de texto original para tabs inactivos
            }
        });
    }

    // Función para agregar transacción
    function agregarTransaccion() {
        const tipo = tipoTransaccion.value; // Ingreso o Egreso
        const descripcion = descripcionInput.value;
        const monto = parseFloat(montoInput.value); // Convertir el monto a número

        // Validar los campos
        if (descripcion.trim() === "" || isNaN(monto) || monto <= 0) {
            alert("Por favor ingresa una descripción válida y un monto numérico positivo.");
            return;
        }

        // Validar si se intenta agregar un egreso cuando no hay ingresos
        if (tipo === "egreso" && ingresos.length === 0) {
            alert("No se puede realizar transacciones de egreso sin ingresos. Por favor, ingrese al menos un ingreso.");
            return;
        }

        // Validar si el monto del egreso es mayor que el saldo disponible
        const totalIngreso = ingresos.reduce((sum, trans) => sum + trans.monto, 0); // Total de ingresos
        const totalEgreso = egresos.reduce((sum, trans) => sum + trans.monto, 0); // Total de egresos
        const saldoDisponible = totalIngreso - totalEgreso; // Calcular saldo disponible

        if (tipo === "egreso" && monto > saldoDisponible) {
            alert("Saldo insuficiente. No se puede realizar la transacción.");
            return;
        }

        const transaccion = { descripcion, monto };

        if (tipo === "ingreso") {
            ingresos.push(transaccion);
        } else if (tipo === "egreso") {
            egresos.push(transaccion);
        }

        // Limpiar campos después de agregar la transacción
        descripcionInput.value = "";
        montoInput.value = "";

        // Actualizar los totales y mostrar las transacciones
        actualizarTotales();
    }

    // Función para cambiar a la pestaña de Ingresos
    tabIngresosBtn.addEventListener('click', () => {
        mostrandoIngresos = true;
        mostrarTransacciones(); // Actualizar la vista
        cambiarColorTab('tab-ingresos'); // Cambiar color del tab
    });

    // Función para cambiar a la pestaña de Egresos
    tabEgresosBtn.addEventListener('click', () => {
        mostrandoIngresos = false;
        mostrarTransacciones(); // Actualizar la vista
        cambiarColorTab('tab-egresos'); // Cambiar color del tab
    });

    // Escuchar el clic en el botón "Agregar" para añadir la transacción
    agregarBtn.addEventListener('click', agregarTransaccion);

    // Inicializar con el mes y año actual
    actualizarTituloMes();
    mostrarTransacciones();

    // Inicializar el tab de ingresos como activo al cargar la página
    cambiarColorTab('tab-ingresos');
});
