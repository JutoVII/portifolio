// =========================
// Canvas
// =========================

const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", () => {
    resizeCanvas();
    particles.length = 0;
    createParticles();
});


// =========================
// Cor Primária (CSS)
// =========================

function getPrimaryColor() {
    return getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color")
        .trim() || "#ffffff";
}


// =========================
// Mouse
// =========================

const mouse = {
    x: null,
    y: null,
    radius: 18
};

window.addEventListener("mousemove", (e) => {

    mouse.x = e.clientX;
    mouse.y = e.clientY;

});

window.addEventListener("mouseleave", () => {

    mouse.x = null;
    mouse.y = null;

});


// =========================
// Ripple (Clique)
// =========================

const ripples = [];

window.addEventListener("click", () => {

    if(mouse.x == null) return;

    ripples.push({
        x: mouse.x,
        y: mouse.y,
        radius: 0,
        opacity: 1
    });

});


// =========================
// Partículas
// =========================

const particles = [];

class Particle {

    constructor(){

        this.reset();

    }

    reset(){

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - .5) * .7;
        this.vy = (Math.random() - .5) * .7;

        this.size = Math.random() * 2 + 1;

    }

    update(){

        this.x += this.vx;
        this.y += this.vy;

        if(this.x < 0 || this.x > canvas.width)
            this.vx *= -1;

        if(this.y < 0 || this.y > canvas.height)
            this.vy *= -1;

    }

    draw(){

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = getPrimaryColor();

        ctx.fill();

    }

}

function createParticles(){

    let amount = Math.floor(
        (canvas.width * canvas.height) / 14000
    );

    amount = Math.min(amount,160);

    for(let i=0;i<amount;i++){

        particles.push(
            new Particle()
        );

    }

}

// =========================
// Conexões entre partículas
// =========================

function connectParticles() {

    const color = getPrimaryColor();

    for (let a = 0; a < particles.length; a++) {

        for (let b = a + 1; b < particles.length; b++) {

            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {

                const opacity = 1 - distance / 120;

                ctx.beginPath();

                ctx.strokeStyle =
                    color +
                    Math.floor(opacity * 80)
                        .toString(16)
                        .padStart(2, "0");

                ctx.lineWidth = 1;

                ctx.moveTo(
                    particles[a].x,
                    particles[a].y
                );

                ctx.lineTo(
                    particles[b].x,
                    particles[b].y
                );

                ctx.stroke();
            }
        }
    }
}



// =========================
// Mouse influencia partículas
// =========================

function mouseInteraction() {

    if (mouse.x == null) return;

    const color = getPrimaryColor();

    particles.forEach(p => {

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 170) {

            ctx.beginPath();

            ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";

            ctx.lineWidth = 1.2;

            ctx.moveTo(
                mouse.x,
                mouse.y
            );

            ctx.lineTo(
                p.x,
                p.y
            );

            ctx.stroke();

            const force = (170 - distance) / 170;

            p.x -= dx * force * 0.01;
            p.y -= dy * force * 0.01;
        }

    });

}



// =========================
// Cursor Personalizado
// =========================

function drawCursor() {

    if (mouse.x == null) return;

    const color = getPrimaryColor();

    ctx.save();

    // brilho

    ctx.shadowBlur = 25;
    ctx.shadowColor = color;

    // círculo externo

    ctx.beginPath();

    ctx.arc(
        mouse.x,
        mouse.y,
        mouse.radius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = color;

    ctx.lineWidth = 2;

    ctx.stroke();

    // círculo interno

    ctx.beginPath();

    ctx.arc(
        mouse.x,
        mouse.y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;

    ctx.fill();

    ctx.restore();

}



// =========================
// Ripple (Clique)
// =========================

function drawRipples() {

    const color = getPrimaryColor();

    for (let i = ripples.length - 1; i >= 0; i--) {

        const ripple = ripples[i];

        ctx.beginPath();

        ctx.arc(
            ripple.x,
            ripple.y,
            ripple.radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            color +
            Math.floor(ripple.opacity * 255)
                .toString(16)
                .padStart(2, "0");

        ctx.lineWidth = 2;

        ctx.stroke();

        ripple.radius += 3;
        ripple.opacity -= 0.03;

        if (ripple.opacity <= 0) {

            ripples.splice(i, 1);

        }

    }

}

// =========================
// Atualização das partículas
// =========================

function updateParticles() {

    particles.forEach(particle => {

        particle.update();
        particle.draw();

    });

}



// =========================
// Fundo
// =========================

function clearCanvas() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}



// =========================
// Cursor Animado
// =========================

let cursorPulse = 0;

window.addEventListener("mousedown", () => {
    cursorPulse = 8;
});

function animateCursor() {

    if(mouse.x == null) return;

    if(cursorPulse > 0){

        ctx.beginPath();

        ctx.arc(
            mouse.x,
            mouse.y,
            mouse.radius + cursorPulse,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            getPrimaryColor() +
            Math.floor((cursorPulse / 8) * 255)
                .toString(16)
                .padStart(2,"0");

        ctx.lineWidth = 2;

        ctx.stroke();

        cursorPulse -= 0.35;

    }

}



// =========================
// Loop Principal
// =========================

function animate(){

    clearCanvas();

    updateParticles();

    connectParticles();

    mouseInteraction();

    drawRipples();

    drawCursor();

    animateCursor();

    requestAnimationFrame(animate);

}



// =========================
// Inicialização
// =========================

createParticles();

animate();