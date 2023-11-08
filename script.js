document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('container');
    const particles = [];

    function createParticle(left, top, width, height) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = width + 'px';
        particle.style.height = height + 'px';
        particle.style.top = top + 'px';
        particle.style.left = left + 'px';
        container.appendChild(particle);
        return particle;
    }

    for (let i = 0; i < 30; i++) {
        const width = Math.random() * 300 + 60; // Random size between 60 and 360
        const left = Math.random() * (container.clientWidth - width);
        const top = Math.random() * (container.clientHeight - width);
        const particle = createParticle(left, top, width, width);
        particles.push({
            element: particle,
            size: width,
            x: left,
            y: top,
            dx: (Math.random() - 0.5) * 2, // Random horizontal velocity
            dy: (Math.random() - 0.5) * 2, // Random vertical velocity
        });
    }

    function animate() {
        for (const particle of particles) {
            particle.x += particle.dx;
            particle.y += particle.dy;

            // Keep particles within the container
            if (particle.x < 0 || particle.x + particle.size > container.clientWidth) {
                particle.dx *= -1;
            }
            if (particle.y < 0 || particle.y + particle.size > container.clientHeight) {
                particle.dy *= -1;
            }


            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        }

        requestAnimationFrame(animate);
    }

    animate();
});


