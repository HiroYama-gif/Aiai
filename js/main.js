/**
 * メインJavaScriptファイル
 * 全体的な機能とユーザーインタラクションを管理
 */

class MainController {
    constructor() {
        this.isLoading = true;
        this.scrollPosition = 0;
        this.isNavOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupPageLoader();
        this.setupSmoothScrolling();
        this.setupNavigationEffects();
        this.setupResponsiveHandling();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
        this.setupEasterEggs();
    }
    
    // ページローダーのセットアップ
    setupPageLoader() {
        // ローディング画面の作成
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-title">待合室藍愛</div>
                <div class="loader-subtitle">Loading...</div>
                <div class="loader-progress">
                    <div class="progress-bar"></div>
                </div>
                <div class="loader-sparkles">
                    ${Array.from({length: 6}, (_, i) => `<div class="sparkle sparkle-${i}"></div>`).join('')}
                </div>
            </div>
        `;
        
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 1s ease, visibility 1s ease;
        `;
        
        document.body.appendChild(loader);
        
        // ローダーのスタイルを追加
        const loaderStyles = document.createElement('style');
        loaderStyles.innerHTML = `
            .loader-content {
                text-align: center;
                position: relative;
            }
            
            .loader-title {
                font-family: 'Cinzel', serif;
                font-size: 3rem;
                color: #ff1493;
                text-shadow: 0 0 30px rgba(255, 20, 147, 0.8);
                margin-bottom: 1rem;
                animation: loaderTitleGlow 2s ease-in-out infinite alternate;
            }
            
            .loader-subtitle {
                font-family: 'Noto Serif JP', serif;
                color: #cccccc;
                font-size: 1.2rem;
                margin-bottom: 2rem;
                opacity: 0.8;
            }
            
            .loader-progress {
                width: 300px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
                margin: 0 auto 2rem;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #ff1493, #ff69b4);
                border-radius: 2px;
                animation: loadingProgress 3s ease-in-out infinite;
                box-shadow: 0 0 10px rgba(255, 20, 147, 0.5);
            }
            
            .loader-sparkles {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                height: 400px;
            }
            
            .sparkle {
                position: absolute;
                width: 6px;
                height: 6px;
                background: #ff1493;
                border-radius: 50%;
                box-shadow: 0 0 15px #ff1493;
            }
            
            .sparkle-0 { top: 20%; left: 50%; animation: sparkleFloat 2s ease-in-out infinite; }
            .sparkle-1 { top: 80%; left: 50%; animation: sparkleFloat 2s ease-in-out infinite 0.3s; }
            .sparkle-2 { top: 50%; left: 20%; animation: sparkleFloat 2s ease-in-out infinite 0.6s; }
            .sparkle-3 { top: 50%; left: 80%; animation: sparkleFloat 2s ease-in-out infinite 0.9s; }
            .sparkle-4 { top: 30%; left: 30%; animation: sparkleFloat 2s ease-in-out infinite 1.2s; }
            .sparkle-5 { top: 70%; left: 70%; animation: sparkleFloat 2s ease-in-out infinite 1.5s; }
            
            @keyframes loaderTitleGlow {
                0% { text-shadow: 0 0 30px rgba(255, 20, 147, 0.8); }
                100% { text-shadow: 0 0 50px rgba(255, 20, 147, 1), 0 0 70px rgba(255, 20, 147, 0.5); }
            }
            
            @keyframes loadingProgress {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
            }
            
            @keyframes sparkleFloat {
                0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
                50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
            }
        `;
        document.head.appendChild(loaderStyles);
        
        // ページ読み込み完了後にローダーを非表示
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                setTimeout(() => {
                    loader.remove();
                    loaderStyles.remove();
                    this.isLoading = false;
                    this.initPageAnimations();
                }, 1000);
            }, 2000);
        });
    }
    
    // ページアニメーションの初期化
    initPageAnimations() {
        const elements = document.querySelectorAll('.main-title, .subtitle, .ornament-top, .ornament-bottom');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // スムーススクローリングのセットアップ
    setupSmoothScrolling() {
        // スクロール指示のクリックイベント
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const eventDetails = document.querySelector('.event-details');
                if (eventDetails) {
                    eventDetails.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
        
        // ナビゲーションリンクのスムーススクロール
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // ナビゲーションエフェクトのセットアップ
    setupNavigationEffects() {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // スクロール方向に基づいてナビゲーションを制御
            if (navbar) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    navbar.classList.add('nav-hidden');
                } else {
                    navbar.classList.remove('nav-hidden');
                }
            }
            
            // スクロール位置に基づいて背景効果を調整
            this.updateScrollEffects(scrollTop);
            
            lastScrollTop = scrollTop;
        });
    }
    
    // スクロールエフェクトの更新
    updateScrollEffects(scrollTop) {
        const heroSection = document.querySelector('.hero-section');
        const particlesContainer = document.getElementById('particles-container');
        
        if (heroSection && particlesContainer) {
            // パララックス効果
            const rate = scrollTop / window.innerHeight;
            heroSection.style.transform = `translateY(${scrollTop * 0.5}px)`;
            
            // パーティクルの透明度調整
            particlesContainer.style.opacity = Math.max(0, 1 - rate);
        }
        
        // セクションごとの効果
        this.updateSectionEffects(scrollTop);
    }
    
    // セクション別エフェクトの更新
    updateSectionEffects(scrollTop) {
        const sections = document.querySelectorAll('section');
        const windowHeight = window.innerHeight;
        
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < windowHeight && rect.bottom > 0;
            
            if (isVisible) {
                const visibilityRatio = Math.max(0, Math.min(1, 
                    (windowHeight - rect.top) / (windowHeight + rect.height)
                ));
                
                // セクション固有のエフェクトを適用
                this.applySectionEffect(section, visibilityRatio, index);
            }
        });
    }
    
    // セクション固有のエフェクト適用
    applySectionEffect(section, ratio, index) {
        if (section.classList.contains('event-details')) {
            // イベント詳細セクションの効果
            const items = section.querySelectorAll('.detail-item');
            items.forEach((item, i) => {
                const delay = i * 0.1;
                const adjustedRatio = Math.max(0, ratio - delay);
                item.style.transform = `translateY(${(1 - adjustedRatio) * 50}px)`;
                item.style.opacity = Math.min(1, adjustedRatio + 0.5);
            });
        } else if (section.classList.contains('cast-section')) {
            // キャストセクションの効果
            const cards = section.querySelectorAll('.cast-card');
            cards.forEach((card, i) => {
                const delay = i * 0.001;
                const adjustedRatio = Math.max(0, ratio - delay);
                card.style.transform = `translateY(${(1 - adjustedRatio) * 30}px) scale(${0.9 + adjustedRatio * 0.1})`;
                card.style.opacity = Math.min(1, adjustedRatio * 1.8);
            });
        }
    }
    
    // レスポンシブ対応の処理
    setupResponsiveHandling() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024;
        
        // モバイル向けの調整
        if (isMobile) {
            this.optimizeForMobile();
        } else if (isTablet) {
            this.optimizeForTablet();
        } else {
            this.optimizeForDesktop();
        }
    }
    
    optimizeForMobile() {
        // モバイル最適化
        const particles = document.getElementById('particles-canvas');
        if (particles && particles.getContext) {
            // パーティクル数を減らす
            const ctx = particles.getContext('2d');
            ctx.canvas.style.opacity = '0.5';
        }
        
        // アニメーション強度を下げる
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }
    
    optimizeForTablet() {
        // タブレット最適化
        document.documentElement.style.setProperty('--animation-duration', '0.5s');
    }
    
    optimizeForDesktop() {
        // デスクトップ最適化
        document.documentElement.style.setProperty('--animation-duration', '0.8s');
    }
    
    // パフォーマンス最適化
    setupPerformanceOptimizations() {
        // Intersection Observer for lazy loading
        const lazyElements = document.querySelectorAll('[data-lazy]');
        if (lazyElements.length > 0) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadLazyElement(entry.target);
                        lazyObserver.unobserve(entry.target);
                    }
                });
            });
            
            lazyElements.forEach(el => lazyObserver.observe(el));
        }
        
        // Reduce motion for accessibility
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            this.disableAnimations();
        }
    }
    
    loadLazyElement(element) {
        const src = element.dataset.lazy;
        if (src) {
            element.src = src;
            element.removeAttribute('data-lazy');
        }
    }
    
    disableAnimations() {
        const style = document.createElement('style');
        style.innerHTML = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // アクセシビリティの設定
    setupAccessibility() {
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // フォーカス管理
        const focusableElements = document.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.outline = '2px solid #ff1493';
                el.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', () => {
                el.style.outline = '';
                el.style.outlineOffset = '';
            });
        });
    }
    
    // イースターエッグ
    setupEasterEggs() {
        let konamiCode = [];
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
                this.activateSecretMode();
                konamiCode = [];
            }
        });
        
        // タイトルを複数回クリックした時の隠し機能
        const mainTitle = document.querySelector('.main-title');
        let clickCount = 0;
        
        if (mainTitle) {
            mainTitle.addEventListener('click', () => {
                clickCount++;
                if (clickCount >= 5) {
                    this.activateRainbowMode();
                    clickCount = 0;
                }
                
                setTimeout(() => {
                    if (clickCount > 0) clickCount--;
                }, 1000);
            });
        }
    }
    
    activateSecretMode() {
        console.log('🎉 Secret mode activated!');
        
        // 特殊エフェクトを追加
        const style = document.createElement('style');
        style.innerHTML = `
            .secret-mode {
                filter: hue-rotate(180deg) saturate(1.5);
                animation: secretGlow 2s ease-in-out infinite alternate;
            }
            
            @keyframes secretGlow {
                0% { filter: hue-rotate(0deg) saturate(1); }
                100% { filter: hue-rotate(360deg) saturate(2); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.classList.add('secret-mode');
        
        setTimeout(() => {
            document.body.classList.remove('secret-mode');
            style.remove();
        }, 10000);
    }
    
    activateRainbowMode() {
        console.log('🌈 Rainbow mode activated!');
        
        const rainbowStyle = document.createElement('style');
        rainbowStyle.innerHTML = `
            .rainbow-mode * {
                animation: rainbowText 3s linear infinite;
            }
            
            @keyframes rainbowText {
                0% { color: #ff0000; }
                16.66% { color: #ff8c00; }
                33.33% { color: #ffd700; }
                50% { color: #00ff00; }
                66.66% { color: #0080ff; }
                83.33% { color: #8000ff; }
                100% { color: #ff0080; }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        document.body.classList.add('rainbow-mode');
        
        setTimeout(() => {
            document.body.classList.remove('rainbow-mode');
            rainbowStyle.remove();
        }, 5000);
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new MainController();
});

// グローバルユーティリティ関数
window.aiaiUtils = {
    // デバッグ用関数
    debug: (message) => {
        console.log(`[待合室藍愛] ${message}`);
    },
    
    // カスタムアラート
    showMessage: (title, message) => {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
                padding: 2rem;
                border-radius: 15px;
                border: 2px solid #ff1493;
                box-shadow: 0 0 30px rgba(255, 20, 147, 0.5);
                z-index: 10001;
                text-align: center;
                color: white;
            ">
                <h3 style="color: #ff1493; margin-bottom: 1rem;">${title}</h3>
                <p style="margin-bottom: 1.5rem;">${message}</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: linear-gradient(135deg, #ff1493, #ff69b4);
                    border: none;
                    color: white;
                    padding: 0.5rem 1.5rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                ">閉じる</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.remove();
        }, 5000);
    }
};