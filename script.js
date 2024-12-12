document.addEventListener('DOMContentLoaded', () => {
    createStarField();
    initCursor();
    initScrollAnimations();
    initTypewriter();
    initNavigation();
});

function createStarField() {
    const starfield = document.createElement('div');
    starfield.className = 'starfield';
    document.body.appendChild(starfield);

    const numStars = 800;
    const stars = [];

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star initial-zoom';
        
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1000;
        
        const x = 50 + radius * Math.cos(theta) * Math.sin(phi);
        const y = 50 + radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.dataset.z = z;
        star.dataset.originalZ = z;
        
        const initialOpacity = 0.3 + Math.random() * 0.7;
        star.style.setProperty('--initial-opacity', initialOpacity);
        
        starfield.appendChild(star);
        stars.push({
            element: star,
            baseOpacity: initialOpacity,
            twinkleSpeed: 0.01 + Math.random() * 0.02,
            twinkleTime: Math.random() * Math.PI * 2,
            twinkleRange: 0.4 + Math.random() * 0.6
        });
    }

    // Initial animation sequence
    setTimeout(() => {
        stars.forEach(star => {
            star.element.classList.remove('initial-zoom');
            star.element.style.transform = `translateZ(${star.element.dataset.z}px)`;
        });
        
        requestAnimationFrame(function animate() {
            stars.forEach(star => {
                if (!star.element.classList.contains('scroll-zoom')) {
                    star.twinkleTime += star.twinkleSpeed;
                    const opacity = star.baseOpacity + Math.sin(star.twinkleTime) * star.twinkleRange;
                    star.element.style.opacity = Math.max(0.1, Math.min(1, opacity));
                }
            });
            requestAnimationFrame(animate);
        });
    }, 3000);

    // Scroll handling
    let lastScrollY = window.pageYOffset;
    let scrollDirection = 1;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Update scroll direction only on significant scroll
        if (Math.abs(scrollDelta) > 1) {
            scrollDirection = Math.sign(scrollDelta);
        }
        
        stars.forEach(star => {
            const currentZ = parseFloat(star.element.dataset.z);
            const zoomFactor = 0.5;
            let newZ = currentZ + (scrollDelta * zoomFactor);
            
            // Reset position while maintaining direction
            if (scrollDirection > 0 && newZ > 2000) {
                newZ = -1000;
            } else if (scrollDirection < 0 && newZ < -1000) {
                newZ = 2000;
            }
            
            star.element.dataset.z = newZ;
            star.element.style.transform = `translateZ(${newZ}px)`;
        });

        lastScrollY = currentScrollY;
    });
}

// Update only the cursor-related JavaScript
function initCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const rocket = document.createElement('div');
    rocket.className = 'cursor-rocket';
    cursor.appendChild(rocket);
    document.body.appendChild(cursor);

    let trails = [];
    const maxTrails = 5;
    let lastX = 0;
    let lastY = 0;
    let currentAngle = 0;
    let targetAngle = 0;

    function updateCursor(e) {
        // Smooth position
        const x = e.clientX;
        const y = e.clientY;
        
        // Calculate angle
        const dx = x - lastX;
        const dy = y - lastY;
        
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            targetAngle = Math.atan2(dy, dx) + Math.PI / 4;
        }
        
        // Smooth rotation
        const angleDiff = targetAngle - currentAngle;
        currentAngle += angleDiff * 0.15;

        // Update cursor
        cursor.style.left = `${x - cursor.offsetWidth / 2}px`;
        cursor.style.top = `${y - cursor.offsetHeight / 2}px`;
        cursor.style.transform = `rotate(${currentAngle}rad)`;

        // Create trail with interpolated positions
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            createTrail(x, y, currentAngle);
        }

        lastX = x;
        lastY = y;
    }

    function createTrail(x, y, angle) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        
        trail.style.left = `${x - 6}px`;
        trail.style.top = `${y - 6}px`;
        trail.style.transform = `rotate(${angle}rad)`;
        
        document.body.appendChild(trail);
        trails.push(trail);

        if (trails.length > maxTrails) {
            const oldTrail = trails.shift();
            oldTrail.style.opacity = '0';
            setTimeout(() => oldTrail.remove(), 300);
        }

        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 300);
            trails = trails.filter(t => t !== trail);
        }, 200);
    }

    // Use RAF for smoother animation
    let rafId;
    let mouseX = 0;
    let mouseY = 0;

    function updateMousePosition(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafId) {
            rafId = requestAnimationFrame(updateFrame);
        }
    }

    function updateFrame() {
        updateCursor({ clientX: mouseX, clientY: mouseY });
        rafId = null;
    }

    document.addEventListener('mousemove', updateMousePosition);
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-title, .grid-item, .hero-content').forEach(el => {
        observer.observe(el);
    });
}

function initTypewriter() {
    const phrases = [
        "AI Enthusiast  ",
        "Creative Thinker  ",
        "Problem Solver  "
    ];
    let phraseIndex = 0;
    let letterIndex = 0;
    let currentPhrase = "";
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');

    function typeWriter() {
        const phrase = phrases[phraseIndex];
        
        if (isDeleting) {
            currentPhrase = phrase.substring(0, letterIndex - 1);
            letterIndex--;
        } else {
            currentPhrase = phrase.substring(0, letterIndex + 1);
            letterIndex++;
        }

        if (typewriterElement) {
            typewriterElement.textContent = currentPhrase;
        }

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && letterIndex === phrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    typeWriter();
}

function initNavigation() {
    let lastScrollPosition = window.pageYOffset;
    const nav = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset;
        
        if (currentScrollPosition > lastScrollPosition) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollPosition = currentScrollPosition;
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function throttle(func, limit) {
    let inThrottle;
    return function(e) {
        if (!inThrottle) {
            func(e);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    const starfield = document.querySelector('.starfield');
    if (starfield) {
        starfield.remove();
    }
    createStarField();
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const starfield = document.querySelector('.starfield');
        if (starfield) {
            starfield.remove();
        }
        createStarField();
    }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        const starfield = document.querySelector('.starfield');
        if (starfield) {
            starfield.remove();
        }
        createStarField();
    }, 200);
});
