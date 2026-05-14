// ============================================================ //
// TASK 1 — Creación del objeto de productos (menú) + TASK 2 -validacion 
// ============================================================ //
// Inventario
let idCounter = 6;
let keyProduct = "p" + idCounter;
let products = {
  p1 : {id: 1, productName: "laptop", price: 1000000, categoria: "Electronica"},
  p2 : {id: 2, productName: "pan", price: 60000, categoria: "panaderia"},
  p3 : {id: 3, productName: "olla", price: 400000, categoria: "hogar"},
  p4 : { id: 4, productName: "jabon", price: 5000, categoria: "elementos de limpieza" },
  p5 : { id: 5, productName: "arroz", price: 3000, categoria: "alimento" }
};


// Funcion para mostrar el objeto
function iterationProducts(){
  let lastProduct; 
  console.log("Inventario (objeto)".toUpperCase())
  for(const key in products){
    lastProduct = products[key];
    console.log(`key : ${key}\nid: ${lastProduct.id}\nproduct Name: ${lastProduct.productName}\nprice: $ ${lastProduct.price.toLocaleString("es-CO")}\ncategoria: ${lastProduct.categoria}`);
  }
  return lastProduct; // Devuelve únicamente el último producto procesado
}

function enterName(){
  let productName;
  let keep2 = true;
  while (keep2) {
    productName = prompt("Please, enter the product name.");
    if (!productName || productName.trim() === "") {
      alert("Error: This field cannot be empty.");
    } else {
      break;
    }
  }
  return productName;
}

function enterPrice(){
  let price;
  let keep = true;
  while (keep) {
    let input = prompt("Enter the price:");
    if (input === null || input.trim() === "") {
      alert("Error: Please enter a price.");
    } else if (isNaN(input)) {
      alert("Error: Enter a valid number.");
    } else if (Number(input) <= 0) {
      alert("Error: Please enter a price greater than 0.");
    } else {
      price = Number(input);
      break;
    }
  }
  return price;
}

function createProduct() {
  let mantenerloop = true;
  while (mantenerloop) {
    let productName = enterName();
    let price = enterPrice();
    let keyProduct = "p" + idCounter;
    
    products[keyProduct] = {
      id : idCounter,
      productName: productName,
      price: price,
      categoria: "Sin categoria" 
    };
    alert(`ID: ${idCounter}\nProducto: ${productName}\nPrecio: $${price.toLocaleString("es-CO")}\n`);
    idCounter++;
    mantenerloop = confirm("Do you want to add another product?");
  }
  console.log("Inventory:", products);
}

// ============================================================ //
// TASK 2 — Uso de Set en JavaScript
// ============================================================ //
function showcategories(){
  console.log("creacion de nuevo set\n".toUpperCase());
  let categories = new Set(["tecnologia","tecnologia","alimentos","panaderia","panaderia", "elementos de limpieza"]);
  console.log(categories);

  categories.add("lacteos");
  categories.add("instrumentos de cocina");
  console.log(`categorias actualizada: `.toUpperCase(), categories);

  let exist = categories.has("alimentos");
  console.log(`exist alimentos en categories? ${exist}\n`.toUpperCase());

  exist = categories.has("papeleria");
  console.log(`existe papeleria en categories? ${exist}`.toUpperCase());

  categories.delete("tecnologia");
  console.log(categories);

  console.log("usando for of voy a imprimir el set de categories".toUpperCase());
   
  // Un Set almacena elementos únicos y no tiene pares clave-valor.
  // antes se distorsionava 'for(const [key,value] of categories)' provocaba lecturas erróneas de caracteres individuales.
  // Se corrigió para iterar directamente sobre cada categoría de forma limpia y que no imprima solo las letras.
  for(const categoria of categories){
    console.log(`Categoría existente: ${categoria}`);
  }
}

// ============================================================ //
// TASK 3 — Creación de un Map
// ============================================================ //
function ShowMap(){
  console.log("creo el map vacio".toUpperCase());
  const myMap = new Map();
  console.log(myMap);

  // antes añadía un solo elemento externo que representaba únicamente al último producto ("arroz").
  // use el bucle 'for...in' dinámico para recorrer todo el objeto 'products' actual y poblar el mapa.
  console.log("Poblando el Map recorriendo dinámicamente todo el inventario...".toUpperCase());
  for (const key in products) {
    const p = products[key];
    myMap.set(p.categoria, p.productName); 
  }

  console.log("--- Contenido del Map(foreach) ---\n".toUpperCase());
  console.log("cabe aclarar que los productos solo se imprimira 1 producto por categoria, si hay 3 de la misma categoria en pantalla solo se vera uno de los 1");

  // En la API nativa de JavaScript para Map.prototype.forEach(), el primer argumento inyectado 
  // es siempre el VALOR y el segundo argumento es la CLAVE (value, key). 
  // Se invirtieron las variables del callback para que muestren la información correcta sin trocarse.
  myMap.forEach((producto, categoria) => {
    console.log(`Categoría: ${categoria} | Producto: ${producto}\n`);
  });

  console.log("aqui muestra el tamaño del el map (size): ".toUpperCase(), myMap.size);
}

// ============================================================ //
// TASK 5: Validación de Datos -
// ============================================================ //
function validation(){
  console.log("\n--- TASK 5: Validación de Datos ---".toUpperCase());
  Object.values(products).forEach((p, index) => {
    if (p.id && p.productName && typeof p.price === 'number') {
      console.log(`Producto ${index + 1}: Válido ✅`);
    } else {
      console.log(`Producto ${index + 1}: Error en datos ❌`);
    }
  });

  Object.entries(products).forEach(([key, value]) => {
    console.log(`Clave: ${key} | Nombre: ${value.productName} | Precio: $ ${value.price.toLocaleString("es-CO")}`);
  });
}

function init(){
  iterationProducts();
  createProduct();
  showcategories();
  ShowMap();
  validation();
  iterationProducts();
}

const btn = document.getElementById("btn");
btn.addEventListener('click',() => {
  init();
});
