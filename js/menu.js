const productos = [
  // Camisas
  {
    categoria: 'camisa',
    nombre: 'Camisa Negra Mujer',
    precio: 52000,
    descripcion: 'Camisa elegante de color negro para ocasiones especiales.',
    imagen: 'img/camisa_negra_mujer.webp'
  },
  {
    categoria: 'camisa',
    nombre: 'Blusa Blanca Mujer',
    precio: 65000,
    descripcion: 'Blusa blanca ligera y elegante para cualquier ocasión.',
    imagen: 'img/blanca_mujer.webp'
  },

  {
    categoria: 'chaqueta',
    nombre: 'Chaqueta de Cuero',
    precio: 120000,
    descripcion: 'Chaqueta clásica de cuero con estilo moderno.',
    imagen: 'img/chaqueta_cuero.webp'
  },
  {
    categoria: 'chaqueta',
    nombre: 'Chaqueta a Cuadros',
    precio: 98000,
    descripcion: 'Chaqueta a cuadros perfecta para un look urbano.',
    imagen: 'img/chaqueta_cuadros.webp'
  },
  {
    categoria: 'chaqueta',
    nombre: 'Chaqueta Verde Hombre',
    precio: 102000,
    descripcion: 'Chaqueta verde moderna y cómoda para uso diario.',
    imagen: 'img/verde_hombre.webp'
  },
  {
    categoria: 'chaqueta',
    nombre: 'Chaqueta Naranja Hombre',
    precio: 99000,
    descripcion: 'Chaqueta naranja vibrante para un look llamativo.',
    imagen: 'img/naranja_hombre.webp'
  },
  {
    categoria: 'chaqueta',
    nombre: 'Chaqueta Naranja Mujer',
    precio: 98000,
    descripcion: 'Chaqueta naranja femenina para destacar tu estilo.',
    imagen: 'img/naranja_mujer.webp'
  },

  {
    categoria: 'jean',
    nombre: 'Jean Claro',
    precio: 78000,
    descripcion: 'Jean azul claro, ideal para looks frescos y casuales.',
    imagen: 'img/jean_claro.webp'
  },
  {
    categoria: 'jean',
    nombre: 'Jean Mujer',
    precio: 82000,
    descripcion: 'Jean diseñado para mujer con ajuste perfecto.',
    imagen: 'img/jean_mujer.webp'
  },
  {
    categoria: 'jean',
    nombre: 'Jean Skinny',
    precio: 86000,
    descripcion: 'Jean skinny ajustado con diseño moderno.',
    imagen: 'img/jean_skiny.webp'
  },

  {
    categoria: 'zapatos',
    nombre: 'Zapatos de Cuero',
    precio: 135000,
    descripcion: 'Zapatos elegantes de cuero para ocasiones formales.',
    imagen: 'img/zapatos_cuero.webp'
  },
  {
    categoria: 'zapatos',
    nombre: 'Zapatos Azul',
    precio: 110000,
    descripcion: 'Zapatos modernos en tono azul para un estilo único.',
    imagen: 'img/zapatos_azul.webp'
  },
  {
    categoria: 'zapatos',
    nombre: 'Zapatos Grises',
    precio: 108000,
    descripcion: 'Zapatos grises casuales y versátiles.',
    imagen: 'img/zapatos_gris.webp'
  },
  {
    categoria: 'zapatos',
    nombre: 'Tacones Rojos',
    precio: 115000,
    descripcion: 'Tacones rojos elegantes para ocasiones especiales.',
    imagen: 'img/tacones_rojos.webp'
  }
];


// =============================
// Productos
// =============================
let productosFiltrados = [...productos];

// Carrito: clave = índice del producto, valor = cantidad
let carrito = {};

// =============================
// Formateador a pesos colombianos
// =============================
const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0
});

// =============================
// Restaurar datos guardados
// =============================
const carritoGuardado = sessionStorage.getItem('carrito');
if (carritoGuardado) {
  carrito = JSON.parse(carritoGuardado);
}

const pedidoGuardado = sessionStorage.getItem('pedido');
if (pedidoGuardado) {
  const pedido = JSON.parse(pedidoGuardado);
  pedido.resumen.forEach(item => {
    const index = productos.findIndex(p => p.nombre === item.nombre);
    if (index !== -1) carrito[index] = item.cantidad;
  });
}

// =============================
// Renderizado del carrito
// =============================
function renderCarrito() {
  const contenedor = document.querySelector('.cart-items');
  contenedor.innerHTML = '';

  productosFiltrados.forEach((producto) => {
    const index = productos.indexOf(producto);
    const cantidad = carrito[index] || 0;

    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="info">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <div class="bottom">
          <span>${formatoCOP.format(producto.precio)}</span>
          <div class="qty">
            <button class="menos" data-id="${index}">−</button>
            <span id="cant_${index}">${cantidad}</span>
            <button class="mas" data-id="${index}">+</button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(item);
  });

  // Asignar eventos a los botones
  document.querySelectorAll('.mas').forEach(btn => {
    btn.addEventListener('click', () => cambiarCantidad(parseInt(btn.dataset.id), 1));
  });

  document.querySelectorAll('.menos').forEach(btn => {
    btn.addEventListener('click', () => cambiarCantidad(parseInt(btn.dataset.id), -1));
  });

  actualizarTotal();
}

// =============================
// Cambiar cantidad
// =============================
function cambiarCantidad(index, delta) {
  carrito[index] = Math.max(0, (carrito[index] || 0) + delta);
  document.getElementById(`cant_${index}`).textContent = carrito[index];
  actualizarTotal();
}

// =============================
// Calcular y actualizar total
// =============================
function actualizarTotal() {
  let total = 0;
  for (const i in carrito) {
    const index = parseInt(i, 10); // 👈 convertir clave a número
    if (productos[index]) {
      total += productos[index].precio * carrito[i];
    }
  }

  const totalTexto = document.getElementById('total-price');
  if (totalTexto) {
    totalTexto.textContent = formatoCOP.format(total);
  }

  // Guardar carrito en sessionStorage
  sessionStorage.setItem('carrito', JSON.stringify(carrito));
}

// =============================
// Filtro de categorías
// =============================
function filtrarBotonCategoria(boton, categoria) {
  document.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('active'));
  boton.classList.add('active');
  localStorage.setItem('categoriaSeleccionada', categoria);
  filtrarCategoria(categoria);
}

function filtrarCategoria(categoria) {
  productosFiltrados = productos.filter(producto => producto.categoria === categoria);
  renderCarrito();
}

// =============================
// Evento de Realizar Pedido
// =============================
document.querySelector('.pay').addEventListener('click', () => {
  const resumen = [];
  let total = 0;

  for (const i in carrito) {
    const index = parseInt(i, 10);
    const producto = productos[index];
    const cantidad = carrito[i];
    if (producto && cantidad > 0) {
      const subtotal = producto.precio * cantidad;

      resumen.push({
        nombre: producto.nombre,
        cantidad,
        subtotal
      });

      total += subtotal;
    }
  }

  const pedido = { resumen, total };

  // Guardar en localStorage y sessionStorage
  localStorage.setItem('pedido', JSON.stringify(pedido));
  sessionStorage.setItem('pedido', JSON.stringify(pedido));

  // No limpiamos el carrito para que siga al volver atrás
  window.location.href = 'customer.html';
});

// =============================
// Inicialización al cargar
// =============================
const categoriaGuardada = localStorage.getItem('categoriaSeleccionada');

if (categoriaGuardada) {
  const boton = [...document.querySelectorAll('.categoria-btn')]
    .find(btn => btn.getAttribute('onclick').includes(categoriaGuardada));

  if (boton) {
    boton.classList.add('active');
    filtrarCategoria(categoriaGuardada);
  } else {
    productosFiltrados = [...productos];
    renderCarrito();
  }
} else {
  productosFiltrados = [...productos];
  renderCarrito();
}
