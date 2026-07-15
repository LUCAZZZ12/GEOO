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
});