// ================================================
//  GESTOR DE PRODUCTOS 
// ================================================


// ------------------------------------------------
// 1. REFERENCIAS AL DOM
// ------------------------------------------------
const inputNombre      = document.getElementById('nombre');
const inputPrecio      = document.getElementById('precio');
const inputDescripcion = document.getElementById('descripcion');
const listaProductos   = document.getElementById('listaProductos');
const contadorEl       = document.getElementById('contador');
const mensajeEl        = document.getElementById('mensaje');
const btnAgregar       = document.getElementById('btnAgregar');
const btnSincronizar   = document.getElementById('btnSincronizar');
const vacioPEl         = document.getElementById('vacio');


// ------------------------------------------------
// 2. ARREGLO GLOBAL DE PRODUCTOS
//    Aquí se guardan todos los productos en memoria.
// ------------------------------------------------
let productos = [];

// ID del producto que se está editando (null = modo agregar)
let idEditando = null;

// URL de la API pública de prueba
const URL_API = 'http://localhost:3000/productos';;


// ------------------------------------------------
// 3. FUNCIONES DE LOCAL STORAGE
// ------------------------------------------------

// Guarda el arreglo en LocalStorage como texto JSON
function guardarEnStorage() {
  localStorage.setItem('productos', JSON.stringify(productos));
  console.log('[LocalStorage] Guardado:', productos);
}

// Lee el arreglo desde LocalStorage y lo convierte a objeto
function cargarDesdeStorage() {
  const datos = localStorage.getItem('productos');
  if (datos) {
    productos = JSON.parse(datos);
    console.log('[LocalStorage] Cargado:', productos);
  }
}


// ------------------------------------------------
// 4. MOSTRAR MENSAJES EN EL DOM
// ------------------------------------------------
function mostrarMensaje(texto, tipo) {
  // tipo puede ser: 'exito', 'error', 'aviso'
  mensajeEl.textContent = texto;
  mensajeEl.className   = tipo;

  // También lo mostramos en consola
  console.log('[Mensaje]', tipo.toUpperCase(), '-', texto);

  // Ocultar el mensaje después de 3 segundos
  setTimeout(() => {
    mensajeEl.className   = '';
    mensajeEl.style.display = 'none';
  }, 3000);
}


// ------------------------------------------------
// 5. VALIDAR FORMULARIO
// ------------------------------------------------
function validarFormulario(nombre, precio, descripcion) {
  if (nombre.trim() === '') {
    mostrarMensaje('⚠ El nombre no puede estar vacío.', 'aviso');
    return false;
  }

  if (precio === '' || isNaN(precio)) {
    mostrarMensaje('⚠ El precio debe ser un número.', 'aviso');
    return false;
  }

  if (Number(precio) < 0) {
    mostrarMensaje('✖ El precio no puede ser negativo.', 'error');
    return false;
  }

  if (descripcion.trim() === '') {
    mostrarMensaje('⚠ La descripción no puede estar vacía.', 'aviso');
    return false;
  }

  return true; // Todo está bien
}


// ------------------------------------------------
// 6. RENDERIZAR LISTA EN EL DOM
// ------------------------------------------------
function renderizarProductos() {
  // Limpiar la lista con removeChild
  while (listaProductos.firstChild) {
    listaProductos.removeChild(listaProductos.firstChild);
  }

  // Mostrar u ocultar el texto "No hay productos"
  if (productos.length === 0) {
    vacioPEl.style.display = 'block';
    contadorEl.textContent = '0';
    return;
  }

  vacioPEl.style.display = 'none';
  contadorEl.textContent = productos.length;

  // Crear un <li> por cada producto
  productos.forEach(function(producto) {
    const li = document.createElement('li');

    // Marcar los que vienen de la API con una clase diferente
    if (producto.fuente === 'api') {
      li.classList.add('api');
    }

    // Contenido del producto
    li.innerHTML = `
      <strong>${producto.nombre}</strong>
      <p class="precio">💲${Number(producto.precio).toFixed(2)} USD</p>
      <p>${producto.descripcion}</p>
      <p style="font-size:11px; color:#999;">${producto.fuente === 'api' ? '🔵 API' : '🟢 Local'}</p>
      <br/>
    `;

    // Botón Editar
    const btnEditar = document.createElement('button');
    btnEditar.textContent = '✏ Editar';
    btnEditar.className   = 'btn-editar';
    btnEditar.addEventListener('click', function() {
      cargarEnFormulario(producto.id);
    });

    // Botón Borrar
    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = '🗑 Borrar';
    btnBorrar.className   = 'btn-borrar';
    btnBorrar.addEventListener('click', function() {
      borrarProducto(producto.id);
    });

    li.appendChild(btnEditar);
    li.appendChild(btnBorrar);

    // Agregar el <li> a la lista con appendChild
    listaProductos.appendChild(li);
  });

  console.log('[DOM] Lista renderizada. Total:', productos.length);
}


// ------------------------------------------------
// 7. AGREGAR PRODUCTO (CREATE)
// ------------------------------------------------
function agregarProducto(nombre, precio, descripcion) {
  const nuevoProducto = {
    id:          Date.now(),         // ID único basado en el tiempo
    nombre:      nombre.trim(),
    precio:      Number(precio),
    descripcion: descripcion.trim(),
    fuente:      'local',
  };

  productos.push(nuevoProducto);    // Agregar al arreglo

  guardarEnStorage();               // Guardar en LocalStorage
  renderizarProductos();            // Actualizar el DOM

  console.log('[CRUD - CREATE] Producto creado:', nuevoProducto);
  mostrarMensaje('✔ Producto agregado correctamente.', 'exito');
}


// ------------------------------------------------
// 8. BORRAR PRODUCTO (DELETE)
// ------------------------------------------------
async function borrarProducto(id) {
  // Buscar el producto antes de borrarlo (para mostrar el nombre)
  const producto = productos.find(p => p.id === id);

  // Filtrar el arreglo: quedarse con todos menos el que tiene ese id
  productos = productos.filter(p => p.id !== id);

  guardarEnStorage();
  renderizarProductos();

  console.log('[CRUD - DELETE] Producto borrado. ID:', id);
  mostrarMensaje(`🗑 "${producto.nombre}" eliminado.`, 'exito');

  // Si el producto vino de la API, intentamos borrarlo también allá
  if (producto.apiId) {
    await borrarEnApi(producto.apiId);
  }
}


// ------------------------------------------------
// 9. CARGAR PRODUCTO EN FORMULARIO (para editar)
// ------------------------------------------------
function cargarEnFormulario(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  // Rellenar los campos
  inputNombre.value      = producto.nombre;
  inputPrecio.value      = producto.precio;
  inputDescripcion.value = producto.descripcion;

  // Cambiar a modo edición
  idEditando = id;
  btnAgregar.textContent = '💾 Guardar Cambios';

  console.log('[CRUD - EDIT] Editando:', producto);
  mostrarMensaje(`✏ Editando: "${producto.nombre}"`, 'aviso');
}


// ------------------------------------------------
// 10. ACTUALIZAR PRODUCTO (UPDATE)
// ------------------------------------------------
async function actualizarProducto(nombre, precio, descripcion) {
  // Encontrar la posición del producto en el arreglo
  const indice = productos.findIndex(p => p.id === idEditando);

  productos[indice] = {
    ...productos[indice],   // Mantener id, fuente, apiId
    nombre:      nombre.trim(),
    precio:      Number(precio),
    descripcion: descripcion.trim(),
  };

  guardarEnStorage();
  renderizarProductos();

  console.log('[CRUD - UPDATE] Producto actualizado:', productos[indice]);
  mostrarMensaje('✔ Producto actualizado.', 'exito');

  // Si tiene apiId, actualizar también en la API
  if (productos[indice].apiId) {
    await actualizarEnApi(productos[indice].apiId, productos[indice]);
  }

  // Salir del modo edición
  idEditando = null;
  btnAgregar.textContent = '➕ Agregar Producto';
  limpiarFormulario();
}


// ------------------------------------------------
// 11. LIMPIAR FORMULARIO
// ------------------------------------------------
function limpiarFormulario() {
  inputNombre.value      = '';
  inputPrecio.value      = '';
  inputDescripcion.value = '';
}


// ------------------------------------------------
// 12. FETCH API — GET (sincronizar productos)
// ------------------------------------------------
async function sincronizarApi() {
  mostrarMensaje('🔄 Cargando desde la API...', 'aviso');
  console.log('[API - GET] Petición a:', URL_API);

  try {
    // Pedir solo 5 productos
    const respuesta = await fetch(URL_API + '?_limit=5');

    if (!respuesta.ok) {
      throw new Error('Error del servidor: ' + respuesta.status);
    }

    const datos = await respuesta.json();
    console.log('[API - GET] Respuesta recibida:', datos);

    // Convertir los datos de la API a nuestro formato
    const productosApi = datos.map(function(item) {
      return {
        id:          Date.now() + item.id,  // ID único local
        apiId:       item.id,               // ID en la API
        nombre:      item.title.slice(0, 35),
        precio:      item.id * 99.99,
        descripcion: item.body.slice(0, 80),
        fuente:      'api',
      };
    });

    // Evitar duplicados: no agregar si el apiId ya existe
    const idsExistentes = productos
      .filter(p => p.apiId)
      .map(p => p.apiId);

    const nuevos = productosApi.filter(p => !idsExistentes.includes(p.apiId));

    if (nuevos.length === 0) {
      mostrarMensaje('ℹ No hay productos nuevos en la API.', 'aviso');
      return;
    }

    // Agregar al arreglo y guardar
    productos.push(...nuevos);
    guardarEnStorage();
    renderizarProductos();

    console.log('[API - GET] Sincronizados:', nuevos.length, nuevos);
    mostrarMensaje('✔ ' + nuevos.length + ' productos cargados desde la API.', 'exito');

  } catch (error) {
    console.error('[API - GET] Error:', error.message);
    mostrarMensaje('✖ No se pudo conectar: ' + error.message, 'error');
  }
}


// ------------------------------------------------
// 13. FETCH API — POST (crear en servidor)
// ------------------------------------------------
async function crearEnApi(producto) {
  console.log('[API - POST] Enviando:', producto);
  try {
    const respuesta = await fetch(URL_API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        title:  producto.nombre,
        body:   producto.descripcion,
        userId: 1,
      }),
    });

    const resultado = await respuesta.json();
    console.log('[API - POST] Respuesta del servidor:', resultado);

  } catch (error) {
    console.error('[API - POST] Error:', error.message);
  }
}


// ------------------------------------------------
// 14. FETCH API — PUT (actualizar en servidor)
// ------------------------------------------------
async function actualizarEnApi(apiId, producto) {
  console.log('[API - PUT] Actualizando ID:', apiId);
  try {
    const respuesta = await fetch(URL_API + '/' + apiId, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        id:     apiId,
        title:  producto.nombre,
        body:   producto.descripcion,
        userId: 1,
      }),
    });

    const resultado = await respuesta.json();
    console.log('[API - PUT] Respuesta del servidor:', resultado);

  } catch (error) {
    console.error('[API - PUT] Error:', error.message);
  }
}


// ------------------------------------------------
// 15. FETCH API — DELETE (borrar en servidor)
// ------------------------------------------------
async function borrarEnApi(apiId) {
  console.log('[API - DELETE] Borrando ID:', apiId);
  try {
    await fetch(URL_API + '/' + apiId, { method: 'DELETE' });
    console.log('[API - DELETE] Borrado del servidor. ID:', apiId);
  } catch (error) {
    console.error('[API - DELETE] Error:', error.message);
  }
}


// ------------------------------------------------
// 16. EVENTOS DE LOS BOTONES
// ------------------------------------------------

// Botón "Agregar Producto" / "Guardar Cambios"
btnAgregar.addEventListener('click', async function() {
  const nombre      = inputNombre.value;
  const precio      = inputPrecio.value;
  const descripcion = inputDescripcion.value;

  // Validar primero
  if (!validarFormulario(nombre, precio, descripcion)) return;

  if (idEditando) {
    // Modo edición
    await actualizarProducto(nombre, precio, descripcion);
  } else {
    // Modo creación
    agregarProducto(nombre, precio, descripcion);
    // También enviar a la API
    const ultimo = productos[productos.length - 1];
    await crearEnApi(ultimo);
  }

  limpiarFormulario();
});

// Botón "Sincronizar API"
btnSincronizar.addEventListener('click', function() {
  sincronizarApi();
});


// ------------------------------------------------
// 17. INICIAR LA APLICACIÓN
//     Se ejecuta al cargar la página.
// ------------------------------------------------
function iniciarApp() {
  console.log('=== Gestor de Productos iniciado ===');

  // Cargar datos guardados y mostrarlos
  cargarDesdeStorage();
  renderizarProductos();

  console.log('Productos en memoria:', productos.length);
  console.log('LocalStorage actual:', localStorage.getItem('productos'));
}

// Llamar a la función de inicio
iniciarApp();
