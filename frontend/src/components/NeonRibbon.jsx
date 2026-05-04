import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const NeonRibbon = () => {
    const canvasRef = useRef(null);
    const { isDark } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- Configuration ---
        const STRAND_COUNT = 15;      // Number of lines in the cable
        const HISTORY_LENGTH = 30;    // How long the tail is
        const BASE_RADIUS = 15;       // How wide the cable spreads
        
        // --- State ---
        let width = 0;
        let height = 0;
        let frame = 0;

        // Mouse state
        const mouse = { x: 0, y: 0, vX: 0, vY: 0 };
        const target = { x: 0, y: 0 };

        // --- Class Definition ---
        class Strand {
            constructor(index) {
                this.index = index;
                this.x = window.innerWidth / 2;
                this.y = window.innerHeight / 2;
                this.history = [];
                // Higher index = slightly more lag (creates the whip effect)
                this.lag = 0.15 + (index / STRAND_COUNT) * 0.1;
                this.phaseOffset = (index / STRAND_COUNT) * Math.PI * 2;
            }

            update() {
                // 1. Calculate the ideal position around the mouse cursor
                const orbitRadius = BASE_RADIUS + Math.sin(frame * 0.05 + this.phaseOffset) * 10;
                const orbitX = target.x + Math.cos(frame * 0.02 + this.phaseOffset) * orbitRadius;
                const orbitY = target.y + Math.sin(frame * 0.02 + this.phaseOffset) * orbitRadius;

                // 2. Physics: Move current x/y towards orbit x/y with lerp
                this.x += (orbitX - this.x) * this.lag;
                this.y += (orbitY - this.y) * this.lag;

                // 3. Update History for the tail
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > HISTORY_LENGTH) {
                    this.history.shift();
                }
            }

            draw(context) {
                if (this.history.length < 2) return;

                context.beginPath();
                context.moveTo(this.history[0].x, this.history[0].y);

                for (let i = 1; i < this.history.length; i++) {
                    context.lineTo(this.history[i].x, this.history[i].y);
                }

                // --- Dynamic Coloring ---
                const speed = Math.abs(mouse.vX) + Math.abs(mouse.vY);
                const hue = (frame * 2 + this.index * (360 / STRAND_COUNT)) % 360;
                
                // Adjust for light mode: higher lightness and lower opacity
                const lightness = isDark ? (60 + Math.min(speed, 20)) : (75 + Math.min(speed, 15));
                const opacity = isDark ? 0.8 : 0.4;

                context.strokeStyle = `hsla(${hue}, 90%, ${lightness}%, ${opacity})`;
                context.lineWidth = isDark ? 3 : 1.5;
                context.lineCap = 'round';
                context.lineJoin = 'round';

                // Glow effect (Subtle in light mode)
                context.shadowBlur = isDark ? 15 : 8;
                context.shadowColor = `hsl(${hue}, 90%, 50%)`;

                context.stroke();
                context.shadowBlur = 0;
            }
        }

        // Initialize Strands
        let strands = [];
        const initStrands = () => {
            strands = [];
            for (let i = 0; i < STRAND_COUNT; i++) {
                strands.push(new Strand(i));
            }
        };

        initStrands();

        // --- Main Loop ---
        const animate = () => {
            mouse.vX = (target.x - mouse.x) * 0.1;
            mouse.vY = (target.y - mouse.y) * 0.1;
            mouse.x += mouse.vX;
            mouse.y += mouse.vY;

            frame++;

            ctx.clearRect(0, 0, width, height);
            
            // Adjust blending mode for light mode
            ctx.globalCompositeOperation = isDark ? 'lighter' : 'multiply';
            if (!isDark) ctx.globalAlpha = 0.6;

            strands.forEach(strand => {
                strand.update();
                strand.draw(ctx);
            });
            
            if (!isDark) ctx.globalAlpha = 1;

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e) => {
            target.x = e.clientX;
            target.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
};

export default NeonRibbon;
