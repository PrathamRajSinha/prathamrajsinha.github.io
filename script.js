window.addEventListener('scroll', function() {
    var parallaxSections = document.querySelectorAll('.parallax-section');
    var scrollPosition = window.pageYOffset;

    parallaxSections.forEach(function(section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        var images = section.querySelectorAll('img');

        if (scrollPosition > sectionTop - window.innerHeight && scrollPosition < sectionTop + sectionHeight) {
            images.forEach(function(img) {
                var speed = img.getAttribute('data-speed');
                var yPos = (scrollPosition - sectionTop) * speed;
                img.style.transform = 'translateY(' + yPos + 'px)';
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
const firefliesContainer = document.getElementById('fireflies-container');
const androidFairy = document.getElementById('android-fairy');
const numFireflies = 50;
const fireflies = [];
let isFairyformed = false;
let isGathering = false;
let gatherX = 10, gatherY = 10;
let fairyX = 10, fairyY = 10;

// Create custom cursor
const customCursor = document.createElement('div');
customCursor.classList.add('custom-cursor');
document.body.appendChild(customCursor);

function createFirefly() {
const firefly = document.createElement('div');
firefly.classList.add('firefly');
const size = Math.random() * 4 + 2;
firefly.style.width = `${size}px`;
firefly.style.height = `${size}px`;
firefly.style.left = `${Math.random() * 100}%`;
firefly.style.top = `${Math.random() * 100}%`;
firefliesContainer.appendChild(firefly);
console.log('Firefly created:', firefly);
return {
element: firefly,
x: parseFloat(firefly.style.left),
y: parseFloat(firefly.style.top),
vx: 0,
vy: 0
};
}

function moveFirefly(firefly, targetX, targetY) {
const dx = targetX - firefly.x;
const dy = targetY - firefly.y;
const distance = Math.sqrt(dx * dx + dy * dy);

if (distance < 0.1) {
    return true; // Firefly has reached the target
}

const speed = isGathering ? 0.1 : 0.1;
firefly.vx += dx * speed;
firefly.vy += dy * speed;

// Apply velocity with damping
firefly.x += firefly.vx * 0.1;
firefly.y += firefly.vy * 0.1;
firefly.vx *= 0.7;
firefly.vy *= 0.7;

// Keep fireflies within bounds
firefly.x = Math.max(0, Math.min(100, firefly.x));
firefly.y = Math.max(0, Math.min(100, firefly.y));

firefly.element.style.left = `${firefly.x}%`;
firefly.element.style.top = `${firefly.y}%`;

return false; // Firefly is still moving
}

function blinkFirefly(firefly) {
if (!isFairyformed) {
    firefly.element.style.opacity = Math.random() * 0.5 + 0.5;
}
}

// Create fireflies
for (let i = 0; i < numFireflies; i++) {
fireflies.push(createFirefly());
}

// Animate fireflies and update cursor
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
mouseX = e.clientX / window.innerWidth * 100;
mouseY = e.clientY / window.innerHeight * 100;

// Update custom cursor position
customCursor.style.left = `${e.clientX}px`;
customCursor.style.top = `${e.clientY}px`;

if (!isGathering && !isFairyformed) {
    gatherX = 62;
    gatherY = 15;
    isGathering = true;
}
});

function transformToFairy() {
isFairyformed = true;
androidFairy.style.display = 'block';
androidFairy.style.opacity = 1;
fireflies.forEach(firefly => {
    firefly.element.classList.add('hidden');
});
fairyX = gatherX;
fairyY = gatherY;
androidFairy.style.left = `${fairyX}%`;
androidFairy.style.top = `${fairyY}%`;
}

function moveFairyTowardsMouse() {
const dx = mouseX - fairyX;
const dy = mouseY - fairyY;
fairyX += dx * 0.08; // Adjust this value to change the fairy's speed
fairyY += dy * 0.08; // Adjust this value to change the fairy's speed
androidFairy.style.left = `${fairyX}%`;
androidFairy.style.top = `${fairyY}%`;
}

function animate() {
if (!isFairyformed) {
    let allFirefliesGathered = true;
    fireflies.forEach(firefly => {
        if (!moveFirefly(firefly, gatherX, gatherY)) {
            allFirefliesGathered = false;
        }
        blinkFirefly(firefly);
    });

    if (allFirefliesGathered) {
        transformToFairy();
    }
} else {
    moveFairyTowardsMouse();
}
requestAnimationFrame(animate);
}

animate();
});

    const phrases = [
        "Web Developer  ",
        "Designer  ",
        "Problem Solver  ",
        "Creative Thinker  "
    ];

    let phraseIndex = 0;
    let letterIndex = 0;
    let currentPhrase = "";
    let isDeleting = false;
    let isEnd = false;

    function typeWriter() {
        isEnd = false;
        const typewriterElement = document.getElementById("typewriter");
        
        if (phraseIndex === phrases.length) {
            phraseIndex = 0;
        }
        
        if (!isDeleting && letterIndex <= phrases[phraseIndex].length) {
            currentPhrase = phrases[phraseIndex].substring(0, letterIndex);
            letterIndex++;
        } else if (isDeleting && letterIndex > 0) {
            currentPhrase = phrases[phraseIndex].substring(0, letterIndex);
            letterIndex--;
        } else {
            isDeleting = !isDeleting;
            phraseIndex++;
            if (phraseIndex === phrases.length) {
                phraseIndex = 0;
            }
            letterIndex = isDeleting ? phrases[phraseIndex].length : 0;
        }
        
        typewriterElement.innerHTML = currentPhrase;
        typewriterElement.classList.add("cursor");
        
        const typingSpeed = isDeleting ? 30 : 500;
        const pauseTime = isDeleting ? 500 : 800;
        
        if (!isDeleting && letterIndex === phrases[phraseIndex].length) {
            setTimeout(typeWriter, pauseTime);
        } else if (isDeleting && letterIndex === 0) {
            typewriterElement.classList.remove("cursor");
            setTimeout(typeWriter, 500);
        } else {
            setTimeout(typeWriter, typingSpeed);
        }
    }

    document.addEventListener("DOMContentLoaded", typeWriter); 
