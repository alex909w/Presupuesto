document.addEventListener("DOMContentLoaded", () => {
    const tituloMes = document.getElementById('titulo-mes');
    const totalIngresos = document.getElementById('total-ingresos');
    const totalEgresos = document.getElementById('total-egresos');
    const porcentajeEgresos = document.getElementById('porcentaje-egresos');
    const saldoTotal = document.getElementById('saldo-total');
    const tipoTransaccion = document.getElementById('tipo-transaccion');
    const descripcion = document.getElementById('descripcion');
    const monto = document.getElementById('monto');
    const listaTransacciones = document.getElementById('lista-transacciones');

    let ingresos = [];
    let egresos = [];

    // Función para actualizar el título con el mes actual
    function actualizarTituloMes() {
        const fechaActual = new Date();
        const mes = fechaActual.toLocaleString('default', { month: 'long' });
        const año = fechaActual.getFullYear();
        tituloMes.textContent = `Presupuesto de ${mes} ${año}`;
    }

    // Función para actualizar los totales y el saldo disponible
    function actualizarTotales() {
        const totalIngreso = ingresos.reduce((sum, transaccion) => sum + transaccion.monto, 0);
        const totalEgreso = egresos.reduce((sum, transaccion) => sum + transaccion.monto, 0);

        // Calcular el porcentaje de egresos
        let porcentaje = 0;
        if (totalIngreso > 0) {
            porcentaje = (totalEgreso * 100) / totalIngreso; // Fórmula proporcionada
        }

        // Actualizar los valores en la interfaz
        totalIngresos.textContent = `+${totalIngreso.toFixed(2)}`; // Redondeado a 2 decimales
        totalEgresos.textContent = `-${totalEgreso.toFixed(2)}`; // Redondeado a 2 decimales
        porcentajeEgresos.textContent = `(${porcentaje.toFixed(2)}%)`; // Redondeado a 2 decimales

        // Calcular el saldo disponible
        const saldoDisponible = totalIngreso - totalEgreso;

        // Mostrar el saldo disponible con + o -
        if (saldoDisponible >= 0) {
            saldoTotal.textContent = `+${saldoDisponible.toFixed(2)}`; // Redondeado a 2 decimales
            saldoTotal.style.color = "#47af5e"; // Verde para saldo positivo
        } else {
            saldoTotal.textContent = `${saldoDisponible.toFixed(2)}`; // Redondeado a 2 decimales
            saldoTotal.style.color = "#dd4658"; // Rojo para saldo negativo
        }
    }

    // Función para agregar transacción
    function agregarTransaccion() {
        const tipo = tipoTransaccion.value;
        const descripcionVal = descripcion.value;
        const montoVal = parseFloat(monto.value);

        if (isNaN(montoVal) || descripcionVal.trim() === "") {
            alert("Por favor ingresa una descripción válida y un monto numérico.");
            return;
        }

        // Validar que los egresos no excedan el saldo actual
        const totalIngreso = ingresos.reduce((sum, transaccion) => sum + transaccion.monto, 0);
        const saldoDisponible = totalIngreso - egresos.reduce((sum, transaccion) => sum + transaccion.monto, 0);

        if (tipo === "egreso" && montoVal > saldoDisponible) {
            alert("El monto del egreso no puede ser mayor que el saldo actual disponible en ingresos.");
            return;
        }

        const transaccion = { descripcion: descripcionVal, monto: montoVal };
        if (tipo === "ingreso") {
            ingresos.push(transaccion);
        } else {
            egresos.push(transaccion);
        }

        // Limpiar campos
        descripcion.value = "";
        monto.value = "";

        // Actualizar totales y mostrar transacciones
        actualizarTotales();
        mostrarTransacciones();
    }

    // Función para mostrar las transacciones
    function mostrarTransacciones() {
        listaTransacciones.innerHTML = "";

        const transacciones = tipoTransaccion.value === "ingreso" ? ingresos : egresos;

        transacciones.forEach(transaccion => {
            const li = document.createElement('li');
            if (tipoTransaccion.value === "ingreso") {
                li.textContent = `${transaccion.descripcion}: +${transaccion.monto.toFixed(2)}`; // Redondeado a 2 decimales
            } else {
                li.textContent = `${transaccion.descripcion}: -${transaccion.monto.toFixed(2)}`; // Redondeado a 2 decimales
            }
            listaTransacciones.appendChild(li);
        });
    }

    document.getElementById('agregar-btn').addEventListener('click', agregarTransaccion);
    document.getElementById('tab-ingresos').addEventListener('click', () => {
        tipoTransaccion.value = "ingreso";
        mostrarTransacciones();
    });
    document.getElementById('tab-egresos').addEventListener('click', () => {
        tipoTransaccion.value = "egreso";
        mostrarTransacciones();
    });

    actualizarTituloMes();
});
