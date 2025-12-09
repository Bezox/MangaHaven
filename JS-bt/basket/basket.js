// ==================== КОРЗИНА - ОСНОВНОЙ МОДУЛЬ ====================

class ShoppingCart {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('mangaCart')) || [];
        this.init();
    }

    init() {
        this.renderCart();
        this.setupEventListeners();
        this.updateCartCount();
    }

    // Сохранение корзины в localStorage
    saveToLocalStorage() {
        localStorage.setItem('mangaCart', JSON.stringify(this.cartItems));
    }

    // Добавление товара в корзину
    addItem(product) {
        const existingItem = this.cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cartItems.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        
        this.saveToLocalStorage();
        this.renderCart();
        this.updateCartCount();
        
        // Показываем уведомление
        this.showNotification(`${product.name} додано до кошика!`);
        
        // Автоматически открываем корзину
        this.openCart();
        
        return this.cartItems;
    }

    // Удаление товара из корзины
    removeItem(itemId) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.saveToLocalStorage();
        this.renderCart();
        this.updateCartCount();
    }

    // Обновление количества товара
    updateQuantity(itemId, newQuantity) {
        const item = this.cartItems.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveToLocalStorage();
            this.renderCart();
        }
    }

    // Очистка корзины
    clearCart() {
        this.cartItems = [];
        this.saveToLocalStorage();
        this.renderCart();
        this.updateCartCount();
    }

    // Получение общей суммы
    getTotal() {
        return this.cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Получение количества товаров
    getItemCount() {
        return this.cartItems.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
    }

    // Обновление счетчика в шапке
    updateCartCount() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.getItemCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Рендеринг корзины
    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartShipping = document.getElementById('cart-shipping');
        const cartTotal = document.getElementById('cart-total');

        if (!cartItemsContainer || !cartEmpty) return;

        // Очищаем контейнер
        cartItemsContainer.innerHTML = '';

        if (this.cartItems.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartEmpty.style.display = 'flex';
        } else {
            cartItemsContainer.style.display = 'block';
            cartEmpty.style.display = 'none';

            // Рендерим каждый товар
            this.cartItems.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.setAttribute('data-id', item.id);
                cartItem.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4 class="item-title">${item.name}</h4>
                        <div class="item-price">${item.price} грн</div>
                        <div class="item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="item-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            // Обновляем суммы
            const subtotal = this.getTotal();
            const shipping = subtotal >= 1000 ? 0 : 50;
            const total = subtotal + shipping;

            if (cartSubtotal) cartSubtotal.textContent = `${subtotal} грн`;
            if (cartTotal) cartTotal.textContent = `${total} грн`;
            if (cartShipping) {
                cartShipping.textContent = shipping === 0 ? 'Безкоштовно' : `${shipping} грн`;
                cartShipping.style.color = shipping === 0 ? 'var(--pastel-mint)' : 'var(--ink-black)';
            }
        }

        // Добавляем обработчики событий для элементов корзины
        this.setupCartItemEvents();
    }

    // Настройка обработчиков событий для элементов корзины
    setupCartItemEvents() {
        // Удаление товара
        document.querySelectorAll('.item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = btn.getAttribute('data-id');
                const item = this.cartItems.find(item => item.id === itemId);
                
                if (item) {
                    this.showNotification(`${item.name} видалено з кошика`, 'info');
                    this.removeItem(itemId);
                }
            });
        });

        // Увеличение количества
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = btn.getAttribute('data-id');
                const item = this.cartItems.find(item => item.id === itemId);
                
                if (item) {
                    this.updateQuantity(itemId, item.quantity + 1);
                }
            });
        });

        // Уменьшение количества
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = btn.getAttribute('data-id');
                const item = this.cartItems.find(item => item.id === itemId);
                
                if (item && item.quantity > 1) {
                    this.updateQuantity(itemId, item.quantity - 1);
                }
            });
        });
    }

    // Настройка основных обработчиков событий
    setupEventListeners() {
        // Открытие корзины
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.openCart());
        }

        // Закрытие корзины
        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        // Очистка корзины
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Ви впевнені, що хочете очистити кошик?')) {
                    this.clearCart();
                    this.showNotification('Кошик очищено', 'info');
                }
            });
        }

        // Оформление заказа
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cartItems.length === 0) {
                    this.showNotification('Кошик порожній!', 'error');
                    return;
                }
                
                this.showNotification('Переходимо до оформлення замовлення...', 'success');
                this.closeCart();
                
                // Здесь можно добавить перенаправление на страницу оформления
                // window.location.href = 'checkout.html';
            });
        }

        // Продолжить покупки
        const continueBtn = document.querySelector('.continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.closeCart());
        }

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('cart-sidebar').classList.contains('active')) {
                this.closeCart();
            }
        });

        // Обработчики для кнопок "В кошик" на странице
        document.addEventListener('click', (e) => {
            // Кнопки "В кошик" на карточках товаров
            if (e.target.closest('.add-to-cart')) {
                const btn = e.target.closest('.add-to-cart');
                this.handleAddToCart(btn);
            }
            
            // Кнопки "В кошик" на странице товара
            if (e.target.closest('.add-to-cart-btn')) {
                const btn = e.target.closest('.add-to-cart-btn');
                this.handleAddToCart(btn);
            }
        });
    }

    // Обработка кнопки "В кошик"
    handleAddToCart(button) {
        const product = {
            id: button.getAttribute('data-id'),
            name: button.getAttribute('data-name'),
            price: parseInt(button.getAttribute('data-price')),
            image: button.getAttribute('data-image')
        };

        // Если есть селектор количества на странице товара
        const quantityInput = document.getElementById('quantity-input');
        if (quantityInput) {
            product.quantity = parseInt(quantityInput.value);
        }

        this.addItem(product);

        // Анимация кнопки
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Додано';
        button.style.background = 'var(--pastel-mint)';
        button.style.color = 'var(--ink-black)';

        // Восстановление кнопки через 2 секунды
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }

    // Открытие корзины
    openCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Закрытие корзины
    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Показ уведомлений
    showNotification(message, type = 'success') {
        // Создание элемента уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
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
            border-left: 4px solid ${type === 'success' ? 'var(--pastel-mint)' : type === 'error' ? 'var(--blush-rose)' : 'var(--soft-lilac)'};
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
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

    // Метод для получения данных корзины (для других скриптов)
    getCartData() {
        return {
            items: this.cartItems,
            total: this.getTotal(),
            itemCount: this.getItemCount()
        };
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ КОРЗИНЫ ====================

// Глобальная переменная для доступа к корзине из других скриптов
window.ShoppingCart = null;

// Функция инициализации корзины
function initCart() {
    window.ShoppingCart = new ShoppingCart();
    
    // Добавляем CSS для анимаций
    if (!document.getElementById('cart-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
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
            
            .cart-item {
                animation: slideInRight 0.3s ease-out;
            }
            
            .cart-item.removing {
                animation: slideOutRight 0.3s ease-in forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log('Корзина инициализирована');
    return window.ShoppingCart;
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли элементы корзины на странице
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        initCart();
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, initCart };
}