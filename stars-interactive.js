/* ====================================================================
   INTERACTIVE STARS BACKGROUND - INFINITEAURA STYLE (RESTORED)
   Real particle system with mouse interaction
   ==================================================================== */

class InteractiveStars {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.stars = [];
        this.mouse = { x: 0, y: 0 };
        this.isInitialized = false;
        this.animationId = null;
        this.config = {
            starCount: 150,
            maxDistance: 200,
            mouseInfluence: 100,
            starSizes: [0.5, 0.8, 1, 1.2],
            colors: [
                'rgba(255, 255, 255, 0.4)',
                'rgba(74, 144, 226, 0.3)',
                'rgba(107, 182, 255, 0.25)',
                'rgba(255, 255, 255, 0.2)'
            ]
        };
    }

    init() {
        this.createCanvas();
        this.createStars();
        this.bindEvents();
        this.animate();
        this.isInitialized = true;
    }

    createCanvas() {
        // Create canvas for each section that needs stars
        const sections = document.querySelectorAll('.stars-background');
        sections.forEach((section, index) => {
            const canvas = document.createElement('canvas');
            canvas.className = 'interactive-stars-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '1';
            section.innerHTML = '';
            section.appendChild(canvas);
            this.resizeCanvas(canvas);
            const ctx = canvas.getContext('2d');
            this.createStarsForSection(canvas, ctx, index);
        });
    }

    resizeCanvas(canvas) {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width || window.innerWidth;
        canvas.height = rect.height || window.innerHeight;
    }

    createStars() {
        // This will be called for each section
    }

    createStarsForSection(canvas, ctx, sectionIndex) {
        const stars = [];
        const starCount = this.config.starCount;
        for (let i = 0; i < starCount; i++) {
            const star = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                originalX: 0,
                originalY: 0,
                size: this.config.starSizes[Math.floor(Math.random() * this.config.starSizes.length)],
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                opacity: Math.random() * 0.3 + 0.1,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                moveSpeed: Math.random() * 0.5 + 0.2,
                canvas: canvas,
                ctx: ctx,
                sectionIndex: sectionIndex
            };
            star.originalX = star.x;
            star.originalY = star.y;
            stars.push(star);
        }
        if (!this.stars[sectionIndex]) {
            this.stars[sectionIndex] = stars;
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        window.addEventListener('scroll', () => {
            this.updateVisibleSections();
        }, { passive: true });
    }

    handleResize() {
        const canvases = document.querySelectorAll('.interactive-stars-canvas');
        canvases.forEach((canvas, index) => {
            this.resizeCanvas(canvas);
            const ctx = canvas.getContext('2d');
            this.createStarsForSection(canvas, ctx, index);
        });
    }

    updateVisibleSections() {
        const sections = document.querySelectorAll('.stars-background');
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (this.stars[index]) {
                this.stars[index].forEach(star => {
                    star.isVisible = isVisible;
                });
            }
        });
    }

    animate() {
        this.updateStars();
        this.drawStars();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateStars() {
        this.stars.forEach((sectionStars, sectionIndex) => {
            if (!sectionStars) return;
            sectionStars.forEach(star => {
                if (!star.isVisible && star.isVisible !== undefined) return;
                const section = star.canvas.parentElement;
                const rect = section.getBoundingClientRect();
                const mouseX = this.mouse.x - rect.left;
                const mouseY = this.mouse.y - rect.top;
                const dx = mouseX - star.x;
                const dy = mouseY - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.config.mouseInfluence) {
                    const force = (this.config.mouseInfluence - distance) / this.config.mouseInfluence;
                    const angle = Math.atan2(dy, dx);
                    star.x -= Math.cos(angle) * force * 2;
                    star.y -= Math.sin(angle) * force * 2;
                } else {
                    star.x += (star.originalX - star.x) * 0.02;
                    star.y += (star.originalY - star.y) * 0.02;
                }
                star.x = Math.max(0, Math.min(star.canvas.width, star.x));
                star.y = Math.max(0, Math.min(star.canvas.height, star.y));
                star.twinklePhase += star.twinkleSpeed;
                star.currentOpacity = star.opacity + Math.sin(star.twinklePhase) * 0.15;
                star.currentOpacity = Math.max(0.05, Math.min(0.5, star.currentOpacity));
            });
        });
    }

    drawStars() {
        this.stars.forEach((sectionStars, sectionIndex) => {
            if (!sectionStars || !sectionStars[0]) return;
            const canvas = sectionStars[0].canvas;
            const ctx = sectionStars[0].ctx;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            sectionStars.forEach(star => {
                if (!star.isVisible && star.isVisible !== undefined) return;
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 2
                );
                const baseColor = star.color.replace(/[\
