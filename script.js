document.addEventListener("DOMContentLoaded", function () {
    // Inicializar ícones
    lucide.createIcons();

    // Intersection Observer para animações fade-in
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Lógica do Slider de Depoimentos (Phone Frame)
    const track = document.getElementById('slider-track');
    const cards = document.querySelectorAll('.slider-card');
    const dotsContainer = document.getElementById('slider-dots');

    if (track && cards.length > 0 && dotsContainer) {
        let currentIndex = 0;

        // Criar os dots dinamicamente
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(index) {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        }

        // Auto-scroll a cada 5 segundos
        let slideInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % cards.length;
            goToSlide(nextIndex);
        }, 5000);

        // Suporte a swipe no mobile celular
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            track.style.transition = 'none';
            clearInterval(slideInterval); // pausa auto-scroll
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            // Para não permitir rolar para o "vazio"
            if ((currentIndex === 0 && diffX > 0) || (currentIndex === cards.length - 1 && diffX < 0)) {
                currentTranslate = prevTranslate + (diffX * 0.2); // resistência
            } else {
                currentTranslate = prevTranslate + diffX;
            }
            track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${currentTranslate - prevTranslate}px))`;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            isDragging = false;
            track.style.transition = 'transform 0.4s ease-in-out';
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -50 && currentIndex < cards.length - 1) {
                currentIndex += 1;
            }
            if (movedBy > 50 && currentIndex > 0) {
                currentIndex -= 1;
            }

            goToSlide(currentIndex);
            prevTranslate = currentTranslate;

            // Retoma auto-scroll
            slideInterval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % cards.length;
                goToSlide(nextIndex);
            }, 5000);
        });
    }
});
