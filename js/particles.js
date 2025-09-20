/**
 * パーティクルシステム - 背景に浮遊する光のパーティクル
 */

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.setupEvents();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }
    
    setupEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 背景グラデーション
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(26, 10, 26, 0.8)');
        gradient.addColorStop(0.5, 'rgba(10, 10, 10, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // パーティクルの更新と描画
        this.particles.forEach((particle, index) => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
            
            // パーティクルが画面外に出たら新しいものを作成
            if (particle.y < -50) {
                this.particles[index] = new Particle(this.canvas);
            }
        });
        
        // パーティクル同士の接続線
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
                );
                
                if (distance < 150) {
                    const opacity = 1 - (distance / 150);
                    this.ctx.strokeStyle = `rgba(255, 20, 147, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.life = Math.random();
        this.decay = Math.random() * 0.02 + 0.005;
        this.glowIntensity = Math.random() * 0.5 + 0.5;
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + 50;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -(Math.random() * 2 + 0.5);
        this.size = Math.random() * 3 + 1;
        this.baseSize = this.size;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }
    
    getRandomColor() {
        const colors = [
            { r: 255, g: 20, b: 147 },   // ネオンピンク
            { r: 255, g: 105, b: 180 },  // ホットピンク
            { r: 221, g: 160, b: 221 },  // プラム
            { r: 255, g: 255, b: 255 },  // 白
            { r: 138, g: 43, b: 226 }    // ブルーバイオレット
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(mouse) {
        // 基本的な移動
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        // マウスの影響
        const mouseDistance = Math.sqrt(
            Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2)
        );
        
        if (mouseDistance < 100) {
            const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
            const force = (100 - mouseDistance) / 100;
            this.vx += Math.cos(angle) * force * 0.02;
            this.vy += Math.sin(angle) * force * 0.02;
            this.size = this.baseSize * (1 + force * 0.5);
            this.glowIntensity = Math.min(1, this.glowIntensity + force * 0.1);
        } else {
            this.size = this.baseSize;
            this.glowIntensity = Math.max(0.5, this.glowIntensity - 0.01);
        }
        
        // 速度の減衰
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // ライフサイクル
        this.life -= this.decay;
        if (this.life <= 0) {
            this.reset();
            this.life = 1;
        }
        
        // 境界での反射
        if (this.x < 0 || this.x > this.canvas.width) {
            this.vx *= -0.8;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        const alpha = this.life * this.glowIntensity;
        
        // グロー効果
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
        ctx.shadowBlur = this.size * 4;
        
        // メインパーティクル
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // 外側のグロー
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 内側のコア
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // キラキラ効果
        if (Math.random() < 0.1) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
});