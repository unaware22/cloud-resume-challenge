/**
 * Aditya Nur Lintang — Cyber Security & Network Engineer Portfolio
 * script.js — Handles Theme Switching, Scroll Reveal, and AWS Cloud Resume Visitor Counter
 */

document.addEventListener("DOMContentLoaded", () => {
    initThemeSwitcher();
    initScrollReveal();
    initVisitorCounter();
    initTypewriter();
    initAsciiCloud();
    initLocationModal();
    // Particle background removed for a cleaner look

});

/**
 * Typewriter Typing Animation for Hero Badge
 * Dynamically types and erases: AWS Enthusiast | Learning Cloud Architecture | AWS re/Start Learner
 */
function initTypewriter() {
    const typingElement = document.getElementById("typing-text");
    if (!typingElement) return;

    const phrases = [
        "AWS Enthusiast",
        "Learning Cloud Architecture",
        "AWS re/Start Learner"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // Faster when deleting
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 90; // Natural typing speed
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end of phrase
            typeSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before typing next phrase
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/**
 * 5. Authentic Pixel Art AWS Cloud Logo Canvas Renderer
 * High-definition pixel art AWS Cloud Logo object matching the user's uploaded image:
 * - Crisp pixel grid rasterizer (8px pixel block step)
 * - Thick 3-pixel orange border (#FF9900)
 * - White/cream pixelated cloud body fill (#FFFFFF)
 * - Pixel art "aws" typography in dark navy (#1E293B)
 * - Pixel art orange smile arc with arrowhead
 * - Fixed static position (no mouse movement tilt, no up/down floating animation)
 */

/**
 * 1. Light and Dark Theme Switcher
 * Detects user saved preference or system preference and toggles theme
 */
function initThemeSwitcher() {
    const themeToggleBtn = document.getElementById("theme-toggle");
    if (!themeToggleBtn) return;

    // Check for saved theme preference in localStorage, fallback to system preference
    const savedTheme = localStorage.getItem("portfolio-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Default to dark theme if user prefers it and has no saved preference
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");

        // Save choice in localStorage
        localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    });
}

/**
 * 2. Scroll Reveal Animation using Intersection Observer
 * Adds the 'active' class to elements when they enter the viewport
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Unobserve once animated to keep the page performant
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * 3. Visitor Counter for AWS Cloud Resume Challenge
 * Fetches the visitor count from AWS API Gateway + Lambda + DynamoDB
 * Falls back to LocalStorage simulation if API_URL is not set or fails.
 */
async function initVisitorCounter() {
    const counterElement = document.getElementById("visitor-count");
    if (!counterElement) return;

    // URL API Gateway (AWS Lambda + DynamoDB) untuk visitor counter
    const API_URL = "https://npcoyuaddi.execute-api.ap-southeast-1.amazonaws.com/prod/visitor";

    if (API_URL) {
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Menangani beberapa kemungkinan format response dari Lambda
            const count = data.visitor_count ?? data.count ?? (data.body && (data.body.visitor_count ?? data.body.count)) ?? data;

            if (typeof count === "number" || !isNaN(count)) {
                animateCounter(counterElement, parseInt(count));
                return;
            }
        } catch (error) {
            console.warn("Gagal menghubungi AWS API Gateway. Menggunakan visitor counter simulasi lokal.", error);
        }
    }

    // FALLBACK SIMULATION (LocalStorage)
    // Berguna untuk testing offline dan demo lokal sebelum API Gateway selesai dikonfigurasi
    let localCount = localStorage.getItem("cloud_resume_visits");

    if (localCount === null) {
        localCount = 205; // Nilai awal default
    } else {
        localCount = parseInt(localCount);
    }

    // Tambah jumlah kunjungan
    localCount += 1;
    localStorage.setItem("cloud_resume_visits", localCount.toString());

    // Tampilkan dengan efek animasi menghitung (counting animation)
    animateCounter(counterElement, localCount);
}

/**
 * Utility: Animates the counter number from 0 to the target value
 */
function animateCounter(element, targetValue) {
    const duration = 1500; // Durasi total animasi dalam milidetik
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let currentFrame = 0;

    const updateCounter = () => {
        currentFrame++;
        const progress = currentFrame / totalFrames;

        // Easing: easeOutQuad
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * targetValue);

        element.textContent = currentValue.toString().padStart(5, "0");

        if (currentFrame < totalFrames) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetValue.toString().padStart(5, "0");
        }
    };

    requestAnimationFrame(updateCounter);
}

/**
 * 4. Deep Space & Dynamic Particle System
 * Efek partikel & bintang jatuh (shooting stars):
 * - Dark Mode: Gemini cosmic theme (bintang berpijar, shooting stars dengan gradien Gemini Blue-Purple-Pink).
 * - Light Mode: Bintang jatuh berwarna gelap (dark navy/charcoal shooting stars) & partikel kosmik gelap.
 */
function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // ---- Config ----
    const STAR_COUNT = 240;
    const DUST_COUNT = 50;
    const SHOOTING_STAR_INTERVAL = 1600; // ms between shooting stars

    let W, H;
    function resizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Utility
    const rand = (min, max) => Math.random() * (max - min) + min;

    // ---- Star Class ----
    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = rand(0, W);
            this.y = rand(0, H);
            this.baseRadius = rand(0.4, 2.2);
            this.radius = this.baseRadius;
            
            const colorRoll = Math.random();
            if (colorRoll < 0.5) {
                this.r = 255; this.g = 255; this.b = 255;
            } else if (colorRoll < 0.75) {
                this.r = 180; this.g = 210; this.b = 255; // Gemini Cool Blue
            } else if (colorRoll < 0.90) {
                this.r = 210; this.g = 170; this.b = 255; // Gemini Purple
            } else {
                this.r = 255; this.g = 180; this.b = 200; // Gemini Pink
            }
            this.baseAlpha = rand(0.2, 0.85);
            this.alpha = this.baseAlpha;
            this.twinkleSpeed = rand(0.008, 0.04);
            this.twinklePhase = rand(0, Math.PI * 2);
            this.driftX = rand(-0.04, 0.04);
            this.driftY = rand(-0.04, 0.04);
        }

        update() {
            this.twinklePhase += this.twinkleSpeed;
            const twinkle = Math.sin(this.twinklePhase) * 0.5 + 0.5;
            this.alpha = this.baseAlpha * (0.35 + twinkle * 0.65);
            this.radius = this.baseRadius * (0.8 + twinkle * 0.4);

            this.x += this.driftX;
            this.y += this.driftY;

            if (this.x < 0) this.x = W;
            if (this.x > W) this.x = 0;
            if (this.y < 0) this.y = H;
            if (this.y > H) this.y = 0;
        }

        draw(ctx, isDark) {
            const a = this.alpha;
            const rad = this.radius;

            ctx.save();

            if (isDark) {
                // Dark Mode: Bright 8-Bit Pixel Square Stars
                ctx.globalAlpha = a;
                ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},1)`;
                const pSize = Math.max(2, Math.round(rad * 2));
                ctx.fillRect(Math.round(this.x), Math.round(this.y), pSize, pSize);
            } else {
                // Light Mode: Subtle Dark 8-Bit Pixel Square Stars
                ctx.globalAlpha = a * 0.55;
                ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
                const pSize = Math.max(2, Math.round(rad * 1.8));
                ctx.fillRect(Math.round(this.x), Math.round(this.y), pSize, pSize);
            }

            ctx.restore();
        }
    }

    // ---- Cosmic Dust Class ----
    class CosmicDust {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = rand(0, W);
            this.y = rand(0, H);
            this.radius = rand(0.8, 3.2);
            this.alpha = rand(0.05, 0.2);
            this.vx = rand(-0.06, 0.06);
            this.vy = rand(-0.06, 0.06);
            this.pulsePhase = rand(0, Math.PI * 2);
            this.pulseSpeed = rand(0.005, 0.015);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulsePhase += this.pulseSpeed;

            if (this.x < -10) this.x = W + 10;
            if (this.x > W + 10) this.x = -10;
            if (this.y < -10) this.y = H + 10;
            if (this.y > H + 10) this.y = -10;
        }

        draw(ctx, isDark) {
            const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
            ctx.save();
            if (isDark) {
                ctx.globalAlpha = this.alpha * pulse;
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
                grad.addColorStop(0, "rgba(155, 104, 246, 0.6)");
                grad.addColorStop(1, "rgba(56, 120, 246, 0)");
                ctx.fillStyle = grad;
            } else {
                ctx.globalAlpha = this.alpha * pulse * 0.5;
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
                grad.addColorStop(0, "rgba(51, 65, 85, 0.5)");
                grad.addColorStop(1, "rgba(100, 116, 139, 0)");
                ctx.fillStyle = grad;
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // ---- Shooting Star Class (Bintang Jatuh) ----
    class ShootingStar {
        constructor() {
            this.active = false;
            this.reset();
        }

        reset() {
            this.active = false;
            this.x = rand(0, W * 0.7);
            this.y = rand(0, H * 0.4);
            this.length = rand(80, 180);
            this.speed = rand(7, 14);
            this.angle = rand(Math.PI * 0.1, Math.PI * 0.38);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.opacity = 1;
            this.fadeSpeed = rand(0.008, 0.016);
            this.width = rand(1.2, 2.8);
        }

        spawn() {
            this.active = true;
            this.x = rand(-50, W * 0.75);
            this.y = rand(-50, H * 0.45);
            this.length = rand(90, 200);
            this.speed = rand(8, 15);
            this.angle = rand(Math.PI * 0.08, Math.PI * 0.4);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.opacity = 1;
            this.fadeSpeed = rand(0.007, 0.015);
            this.width = rand(1.2, 2.8);
        }

        update() {
            if (!this.active) return;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0 || this.x > W + 150 || this.y > H + 150) {
                this.active = false;
            }
        }

        draw(ctx, isDark) {
            if (!this.active) return;
            ctx.save();
            ctx.globalAlpha = this.opacity;

            const tailX = this.x - this.vx * (this.length / this.speed);
            const tailY = this.y - this.vy * (this.length / this.speed);
            const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);

            if (isDark) {
                // Dark Mode: Gemini Vibrant Glow Streak (White -> Blue -> Purple -> Pink)
                grad.addColorStop(0, "rgba(255, 255, 255, 1)");
                grad.addColorStop(0.25, "rgba(56, 120, 246, 0.95)");  // Gemini Blue
                grad.addColorStop(0.65, "rgba(155, 104, 246, 0.7)");  // Gemini Purple
                grad.addColorStop(1, "rgba(255, 94, 98, 0)");        // Gemini Pink Fade

                ctx.strokeStyle = grad;
                ctx.lineWidth = this.width;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();

                // Bright head
                ctx.globalAlpha = this.opacity * 0.95;
                ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width * 1.3, 0, Math.PI * 2);
                ctx.fill();

                // Head Gemini Glow
                ctx.globalAlpha = this.opacity * 0.4;
                const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * 7);
                glow.addColorStop(0, "rgba(155, 104, 246, 0.8)");
                glow.addColorStop(1, "rgba(56, 120, 246, 0)");
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width * 7, 0, Math.PI * 2);
                ctx.fill();

            } else {
                // Light Mode: Dark-colored Shooting Star (Bintang Jatuh Berwarna Gelap)
                grad.addColorStop(0, "rgba(15, 23, 42, 0.95)");    // Dark Charcoal Head
                grad.addColorStop(0.3, "rgba(30, 41, 59, 0.75)");  // Dark Navy Body
                grad.addColorStop(0.7, "rgba(71, 85, 105, 0.4)");  // Slate Grey Tail
                grad.addColorStop(1, "rgba(100, 116, 139, 0)");   // Transparent Fade

                ctx.strokeStyle = grad;
                ctx.lineWidth = this.width * 1.1;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();

                // Dark Head Dot
                ctx.globalAlpha = this.opacity * 0.95;
                ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width * 1.3, 0, Math.PI * 2);
                ctx.fill();

                // Dark Head Soft Glow
                ctx.globalAlpha = this.opacity * 0.3;
                const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * 6);
                glow.addColorStop(0, "rgba(30, 41, 59, 0.6)");
                glow.addColorStop(1, "rgba(15, 23, 42, 0)");
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width * 6, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    // ---- Nebula Background Glow ----
    const nebulae = [
        { x: 0.25, y: 0.3, r: 0.35, color: { r: 56, g: 120, b: 246 } },
        { x: 0.75, y: 0.2, r: 0.25, color: { r: 155, g: 104, b: 246 } },
        { x: 0.5, y: 0.7, r: 0.3, color: { r: 255, g: 94, b: 98 } },
    ];

    function drawNebulae(ctx, isDark) {
        if (!isDark) return; // Hide nebulae in light mode
        ctx.save();
        nebulae.forEach(n => {
            const nx = n.x * W;
            const ny = n.y * H;
            const nr = n.r * Math.min(W, H);
            const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
            grad.addColorStop(0, `rgba(${n.color.r},${n.color.g},${n.color.b},0.05)`);
            grad.addColorStop(0.6, `rgba(${n.color.r},${n.color.g},${n.color.b},0.015)`);
            grad.addColorStop(1, `rgba(${n.color.r},${n.color.g},${n.color.b},0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(nx, ny, nr, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    // ---- Instantiate ----
    const stars = Array.from({ length: STAR_COUNT }, () => new Star());
    const dusts = Array.from({ length: DUST_COUNT }, () => new CosmicDust());
    const shootingStars = Array.from({ length: 5 }, () => new ShootingStar());
    let lastShootingStarTime = 0;

    // ---- Animation loop ----
    let animationId = null;

    function animate(now) {
        const isDark = document.body.classList.contains("dark-theme");
        ctx.clearRect(0, 0, W, H);

        drawNebulae(ctx, isDark);

        dusts.forEach(d => {
            d.update();
            d.draw(ctx, isDark);
        });

        stars.forEach(s => {
            s.update();
            s.draw(ctx, isDark);
        });

        if (now - lastShootingStarTime > SHOOTING_STAR_INTERVAL + rand(-600, 1200)) {
            const inactive = shootingStars.find(ss => !ss.active);
            if (inactive) {
                inactive.spawn();
                lastShootingStarTime = now;
            }
        }
        shootingStars.forEach(ss => {
            ss.update();
            ss.draw(ctx, isDark);
        });

        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!animationId) {
            animate(performance.now());
        }
    }

    startAnimation();
}

/**
 * High-Definition Harmonious ASCII Character Cloud Visualizer
 * Features smooth, non-clashing continuous color gradients (White -> Ice Blue -> Azure -> Navy),
 * enhanced 3D light sweep, subtle volumetric breathing pulse, and anti-gravity float.
 */
function initAsciiCloud() {
    const canvas = document.getElementById("ascii-cloud-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High resolution grid (tiny individual ASCII character pixels)
    const COLS = 104;
    const ROWS = 34;
    const charWidth = canvas.width / COLS;
    const charHeight = canvas.height / ROWS;

    // Rich ASCII character shading palette (from dense/dark to sparse/light)
    const charPalette = [
        " ", ".", "'", "`", "-", "~", ":", "=", "+", "*", 
        "i", "r", "c", "v", "z", "1", "0", "C", "Z", "D", 
        "O", "S", "X", "#", "%", "W", "M", "@", "$"
    ];

    // High-definition Voxel Cloud Billows Geometry
    const baseBillows = [
        { cx: 52, cy: 9.0,  rx: 15.0, ry: 10.5 },
        { cx: 36, cy: 11.5, rx: 13.0, ry: 9.5  },
        { cx: 68, cy: 12.0, rx: 13.5, ry: 9.8  },
        { cx: 22, cy: 15.5, rx: 11.0, ry: 8.5  },
        { cx: 82, cy: 16.0, rx: 10.5, ry: 8.2  },
        { cx: 12, cy: 19.0, rx: 8.5,  ry: 6.5  },
        { cx: 92, cy: 19.5, rx: 7.5,  ry: 6.0  },
        { cx: 52, cy: 19.0, rx: 22.0, ry: 10.0 },
        { cx: 35, cy: 20.0, rx: 18.0, ry: 8.5  },
        { cx: 69, cy: 20.0, rx: 18.0, ry: 8.5  }
    ];

    let time = 0;

    function renderFrame() {
        time += 0.018; // Smooth cinematic time step

        // Anti-gravity floating & organic breathing volume pulse
        const floatY = Math.sin(time * 0.6) * 1.6;
        const floatX = Math.cos(time * 0.3) * 0.6;
        const volumePulse = 1.0 + Math.sin(time * 0.8) * 0.025; // Subtle breathing expansion

        // Smooth orbiting 3D light vector
        const lx = Math.cos(time * 0.5) * 0.65;
        const ly = Math.sin(time * 0.35) * 0.4 - 0.7; // Light coming from top-front
        const lz = Math.sin(time * 0.5) * 0.5 + 0.85;
        const lLen = Math.sqrt(lx * lx + ly * ly + lz * lz);
        const lnx = lx / lLen, lny = ly / lLen, lnz = lz / lLen;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 9px 'Courier New', 'Consolas', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const isDark = document.body.classList.contains("dark-theme");

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const evalR = r + (floatY * 0.25);
                const evalC = c + (floatX * 0.25);

                let inCloud = false;
                let minDistSq = 999;
                let bestBillow = null;

                for (let b of baseBillows) {
                    // Apply organic breathing volume pulse
                    const effectiveRx = b.rx * volumePulse;
                    const effectiveRy = b.ry * volumePulse;

                    const dx = (evalC - b.cx) / effectiveRx;
                    const dy = (evalR - b.cy) / effectiveRy;
                    const distSq = dx * dx + dy * dy;

                    if (distSq <= 1.0) {
                        inCloud = true;
                        if (distSq < minDistSq) {
                            minDistSq = distSq;
                            bestBillow = { b, dx, dy, distSq };
                        }
                    }
                }

                // Cloud flat pixel base cut-off
                if (evalR > 26.5) {
                    inCloud = false;
                }

                if (inCloud && bestBillow) {
                    // Compute 3D pseudo surface normal
                    const nz = Math.sqrt(Math.max(0.02, 1.0 - bestBillow.distSq));
                    const nx = bestBillow.dx;
                    const ny = bestBillow.dy;

                    // 3D Photorealistic lighting dot product
                    const dot = Math.max(0.06, nx * lnx + ny * lny + nz * lnz);

                    // Character density mapping
                    const charIdx = Math.min(
                        charPalette.length - 1,
                        Math.floor(dot * (charPalette.length - 0.05))
                    );

                    // Harmonious Analogous Color Gradient System (No Color Collision!)
                    let color = isDark ? "#3b82f6" : "#2563eb";
                    let glow = false;

                    if (isDark) {
                        // Dark Theme: Neon Ice-Cyan to Deep Cosmic Navy Gradient
                        if (dot > 0.75) {
                            color = "#ffffff"; // Pure White Highlight
                            glow = true;
                        } else if (dot > 0.60) {
                            color = "#e0f2fe"; // Soft Ice Blue Peak
                            glow = true;
                        } else if (dot > 0.42) {
                            color = "#38bdf8"; // Electric Sky Cyan
                        } else if (dot > 0.26) {
                            color = "#3b82f6"; // Vivid Azure Blue
                        } else if (dot > 0.14) {
                            color = "#1d4ed8"; // Deep Sapphire Blue
                        } else {
                            color = "#1e1b4b"; // Dark Cosmic Navy Shadow
                        }
                    } else {
                        // Light Theme: Crisp Sky-Blue Gradient (100% visible on white card)
                        if (dot > 0.75) {
                            color = "#0284c7"; // Crisp Sky Cyan Peak Highlight
                            glow = true;
                        } else if (dot > 0.60) {
                            color = "#2563eb"; // Vivid Ocean Blue
                            glow = true;
                        } else if (dot > 0.42) {
                            color = "#3b82f6"; // Steel Azure Blue
                        } else if (dot > 0.26) {
                            color = "#1d4ed8"; // Deep Royal Azure
                        } else if (dot > 0.14) {
                            color = "#1e40af"; // Deep Sapphire Navy
                        } else {
                            color = "#1e293b"; // Crisp Slate Navy Shadow Base
                        }
                    }

                    // Controlled Matrix Code Character Shimmer
                    let charToDraw = charPalette[charIdx];
                    if (Math.random() < 0.018) {
                        const matrixChars = ["1", "0", "C", "Z", "D", "I", "O", "G", "W", "N", "X", "#", "@"];
                        charToDraw = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                    }

                    const px = (c + 0.5) * charWidth;
                    const py = (r + 0.5) * charHeight;

                    if (glow) {
                        ctx.shadowColor = color;
                        ctx.shadowBlur = isDark ? 8 : 4;
                    } else {
                        ctx.shadowBlur = 0;
                    }

                    ctx.fillStyle = color;
                    ctx.fillText(charToDraw, px, py);
                }
            }
        }

        requestAnimationFrame(renderFrame);
    }

    renderFrame();
}

/**
 * Interactive Location Modal Map Handler
 * Opens location modal preview on location pin button click without opening a new tab.
 */
function initLocationModal() {
    const locationBtn = document.getElementById("location-btn");
    const modal = document.getElementById("location-modal");
    const closeBtn = document.getElementById("close-location-modal");

    if (!locationBtn || !modal) return;

    function openModal() {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Restore background scroll
    }

    locationBtn.addEventListener("click", openModal);

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Close on backdrop click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
}









