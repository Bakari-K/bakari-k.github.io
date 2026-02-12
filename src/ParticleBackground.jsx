import { useEffect, useRef } from 'react';
import './ParticleBackground.css';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.6 + 0.4;
        
        // Random orange shades
        const colors = [
          { r: 249, g: 115, b: 22 },   // #F97316
          { r: 251, g: 146, b: 60 },   // #FB923C
          { r: 253, g: 186, b: 116 },  // #FDBA74
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Some particles twinkle
        this.twinkle = Math.random() > 0.7;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // Reset if out of bounds
        if (this.y > canvas.height + 10) {
          this.reset();
        }
        if (this.x < -10 || this.x > canvas.width + 10) {
          this.x = Math.random() * canvas.width;
        }

        // Twinkle effect
        if (this.twinkle) {
          this.opacity = 0.3 + Math.abs(Math.sin(Date.now() * this.twinkleSpeed + this.twinkleOffset)) * 0.5;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.fill();

        // Add subtle glow
        if (this.size > 1.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.1})`;
          ctx.fill();
        }
      }
    }

    // Create particles (not too many - subtle effect)
    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-background" />;
};

export default ParticleBackground;
