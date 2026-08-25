/**
 * Aditya Nur Lintang — Cyber Security & Network Engineer Portfolio
 * script.js — Handles Theme Switching, Scroll Reveal, and AWS Cloud Resume Visitor Counter
 */

document.addEventListener("DOMContentLoaded", () => {
    initIrisPreloader();
    initHeroRive();
    initScrollNavbar();
    initThemeSwitcher();
    initScrollReveal();
    initVisitorCounter();
    initTypewriter();
    initExperienceCountUp();
    initInteractiveExperienceCards();
    initLocationModal();
    initProjectCarousel();
    initBadgeCardTilt();
    initWavySkillsText();
    initPageTransitions();
});

/**
 * Hero Interactive Rive Cat Initializer (interactive/cat/cat_follow_cursor_demo.riv)
 * Uses Rive ViewModelInstance and Data Binding (Artboard 2, xPos / yPos)
 * to smoothly track cursor position across the entire viewport
 */
let heroRiveInstance = null;

function initHeroRive() {
    const canvas = document.getElementById("hero-rive-canvas");
    if (!canvas) return;

    if (typeof rive === "undefined") {
        setTimeout(initHeroRive, 50);
        return;
    }

    function base64ToArrayBuffer(base64) {
        try {
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        } catch (e) {
            console.error("Base64 decode error:", e);
            return null;
        }
    }

    try {
        const riveConfig = {
            canvas: canvas,
            artboard: "Artboard 2",
            stateMachines: "State Machine 1",
            autoplay: true,
            autoBind: true,
            layout: new rive.Layout({
                fit: rive.Fit.Contain,
                alignment: rive.Alignment.Center,
            }),
            onLoad: () => {
                if (!heroRiveInstance) return;

                heroRiveInstance.resizeDrawingSurfaceToCanvas();

                // Get ViewModelInstance properties (Data Binding for xPos & yPos)
                const vmi = heroRiveInstance.viewModelInstance;
                let xProperty = null;
                let yProperty = null;

                if (vmi) {
                    xProperty = vmi.number("xPos") || vmi.number("x") || vmi.number("X value");
                    yProperty = vmi.number("yPos") || vmi.number("y") || vmi.number("Y value");
                }

                // Initial forward-looking gaze (centered at 50, 50)
                if (xProperty) xProperty.value = 50;
                if (yProperty) yProperty.value = 50;

                // Also get direct State Machine inputs if available
                const smInputs = heroRiveInstance.stateMachineInputs("State Machine 1") || [];

                // Convert cursor coordinates to 0-100 range relative to canvas bounds
                const mapCursorToRange = (position, dimension) => {
                    const clampedPosition = Math.max(0, Math.min(position, dimension));
                    return (clampedPosition / dimension) * 100;
                };

                const updatePosition = (clientX, clientY) => {
                    const rect = canvas.getBoundingClientRect();

                    // Calculate position relative to canvas
                    const canvasX = clientX - rect.left;
                    const canvasY = clientY - rect.top;

                    // Map to 0-100 range based on canvas dimensions
                    const xValue = mapCursorToRange(canvasX, rect.width);
                    const yValue = mapCursorToRange(canvasY, rect.height);

                    // Update ViewModel properties (Data Binding)
                    if (xProperty) xProperty.value = xValue;
                    if (yProperty) yProperty.value = yValue;

                    // Also update State Machine number inputs for full compatibility
                    smInputs.forEach(input => {
                        const name = input.name.toLowerCase();
                        if (input.type === rive.StateMachineInputType.Number) {
                            if (name.includes("x") || name.includes("horiz") || name.includes("ltor")) {
                                input.value = xValue;
                            } else if (name.includes("y") || name.includes("vert") || name.includes("utod")) {
                                input.value = yValue;
                            }
                        }
                    });
                };

                // Mouse movement on entire window
                const handleMouseMove = (event) => {
                    updatePosition(event.clientX, event.clientY);
                };

                // Touch movement on mobile devices
                const handleTouchMove = (event) => {
                    if (event.touches && event.touches.length > 0) {
                        const touch = event.touches[0];
                        updatePosition(touch.clientX, touch.clientY);
                    }
                };

                // Reset eyes to forward gaze when cursor leaves window or touch ends
                const handleReset = () => {
                    if (xProperty) xProperty.value = 50;
                    if (yProperty) yProperty.value = 50;
                    smInputs.forEach(input => {
                        if (input.type === rive.StateMachineInputType.Number) {
                            input.value = 50;
                        }
                    });
                };

                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("touchmove", handleTouchMove, { passive: true });
                window.addEventListener("touchend", handleReset);
                document.addEventListener("mouseleave", handleReset);
            },
            onLoadError: (err) => {
                console.warn("Rive load error, retrying with fallback:", err);
                if (heroRiveInstance) {
                    heroRiveInstance.load({
                        src: "interactive/cat/cat_follow_cursor_demo.riv",
                        artboard: "Artboard 2",
                        stateMachines: "State Machine 1",
                        autoplay: true,
                        autoBind: true,
                    });
                }
            }
        };

        // If Base64 string is available, use binary buffer (works offline & on file://)
        if (typeof CAT_RIV_BASE64 !== "undefined" && CAT_RIV_BASE64) {
            const buffer = base64ToArrayBuffer(CAT_RIV_BASE64);
            if (buffer) {
                riveConfig.buffer = buffer;
            } else {
                riveConfig.src = "interactive/cat/cat_follow_cursor_demo.riv";
            }
        } else {
            riveConfig.src = "interactive/cat/cat_follow_cursor_demo.riv";
        }

        heroRiveInstance = new rive.Rive(riveConfig);

        // Resize handler for responsive crisp rendering
        window.addEventListener("resize", () => {
            if (heroRiveInstance) {
                heroRiveInstance.resizeDrawingSurfaceToCanvas();
            }
        });

        // Click / tap trigger on cat stage & canvas
        const catStages = document.querySelectorAll(".hero-cat-stage, .hero-skull-stage, .hero-studio-card");
        const fireInteractiveAction = () => {
            if (heroRiveInstance) {
                const inputs = heroRiveInstance.stateMachineInputs("State Machine 1");
                if (inputs && inputs.length > 0) {
                    inputs.forEach(input => {
                        if (input.type === rive.StateMachineInputType.Trigger || typeof input.fire === "function") {
                            input.fire();
                        } else if (input.type === rive.StateMachineInputType.Boolean) {
                            input.value = !input.value;
                        }
                    });
                }
            }
        };

        catStages.forEach(stage => {
            stage.addEventListener("click", fireInteractiveAction);
        });
        canvas.addEventListener("click", fireInteractiveAction);
    } catch (e) {
        console.error("Error initializing Rive cat:", e);
    }
}

/**
 * Scroll-triggered Header Collapse and Floating Burger Menu
 */
function initScrollNavbar() {
    const header = document.getElementById("site-header");
    const burgerBtn = document.getElementById("floating-burger-btn");
    const drawer = document.getElementById("floating-nav-drawer");
    const closeBtn = document.getElementById("drawer-close-btn");
    const backdrop = document.getElementById("drawer-backdrop");
    const drawerLinks = document.querySelectorAll(".drawer-nav-link");

    if (!header || !burgerBtn || !drawer) return;

    let isDrawerOpen = false;

    function openDrawer() {
        isDrawerOpen = true;
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        burgerBtn.classList.add("is-active");
    }

    function closeDrawer() {
        isDrawerOpen = false;
        drawer.classList.remove("is-open");
        drawer.setAttribute("aria-hidden", "true");
        burgerBtn.classList.remove("is-active");
    }

    burgerBtn.addEventListener("click", () => {
        if (isDrawerOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener("click", closeDrawer);
    });

    const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        if (scrollY > 70) {
            header.classList.add("is-scrolled");
            burgerBtn.classList.add("is-visible");
        } else {
            header.classList.remove("is-scrolled");
            burgerBtn.classList.remove("is-visible");
            if (isDrawerOpen) {
                closeDrawer();
            }
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}

/**
 * Iris Greeting Preloader (Apple iOS-Style Cinematic Preloader)
 * Pure black background (#000000) & pure white typography (#FFFFFF)
 * Cycles through greetings: ["hello", "你好", "こんにちは", "안녕하세요", "hola", "bonjour"]
 * Smooth word reveal and Apple-style curtain slide up exit
 */
function initIrisPreloader() {
    const preloader = document.getElementById("iris-preloader");
    const textEl = document.getElementById("iris-greeting-text");
    if (!preloader || !textEl) return;

    document.body.classList.add("preloader-active");

    const greetings = ["hello", "你好", "こんにちは", "안녕하세요", "hola", "bonjour"];
    const greetingDuration = 380; // ms per word
    let currentIndex = 0;

    // Show initial greeting
    textEl.textContent = greetings[currentIndex];
    textEl.className = "iris-greeting-text anim-init";
    requestAnimationFrame(() => {
        textEl.className = "iris-greeting-text anim-in";
    });

    // Function to trigger exit
    function triggerExit() {
        textEl.className = "iris-greeting-text anim-out";
        setTimeout(() => {
            textEl.textContent = "";
            textEl.innerHTML = "";
            preloader.classList.add("is-exiting");

            setTimeout(() => {
                document.body.classList.remove("preloader-active");
                preloader.style.display = "none";
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 850);
        }, 150);
    }

    // Step-by-step greeting progression (each word shown exactly once)
    function nextGreeting() {
        currentIndex++;
        if (currentIndex >= greetings.length) {
            // Reached the end of the list ("bonjour"), exit immediately
            setTimeout(triggerExit, 300);
            return;
        }

        textEl.className = "iris-greeting-text anim-out";
        setTimeout(() => {
            textEl.textContent = greetings[currentIndex];
            textEl.className = "iris-greeting-text anim-init";
            requestAnimationFrame(() => {
                textEl.className = "iris-greeting-text anim-in";
            });

            setTimeout(nextGreeting, greetingDuration);
        }, 100);
    }

    // Start progression after initial word duration
    setTimeout(nextGreeting, greetingDuration);
}

/**
 * Typewriter Typing Animation for Hero Badge
 * Dynamically types and erases: AWS Enthusiast | Learning Cloud Architecture | AWS re/Start Learner
 */
function initTypewriter() {
    const typingElement = document.getElementById("typing-text");
    if (!typingElement) return;

    const phrases = [
        "AI-Native Software Developer",
        "Cloud, Network & Cyber Security Enthusiast",
        "AWS re/Start Learner",
        "Frontend Learner"
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
 * Experience Stat Counter Animation (Rolling / Count-up from 0 to Target)
 * Triggers every time the user scrolls / navigates to the Experience section
 */
function initExperienceCountUp() {
    const statCards = document.querySelectorAll(".count-up-stat");
    if (!statCards.length) return;

    function animateStats() {
        statCards.forEach((statEl) => {
            const target = parseInt(statEl.getAttribute("data-target"), 10);
            const suffix = statEl.getAttribute("data-suffix") || "";
            const prefix = statEl.getAttribute("data-prefix") || "";
            const duration = target > 50 ? 1400 : 900;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic curve for natural deceleration
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeProgress * target);

                statEl.textContent = `${prefix}${currentVal}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    statEl.textContent = `${prefix}${target}${suffix}`;
                }
            }

            requestAnimationFrame(update);
        });
    }

    if ("IntersectionObserver" in window) {
        const experienceSection = document.getElementById("experience");
        if (experienceSection) {
            let wasIntersecting = false;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !wasIntersecting) {
                        wasIntersecting = true;
                        animateStats();
                    } else if (!entry.isIntersecting) {
                        wasIntersecting = false; // Reset so scrolling back triggers it again!
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: "0px 0px -40px 0px"
            });

            observer.observe(experienceSection);
        }
    } else {
        animateStats();
    }

    // Trigger when clicking any anchor link pointing to #experience
    const expLinks = document.querySelectorAll('a[href="#experience"]');
    expLinks.forEach((link) => {
        link.addEventListener("click", () => {
            setTimeout(animateStats, 350);
        });
    });

    // Also replay on hovering over any stat card
    document.querySelectorAll(".journey-stat-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
            const stat = card.querySelector(".count-up-stat");
            if (stat) {
                const target = parseInt(stat.getAttribute("data-target"), 10);
                const suffix = stat.getAttribute("data-suffix") || "";
                const prefix = stat.getAttribute("data-prefix") || "";
                const duration = target > 50 ? 900 : 600;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentVal = Math.floor(easeProgress * target);

                    stat.textContent = `${prefix}${currentVal}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        stat.textContent = `${prefix}${target}${suffix}`;
                    }
                }

                requestAnimationFrame(update);
            }
        });
    });
}

/**
 * Interactive Cursor-Driven Card Color & Lighting for Experience Cards (card.riv)
 * Loads interactive/card.riv to canvas and controls cursor-reactive properties,
 * dynamic color spotlights, holographic gradient mesh, and subtle 3D tilt
 * in real-time as the cursor moves over each card (AWS, IBM, MSIB 4, S1 UP)
 */
let cardRivBufferPromise = null;

function getCardRivBuffer() {
    if (!cardRivBufferPromise) {
        cardRivBufferPromise = fetch("interactive/card.riv")
            .then(res => res.ok ? res.arrayBuffer() : null)
            .catch(err => {
                console.warn("card.riv buffer fetch error:", err);
                return null;
            });
    }
    return cardRivBufferPromise;
}

function initInteractiveExperienceCards() {
    const cards = document.querySelectorAll(".interactive-glow-card");
    if (!cards.length) return;

    // Load Rive card instances if Rive runtime is available
    if (typeof rive !== "undefined") {
        getCardRivBuffer().then(buffer => {
            cards.forEach((card) => {
                const canvas = card.querySelector(".timeline-rive-card-canvas");
                if (!canvas) return;

                try {
                    const riveParams = {
                        canvas: canvas,
                        autoplay: true,
                        autoBind: true,
                        layout: new rive.Layout({
                            fit: rive.Fit.Cover,
                            alignment: rive.Alignment.Center,
                        }),
                        onLoad: () => {
                            if (card._riveInstance) {
                                card._riveInstance.resizeDrawingSurfaceToCanvas();
                            }
                        }
                    };

                    if (buffer) {
                        riveParams.buffer = buffer.slice(0);
                    } else {
                        riveParams.src = "interactive/card.riv";
                    }

                    const riveInstance = new rive.Rive(riveParams);
                    card._riveInstance = riveInstance;
                } catch (e) {
                    console.log("Rive card initialization note:", e);
                }
            });
        });
    }

    cards.forEach((card) => {
        let isHovered = false;
        let targetX = 50;
        let targetY = 50;
        let currentX = 50;
        let currentY = 50;
        let animFrameId = null;

        function updateGlow() {
            // Smooth natural interpolation (spring-like inertia)
            currentX += (targetX - currentX) * 0.16;
            currentY += (targetY - currentY) * 0.16;

            card.style.setProperty("--cursor-x", `${currentX.toFixed(2)}%`);
            card.style.setProperty("--cursor-y", `${currentY.toFixed(2)}%`);

            if (isHovered || Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
                animFrameId = requestAnimationFrame(updateGlow);
            } else {
                animFrameId = null;
            }
        }

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            targetX = (x / rect.width) * 100;
            targetY = (y / rect.height) * 100;

            // Subtle dynamic 3D tilt towards cursor position
            const rotateX = ((y / rect.height) - 0.5) * -7;
            const rotateY = ((x / rect.width) - 0.5) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale(1.015)`;
            card.style.setProperty("--cursor-opacity", "1");

            // If Rive instance is active, update inputs
            if (card._riveInstance && card._riveInstance.stateMachineInputs) {
                try {
                    const inputs = card._riveInstance.stateMachineInputs("State Machine 1") || [];
                    inputs.forEach(input => {
                        const name = input.name.toLowerCase();
                        if (name.includes("x") || name.includes("horiz") || name.includes("ltor")) {
                            input.value = targetX;
                        } else if (name.includes("y") || name.includes("vert") || name.includes("utod")) {
                            input.value = targetY;
                        } else if (name.includes("hover")) {
                            input.value = true;
                        }
                    });
                } catch (_) {}
            }

            if (!animFrameId) {
                animFrameId = requestAnimationFrame(updateGlow);
            }
        });

        card.addEventListener("mouseenter", () => {
            isHovered = true;
            card.style.setProperty("--cursor-opacity", "1");
            if (!animFrameId) {
                animFrameId = requestAnimationFrame(updateGlow);
            }
        });

        card.addEventListener("mouseleave", () => {
            isHovered = false;
            targetX = 50;
            targetY = 50;
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
            card.style.setProperty("--cursor-opacity", "0");
        });
    });
}

/**
 * Animated Wavy Text-Follow-Path for Skills Section (Matching Reference Image)
 * Continuously flows bold white text along undulating wave curves with contour strokes
 */
function initWavySkillsText() {
    const textPath1 = document.getElementById("wavyTextPath1");
    const textPath2 = document.getElementById("wavyTextPath2");
    if (!textPath1 && !textPath2) return;

    let offset1 = 0;
    let offset2 = 0;
    const speed1 = 1.0;
    const speed2 = 1.0;
    const loopLength = 2400; // Exact repeating wavelength loop

    function animateWave() {
        offset1 -= speed1;
        offset2 += speed2;

        if (offset1 <= -loopLength) offset1 += loopLength;
        if (offset2 >= loopLength) offset2 -= loopLength;

        if (textPath1) textPath1.setAttribute("startOffset", `${offset1.toFixed(1)}px`);
        if (textPath2) textPath2.setAttribute("startOffset", `${offset2.toFixed(1)}px`);

        requestAnimationFrame(animateWave);
    }

    requestAnimationFrame(animateWave);
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
    // Lock site permanently to Clean Light Mode as requested
    document.body.classList.remove("dark-theme");
    localStorage.setItem("portfolio-theme", "light");
}

/**
 * 2. Scroll Reveal Animation using Intersection Observer
 * Adds the 'active' class to elements when they enter the viewport.
 * Includes fallback so elements never stay hidden on mobile or S3 deployment.
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach(element => element.classList.add("active"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.01,
        rootMargin: "50px 0px 50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Safety fallback: Ensure all elements are visible after page load
    setTimeout(() => {
        revealElements.forEach(element => {
            element.classList.add("active");
        });
    }, 1200);
}

/**
 * Realistic Interactive Draggable & Spring Pendulum Physics for Lanyard ID Badge
 * Allows user to pull, drag, and swing the ID card with physical spring momentum
 */
function initBadgeCardTilt() {
    const cardAssembly = document.getElementById("id-card-assembly") || document.getElementById("id-badge-card");
    const stageWrap = document.getElementById("badge-stage-wrap");
    const lanyardRibbon = document.getElementById("lanyard-ribbon");
    const dragHint = document.getElementById("badge-drag-hint");
    if (!cardAssembly || !stageWrap) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let vx = 0, vy = 0;
    let rot = 0, vRot = 0;
    let animId = null;

    const stiffness = 0.055; // Spring force pulling back to vertical origin
    const damping = 0.86;    // Air / lanyard ribbon friction
    const maxPullRadius = 150; // Max pull radius in px
    const baseRibbonHeight = 95; // Shortened clean lanyard strap length connecting top anchor to card clip

    function applyTransforms(x, y, rotationDeg) {
        // Transform the entire card assembly (Clip + Card moving together)
        cardAssembly.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotationDeg.toFixed(2)}deg)`;

        // Calculate ribbon angle & stretch from top anchor
        const totalY = baseRibbonHeight + y;
        const ribbonAngle = Math.atan2(x, totalY) * (180 / Math.PI);
        const distance = Math.sqrt(x * x + totalY * totalY);
        const scaleY = distance / baseRibbonHeight;
        const scaleX = 1 / Math.sqrt(Math.max(0.5, scaleY)); // Elastic thickness thinning

        if (lanyardRibbon) {
            lanyardRibbon.style.transform = `rotate(${ribbonAngle.toFixed(2)}deg) scaleY(${scaleY.toFixed(3)}) scaleX(${Math.max(0.7, scaleX).toFixed(3)})`;
        }
    }

    function springPhysicsLoop() {
        if (isDragging) return;

        // Acceleration towards (0, 0) and (0 deg)
        const ax = -stiffness * currentX;
        const ay = -stiffness * currentY;
        const aRot = -stiffness * rot;

        vx = (vx + ax) * damping;
        vy = (vy + ay) * damping;
        vRot = (vRot + aRot) * damping;

        currentX += vx;
        currentY += vy;
        rot += vRot;

        applyTransforms(currentX, currentY, rot);

        // Continue until motion settles down to zero
        if (Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1 || Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1 || Math.abs(rot) > 0.1) {
            animId = requestAnimationFrame(springPhysicsLoop);
        } else {
            currentX = 0;
            currentY = 0;
            rot = 0;
            vx = 0;
            vy = 0;
            vRot = 0;
            applyTransforms(0, 0, 0);
            animId = null;
        }
    }

    // Pointer Down (Mouse Click or Touch Start)
    function onPointerDown(e) {
        isDragging = true;
        if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }

        cardAssembly.classList.add("is-dragging");
        if (dragHint) {
            dragHint.style.opacity = "0";
            dragHint.style.pointerEvents = "none";
        }

        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

        startX = clientX - currentX;
        startY = clientY - currentY;

        window.addEventListener("pointermove", onPointerMove, { passive: false });
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
    }

    // Pointer Move (Dragging)
    function onPointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

        let rawX = clientX - startX;
        let rawY = clientY - startY;

        // Apply elastic circular resistance when pulling far
        const dist = Math.sqrt(rawX * rawX + rawY * rawY);
        if (dist > maxPullRadius) {
            const factor = maxPullRadius + (dist - maxPullRadius) * 0.35;
            rawX = (rawX / dist) * factor;
            rawY = (rawY / dist) * factor;
        }

        // Calculate velocity for natural release momentum
        vx = (rawX - currentX) * 0.6;
        vy = (rawY - currentY) * 0.6;

        currentX = rawX;
        currentY = rawY;

        // Card tilts naturally with drag displacement
        rot = (currentX / maxPullRadius) * 24;

        applyTransforms(currentX, currentY, rot);
    }

    // Pointer Up (Release) -> Trigger Spring Pendulum Physics
    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;

        cardAssembly.classList.remove("is-dragging");
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);

        // Add initial rotational momentum based on horizontal release speed
        vRot = (vx * 0.8) + (currentX * 0.05);

        if (!animId) {
            animId = requestAnimationFrame(springPhysicsLoop);
        }
    }

    cardAssembly.addEventListener("pointerdown", onPointerDown);

    // Subtle 3D perspective tilt on hover when not dragging
    stageWrap.addEventListener("mousemove", (e) => {
        if (isDragging || currentX !== 0 || currentY !== 0) return;
        const rect = cardAssembly.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - cardCenterX) / (rect.width / 2);
        const deltaY = (e.clientY - cardCenterY) / (rect.height / 2);

        const tiltX = -deltaY * 5;
        const tiltY = deltaX * 5;
        cardAssembly.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-3px)`;
    });

    stageWrap.addEventListener("mouseleave", () => {
        if (isDragging || currentX !== 0 || currentY !== 0) return;
        cardAssembly.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
}

/**
 * Smooth Navigation & Scroll-Driven Morphing Transitions for Page 2 & Page 3
 */
function initPageTransitions() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    const pageTwo = document.getElementById("editorial-statement");
    const heroCenter = document.querySelector(".hero-center-stage");
    const heroHeadline = document.querySelector(".about-editorial-heading");
    const heroSubtext = document.querySelector(".about-editorial-subtext");
    const heroCta = document.querySelector(".about-action-row");

    // Click handlers for smooth anchor link navigation
    scrollLinks.forEach(link => {
        const targetId = link.getAttribute("href");
        if (targetId && targetId.startsWith("#") && targetId.length > 1) {
            link.addEventListener("click", (e) => {
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    const headerOffset = targetId === "#editorial-statement" ? 0 : 30;
                    const elementPosition = targetElem.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        }
    });

    // Scroll-driven Parallax & Dynamic Arch Morphing Animation for Page 2
    let isTicking = false;
    function onScrollTransition() {
        if (!isTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const vh = window.innerHeight;

                if (scrollY <= 0) {
                    if (pageTwo) {
                        pageTwo.style.borderRadius = "0 0 0 0";
                        pageTwo.style.marginTop = "0px";
                    }
                    if (heroCenter) {
                        heroCenter.style.transform = "none";
                        heroCenter.style.opacity = "1";
                    }
                    if (heroHeadline) {
                        heroHeadline.style.opacity = "0.3";
                        heroHeadline.style.transform = "translateY(16px)";
                    }
                    if (heroSubtext) {
                        heroSubtext.style.opacity = "0.2";
                        heroSubtext.style.transform = "translateY(12px)";
                    }
                    if (heroCta) {
                        heroCta.style.opacity = "0.2";
                        heroCta.style.transform = "translateY(8px) scale(0.95)";
                    }
                } else {
                    const progress = Math.min(1, scrollY / (vh * 0.75));

                    // 1. Hero Pullback & Fade effect
                    if (heroCenter) {
                        const scale = 1 - progress * 0.06;
                        const translateY = progress * -35;
                        const opacity = Math.max(0, 1 - progress * 1.15);
                        heroCenter.style.transform = `translateY(${translateY}px) scale(${scale})`;
                        heroCenter.style.opacity = `${opacity}`;
                    }

                    // 2. Page 2 Morphing into Arched Dome Curve
                    if (pageTwo) {
                        const archCurve = Math.min(80, progress * 80);
                        const overlap = Math.min(40, progress * 40);
                        pageTwo.style.borderRadius = `50% 50% 0 0 / ${archCurve}px ${archCurve}px 0 0`;
                        pageTwo.style.marginTop = `-${overlap}px`;
                    }

                    // 3. Staggered Headline & Button Reveal
                    if (heroHeadline) {
                        const headProgress = Math.min(1, Math.max(0, (progress - 0.08) * 1.5));
                        heroHeadline.style.opacity = `${0.3 + headProgress * 0.7}`;
                        heroHeadline.style.transform = `translateY(${(1 - headProgress) * 16}px)`;
                    }
                    if (heroSubtext) {
                        const subProgress = Math.min(1, Math.max(0, (progress - 0.15) * 1.5));
                        heroSubtext.style.opacity = `${0.2 + subProgress * 0.8}`;
                        heroSubtext.style.transform = `translateY(${(1 - subProgress) * 12}px)`;
                    }
                    if (heroCta) {
                        const ctaProgress = Math.min(1, Math.max(0, (progress - 0.22) * 1.5));
                        heroCta.style.opacity = `${0.2 + ctaProgress * 0.8}`;
                        heroCta.style.transform = `translateY(${(1 - ctaProgress) * 8}px) scale(${0.95 + ctaProgress * 0.05})`;
                    }
                }
                isTicking = false;
            });
            isTicking = true;
        }
    }

    window.addEventListener("scroll", onScrollTransition, { passive: true });
    onScrollTransition();
}

/**
 * 3. Visitor Counter for AWS Cloud Resume / Portofolio
 * Fetches count from AWS Lambda + DynamoDB with IP-based Deduplication.
 */
async function initVisitorCounter() {
    const counterElement = document.getElementById("visitor-count");
    if (!counterElement) return;

    // URL API Gateway (AWS Lambda + DynamoDB)
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

            if (response.ok) {
                const data = await response.json();
                let parsedBody = data;
                if (data.body) {
                    parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
                }
                const count = parsedBody.visitor_count ?? parsedBody.count ?? data.visitor_count ?? data.count;

                if (count !== undefined && !isNaN(count)) {
                    animateCounter(counterElement, parseInt(count, 10));
                    return;
                }
            }
        } catch (error) {
            console.warn("Gagal menghubungi AWS API Gateway.", error);
        }
    }

    // FALLBACK LOKAL (Jika API offline/bermasalah)
    let localCount = parseInt(localStorage.getItem("cloud_resume_visits") || "1", 10);
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



/**
 * Project Carousel
 * Center-locked slider: active slide always centered in viewport.
 * Uses offsetLeft for pixel-accurate positioning (no gap bug).
 */
function initProjectCarousel() {
    const track    = document.getElementById("carouselTrack");
    const viewport = document.getElementById("carouselViewport");
    const prevBtn  = document.getElementById("carouselPrev");
    const nextBtn  = document.getElementById("carouselNext");
    const dotsEl   = document.getElementById("carouselDots");

    if (!track || !prevBtn || !nextBtn || !dotsEl) return;

    const slides = Array.from(track.querySelectorAll(".project-slide"));
    const dots   = Array.from(dotsEl.querySelectorAll(".carousel-dot"));
    const total  = slides.length;
    let current  = 0;

    // --- Compute translateX so that slide[index] is centered in viewport ---
    function calcOffset(index) {
        const slide = slides[index];
        if (!slide) return 0;
        const viewportW = viewport.clientWidth;
        const slideW    = slide.offsetWidth;
        // offsetLeft is the slide's left edge relative to the track
        const slideLeft = slide.offsetLeft;
        // We want: viewportCenter = slideLeft + slideW/2 - offset
        // => offset = slideLeft + slideW/2 - viewportW/2
        return Math.max(0, slideLeft + slideW / 2 - viewportW / 2);
    }

    function render(animate) {
        track.style.transition = animate
            ? "transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none";
        track.style.transform = `translateX(${-calcOffset(current)}px)`;

        slides.forEach((s, i) => s.classList.toggle("active", i === current));
        dots.forEach((d, i) => {
            d.classList.toggle("active", i === current);
            d.setAttribute("aria-selected", String(i === current));
        });

        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total - 1;
    }

    function goTo(index) {
        const next = Math.max(0, Math.min(index, total - 1));
        if (next === current) return;
        current = next;
        render(true);
    }

    // --- Events ---
    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener("click", () => goTo(i)));

    // Keyboard nav when section is in view
    document.addEventListener("keydown", (e) => {
        const sect = document.getElementById("projects");
        if (!sect) return;
        const r = sect.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
            if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(current - 1); }
            if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
        }
    });

    // Touch swipe
    let tx = 0, ty = 0;
    track.addEventListener("touchstart", e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    track.addEventListener("touchend",   e => {
        const dx = e.changedTouches[0].clientX - tx;
        const dy = e.changedTouches[0].clientY - ty;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40)
            goTo(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });

    // Debounced resize
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => render(false), 150); });

    // Initial paint — wait for fonts/images so offsetLeft is correct
    requestAnimationFrame(() => setTimeout(() => render(false), 100));
}





