document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // SECTION 01 — Hero Opening Animation
    // ============================================
    const chars = document.querySelectorAll('.portfolio-text .char');
    const portrait = document.querySelector('.portrait-container');
    
    // Final layout elements
    const finalLayout = document.querySelector('.s1-final-layout');
    const f1Name = document.querySelector('.f1-name');
    const f1Sections = document.querySelectorAll('.f1-sec');
    const f1Apply = document.querySelector('.f1-apply');

    // === INITIAL STATES ===
    chars.forEach(char => {
        gsap.set(char, {
            x: () => gsap.utils.random(-300, 300),
            y: () => gsap.utils.random(-200, 200),
            rotation: () => gsap.utils.random(-20, 20),
            scale: () => gsap.utils.random(0.8, 1.5),
            opacity: 0,
            filter: 'blur(8px)'
        });
    });
    gsap.set(portrait, { y: 30, opacity: 0 });
    // Final layout starts visible to DOM for layout calculation, but completely transparent
    gsap.set(finalLayout, { visibility: 'visible', opacity: 0, pointerEvents: 'none' });
    gsap.set(f1Name, { opacity: 0, y: -40 });
    gsap.set(f1Sections, { opacity: 0, y: 30 });
    gsap.set(f1Apply, { opacity: 0, y: 20 });

    // Parallax flag — disable after Phase 1
    let parallaxEnabled = true;

    // === MASTER TIMELINE ===
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // ── PHASE 1: PORTFOLIO assembles, portrait fades in ──
    heroTl.addLabel("start", 0)
    .to(chars, {
        duration: 2.5,
        x: 0, y: 0, rotation: 0, scale: 1,
        opacity: 1, filter: 'blur(0px)',
        stagger: { amount: 0.8, from: "random" }
    }, "start+=0.2")
    .to(portrait, {
        duration: 2, opacity: 1, y: 0,
        ease: "power2.out"
    }, "start+=1.0")

    // ── PHASE 2: Transition starts strictly at 3.2s (reduced wait time) ──
    .addLabel("scene2", "start+=3.2")
    
    // Disable parallax before transitioning
    .add(() => { parallaxEnabled = false; }, "scene2")

    // 0.0–0.6s: PORTFOLIO sinks & fades
    .to('.portfolio-text-wrap', {
        y: 120, opacity: 0,
        duration: 0.8,
        ease: "power2.in"
    }, "scene2")

    // Show the final layout container (make it visible & active)
    .add(() => {
        gsap.set(finalLayout, { opacity: 1, pointerEvents: 'auto' });
    }, "scene2+=0.4")

    // 0.4–1.0s: Name appears at top
    .to(f1Name, {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "scene2+=0.4")

    // 0.4–1.9s: Portrait slowly fades out instead of moving
    .to(portrait, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut"
    }, "scene2+=0.4")

    // 0.8–2.0s: Three sections reveal simultaneously, a bit slower
    .to(f1Sections, {
        opacity: 1, y: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: "power2.out"
    }, "scene2+=0.8")

    // 1.8–2.5s: Apply section reveals
    .to(f1Apply, {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: "power2.out"
    }, "scene2+=1.8");


    // ============================================
    // Hero Mouse Parallax (Desktop) — only during Phase 1
    // ============================================
    if (window.matchMedia("(min-width: 1024px)").matches) {
        const heroSection = document.querySelector('#section-01');

        heroSection.addEventListener('mousemove', (e) => {
            if (!parallaxEnabled) return; // Stop after Phase 1
            const xAxis = (window.innerWidth / 2 - e.pageX) / 80;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 80;

            gsap.to('.portrait-img', {
                x: xAxis * 1.5,
                duration: 1, ease: "power1.out"
            });
            gsap.to('.portfolio-text', {
                x: xAxis * -0.5, y: yAxis * -0.5,
                duration: 1, ease: "power1.out"
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            if (!parallaxEnabled) return;
            gsap.to('.portrait-img', { x: 0, duration: 1, ease: "power2.out" });
            gsap.to('.portfolio-text', { x: 0, y: 0, duration: 1, ease: "power2.out" });
        });
    }


    // ============================================
    // FLOATING NAVIGATION
    // ============================================
    const navItems = document.querySelectorAll('.nav-item');
    const mainNav = document.getElementById('main-nav');
    const allSections = document.querySelectorAll('[data-section]');

    // 1. ScrollSpy (Active item detection)
    allSections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => updateNav(section.dataset.section),
            onEnterBack: () => updateNav(section.dataset.section)
        });
    });

    function updateNav(sectionId) {
        navItems.forEach(item => {
            if (item.dataset.target === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 2. Smooth Scroll on Click
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. Navigation Scrolled State
    ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: { className: 'scrolled', targets: mainNav }
    });


    // ============================================
    // SCROLL-TRIGGERED ANIMATIONS (Generic)
    // ============================================

    // Fade-up elements
    gsap.utils.toArray('.anim-fade-up').forEach(el => {
        gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 95%",
                toggleActions: "play none none none"
            }
        });
    });

    // ============================================
    // SECTION 03 — Editorial Typography Animation
    // ============================================
    const s3Section = document.querySelector('.s3');
    if (s3Section) {
        const s3Tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.s3-inner',
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });

        // 1. Main title fades in and moves upward slightly
        s3Tl.from('.anim-s3-up', {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
        // 2. The three sections appear sequentially
        .from('.anim-s3-stagger', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.4")
        // 3. Process line draws itself
        .to('.s3-p-line-fill', {
            width: '100%',
            duration: 1.2,
            ease: "power2.inOut"
        }, "-=0.2")
        // 4. Keywords subtly brighten
        .from('.s3-kw, .s3-kw-box', {
            opacity: 0.4,
            color: "rgba(2, 19, 176, 0.4)", // Fade from muted to primary
            duration: 1,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=1.0")
        // 5. Final statement appears last
        .from('.anim-s3-final', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5");
    }

    // ============================================
    // SECTION 04 — Pathway Line Animation
    // ============================================
    const pathwaySide = document.querySelector('.s4-pathway-side');
    if (pathwaySide) {
        gsap.to('.pathway-line-fill', {
            height: '100%',
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: pathwaySide,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    }


    // ============================================
    // SECTION 05 — Commitment Animations
    // ============================================
    const s5Section = document.querySelector('.s5-inner');
    if (s5Section) {
        const s5Tl = gsap.timeline({
            scrollTrigger: {
                trigger: s5Section,
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });

        // 1 & 2. COMMITMENT and subtitle fade upward
        s5Tl.from('.anim-s5-up', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        })
        // 3. Image gently fades in
        .from('.anim-s5-img', {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut"
        }, "-=0.4")
        // 4. Process line appears and draws
        .from('.anim-s5-flow', {
            opacity: 0,
            duration: 0.5
        }, "-=0.6")
        .to('.f-l-fill', {
            width: '100%',
            duration: 1,
            ease: "power1.inOut"
        }, "-=0.3")
        // 5. Commitment points reveal sequentially
        .from('.anim-s5-point', {
            x: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.8")
        // 6. Final statement fades in
        .from('.anim-s5-final', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.2")
        // 7. Contact bar appears last
        .from('.anim-s5-contact', {
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.4");
    }

});
