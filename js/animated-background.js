// Animated Background with Particles - Romario Burgues Style
class AnimatedBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'animated-background';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        // Insert canvas as first child of body
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = 150; // Fixo em 150 partículas
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 50, // Start from bottom
                size: Math.random() * 4 + 1, // Tamanhos de 2-8px (maiores)
                speedX: (Math.random() - 0.5) * 2, // Movimento lateral mais variado
                speedY: -(Math.random() * 2.5 + 0.8), // Movimento ascendente natural
                opacity: Math.random() * 0.8 + 0.2,
                hue: Math.random() * 60 + 0, // Laranja, amarelo e vermelho (0-60)
                saturation: Math.random() * 30 + 80, // 80-100% saturação
                lightness: Math.random() * 40 + 40, // 40-80% luminosidade
                life: 1,
                decay: Math.random() * 0.012 + 0.002, // Opacidade diminui gradualmente
                flicker: Math.random() * 0.4 + 0.6, // Efeito de brilho
                glowIntensity: Math.random() * 0.5 + 0.5 // Intensidade do brilho
            });
        }
    }

    drawBackground() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#030236');    // Brand blue at top
        gradient.addColorStop(0.5, '#440917');  // Dark red in middle
        gradient.addColorStop(1, '#980013');    // Darker red at bottom
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Movement - brasas rising up
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= particle.decay;
            
            // Fire effect - color changes as it rises
            particle.hue += Math.random() * 2 - 1; // Random hue variation
            if (particle.hue < 0) particle.hue = 0;
            if (particle.hue > 50) particle.hue = 50;
            
            // Flickering size effect
            particle.flicker += (Math.random() - 0.5) * 0.1;
            particle.flicker = Math.max(0.5, Math.min(1.2, particle.flicker));
            
            // Reset particle when it goes off screen or dies
            if (particle.y < 0 || particle.life <= 0) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = this.canvas.height + Math.random() * 50;
                particle.life = 1;
                particle.hue = Math.random() * 60 + 0; // Laranja, amarelo e vermelho
                particle.saturation = Math.random() * 20 + 80;
                particle.lightness = Math.random() * 40 + 40;
                particle.speedY = -(Math.random() * 2.5 + 0.8);
                particle.speedX = (Math.random() - 0.5) * 2;
                particle.size = Math.random() * 6 + 2;
                particle.glowIntensity = Math.random() * 0.5 + 0.5;
                particle.flicker = Math.random() * 0.4 + 0.6;
            }
            
            // Horizontal wrapping
            if (particle.x < -10) particle.x = this.canvas.width + 10;
            if (particle.x > this.canvas.width + 10) particle.x = -10;
            
            // Draw particle with enhanced fire effect
            const alpha = particle.life * particle.opacity;
            const lightness = Math.min(80, particle.lightness + (particle.life * 20));
            const currentSize = particle.size * particle.flicker;
            const glowSize = currentSize * particle.glowIntensity;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            
            // Outer glow (brilho externo)
            this.ctx.fillStyle = `hsl(${particle.hue}, ${particle.saturation}%, ${Math.min(90, lightness + 30)}%)`;
            this.ctx.shadowBlur = glowSize * 3;
            this.ctx.shadowColor = `hsl(${particle.hue}, ${particle.saturation}%, ${lightness}%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Middle layer (camada intermediária)
            this.ctx.shadowBlur = glowSize * 1.5;
            this.ctx.fillStyle = `hsl(${Math.min(60, particle.hue + 15)}, ${particle.saturation}%, ${Math.min(85, lightness + 25)}%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentSize * 0.8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner core (núcleo interno)
            this.ctx.shadowBlur = glowSize * 0.8;
            this.ctx.fillStyle = `hsl(${Math.min(60, particle.hue + 25)}, ${Math.min(100, particle.saturation + 10)}%, ${Math.min(95, lightness + 40)}%)`;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentSize * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBackground();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            // Recreate particles for new canvas size
            this.particles = [];
            this.createParticles();
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize animated background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimatedBackground();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimatedBackground;
}