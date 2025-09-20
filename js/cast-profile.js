/**
 * キャスト紹介ページ用JavaScript
 * 画像ギャラリー、アニメーション、インタラクションを管理
 */

class CastProfileController {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.autoSlideInterval = null;
        this.isAutoSliding = true;
        
        this.init();
    }
    
    init() {
        this.setupGallery();
        this.setupAnimations();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupInteractions();
    }
    
    // 画像ギャラリーのセットアップ
    setupGallery() {
        const gallery = document.querySelector('.gallery-container');
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        const indicators = document.querySelector('.gallery-indicators');
        
        if (!gallery) return;
        
        this.slides = gallery.querySelectorAll('.gallery-slide');
        
        if (this.slides.length === 0) {
            // プレースホルダー画像を作成
            this.createPlaceholderSlides();
        }
        
        // ナビゲーションボタンのイベント
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // インジケーターの作成
        this.createIndicators();
        
        // 自動スライド開始
        this.startAutoSlide();
        
        // マウスホバーで自動スライド停止
        gallery.addEventListener('mouseenter', () => this.stopAutoSlide());
        gallery.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // タッチスワイプ対応
        this.setupTouchNavigation(gallery);
    }
    
    // プレースホルダースライドの作成
    createPlaceholderSlides() {
        const gallery = document.querySelector('.gallery-container');
        const placeholderCount = 3;
        
        for (let i = 0; i < placeholderCount; i++) {
            const slide = document.createElement('div');
            slide.className = 'gallery-slide';
            if (i === 0) slide.classList.add('active');
            
            slide.innerHTML = `
                <div class="gallery-placeholder">
                    <i class="fas fa-image"></i>
                    <p>キャスト写真 ${i + 1}</p>
                </div>
            `;
            
            gallery.appendChild(slide);
        }
        
        this.slides = gallery.querySelectorAll('.gallery-slide');
    }
    
    // インジケーターの作成
    createIndicators() {
        const indicators = document.querySelector('.gallery-indicators');
        if (!indicators || this.slides.length === 0) return;
        
        indicators.innerHTML = '';
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'gallery-dot';
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(dot);
        });
    }
    
    // スライド移動
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        // 現在のスライドを非アクティブ化
        this.slides[this.currentSlide].classList.remove('active');
        document.querySelectorAll('.gallery-dot')[this.currentSlide].classList.remove('active');
        
        // 新しいスライドをアクティブ化
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        document.querySelectorAll('.gallery-dot')[this.currentSlide].classList.add('active');
        
        // ナビゲーションボタンの状態更新
        this.updateNavButtons();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    // ナビゲーションボタンの状態更新
    updateNavButtons() {
        const prevBtn = document.querySelector('.gallery-prev');
        const nextBtn = document.querySelector('.gallery-next');
        
        if (prevBtn) {
            prevBtn.disabled = false; // 循環するので常に有効
        }
        
        if (nextBtn) {
            nextBtn.disabled = false; // 循環するので常に有効
        }
    }
    
    // 自動スライド開始
    startAutoSlide() {
        if (this.slides.length <= 1) return;
        
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            if (this.isAutoSliding) {
                this.nextSlide();
            }
        }, 4000);
    }
    
    // 自動スライド停止
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    // タッチナビゲーション
    setupTouchNavigation(gallery) {
        let startX = 0;
        let endX = 0;
        
        gallery.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        gallery.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // 50px以上のスワイプで反応
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    // アニメーションのセットアップ
    setupAnimations() {
        // プロフィール要素のアニメーション
        const profileElements = document.querySelectorAll('.profile-field');
        profileElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('scroll-animate-profile');
        });
        
        // 他キャスト要素のアニメーション
        const otherCastItems = document.querySelectorAll('.other-cast-item');
        otherCastItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
            item.classList.add('scroll-animate-profile');
        });
    }
    
    // ナビゲーション効果
    setupNavigation() {
        const backButton = document.querySelector('.back-to-main');
        if (backButton) {
            backButton.addEventListener('mouseenter', () => {
                this.createSparkleEffect(backButton);
            });
        }
    }
    
    // スクロール効果
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);
        
        // アニメーション対象要素の観察
        const animateElements = document.querySelectorAll('.scroll-animate-profile');
        animateElements.forEach(el => observer.observe(el));
    }
    
    // インタラクション効果
    setupInteractions() {
        // プロフィールフィールドのホバー効果
        const profileFields = document.querySelectorAll('.profile-field');
        profileFields.forEach(field => {
            field.addEventListener('mouseenter', () => {
                this.addFieldGlow(field);
            });
            
            field.addEventListener('mouseleave', () => {
                this.removeFieldGlow(field);
            });
        });
        
        // 他キャストアイテムのホバー効果
        const otherCastItems = document.querySelectorAll('.other-cast-item');
        otherCastItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.createFloatingOrbs(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.removeFloatingOrbs(item);
            });
        });
        
        // ギャラリーのクリック効果
        const gallerySlides = document.querySelectorAll('.gallery-slide');
        gallerySlides.forEach(slide => {
            slide.addEventListener('click', () => {
                this.createImageClickEffect(slide);
            });
        });
    }
    
    // フィールドグロウ効果
    addFieldGlow(field) {
        field.style.boxShadow = `
            0 5px 20px rgba(255, 20, 147, 0.3),
            0 0 30px rgba(255, 20, 147, 0.2)
        `;
    }
    
    removeFieldGlow(field) {
        field.style.boxShadow = '';
    }
    
    // スパークル効果
    createSparkleEffect(element) {
        const sparkleCount = 5;
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #ff1493;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 0 10px #ff1493;
            `;
            
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            document.body.appendChild(sparkle);
            
            sparkle.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 0 },
                { transform: 'scale(1) rotate(180deg)', opacity: 1, offset: 0.5 },
                { transform: 'scale(0) rotate(360deg)', opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => sparkle.remove();
        }
    }
    
    // フローティングオーブ効果
    createFloatingOrbs(element) {
        const orbCount = 2;
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < orbCount; i++) {
            const orb = document.createElement('div');
            orb.className = 'floating-orb-effect';
            orb.style.cssText = `
                position: fixed;
                width: 15px;
                height: 15px;
                background: radial-gradient(circle, rgba(255, 20, 147, 0.8), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 999;
            `;
            
            orb.style.left = (rect.left + Math.random() * rect.width) + 'px';
            orb.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(orb);
            
            orb.animate([
                { transform: 'translateY(0px) scale(1)', opacity: 0.7 },
                { transform: 'translateY(-30px) scale(1.2)', opacity: 1, offset: 0.5 },
                { transform: 'translateY(-60px) scale(0.8)', opacity: 0 }
            ], {
                duration: 2000,
                easing: 'ease-out'
            }).onfinish = () => orb.remove();
        }
    }
    
    removeFloatingOrbs(element) {
        // 既存のオーブを削除（必要に応じて実装）
    }
    
    // 画像クリック効果
    createImageClickEffect(slide) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 20, 147, 0.3);
            pointer-events: none;
            width: 50px;
            height: 50px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            z-index: 10;
        `;
        
        slide.style.position = 'relative';
        slide.appendChild(ripple);
        
        ripple.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(4)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    }
}

// ページロード時の初期化
document.addEventListener('DOMContentLoaded', () => {
    new CastProfileController();
});

// ユーティリティ関数
window.castUtils = {
    // ギャラリーに画像を追加
    addGalleryImage: (imageUrl, alt = 'Cast Photo') => {
        const gallery = document.querySelector('.gallery-container');
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        slide.innerHTML = `<img src="${imageUrl}" alt="${alt}">`;
        gallery.appendChild(slide);
        
        // ギャラリーコントローラーを再初期化
        if (window.castController) {
            window.castController.slides = gallery.querySelectorAll('.gallery-slide');
            window.castController.createIndicators();
        }
    },
    
    // プロフィール情報を更新
    updateProfile: (field, value) => {
        const fieldElement = document.querySelector(`.profile-field[data-field="${field}"] .profile-value`);
        if (fieldElement) {
            fieldElement.textContent = value;
        }
    }
};