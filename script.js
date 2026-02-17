/* ─── PARTICLE CONSTELLATION ─── */
(function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECT_DIST = 120;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.4 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(125,249,224,${p.alpha})`;
            ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(125,249,224,${0.06 * (1 - dist / CONNECT_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ─── SPOTLIGHT ─── */
const sl = document.getElementById('spotlight');
let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
let tx = cx, ty = cy;

document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
}, { passive: true });

(function spotlightLoop() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    sl.style.background = `radial-gradient(520px circle at ${cx.toFixed(1)}px ${cy.toFixed(1)}px, rgba(125,249,224,0.036) 0%, rgba(167,139,250,0.016) 45%, transparent 70%)`;
    requestAnimationFrame(spotlightLoop);
})();

/* ─── PER-CARD INNER GLOW + TILT ─── */
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--cx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--cy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${(-dy * 5).toFixed(2)}deg) rotateY(${(dx * 5).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ─── SCROLL PROGRESS ─── */
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0) prog.style.transform = `scaleX(${(window.scrollY / max).toFixed(4)})`;
}, { passive: true });

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver(
    (entries, obs) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── PARALLAX ORBS ─── */
window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * 16;
    document.querySelector('.orb1').style.transform = `translate(${(x * .65).toFixed(1)}px,${(y * .65).toFixed(1)}px)`;
    document.querySelector('.orb2').style.transform = `translate(${(-x * .4).toFixed(1)}px,${(-y * .4).toFixed(1)}px)`;
}, { passive: true });

/* ─── NAV SHRINK + ACTIVE SECTION ─── */
const navEl = document.querySelector('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 80);

    let current = '';
    sections.forEach(s => {
        const top = s.offsetTop - 200;
        if (window.scrollY >= top) current = s.getAttribute('id');
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}, { passive: true });

/* ─── TYPEWRITER ─── */
const typeEl = document.getElementById('typewriter');
const words = ['Engineer.', 'Architect.', 'Builder.', 'Problem Solver.'];
let wordIdx = 0, charIdx = 0, isDeleting = false;

function typewrite() {
    const word = words[wordIdx];
    if (isDeleting) {
        charIdx--;
        typeEl.textContent = word.substring(0, charIdx);
    } else {
        charIdx++;
        typeEl.textContent = word.substring(0, charIdx);
    }

    let delay = isDeleting ? 50 : 100;

    if (!isDeleting && charIdx === word.length) {
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        delay = 400;
    }

    setTimeout(typewrite, delay);
}
setTimeout(typewrite, 1500);

/* ─── ANIMATED COUNTERS ─── */
function animateCounter(el) {
    const target = el.getAttribute('data-target');
    const suffix = el.getAttribute('data-suffix') || '';
    const numTarget = parseFloat(target);
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * numTarget);

        if (target.includes('.')) {
            el.textContent = (eased * numTarget).toFixed(1) + suffix;
        } else {
            el.textContent = current.toLocaleString() + suffix;
        }

        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(e.target);
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

/* ─── BACK TO TOP ─── */
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });
btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
