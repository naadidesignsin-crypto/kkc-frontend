import { useEffect, useRef } from 'react';
import galaxyBg from '../assets/galaxy-bg.png';

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

const STAR_COUNT_DESKTOP = 110;
const STAR_COUNT_MOBILE = 65;
const CONNECTION_DISTANCE = 130;

function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId = 0;
    let stars: Star[] = [];

    const createStars = () => {
      const isMobile = width < 768;
      const count = isMobile ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 1.35 + 0.35,
        alpha: Math.random() * 0.55 + 0.35
      }));
    };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      createStars();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > width) star.vx *= -1;
        if (star.y < 0 || star.y > height) star.vy *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 209, 122, ${star.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < stars.length; i += 1) {
        for (let j = i + 1; j < stars.length; j += 1) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(214, 170, 82, ${opacity})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      animationId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="galaxy-layer" aria-hidden="true">
      <img className="galaxy-image" src={galaxyBg} alt="" />
      <canvas ref={canvasRef} className="star-canvas" />
      <div className="gold-vignette" />
    </div>
  );
}

export default GalaxyBackground;
