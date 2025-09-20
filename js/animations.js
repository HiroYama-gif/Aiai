/**
 * アニメーション制御システム
 * スクロールアニメーション、ホバーエフェクト、インタラクションを管理
 */

class AnimationController {
    constructor() {
        this.scrollElements = [];
        this.isScrolling = false;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupInteractions();
        this.setupParallax();
        this.startAnimationLoop();
    }
    
    // スクロールアニメーションのセットアップ
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px 150px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // 遅延アニメーション
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.style.animationDelay = delay + 'ms';
                    }, delay);
                }
            });
        }, observerOptions);
        
        // アニメーション対象要素の登録
        const animateElements = document.querySelectorAll(`
            .section-title,
            .section-underline,
            .detail-item,
            .about-text p,
            .main-title,
            .subtitle,
            .ornament-top,
            .ornament-bottom
        `);
        
        animateElements.forEach((el, index) => {
            el.classList.add('scroll-animate');
            el.dataset.delay = index * 100;
            observer.observe(el);
        });
        // cast-card専用のObserverを設定
        this.setupCastCardAnimation();
    }

    // cast-card専用のスクロールアニメーション
    setupCastCardAnimation() {
     const castObserverOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px 200px 0px'  // 画面下200px手前で発動
        };
    
        const castObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const castCards = entry.target.querySelectorAll('.cast-card');
                    castCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 50); // 50msずつ順次表示
                    });
                    castObserver.unobserve(entry.target);
                }
            });
        }, castObserverOptions);
    
        // cast-sectionを監視
        const castSection = document.querySelector('.cast-section');
        if (castSection) {
            castObserver.observe(castSection);
        }
    }

    
    // ホバーエフェクトのセットアップ
    setupHoverEffects() {
     // キャストカードの特殊エフェクト
        const castCards = document.querySelectorAll('.cast-card');
        castCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createSparkleEffect(card);
                this.addFloatingOrbs(card);
                // ハイライト効果を追加
                this.addCardHighlight(card);
            });
    
            card.addEventListener('mouseleave', () => {
                this.removeEffects(card);
                this.removeCardHighlight(card);
            });
        });

        
        // 詳細アイテムのマジックエフェクト
        const detailItems = document.querySelectorAll('.detail-item');
        detailItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.createMagicCircle(item);
            });
        });
        
        // リンクのグロウエフェクト
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.addLinkGlow(link);
            });
            
            link.addEventListener('mouseleave', () => {
                this.removeLinkGlow(link);
            });
        });
    }
    
    // インタラクション効果のセットアップ
    setupInteractions() {
        // タイトルクリック時のエフェクト
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) {
            mainTitle.addEventListener('click', () => {
                this.createTitleExplosion(mainTitle);
            });
        }
        
        // スクロール指示の動的制御
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled / (document.body.scrollHeight - window.innerHeight);
                scrollIndicator.style.opacity = Math.max(0, 1 - rate * 3);
            });
        }
        
        // カーソル追従エフェクト
        this.setupCursorEffects();
    }
    
    // パララックス効果のセットアップ
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element, .decorative-frame');
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax(parallaxElements);
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
    
    updateParallax(elements) {
        const scrollTop = window.pageYOffset;
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // スパークルエフェクトの作成
    createSparkleEffect(element) {
        const sparkleCount = 8;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-particle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ff1493;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 0 10px #ff1493;
            `;
            
            const rect = element.getBoundingClientRect();
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            document.body.appendChild(sparkle);
            
            // アニメーション
            sparkle.animate([
                { 
                    transform: 'scale(0) rotate(0deg)',
                    opacity: 0
                },
                { 
                    transform: 'scale(1) rotate(180deg)',
                    opacity: 1,
                    offset: 0.5
                },
                { 
                    transform: 'scale(0) rotate(360deg)',
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => sparkle.remove();
        }
    }
    
    // フローティングオーブの追加
    addFloatingOrbs(element) {
        const orbCount = 3;
        for (let i = 0; i < orbCount; i++) {
            const orb = document.createElement('div');
            orb.className = 'floating-orb-particle';
            orb.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(255, 20, 147, 0.8), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 999;
                animation: floatingOrb ${3 + i}s ease-in-out infinite;
                animation-delay: ${i * 0.5}s;
            `;
            
            const rect = element.getBoundingClientRect();
            orb.style.left = (rect.left + Math.random() * rect.width) + 'px';
            orb.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(orb);
            element._orbs = element._orbs || [];
            element._orbs.push(orb);
        }
    }
    
    // マジックサークルの作成
    createMagicCircle(element) {
        const circle = document.createElement('div');
        circle.className = 'magic-circle';
        circle.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            border: 2px solid rgba(255, 20, 147, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 998;
            animation: magicCircle 2s ease-in-out infinite;
        `;
        
        const rect = element.getBoundingClientRect();
        circle.style.left = (rect.left + rect.width / 2 - 50) + 'px';
        circle.style.top = (rect.top + rect.height / 2 - 50) + 'px';
        
        document.body.appendChild(circle);
        element._magicCircle = circle;
        
        setTimeout(() => {
            if (circle.parentNode) {
                circle.remove();
            }
        }, 2000);
    }
    
    // エフェクトの除去
    removeEffects(element) {
        if (element._orbs) {
            element._orbs.forEach(orb => orb.remove());
            element._orbs = [];
        }
        
        if (element._magicCircle) {
            element._magicCircle.remove();
            element._magicCircle = null;
        }
    }
    
    // リンクグロウエフェクト
    addLinkGlow(link) {
        link.style.transition = 'all 0.3s ease';
        link.style.textShadow = '0 0 15px #ff1493, 0 0 25px rgba(255, 20, 147, 0.5)';
        link.style.transform = 'scale(1.05)';
    }
    
    removeLinkGlow(link) {
        link.style.textShadow = '0 0 10px rgba(255, 20, 147, 0.8)';
        link.style.transform = 'scale(1)';
    }
    
    // タイトル爆発エフェクト
    createTitleExplosion(title) {
        const particleCount = 20;
        const rect = title.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: #ff1493;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1001;
                box-shadow: 0 0 15px #ff1493;
            `;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 100 + Math.random() * 100;
            const duration = 1000 + Math.random() * 1000;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
    
    // カーソルエフェクト
    setupCursorEffects() {
        let cursor = null;
        
        document.addEventListener('mousemove', (e) => {
            if (!cursor) {
                cursor = document.createElement('div');
                cursor.style.cssText = `
                    position: fixed;
                    width: 20px;
                    height: 20px;
                    background: radial-gradient(circle, rgba(255, 20, 147, 0.8), transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    mix-blend-mode: screen;
                    transition: transform 0.1s ease;
                `;
                document.body.appendChild(cursor);
            }
            
            cursor.style.left = (e.clientX - 10) + 'px';
            cursor.style.top = (e.clientY - 10) + 'px';
        });
        
        // ホバー可能要素でのカーソル変更
        const hoverElements = document.querySelectorAll('a, button, .cast-card, .detail-item');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (cursor) {
                    cursor.style.transform = 'scale(2)';
                    cursor.style.background = 'radial-gradient(circle, rgba(255, 20, 147, 0.4), rgba(255, 105, 180, 0.2))';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                if (cursor) {
                    cursor.style.transform = 'scale(1)';
                    cursor.style.background = 'radial-gradient(circle, rgba(255, 20, 147, 0.8), transparent)';
                }
            });
        });
    }
    
    // メインアニメーションループ
    startAnimationLoop() {
        const animate = () => {
            // 継続的なアニメーション処理
            this.updateGlowEffects();
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    // グロウエフェクトの更新
    updateGlowEffects() {
        const time = Date.now() * 0.001;
        const glowElements = document.querySelectorAll('.title-glow, .section-title');
        
        glowElements.forEach((element, index) => {
            const intensity = Math.sin(time + index * 0.5) * 0.3 + 0.7;
            element.style.filter = `brightness(${intensity})`;
        });
    }

    // カードハイライト効果の追加
    addCardHighlight(card) {
        // グロー効果のオーバーレイを作成
        const glowOverlay = document.createElement('div');
        glowOverlay.className = 'card-glow-overlay';
        glowOverlay.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, 
               rgba(255, 20, 147, 0.3), 
               rgba(255, 105, 180, 0.2), 
               rgba(255, 20, 147, 0.3));
            border-radius: 22px;
            opacity: 0;
            z-index: -1;
            transition: opacity 0.3s ease;
            animation: cardGlowPulse 2s ease-in-out infinite alternate;
        `;
    
        card.style.position = 'relative';
        card.appendChild(glowOverlay);
    
        // フェードイン
        setTimeout(() => {
            glowOverlay.style.opacity = '1';
        }, 50);
    
        card._glowOverlay = glowOverlay;
    }

    // カードハイライト効果の除去
    removeCardHighlight(card) {
        if (card._glowOverlay) {
            card._glowOverlay.style.opacity = '0';
            setTimeout(() => {
                if (card._glowOverlay && card._glowOverlay.parentNode) {
                    card._glowOverlay.remove();
                    card._glowOverlay = null;
             }
            }, 300);
        }
    }

}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});