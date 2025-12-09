// ==================== ГЛАВНЫЙ СКРИПТ ====================

// Основной JavaScript код для интернет-магазина

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация функционала
    initMobileMenu();
    initSmoothScrolling();
    initAnimations();
    initSearchFunctionality();
    initDetailButtons();
    
    // Корзина инициализируется автоматически через cart.js
    // Можно получить доступ через window.ShoppingCart
});

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
}

// Плавная прокрутка
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Анимации при скролле
function initAnimations() {
    const animatedElements = document.querySelectorAll('.product-card, .category-card, .info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
}



// Кнопки "Детальніше"
function initDetailButtons() {
    const detailButtons = document.querySelectorAll('.view-details-btn');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Если нужно добавить какую-то логику перед переходом
            console.log('Переход на страницу товара');
            
            // Можно добавить анимацию загрузки
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Завантаження...';
            
            // Через секунду вернуть обычный текст (на случай если переход задерживается)
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-eye"></i> Детальніше';
            }, 1000);
        });
    });
}

// Адаптивность для мобильных устройств
window.addEventListener('resize', function() {
    // Закрыть мобильное меню при изменении размера на десктоп
    if (window.innerWidth > 768) {
        const mainNav = document.getElementById('main-nav');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (mainNav) mainNav.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация базового функционала
    initMobileMenu();
    initSmoothScrolling();
    initAnimations();
});
// Глобальная переменная для доступа к менеджеру товаров
window.ProductManager = null;

// Функция инициализации
function initProducts() {
    window.ProductManager = new ProductManager();
    console.log('Менеджер товаров инициализирован');
    return window.ProductManager;
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем только если есть поиск на странице
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        initProducts();
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductManager, initProducts };
}