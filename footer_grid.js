/**
 * FOOTER VIDEO GRID EFFECT
 * Replicates the "Luminous Lab" physics tick grid from the Hero section
 * and applies it to the footer video.
 */

(function initFooterGrid() {
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const section = document.getElementById('sectionFinal');
        if (!section) return;

        // Create Canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'footer-grid-canvas';
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1'; // Above video (z-0), below text (z-10)
        canvas.style.pointerEvents = 'none'; // Allow clicking through
        canvas.style.mixBlendMode = 'normal'; // Normal blend for better visibility

        // Insert as first child to be behind everything else but video
        section.insertBefore(canvas, section.firstChild);

        const ctx = canvas.getContext('2d');
        let width, height;
        let mouseX = -1000;
        let mouseY = -1000;

        // Grid Settings (Matching Hero)
        const gridSize = 60;
        const pointInfluence = 250;
        const friction = 0.9;
        const elasticity = 0.1;

        // Point Class
        class Point {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.originX = x;
                this.originY = y;
                this.vx = 0;
                this.vy = 0;
            }

            update() {
                // Distance from mouse
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Physics: Push away if close (Gravity well)
                if (dist < pointInfluence) {
                    const angle = Math.atan2(dy, dx);
                    const force = (pointInfluence - dist) / pointInfluence;
                    // Push away
                    const pushX = Math.cos(angle) * force * 15;
                    const pushY = Math.sin(angle) * force * 15;

                    this.vx -= pushX;
                    this.vy -= pushY;
                }

                // Spring back to origin
                const springX = (this.originX - this.x) * elasticity;
                const springY = (this.originY - this.y) * elasticity;

                this.vx += springX;
                this.vy += springY;

                // Apply velocity
                this.vx *= friction;
                this.vy *= friction;

                this.x += this.vx;
                this.y += this.vy;
            }
        }

        let gridRows = [];
        let rX = 0;
        let rY = 0;

        function initConnectedGrid() {
            gridRows = [];
            width = section.offsetWidth;
            height = section.offsetHeight;
            canvas.width = width;
            canvas.height = height;

            rX = Math.ceil(width / gridSize) + 1;
            rY = Math.ceil(height / gridSize) + 1;

            for (let y = 0; y < rY; y++) {
                let row = [];
                for (let x = 0; x < rX; x++) {
                    row.push(new Point(x * gridSize, y * gridSize));
                }
                gridRows.push(row);
            }
        }

        function drawConnected() {
            ctx.clearRect(0, 0, width, height);

            // Update all
            for (let y = 0; y < rY; y++) {
                for (let x = 0; x < rX; x++) {
                    gridRows[y][x].update();
                }
            }

            // Style (Visible White)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();

            // Draw Horizontal
            for (let y = 0; y < rY; y++) {
                ctx.moveTo(gridRows[y][0].x, gridRows[y][0].y);
                for (let x = 1; x < rX; x++) {
                    ctx.lineTo(gridRows[y][x].x, gridRows[y][x].y);
                }
            }

            // Draw Vertical
            for (let x = 0; x < rX; x++) {
                ctx.moveTo(gridRows[0][x].x, gridRows[0][x].y);
                for (let y = 1; y < rY; y++) {
                    ctx.lineTo(gridRows[y][x].x, gridRows[y][x].y);
                }
            }

            ctx.stroke();
        }

        function animate() {
            // Only animate if visible? 
            // For now, simple rAF loop is fine, performance cost is low
            drawConnected();
            requestAnimationFrame(animate);
        }

        // Listeners
        window.addEventListener('resize', initConnectedGrid);

        // Track mouse relative to the section/canvas
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        section.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });

        // Start
        initConnectedGrid();

        // Respect reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            animate();
        } else {
            // Static Draw for reduced motion
            setTimeout(() => {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 1;
                // Just draw lines without points update? Or run once.
                // Draw static grid lines simply
                ctx.beginPath();
                for (let y = 0; y < height; y += gridSize) {
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                }
                for (let x = 0; x < width; x += gridSize) {
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                }
                ctx.stroke();
            }, 100);
        }
    }
})();
