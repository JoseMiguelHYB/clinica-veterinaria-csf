document.addEventListener("DOMContentLoaded", () => {
  console.log("Clínica Veterinaria - Web cargada correctamente 🐾");

  // --- Formulario de contacto ---
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Gracias por contactarnos. Te responderemos pronto 🐶🐱");
      form.reset();
    });
  }

  // --- Centros / mapa / tiempos ---
  const mapa = document.getElementById("mapa-centro");
  const centros = document.querySelectorAll(".centro-info");

  // Elementos UI de tiempos
  const elWalk = document.getElementById("tiempo-walk");
  const elCar = document.getElementById("tiempo-car");
  const elTransit = document.getElementById("tiempo-transit");
  const elNote = document.getElementById("tiempos-note");

  // Velocidades medias (km/h) y buffers ajustados a valores tipo Google Maps
  const SPEED = { walk: 4.5, car: 30, transit: 14 };
  const BUFFER = { walk: 0, car: 7, transit: 8 };

  let userPos = null;

  // Util: Haversine (distancia en km)
  const toRad = (v) => (v * Math.PI) / 180;
  function distanceKm(a, b) {
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  // Estimar minutos
  function mins(distKm, speedKmh, extraMin) {
    if (!isFinite(distKm) || distKm < 0) return "–";
    const m = Math.round((distKm / speedKmh) * 60 + extraMin);
    return Math.max(m, 1);
  }

  function actualizarTiempos(dest) {
    if (!userPos) {
      elWalk.textContent = "–";
      elCar.textContent = "–";
      elTransit.textContent = "–";
      elNote.textContent = "activa la ubicación para calcular";
      return;
    }
    const d = distanceKm(userPos, dest);
    elWalk.textContent = mins(d, SPEED.walk, BUFFER.walk);
    elCar.textContent = mins(d, SPEED.car, BUFFER.car);
    elTransit.textContent = mins(d, SPEED.transit, BUFFER.transit);
    elNote.textContent = "aprox. desde tu ubicación";
  }

  // Geolocalización del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        // Si ya hay un centro activo, recalcular
        const activo = document.querySelector(".centro-info.active");
        if (activo) {
          const dest = {
            lat: parseFloat(activo.dataset.lat),
            lng: parseFloat(activo.dataset.lng),
          };
          actualizarTiempos(dest);
        }
      },
      () => {
        elNote.textContent = "no se pudo obtener tu ubicación";
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  } else {
    elNote.textContent = "tu navegador no soporta geolocalización";
  }

  // Click en centros
  centros.forEach((c) => {
    c.addEventListener("click", () => {
      // Cambiar mapa
      if (c.dataset.mapa) mapa.src = c.dataset.mapa;

      // Marcar activo
      centros.forEach((x) => x.classList.remove("active"));
      c.classList.add("active");

      // Calcular tiempos
      const dest = {
        lat: parseFloat(c.dataset.lat),
        lng: parseFloat(c.dataset.lng),
      };
      actualizarTiempos(dest);
    });
  });

  // Marcar primero como activo por defecto
  if (centros.length > 0) {
    centros[0].classList.add("active");
    const dest0 = {
      lat: parseFloat(centros[0].dataset.lat),
      lng: parseFloat(centros[0].dataset.lng),
    };
    actualizarTiempos(dest0);
  }
});



// -------------------------------Opiniones en movimiento ---------------------------------------
/// Opinione suaves
const grid = document.getElementById("opinionesGrid");

// 🔥 duplicamos las tarjetas para el scroll infinito
grid.innerHTML += grid.innerHTML;

let scrollAmount = 0;
let speed = 0.177; // ajusta velocidad (más alto = más rápido)

function animateScroll() {
  scrollAmount += speed;
  if (scrollAmount >= grid.scrollWidth / 2) {
    scrollAmount = 0; // reinicia al llegar a la mitad
  }
  grid.style.transform = `translateX(-${scrollAmount}px)`;
  requestAnimationFrame(animateScroll);
}

animateScroll();

// ------------------------------- MURAL ---------------------------------------

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeBtn = document.querySelector(".lightbox .close");

document.querySelectorAll(".mural-grid img").forEach(img => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.getAttribute("data-historia") || img.alt;
  });
});

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});


// --------------------------- Script del overly
 // ================================
// Script menú hamburguesa
// ================================
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

if (menuToggle && mobileMenu) {
  // Abrir/cerrar con hamburguesa
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("active");

    // Cambiar icono ☰ ↔ ✖
    menuToggle.textContent = mobileMenu.classList.contains("active") ? "✖" : "☰";
  });

  // Cerrar menú al hacer clic en un enlace
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuToggle.textContent = "☰"; 
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("active") &&
      !mobileMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      mobileMenu.classList.remove("active");
      menuToggle.textContent = "☰";
    }
  });
}



  // carrusel de portada
  const slides = document.querySelectorAll('.carousel-slide');
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  // Cambia cada 7 segundos
  setInterval(nextSlide, 7000);


  // --------------------------------------------MURAL CAMBIANDO DINAMICO----------
document.addEventListener("DOMContentLoaded", () => {
  const muralGrid = document.querySelector(".mural-grid");
  const fotos = muralGrid.querySelectorAll("img");

  // Pool de imágenes
  const poolImagenes = [
    "img/mascota1.PNG", "img/mascota2.PNG", "img/mascota3.PNG",
    "img/mascota4.PNG", "img/mascota5.PNG", "img/mascota6.PNG",
    "img/mascota7.PNG", "img/mascota8.PNG", "img/mascota9.PNG",
    "img/mascota10.PNG", "img/mascota11.PNG", "img/mascota12.PNG",
    "img/mascota13.PNG", "img/mascota14.PNG", "img/mascota15.PNG",
    "img/mascota16.PNG", "img/mascota17.PNG", "img/mascota18.PNG",
    "img/mascota19.PNG", "img/mascota20.PNG", "img/mascota21.PNG",
    "img/mascota22.PNG", "img/mascota23.PNG", "img/mascota24.PNG",
    "img/mascota25.PNG"
  ];

  // Guardar qué imágenes están actualmente visibles
  let usadas = Array.from(fotos).map(f => f.src);

  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * fotos.length);
    const foto = fotos[randomIndex];

    // Filtrar las disponibles (no usadas en este momento)
    const disponibles = poolImagenes.filter(img => !usadas.includes(location.origin + "/" + img));

    if (disponibles.length === 0) return; // todas están en uso

    const nuevaImg = disponibles[Math.floor(Math.random() * disponibles.length)];

    // Hacer fade-out
    foto.style.opacity = 0;

    // Cuando termine la transición del fade-out, cambiar la imagen y hacer fade-in
    foto.addEventListener("transitionend", function cambio() {
      foto.src = nuevaImg;
      foto.style.opacity = 1;

      // Eliminar el listener para que no se ejecute en cada transición
      foto.removeEventListener("transitionend", cambio);
    });
    
    // Actualizar historial de usadas
    usadas[randomIndex] = location.origin + "/" + nuevaImg;

  }, 4000);
});
