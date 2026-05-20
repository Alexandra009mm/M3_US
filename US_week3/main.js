// ==========================================
// TASK 2: SELECCIÓN E INSPECCIÓN DE ELEMENTOS
// ==========================================
// Seleccionamos los elementos clave del DOM usando querySelector y sus ID correspondientes.
const lista = document.querySelector('#listaDeNotas');
const input = document.querySelector('#textTarea');
const btn = document.querySelector('#btn');

// Verificación obligatoria en consola para asegurar que los elementos existen en el HTML.
console.log('--- TASK 2: Referencias del DOM ---');
console.log('Elemento Lista (ul):', lista);
console.log('Elemento Input:', input);
console.log('Elemento Botón:', btn);


// ==========================================
// TASK 3 & 4: GESTIÓN DE NOTAS EN EL DOM
// ==========================================

/**
 * Función principal para validar el campo de texto y añadir una nueva nota al DOM.
 */
const validarYNotas = () => {
    // .trim() elimina espacios en blanco al inicio y al final para evitar textos vacíos invisibles.
    const textoInyectado = input.value.trim(); 

    // Validación obligatoria: Si está vacío, se advierte y se frena la ejecución.
    if (textoInyectado === "") {
        console.log('Texto inválido: el campo está vacío');
        alert('Por favor, escribe una nota válida.'); // Alerta simple al usuario.
        return; 
    } 

    // Creación dinámica de la estructura de la nota (<li>)
    const elementoLista = document.createElement('li');
    elementoLista.textContent = textoInyectado;

    // Creación dinámica del botón para eliminar la nota
    const button = document.createElement('button');
    button.textContent = 'Eliminar';
    aplicarEstilos(button); // Aplicamos los estilos visuales definidos más abajo.

    // TASK 4: Manejador de eventos para eliminar la nota actual
    button.addEventListener('click', () => {
        lista.removeChild(elementoLista); // Remueve el elemento li directamente desde el contenedor padre (ul).
        console.log('--- TASK 4: Nota eliminada desde el DOM ---');
        actualizarLocalStorage(); // TASK 5: Sincroniza y actualiza el almacenamiento.
    });

    // Construcción del nodo: Insertamos el botón dentro del <li> y el <li> dentro de la <ul>.
    elementoLista.appendChild(button);
    lista.appendChild(elementoLista);
    
    console.log('--- TASK 3: Nota agregada exitosamente ---');
    actualizarLocalStorage(); // TASK 5: Guardamos la nueva nota en el Local Storage.

    // Limpieza y usabilidad
    input.value = ""; // Limpia el campo para una nueva escritura.
    input.focus();    // Devuelve automáticamente el cursor al input para agilizar el proceso.
};

// Asignación de eventos para ejecutar la función al hacer clic o presionar Enter
btn.addEventListener('click', validarYNotas);

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        validarYNotas();
    }
});

/**
 * Función auxiliar para dar estilo en línea al botón dinámico.
 */
const aplicarEstilos = (button) => {
    button.style.color = 'white';
    button.style.backgroundColor = 'pink'; 
}


// ==========================================
// TASK 5: PERSISTENCIA CON LOCAL STORAGE
// ==========================================

/**
 * FUNCIÓN 1: Guarda la estructura HTML exacta actual de la lista en el navegador.
 */
function actualizarLocalStorage() {
    localStorage.setItem('notas', lista.innerHTML);
    console.log('--- TASK 5: Local Storage Actualizado ---');
}

/**
 * FUNCIÓN 2: Recupera el HTML guardado al recargar la página y reactiva los eventos de los botones.
 */
function cargarDesdeLocalStorage() {
    const notasGuardadas = localStorage.getItem('notas');

    if (notasGuardadas) {
        // Inyectamos el bloque de HTML guardado directamente dentro de la lista contenedora.
        lista.innerHTML = notasGuardadas;

        // CRUCIAL: Al usar innerHTML, los elementos pierden sus 'addEventListener'. 
        // Debemos buscar cada <li> inyectado y volver a activar su botón de eliminar.
        const elementosCargados = lista.querySelectorAll('li');
        
        elementosCargados.forEach((elementoLista) => {
            const btnEliminar = elementoLista.querySelector('button');

            btnEliminar.addEventListener('click', () => {
                lista.removeChild(elementoLista);
                console.log('--- TASK 4: Nota vieja eliminada desde el DOM ---');
                actualizarLocalStorage(); // Sincroniza el cambio en Local Storage tras borrar.
            });
        });

        // Log requerido para auditar cuántas notas se restauraron con éxito.
        console.log(`--- TASK 5: Se cargaron ${elementosCargados.length} notas desde Local Storage ---`);
    } else {
        console.log('--- TASK 5: No se encontraron notas previas en Local Storage ---');
    }
}

// Ejecución automática al cargar el script para restaurar el estado de la aplicación.
cargarDesdeLocalStorage();
