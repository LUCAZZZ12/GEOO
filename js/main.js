document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scroll Suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // 2. Animación de revelado
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 3. Estado de la navbar al hacer scroll (fondo mate más sólido + sombra)
    const navbar = document.getElementById('navbar');

    function updateNavbarState() {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // 4. Efectos dinámicos al bajar (Scroll) — parallax del hero
    const heroSection = document.querySelector('.hero');
    const heroBg = document.getElementById('hero-bg');
    const heroContent = document.getElementById('hero-content');
    let ticking = false;

    function updateHeroParallax() {
        updateNavbarState();

        if (!heroSection) {
            ticking = false;
            return;
        }

        const scrollY = window.scrollY;

        if (scrollY <= window.innerHeight) {

            // A. Desvanecimiento del texto (empieza después de 50px de bajada)
            let opacity = 1;
            if (scrollY > 50) {
                opacity = 1 - ((scrollY - 50) / 400);
            }
            heroContent.style.opacity = Math.max(0, opacity);

            // El desplazamiento (parallax) se omite si el usuario prefiere menos movimiento,
            // pero el desvanecimiento y la niebla de abajo siguen activos siempre.
            if (!prefersReducedMotion) {
                const translateY = scrollY * 0.4;
                heroContent.style.transform = `translateY(${translateY}px)`;

                // B. Movimiento sutil de la imagen
                const bgTranslateY = scrollY * 0.2;
                heroBg.style.transform = `translateY(${bgTranslateY}px)`;
            }

            // C. NIEBLA DINÁMICA
            // Empieza en 100% (sin niebla). A medida que bajas, disminuye hasta el 40% (niebla alta).
            let fadePoint = 100 - (scrollY / 6);
            fadePoint = Math.max(40, fadePoint); // Evita que cubra toda la imagen por completo
            heroSection.style.setProperty('--fade-point', `${fadePoint}%`);
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeroParallax);
            ticking = true;
        }
    });

    updateHeroParallax();

    // 5. Año dinámico en el footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 6. Tarjetas "¿Por qué elegirnos?" — expandir/contraer al tocar
    // (en escritorio el hover ya revela el detalle solo con CSS)
    document.querySelectorAll('.why-card').forEach(card => {
        card.addEventListener('click', () => {
            const isOpen = card.classList.toggle('is-open');
            card.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });

    // 7. Mapa de cobertura — provincia de Leoncio Prado (Huánuco, Perú)
    const mapEl = document.getElementById('coverage-map');
    const touchHint = document.getElementById('mapTouchHint');
    // pointer:coarse identifica dedos/pantallas táctiles (no mouse/trackpad),
    // que es donde el arrastre del mapa choca con el scroll de la página.
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (mapEl && typeof L !== 'undefined') {
        const leoncioPradoGeoJSON = {"type":"Feature","properties":{"nombre":"Leoncio Prado","departamento":"Huánuco"},"geometry":{"type":"Polygon","coordinates":[[[-75.6216,-9.3967],[-75.6336,-9.4502],[-75.6687,-9.5096],[-75.6776,-9.5601],[-75.7139,-9.6125],[-75.7213,-9.6175],[-75.7384,-9.6082],[-75.7907,-9.466],[-75.7857,-9.4051],[-75.8112,-9.3913],[-75.8531,-9.4264],[-75.8924,-9.4332],[-75.9421,-9.4879],[-76.0114,-9.508],[-76.0717,-9.4718],[-76.1599,-9.4694],[-76.2034,-9.4992],[-76.204,-9.4467],[-76.2353,-9.4182],[-76.2277,-9.38],[-76.141,-9.3033],[-76.0832,-9.3045],[-76.0568,-9.2817],[-76.0987,-9.2117],[-76.214,-9.2044],[-76.2442,-9.147],[-76.2721,-9.214],[-76.3105,-9.1769],[-76.3584,-9.1972],[-76.4131,-9.1774],[-76.4802,-9.1721],[-76.4734,-9.0122],[-76.4192,-8.9864],[-76.3655,-9.0263],[-76.2405,-8.9711],[-76.2212,-8.9257],[-76.2266,-8.8638],[-76.2054,-8.8339],[-76.2236,-8.7914],[-76.1664,-8.7564],[-76.1313,-8.6568],[-76.1159,-8.6576],[-76.1304,-8.4672],[-76.1092,-8.3796],[-76.0872,-8.3369],[-75.985,-8.3222],[-75.946,-8.4009],[-75.9649,-8.4517],[-75.9663,-8.592],[-75.9798,-8.636],[-75.9458,-8.7161],[-75.9216,-8.7808],[-75.9173,-8.8792],[-75.8744,-8.9703],[-75.8759,-9.0215],[-75.8444,-9.0515],[-75.8065,-9.1215],[-75.7941,-9.1884],[-75.7318,-9.2723],[-75.6708,-9.3966],[-75.6216,-9.3967]]]}};

        const coverageMap = L.map(mapEl, {
            scrollWheelZoom: false,
            dragging: !isCoarsePointer,
            touchZoom: !isCoarsePointer,
            tap: true,
            attributionControl: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 18
        }).addTo(coverageMap);

        const provinceLayer = L.geoJSON(leoncioPradoGeoJSON, {
            style: {
                color: '#6FA42A',
                weight: 2.5,
                fillColor: '#6FA42A',
                fillOpacity: 0.22
            }
        }).addTo(coverageMap);

        coverageMap.fitBounds(provinceLayer.getBounds(), { padding: [24, 24] });

        // El contenedor puede cambiar de tamaño después de este primer ajuste
        // (fuentes cargando, cambio de layout en el breakpoint móvil, giro de
        // pantalla), y Leaflet no se entera solo. Sin esto, el mapa se queda
        // con las medidas viejas y la provincia se ve recortada a los costados.
        const refitMap = () => {
            coverageMap.invalidateSize();
            coverageMap.fitBounds(provinceLayer.getBounds(), { padding: [24, 24] });
        };
        window.addEventListener('load', refitMap);
        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(refitMap).observe(mapEl);
        }

        const pinIcon = L.divIcon({
            className: 'coverage-pin',
            html: '<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="#6FA42A"/><circle cx="15" cy="15" r="6" fill="#0A1B3F"/></svg>',
            iconSize: [30, 40],
            iconAnchor: [15, 38],
            popupAnchor: [0, -34]
        });

        // Tingo María, capital de la provincia.
        // El popup ya no se abre solo: al abrirse de entrada tapaba parte de
        // la provincia resaltada. Sigue disponible tocando/haciendo click en el pin.
        L.marker([-9.2939, -75.9997], { icon: pinIcon })
            .addTo(coverageMap)
            .bindPopup(
                '<div class="map-popup"><span class="map-popup-label">PROVINCIA</span><h4>Leoncio Prado</h4><p>Huánuco, Perú</p></div>',
                { closeButton: true, className: 'ingeotop-popup' }
            );

        if (isCoarsePointer && touchHint) {
            // En táctil: el mapa arranca "bloqueado" (ver dragging/touchZoom arriba)
            // y un primer toque en el aviso lo activa, para no robarle el scroll
            // de la página a alguien que solo estaba pasando el dedo por encima.
            touchHint.style.display = 'flex';
            const activateMap = () => {
                coverageMap.dragging.enable();
                coverageMap.touchZoom.enable();
                touchHint.style.display = 'none';
                touchHint.removeEventListener('touchend', activateMap);
                touchHint.removeEventListener('click', activateMap);
            };
            touchHint.addEventListener('touchend', activateMap);
            touchHint.addEventListener('click', activateMap);
        } else {
            // En mouse/trackpad: el zoom con la rueda se activa solo mientras
            // el cursor está sobre el mapa, para no atrapar el scroll de la página.
            coverageMap.on('click', () => coverageMap.scrollWheelZoom.enable());
            mapEl.addEventListener('mouseleave', () => coverageMap.scrollWheelZoom.disable());
        }
    }
});
