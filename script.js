

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация функционала
    initMobileMenu();
    initProductInteractions();
    initSmoothScrolling();
    initAnimations();
    initSearchFunctionality();
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

// Взаимодействия с продуктами
function initProductInteractions() {
    const productButtons = document.querySelectorAll('.product-btn');
    const wishlistBtn = document.getElementById('wishlist-btn');
    const cartBtn = document.getElementById('cart-btn');
    
    // Добавление в корзину
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Анимация кнопки
            this.innerHTML = '<i class="fas fa-check"></i> Додано';
            this.style.background = 'var(--pastel-mint)';
            this.style.color = 'var(--ink-black)';
            
            // Обновление счетчика корзины
            updateCartCounter(1);
            
            // Восстановление кнопки через 2 секунды
            setTimeout(() => {
                this.innerHTML = this.classList.contains('view-btn') ? 
                    'Переглянути' : 'В кошик';
                this.style.background = '';
                this.style.color = '';
            }, 2000);
            
            // Показать уведомление
            showNotification(`"${productTitle}" додано до кошика!`);
        });
    });
    
    // Добавление в избранное
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const badge = this.querySelector('.badge');
            
            if (this.classList.contains('active')) {
                badge.textContent = parseInt(badge.textContent) + 1;
                showNotification('Додано до списку бажань!');
            } else {
                badge.textContent = Math.max(0, parseInt(badge.textContent) - 1);
            }
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

// Функциональность поиска
function initSearchFunctionality() {
    const searchBar = document.getElementById('search-bar');
    const searchInput = searchBar?.querySelector('input');
    const searchBtn = searchBar?.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // Поиск при нажатии Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
        
        // Поиск при клике на кнопку
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }
}

// Выполнение поиска
function performSearch(query) {
    if (query.trim()) {
        showNotification(`Пошук: "${query}"`);

        console.log('Searching for:', query);
    }
}

// Обновление счетчика корзины
function updateCartCounter(increment = 0) {
    const cartBtn = document.getElementById('cart-btn');
    const badge = cartBtn?.querySelector('.badge');
    
    if (badge) {
        const currentCount = parseInt(badge.textContent) || 0;
        badge.textContent = currentCount + increment;
        
        // Анимация обновления
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 300);
    }
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Создание элемента уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--white);
        color: var(--ink-black);
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-strong);
        border-left: 4px solid ${type === 'success' ? 'var(--pastel-mint)' : 'var(--blush-rose)'};
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Обработка изменения размера окна
window.addEventListener('resize', function() {
    // Закрыть мобильное меню при изменении размера на десктоп
    if (window.innerWidth > 768) {
        const mainNav = document.getElementById('main-nav');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (mainNav) mainNav.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Загрузка дополнительных продуктов
function loadMoreProducts(sectionId) {
    // Имитация загрузки дополнительных продуктов
    showNotification('Завантаження додаткових товарів...');
    
    setTimeout(() => {
        showNotification('Товари успішно завантажені!');
    }, 1500);
}

// Инициализация фильтров (заглушка для будущей реализации)
function initFilters() {
    console.log('Filters initialized - ready for implementation');
}

// Отслеживание аналитики (заглушка)
function trackUserInteraction(action, label) {
    console.log('User interaction:', action, label);
    // Здесь можно интегрировать с Google Analytics или другими системами
}
// Обработка кнопок "Детальніше" на главной странице
function initDetailButtons() {
    const detailButtons = document.querySelectorAll('.view-details-btn');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Если нужно добавить какую-то логику перед переходом
            // Например, отслеживание аналитики
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

// Добавить вызов функции в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    initDetailButtons();
    // ... остальной код ...
});

// Функция для быстрого просмотра товара (можно добавить модальное окно)
function quickView(productId) {
    // Здесь можно реализовать быстрый просмотр товара без перехода на отдельную страницу
    showNotification('Функція швидкого перегляду буде доступна найближчим часом!');
}

// Добавить обработчики для быстрого просмотра по клику на карточку
function initProductQuickView() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Исключаем клики по кнопкам
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.product-btn') && !e.target.closest('.view-details-btn')) {
                const productTitle = this.querySelector('.product-title').textContent;
                quickView(productTitle);
            }
        });
    });
}

// Основной JavaScript код для интернет-магазина

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация функционала
    initMobileMenu();
    initProductInteractions();
    initSmoothScrolling();
    initAnimations();
    initSearchFunctionality();
    initCart();
    initDetailButtons();
});

// Функционал корзины
function initCart() {
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const continueShoppingBtn = document.querySelector('.continue-shopping');

    // Открытие корзины
    if (cartToggle) {
        cartToggle.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Закрытие корзины
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
            closeCart();
        }
    });

    // Очистка корзины
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Ви впевнені, що хочете очистити кошик?')) {
                clearCart();
                showNotification('Кошик очищено', 'info');
            }
        });
    }

    // Оформление заказа
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cartItems = document.querySelectorAll('.cart-item');
            if (cartItems.length === 0) {
                showNotification('Кошик порожній!', 'error');
                return;
            }
            
            showNotification('Переходимо до оформлення замовлення...', 'success');
            closeCart();
            // Здесь можно добавить переход на страницу оформления заказа
        });
    }

    // Продолжить покупки
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', closeCart);
    }

    // Инициализация обработчиков для товаров в корзине
    initCartItems();
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function initCartItems() {
    // Обработчики для изменения количества
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            const quantityElement = item.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (this.classList.contains('increase')) {
                quantity++;
            } else if (this.classList.contains('decrease') && quantity > 1) {
                quantity--;
            }
            
            quantityElement.textContent = quantity;
            updateCartItemTotal(item);
            updateCartSummary();
        });
    });

    // Обработчики для удаления товаров
    document.querySelectorAll('.item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            const productName = item.querySelector('.item-title').textContent;
            
            item.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                item.remove();
                updateCartSummary();
                checkEmptyCart();
                showNotification(`"${productName}" видалено з кошика`, 'info');
            }, 300);
        });
    });
}

function updateCartItemTotal(item) {
    const price = parseInt(item.querySelector('.item-price').textContent);
    const quantity = parseInt(item.querySelector('.quantity').textContent);
    const total = price * quantity;
    
    item.querySelector('.item-price').textContent = `${price} грн`;
}

function updateCartSummary() {
    const items = document.querySelectorAll('.cart-item');
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    const badgeElement = document.getElementById('cart-badge');
    
    let subtotal = 0;
    let totalItems = 0;
    
    items.forEach(item => {
        const price = parseInt(item.querySelector('.item-price').textContent);
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        subtotal += price * quantity;
        totalItems += quantity;
    });
    
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;
    
    if (subtotalElement) subtotalElement.textContent = `${subtotal} грн`;
    if (totalElement) totalElement.textContent = `${total} грн`;
    if (badgeElement) badgeElement.textContent = totalItems;
    
    // Обновляем цену доставки
    const shippingElement = document.getElementById('cart-shipping');
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? 'Безкоштовно' : `${shipping} грн`;
        shippingElement.style.color = shipping === 0 ? 'var(--pastel-mint)' : 'var(--ink-black)';
    }
}

function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartEmpty = document.getElementById('cart-empty');
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cartItems.length === 0) {
        cartEmpty.style.display = 'flex';
        cartItemsContainer.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartItemsContainer.style.display = 'block';
    }
}

function clearCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    cartItems.forEach(item => {
        item.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => item.remove(), 300);
    });
    
    setTimeout(() => {
        updateCartSummary();
        checkEmptyCart();
    }, 400);
}

// Добавление товаров в корзину
function initProductInteractions() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseInt(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            
            addToCart(productId, productName, productPrice, productImage);
            
            // Анимация кнопки
            this.innerHTML = '<i class="fas fa-check"></i> Додано';
            this.style.background = 'var(--pastel-mint)';
            this.style.color = 'var(--ink-black)';
            
            // Восстановление кнопки через 2 секунды
            setTimeout(() => {
                this.innerHTML = 'В кошик';
                this.style.background = '';
                this.style.color = '';
            }, 2000);
        });
    });
}

function addToCart(id, name, price, image) {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = document.querySelector(`.cart-item[data-id="${id}"]`);
    
    if (existingItem) {
        // Увеличиваем количество
        const quantityElement = existingItem.querySelector('.quantity');
        const quantity = parseInt(quantityElement.textContent) + 1;
        quantityElement.textContent = quantity;
        updateCartItemTotal(existingItem);
    } else {
        // Создаем новый элемент корзины
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', id);
        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${image}" alt="${name}">
            </div>
            <div class="item-details">
                <h4 class="item-title">${name}</h4>
                <div class="item-price">${price} грн</div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-btn increase">+</button>
                </div>
            </div>
            <button class="item-remove">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
        
        // Добавляем обработчики для нового элемента
        const removeBtn = cartItem.querySelector('.item-remove');
        const quantityBtns = cartItem.querySelectorAll('.quantity-btn');
        
        removeBtn.addEventListener('click', function() {
            const productName = cartItem.querySelector('.item-title').textContent;
            cartItem.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                cartItem.remove();
                updateCartSummary();
                checkEmptyCart();
                showNotification(`"${productName}" видалено з кошика`, 'info');
            }, 300);
        });
        
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const quantityElement = cartItem.querySelector('.quantity');
                let quantity = parseInt(quantityElement.textContent);
                
                if (this.classList.contains('increase')) {
                    quantity++;
                } else if (this.classList.contains('decrease') && quantity > 1) {
                    quantity--;
                }
                
                quantityElement.textContent = quantity;
                updateCartItemTotal(cartItem);
                updateCartSummary();
            });
        });
    }
    
    // Обновляем итоги и скрываем сообщение о пустой корзине
    updateCartSummary();
    cartEmpty.style.display = 'none';
    document.getElementById('cart-items').style.display = 'block';
    
    // Показываем уведомление
    showNotification(`"${name}" додано до кошика!`);
    
    // Автоматически открываем корзину при добавлении товара
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}




// Добавляем CSS анимацию для удаления элементов
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);