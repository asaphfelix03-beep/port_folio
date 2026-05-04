// Script complet pour assurer le fonctionnement du portfolio
document.addEventListener('DOMContentLoaded', function () {
    // Assurer que tout le contenu est visible
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';

    // Skill Radar Logic
    const radarCanvas = document.getElementById('skill-radar');
    if (radarCanvas) {
        const rctx = radarCanvas.getContext('2d');
        let size = 400;

        function resizeRadar() {
            const container = radarCanvas.parentElement;
            const availableWidth = container ? container.clientWidth : radarCanvas.clientWidth;
            size = Math.max(260, Math.min(420, availableWidth || 400));
            const pixelRatio = window.devicePixelRatio || 1;

            radarCanvas.width = Math.floor(size * pixelRatio);
            radarCanvas.height = Math.floor(size * pixelRatio);
            radarCanvas.style.width = size + 'px';
            radarCanvas.style.height = size + 'px';
            rctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            drawRadar();
        }

        const skills = [
            { name: 'Cyber', value: 0.9 },
            { name: 'IA', value: 0.85 },
            { name: 'Dev', value: 0.8 },
            { name: 'Réseaux', value: 0.75 },
            { name: 'Data', value: 0.7 }
        ];

        function drawRadar() {
            const centerX = size / 2;
            const centerY = size / 2;
            const radius = size * 0.4;
            const angleStep = (Math.PI * 2) / skills.length;

            rctx.clearRect(0, 0, size, size);

            // Draw Background Circles
            for (let i = 1; i <= 5; i++) {
                rctx.beginPath();
                rctx.arc(centerX, centerY, radius * (i / 5), 0, Math.PI * 2);
                rctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
                rctx.stroke();
            }

            // Draw Axis
            rctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
            skills.forEach((s, i) => {
                const angle = i * angleStep - Math.PI / 2;
                rctx.beginPath();
                rctx.moveTo(centerX, centerY);
                rctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
                rctx.stroke();

                // Labels
                rctx.fillStyle = 'var(--text-secondary)';
                rctx.font = '12px Courier New';
                const labelX = centerX + Math.cos(angle) * (radius + 25);
                const labelY = centerY + Math.sin(angle) * (radius + 25);
                rctx.textAlign = 'center';
                rctx.fillText(s.name, labelX, labelY);
            });

            // Draw Area
            rctx.beginPath();
            skills.forEach((s, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const dist = radius * s.value;
                const x = centerX + Math.cos(angle) * dist;
                const y = centerY + Math.sin(angle) * dist;
                if (i === 0) rctx.moveTo(x, y);
                else rctx.lineTo(x, y);
            });
            rctx.closePath();
            rctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
            rctx.fill();
            rctx.strokeStyle = 'var(--accent-primary)';
            rctx.lineWidth = 2;
            rctx.stroke();
        }

        window.addEventListener('resize', resizeRadar);
        resizeRadar();
    }

    // Scroll Progress Logic
    window.addEventListener("scroll", () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector(".scroll-progress").style.width = scrolled + "%";
    });

    // Particle Background Logic
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = 'rgba(0, 229, 255, ' + (Math.random() * 0.5 + 0.2) + ')';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw lines between particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = 'rgba(0, 229, 255, ' + (1 - dist / 100) * 0.2 + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        init();
        animate();
    }

    // Animated counters in the hero
    const metricNumbers = document.querySelectorAll('[data-count]');
    if (metricNumbers.length) {
        const runCounter = (number) => {
            const target = Number(number.dataset.count || 0);
            let current = 0;
            const steps = Math.max(target, 1) * 16;
            const increment = target / steps;

            const tick = () => {
                current += increment;
                if (current >= target) {
                    number.textContent = target;
                    return;
                }
                number.textContent = Math.ceil(current);
                requestAnimationFrame(tick);
            };

            tick();
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });

        metricNumbers.forEach(number => counterObserver.observe(number));
    }

    // Soft spotlight for the lab panel
    const labPanel = document.querySelector('.lab-panel');
    if (labPanel) {
        labPanel.addEventListener('mousemove', (event) => {
            const rect = labPanel.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            labPanel.style.setProperty('--spot-x', `${x}%`);
            labPanel.style.setProperty('--spot-y', `${y}%`);
        });
    }

    // Matrix Rain Logic
    const matrixCanvas = document.getElementById('matrix-canvas');
    if (matrixCanvas) {
        const mctx = matrixCanvas.getContext('2d');
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%";
        const fontSize = 16;
        let columns = 0;
        let drops = [];

        function resizeMatrix() {
            matrixCanvas.width = matrixCanvas.parentElement.offsetWidth;
            matrixCanvas.height = matrixCanvas.parentElement.offsetHeight;
            columns = Math.ceil(matrixCanvas.width / fontSize);
            drops = Array.from({ length: columns }, () => 1);
        }

        window.addEventListener('resize', resizeMatrix);
        resizeMatrix();

        function drawMatrix() {
            mctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            mctx.fillStyle = "#a855f7"; // Theme purple
            mctx.font = fontSize + "px Courier New";

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                mctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(drawMatrix, 33);
    }

    // Professional hover elevation
    const tiltElements = document.querySelectorAll('.project-card, .glass-card, .metric-card, .lab-panel');
    tiltElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transform = 'translateY(-8px)';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translateY(0)';
        });
    });

    // Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.cta-button');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // Interactive project filters
    const filterButtons = document.querySelectorAll('.project-filters button');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Rendre toutes les sections visibles
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });

    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                window.scrollTo({
                    top: Math.max(target.offsetTop - navHeight, 0),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Typing effect for the hero subtitle
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const phrases = [
            "Étudiant en Cybersécurité",
            "Passionné d'Intelligence Artificielle",
            "Futur Expert en Sécurité Numérique",
            "Développeur de Solutions Sécurisées"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at the end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // GSAP Animations améliorées
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animation des cartes de projets
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Animation des cartes de compétences
        gsap.utils.toArray('.glass-card').forEach((card, i) => {
            gsap.from(card, {
                scale: 0.9,
                opacity: 0,
                duration: 1,
                delay: i * 0.15,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        gsap.utils.toArray('.about-image, .lab-panel, .skills-visuals').forEach((item, i) => {
            gsap.from(item, {
                y: 36,
                opacity: 0,
                duration: 0.9,
                delay: i * 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 84%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    // Animation de chargement initiale
    setTimeout(() => {
        document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // Gestion du formulaire de contact avec Web3Forms
    const form = document.getElementById('form');
    const result = document.getElementById('result');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            result.innerHTML = "Veuillez patienter..."

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        result.innerHTML = "Formulaire soumis avec succès";
                    } else {
                        console.log(response);
                        result.innerHTML = json.message;
                    }
                })
                .catch(error => {
                    console.log(error);
                    result.innerHTML = "Une erreur s'est produite!";
                })
                .then(function () {
                    form.reset();
                    setTimeout(() => {
                        result.style.display = "none";
                    }, 3000);
                });
        });
    }
});

// Fonction pour valider l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonction pour afficher les messages de statut du formulaire
function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;

    // Faire défiler jusqu'au message
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Masquer le message après 5 secondes si c'est un succès
    if (type === 'success') {
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
}

// Fonction pour gérer le chargement des images
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});
