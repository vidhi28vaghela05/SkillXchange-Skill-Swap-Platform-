import React, { useEffect, useRef } from 'react';

const NeonRibbon = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const points = useRef([]);
  const MAX_POINTS = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Add point to history
      points.current.push({ x: e.clientX, y: e.clientY });
      if (points.current.length > MAX_POINTS) {
        points.current.shift();
      }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    resizeCanvas();

    const colors = [
      '#FF0080', // Fuchsia
      '#7928CA', // Purple
      '#0070F3', // Blue
      '#00DFD8', // Cyan
      '#FF4D4D', // Red
    ];

    const drawLine = (offset, color, width) => {
      if (points.current.length < 3) return;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Apply a shadow for neon effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;

      ctx.moveTo(points.current[0].x + offset.x, points.current[0].y + offset.y);

      for (let i = 1; i < points.current.length - 2; i++) {
        const xc = (points.current[i].x + points.current[i + 1].x) / 2;
        const yc = (points.current[i].y + points.current[i + 1].y) / 2;
        ctx.quadraticCurveTo(
          points.current[i].x + offset.x, 
          points.current[i].y + offset.y, 
          xc + offset.x, 
          yc + offset.y
        );
      }

      // Finish the curve
      const last = points.current.length - 1;
      ctx.quadraticCurveTo(
        points.current[last - 1].x + offset.x,
        points.current[last - 1].y + offset.y,
        points.current[last].x + offset.x,
        points.current[last].y + offset.y
      );

      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.current.length > 0) {
        // Draw multiple lines to create the ribbon effect
        drawLine({ x: -10, y: -5 }, colors[0], 2);
        drawLine({ x: -5, y: 0 }, colors[1], 1.5);
        drawLine({ x: 0, y: 5 }, colors[2], 1);
        drawLine({ x: 5, y: 10 }, colors[3], 1.5);
        drawLine({ x: 10, y: 15 }, colors[4], 2);
      }

      // Slowly remove points to create a trailing effect even if mouse stops
      if (points.current.length > 0) {
        // points.current.shift(); // Optional: more aggressive fade
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-60"
      style={{ filter: 'blur(2px)' }}
    />
  );
};

export default NeonRibbon;
