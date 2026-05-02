// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Lock scroll during preloader
    document.documentElement.classList.add('no-scroll');

    // 2. Preloader Animation
    const preloaderTl = gsap.timeline({
        onComplete: () => {
            document.documentElement.classList.remove('no-scroll');
            initHeroAnimations();
            initScrollAnimations();
        }
    });

    preloaderTl.to('.preloader-bar', {
        width: '100%',
        duration: 1.5,
        ease: 'power3.inOut'
    })
    .fromTo('.pre-sumith', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.5")
    .fromTo('.pre-pk', { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.6")
    .to('.preloader-text', { scale: 1.1, opacity: 0, duration: 0.6, ease: 'power2.inOut', delay: 0.3 })
    .to('#preloader', {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut'
    })
    .to('.nav-container', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, "-=0.5");

    // 3. Custom Cursor & Magnetic Effect
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    if (window.innerWidth > 768) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: function() {
                posX += (mouseX - posX) / 9;
                posY += (mouseY - posY) / 9;
                
                gsap.set(follower, { css: { left: posX, top: posY } });
                gsap.set(cursor, { css: { left: mouseX, top: mouseY } });
            }
        });

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Interactive hover states
        const interactables = document.querySelectorAll('a, button, video, iframe');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Magnetic Buttons & Nav Links
        const magneticElements = document.querySelectorAll('.magnetic-btn, .magnetic-nav');
        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-magnetic'));
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-magnetic');
                gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
            });
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
        });
    }

    // 4. Hero Animations Setup
    function initHeroAnimations() {
        // Split Type for Hero
        const heroText = new SplitType('.split-text-hero', { types: 'chars, words' });
        
        const heroTl = gsap.timeline();
        
        heroTl.fromTo('.profile-ring', 
            { scale: 0, rotation: -90, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "back.out(1.5)" }
        )
        .fromTo('.hero-subtitle', 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
            "-=0.6"
        )
        .fromTo(heroText.chars, 
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: "power4.out" },
            "-=0.6"
        )
        .fromTo('.hero-desc', 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
            "-=0.4"
        )
        .fromTo('.hero-buttons a', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power3.out" }, 
            "-=0.4"
        );

        // Background Parallax & Speed Lines tying to mouse
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            gsap.to('.speed-line', {
                x: x * 2,
                y: y * 2,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    // 5. Scroll Animations (SplitText & Reveals)
    function initScrollAnimations() {
        // Counter Animation for About section stats
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            gsap.to(counter, {
                innerHTML: target,
                duration: 2.5,
                snap: { innerHTML: 1 },
                ease: "power2.out",
                scrollTrigger: {
                    trigger: counter,
                    start: "top 90%",
                    once: true
                },
                onUpdate: function() {
                    counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                }
            });
        });

        // Split Text headers
        const splitHeaders = document.querySelectorAll('.split-text');
        splitHeaders.forEach(header => {
            const split = new SplitType(header, { types: 'chars' });
            gsap.fromTo(split.chars, 
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: header,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Simple Reveals
        const revealElements = document.querySelectorAll('.reveal-up, .gsap-reveal');
        revealElements.forEach((el) => {
            gsap.fromTo(el, 
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Portfolio Video Hover Effects using Motion One
        if (window.motion) {
            const { hover, spring, animate } = window.motion;
            
            document.querySelectorAll('article.group').forEach(article => {
                hover(article, (element) => {
                    animate(element, { scale: 1.02 }, { easing: spring({ stiffness: 300, damping: 20 }) });
                    return () => {
                        animate(element, { scale: 1 }, { easing: spring({ stiffness: 300, damping: 20 }) });
                    };
                });
            });

            document.querySelectorAll('#skills .group').forEach(skill => {
                hover(skill, (element) => {
                    animate(element, { y: -10 }, { easing: spring({ stiffness: 300, damping: 15 }) });
                    return () => {
                        animate(element, { y: 0 }, { easing: spring({ stiffness: 300, damping: 15 }) });
                    };
                });
            });
        }
    }

    // Navbar active state logic based on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const reelFrames = document.querySelectorAll('.reel-frame');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        // Also highlight reel frames
        reelFrames.forEach(frame => {
            frame.classList.remove('active');
            if (frame.getAttribute('href').includes(current)) {
                frame.classList.add('active');
            }
        });
    });

    // 7. Mobile Reel Menu Toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const reelMenu = document.getElementById('mobile-reel-menu');
    const navContainer = document.querySelector('.nav-container');
    let menuOpen = false;

    if (menuToggle && reelMenu) {
        menuToggle.addEventListener('click', () => {
            menuOpen = !menuOpen;
            if (menuOpen) {
                reelMenu.classList.add('reel-open');
                navContainer.classList.add('menu-open');
                document.body.classList.add('no-scroll');
            } else {
                closeReelMenu();
            }
        });

        // Close menu when a reel frame link is clicked
        reelFrames.forEach(frame => {
            frame.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = frame.getAttribute('href');
                closeReelMenu();
                // Small delay to let menu close animation start, then scroll
                setTimeout(() => {
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
            });
        });

        // Close on backdrop click
        const backdrop = reelMenu.querySelector('.reel-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                closeReelMenu();
            });
        }
    }

    function closeReelMenu() {
        menuOpen = false;
        reelMenu.classList.remove('reel-open');
        navContainer.classList.remove('menu-open');
        document.body.classList.remove('no-scroll');
        // Reset frame animations for next open
        reelFrames.forEach(frame => {
            frame.style.opacity = '0';
            frame.style.transform = 'translateY(20px)';
        });
    }
});
