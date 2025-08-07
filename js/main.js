// ===== MAIN JAVASCRIPT FILE =====
// American Burguer - Sistema de Pedidos Online

// ===== GLOBAL VARIABLES =====
let products = [];
let filteredProducts = [];
let currentCategory = 'all';
let currentPriceRange = 'all';
let searchQuery = '';

// ===== PRODUCT DATA =====
const productData = [
    // Burguers
    {
        id: 1,
        name: 'Double Burguer',
        description: 'Pão, 2 blend artesanal de frango 120 gramas, Cheddar duplo, Bacon Duplo, Tomate, Cebola roxa, Alface, Maionese.',
        price: 18.00,
        category: 'burguers',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 2,
        name: 'Classic Burguer',
        description: 'Pão, blend artesanal de frango 120g, Cheddar, Bacon, Tomate, Alface, Maionese especial.',
        price: 15.00,
        category: 'burguers',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 3,
        name: 'Mega Burguer',
        description: 'Pão, 3 blend artesanal de frango 150g cada, Cheddar triplo, Bacon, Ovo, Tomate, Alface, Maionese.',
        price: 25.00,
        category: 'burguers',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 4,
        name: 'Chicken Burguer',
        description: 'Pão, Filé de frango grelhado, Queijo mussarela, Tomate, Alface, Maionese de ervas.',
        price: 16.00,
        category: 'burguers',
        image: 'images/placeholder-product.svg'
    },
    
    // Hot Dogs
    {
        id: 5,
        name: 'Hot Dog Tradicional',
        description: 'Pão de hot dog, Salsicha especial, Batata palha, Milho, Ervilha, Maionese, Ketchup, Mostarda.',
        price: 12.00,
        category: 'hotdogs',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 6,
        name: 'Hot Dog Especial',
        description: 'Pão, Salsicha especial, Bacon, Queijo cheddar, Batata palha, Milho, Maionese especial.',
        price: 15.00,
        category: 'hotdogs',
        image: 'images/placeholder-product.svg'
    },
    
    // Crep Wraps
    {
        id: 7,
        name: 'Wrap de Frango',
        description: 'Tortilla, Frango desfiado temperado, Queijo, Alface, Tomate, Molho especial.',
        price: 14.00,
        category: 'wraps',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 8,
        name: 'Wrap Vegetariano',
        description: 'Tortilla, Mix de vegetais grelhados, Queijo, Alface, Tomate, Molho de ervas.',
        price: 13.00,
        category: 'wraps',
        image: 'images/placeholder-product.svg'
    },
    
    // Petiscos
    {
        id: 9,
        name: 'Batata Frita Grande',
        description: 'Porção generosa de batatas fritas crocantes temperadas com sal especial.',
        price: 8.00,
        category: 'petiscos',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 10,
        name: 'Onion Rings',
        description: 'Anéis de cebola empanados e fritos, servidos com molho especial.',
        price: 10.00,
        category: 'petiscos',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 11,
        name: 'Nuggets (10 unidades)',
        description: 'Nuggets de frango crocantes servidos com molho barbecue.',
        price: 12.00,
        category: 'petiscos',
        image: 'images/placeholder-product.svg'
    },
    
    // Coxinhas
    {
        id: 12,
        name: 'Coxinha de Frango (6 unidades)',
        description: 'Coxinhas tradicionais de frango com massa sequinha e recheio generoso.',
        price: 15.00,
        category: 'coxinhas',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 13,
        name: 'Coxinha de Catupiry (6 unidades)',
        description: 'Coxinhas especiais recheadas com catupiry cremoso.',
        price: 17.00,
        category: 'coxinhas',
        image: 'images/placeholder-product.svg'
    },
    
    // Refrigerantes
    {
        id: 14,
        name: 'Coca-Cola 350ml',
        description: 'Refrigerante Coca-Cola gelado.',
        price: 4.00,
        category: 'refrigerantes',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 15,
        name: 'Guaraná Antarctica 350ml',
        description: 'Refrigerante Guaraná Antarctica gelado.',
        price: 4.00,
        category: 'refrigerantes',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 16,
        name: 'Fanta Laranja 350ml',
        description: 'Refrigerante Fanta Laranja gelado.',
        price: 4.00,
        category: 'refrigerantes',
        image: 'images/placeholder-product.svg'
    },
    
    // Sucos
    {
        id: 17,
        name: 'Suco de Laranja Natural 300ml',
        description: 'Suco natural de laranja fresquinho.',
        price: 6.00,
        category: 'sucos',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 18,
        name: 'Suco de Limão 300ml',
        description: 'Suco natural de limão refrescante.',
        price: 5.00,
        category: 'sucos',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 19,
        name: 'Suco de Acerola 300ml',
        description: 'Suco natural de acerola rico em vitamina C.',
        price: 6.00,
        category: 'sucos',
        image: 'images/placeholder-product.svg'
    },
    
    // Cervejas
    {
        id: 20,
        name: 'Cerveja Skol 350ml',
        description: 'Cerveja Skol gelada.',
        price: 5.00,
        category: 'cervejas',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 21,
        name: 'Cerveja Brahma 350ml',
        description: 'Cerveja Brahma gelada.',
        price: 5.00,
        category: 'cervejas',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 22,
        name: 'Cerveja Heineken 350ml',
        description: 'Cerveja Heineken premium gelada.',
        price: 8.00,
        category: 'cervejas',
        image: 'images/placeholder-product.svg'
    },
    
    // Energéticos
    {
        id: 23,
        name: 'Red Bull 250ml',
        description: 'Energético Red Bull gelado.',
        price: 8.00,
        category: 'energeticos',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 24,
        name: 'Monster Energy 473ml',
        description: 'Energético Monster Energy gelado.',
        price: 10.00,
        category: 'energeticos',
        image: 'images/placeholder-product.svg'
    },
    
    // Drinks
    {
        id: 25,
        name: 'Caipirinha',
        description: 'Caipirinha tradicional com cachaça, limão e açúcar.',
        price: 12.00,
        category: 'drinks',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 26,
        name: 'Mojito',
        description: 'Drink refrescante com rum, hortelã, limão e água com gás.',
        price: 15.00,
        category: 'drinks',
        image: 'images/placeholder-product.svg'
    },
    
    // Milkshakes
    {
        id: 27,
        name: 'Milkshake de Chocolate',
        description: 'Milkshake cremoso de chocolate com chantilly.',
        price: 12.00,
        category: 'milkshakes',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 28,
        name: 'Milkshake de Morango',
        description: 'Milkshake cremoso de morango com chantilly.',
        price: 12.00,
        category: 'milkshakes',
        image: 'images/placeholder-product.svg'
    },
    {
        id: 29,
        name: 'Milkshake de Baunilha',
        description: 'Milkshake cremoso de baunilha com chantilly.',
        price: 11.00,
        category: 'milkshakes',
        image: 'images/placeholder-product.svg'
    }
];

// ===== DOM ELEMENTS =====
const elements = {
    // Navigation
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    // Cart
    cartBtn: document.getElementById('cart-btn'),
    cartCount: document.getElementById('cart-count'),
    cartSidebar: document.getElementById('cart-sidebar'),
    closeCart: document.getElementById('close-cart'),
    cartContent: document.getElementById('cart-content'),
    cartItems: document.getElementById('cart-items'),
    emptyCart: document.getElementById('empty-cart'),
    cartFooter: document.getElementById('cart-footer'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartTotal: document.getElementById('cart-total'),
    checkoutBtn: document.getElementById('checkout-btn'),
    
    // Filters
    filterBtns: document.querySelectorAll('.filter-btn'),
    searchInput: document.getElementById('search-input'),
    priceFilter: document.getElementById('price-filter'),
    
    // Products
    productsGrid: document.getElementById('products-grid'),
    
    // Modals
    productModal: document.getElementById('product-modal'),
    closeModal: document.getElementById('close-modal'),
    checkoutModal: document.getElementById('checkout-modal'),
    closeCheckoutModal: document.getElementById('close-checkout-modal'),
    
    // Loading
    loadingOverlay: document.getElementById('loading-overlay'),
    
    // Toast
    toastContainer: document.getElementById('toast-container')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize products
    products = [...productData];
    filteredProducts = [...products];
    
    // Setup event listeners
    setupEventListeners();
    
    // Load saved data
    loadSavedData();
    
    // Render initial products
    renderProducts();
    
    // Update cart display
    updateCartDisplay();
    
    // Hide loading overlay
    hideLoading();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup header scroll effect
    setupHeaderScrollEffect();
    
    console.log('American Burguer - Sistema inicializado com sucesso!');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile menu
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Cart
    if (elements.cartBtn) {
        elements.cartBtn.addEventListener('click', openCart);
    }
    if (elements.closeCart) {
        elements.closeCart.addEventListener('click', closeCart);
    }
    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', openCheckout);
    }
    
    // Filters
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });
    
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
    }
    
    if (elements.priceFilter) {
        elements.priceFilter.addEventListener('change', handlePriceFilter);
    }
    
    // Modals
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeProductModal);
    }
    if (elements.closeCheckoutModal) {
        elements.closeCheckoutModal.addEventListener('click', closeCheckoutModal);
    }
    
    // Close modals on backdrop click
    if (elements.productModal) {
        elements.productModal.addEventListener('click', function(e) {
            if (e.target === this) closeProductModal();
        });
    }
    if (elements.checkoutModal) {
        elements.checkoutModal.addEventListener('click', function(e) {
            if (e.target === this) closeCheckoutModal();
        });
    }
    
    // Close cart on backdrop click
    document.addEventListener('click', function(e) {
        if (elements.cartSidebar.classList.contains('open') && 
            !elements.cartSidebar.contains(e.target) && 
            !elements.cartBtn.contains(e.target)) {
            closeCart();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Window scroll
    window.addEventListener('scroll', handleWindowScroll);
}

// ===== NAVIGATION FUNCTIONS =====
function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    const icon = elements.mobileMenuBtn.querySelector('i');
    
    if (elements.navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    
    // Close mobile menu
    elements.navMenu.classList.remove('active');
    const icon = elements.mobileMenuBtn?.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
    
    // Update active nav link
    elements.navLinks.forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
    
    // Smooth scroll to section
    if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ===== PRODUCT FUNCTIONS =====
function renderProducts() {
    if (!elements.productsGrid) return;
    
    showLoading();
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        elements.productsGrid.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            elements.productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Tente ajustar os filtros ou buscar por outro termo.</p>
                </div>
            `;
            hideLoading();
            return;
        }
        
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            elements.productsGrid.appendChild(productCard);
        });
        
        hideLoading();
        
        // Add animation
        elements.productsGrid.classList.add('animate-fade-in');
        setTimeout(() => {
            elements.productsGrid.classList.remove('animate-fade-in');
        }, 500);
    }, 300);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-price', product.price);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder-product.svg'">
            <div class="product-category">${getCategoryName(product.category)}</div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                <button class="add-product-btn" onclick="openProductModal(${product.id})">
                    <i class="fas fa-plus"></i>
                    Adicionar
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function getCategoryName(category) {
    const categoryNames = {
        'burguers': 'Burguers',
        'hotdogs': 'Hot Dogs',
        'wraps': 'Wraps',
        'petiscos': 'Petiscos',
        'coxinhas': 'Coxinhas',
        'refrigerantes': 'Refrigerantes',
        'sucos': 'Sucos',
        'cervejas': 'Cervejas',
        'energeticos': 'Energéticos',
        'drinks': 'Drinks',
        'milkshakes': 'Milkshakes'
    };
    return categoryNames[category] || category;
}

// ===== FILTER FUNCTIONS =====
function handleCategoryFilter(e) {
    const category = e.target.getAttribute('data-category');
    currentCategory = category;
    
    // Update active filter button
    elements.filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Apply filters
    applyFilters();
}

function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
}

function handlePriceFilter(e) {
    currentPriceRange = e.target.value;
    applyFilters();
}

function applyFilters() {
    filteredProducts = products.filter(product => {
        // Category filter
        const categoryMatch = currentCategory === 'all' || product.category === currentCategory;
        
        // Search filter
        const searchMatch = searchQuery === '' || 
            product.name.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery);
        
        // Price filter
        let priceMatch = true;
        if (currentPriceRange !== 'all') {
            const price = product.price;
            switch (currentPriceRange) {
                case '0-15':
                    priceMatch = price <= 15;
                    break;
                case '15-25':
                    priceMatch = price > 15 && price <= 25;
                    break;
                case '25-35':
                    priceMatch = price > 25 && price <= 35;
                    break;
                case '35+':
                    priceMatch = price > 35;
                    break;
            }
        }
        
        return categoryMatch && searchMatch && priceMatch;
    });
    
    renderProducts();
}

// ===== MODAL FUNCTIONS =====
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Populate modal with product data
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-description').textContent = product.description;
    document.getElementById('modal-product-price').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-image').alt = product.name;
    
    // Reset form
    document.getElementById('product-quantity').textContent = '1';
    document.getElementById('product-observations').value = '';
    document.querySelectorAll('.extra-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Store product ID
    elements.productModal.setAttribute('data-product-id', productId);
    
    // Update total price
    updateModalTotalPrice();
    
    // Show modal
    elements.productModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Setup modal event listeners
    setupProductModalListeners();
}

function setupProductModalListeners() {
    // Quantity controls
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    // Remove existing listeners
    qtyMinus.replaceWith(qtyMinus.cloneNode(true));
    qtyPlus.replaceWith(qtyPlus.cloneNode(true));
    addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));
    
    // Add new listeners
    document.getElementById('qty-minus').addEventListener('click', decreaseQuantity);
    document.getElementById('qty-plus').addEventListener('click', increaseQuantity);
    document.getElementById('add-to-cart-btn').addEventListener('click', addToCart);
    
    // Extras checkboxes
    document.querySelectorAll('.extra-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateModalTotalPrice);
    });
}

function closeProductModal() {
    elements.productModal.classList.remove('show');
    document.body.style.overflow = '';
}

function closeCheckoutModal() {
    elements.checkoutModal.classList.remove('show');
    document.body.style.overflow = '';
}

function increaseQuantity() {
    const quantityElement = document.getElementById('product-quantity');
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
    updateModalTotalPrice();
}

function decreaseQuantity() {
    const quantityElement = document.getElementById('product-quantity');
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
        updateModalTotalPrice();
    }
}

function updateModalTotalPrice() {
    const productId = parseInt(elements.productModal.getAttribute('data-product-id'));
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantity = parseInt(document.getElementById('product-quantity').textContent);
    let totalPrice = product.price;
    
    // Add extras price
    document.querySelectorAll('.extra-item input[type="checkbox"]:checked').forEach(checkbox => {
        const extraPrice = parseFloat(checkbox.getAttribute('data-price'));
        totalPrice += extraPrice;
    });
    
    // Multiply by quantity
    totalPrice *= quantity;
    
    // Update display
    document.getElementById('modal-total-price').textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

// ===== CART FUNCTIONS =====
function openCart() {
    elements.cartSidebar.classList.add('open');
}

function closeCart() {
    elements.cartSidebar.classList.remove('open');
}

function addToCart() {
    const productId = parseInt(elements.productModal.getAttribute('data-product-id'));
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantity = parseInt(document.getElementById('product-quantity').textContent);
    const observations = document.getElementById('product-observations').value.trim();
    
    // Get selected extras
    const extras = [];
    document.querySelectorAll('.extra-item input[type="checkbox"]:checked').forEach(checkbox => {
        extras.push({
            name: checkbox.getAttribute('data-extra'),
            price: parseFloat(checkbox.getAttribute('data-price'))
        });
    });
    
    // Calculate item price
    let itemPrice = product.price;
    extras.forEach(extra => {
        itemPrice += extra.price;
    });
    
    // Create cart item
    const cartItem = {
        id: Date.now(), // Unique ID for cart item
        productId: product.id,
        name: product.name,
        price: itemPrice,
        quantity: quantity,
        extras: extras,
        observations: observations,
        image: product.image
    };
    
    // Add to cart
    let cart = getCart();
    cart.push(cartItem);
    saveCart(cart);
    
    // Update display
    updateCartDisplay();
    
    // Show success message
    showToast('Produto adicionado ao carrinho!', 'success');
    
    // Close modal
    closeProductModal();
    
    // Add animation to cart button
    elements.cartBtn.classList.add('animate-bounce-in');
    setTimeout(() => {
        elements.cartBtn.classList.remove('animate-bounce-in');
    }, 600);
}

function removeFromCart(cartItemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== cartItemId);
    saveCart(cart);
    updateCartDisplay();
    showToast('Produto removido do carrinho', 'warning');
}

function updateCartDisplay() {
    const cart = getCart();
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
    
    // Update cart content
    if (cart.length === 0) {
        elements.emptyCart.style.display = 'block';
        elements.cartItems.style.display = 'none';
        elements.cartFooter.style.display = 'none';
    } else {
        elements.emptyCart.style.display = 'none';
        elements.cartItems.style.display = 'block';
        elements.cartFooter.style.display = 'block';
        
        // Render cart items
        elements.cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            elements.cartItems.appendChild(cartItemElement);
        });
        
        // Update totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 3.00;
        const total = subtotal + deliveryFee;
        
        elements.cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        elements.cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

function createCartItemElement(item) {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    
    const extrasText = item.extras.length > 0 
        ? item.extras.map(extra => extra.name).join(', ')
        : '';
    
    const observationsText = item.observations 
        ? `<div class="cart-item-observations">Obs: ${item.observations}</div>`
        : '';
    
    cartItemDiv.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder-product.svg'">
        </div>
        <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            ${extrasText ? `<div class="cart-item-extras">+ ${extrasText}</div>` : ''}
            ${observationsText}
            <div class="cart-item-footer">
                <span class="cart-item-quantity">Qtd: ${item.quantity}</span>
                <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return cartItemDiv;
}

// ===== CHECKOUT FUNCTIONS =====
function openCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio!', 'warning');
        return;
    }
    
    // Update checkout totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 3.00;
    const total = subtotal + deliveryFee;
    
    document.getElementById('final-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('final-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Load saved customer data
    loadCustomerData();
    
    // Setup checkout form listeners
    setupCheckoutFormListeners();
    
    // Show modal
    elements.checkoutModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close cart
    closeCart();
}

function setupCheckoutFormListeners() {
    // Phone mask
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }
    
    // CEP mask
    const cepInput = document.getElementById('customer-cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }
    
    // Payment method change
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const changeGroup = document.getElementById('change-group');
            if (this.value === 'dinheiro') {
                changeGroup.style.display = 'block';
            } else {
                changeGroup.style.display = 'none';
            }
        });
    });
    
    // Change amount mask
    const changeInput = document.getElementById('change-amount');
    if (changeInput) {
        changeInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = (value / 100).toFixed(2);
            value = value.replace('.', ',');
            value = 'R$ ' + value;
            e.target.value = value;
        });
    }
    
    // Form submission buttons
    const copyBtn = document.getElementById('copy-order-btn');
    const whatsappBtn = document.getElementById('send-whatsapp-btn');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copyOrderMessage);
    }
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', sendWhatsAppOrder);
    }
}

// ===== UTILITY FUNCTIONS =====
function showLoading() {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.classList.add('show');
    }
}

function hideLoading() {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.classList.remove('show');
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = {
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle',
        'info': 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';
    
    toast.innerHTML = `
        <i class="toast-icon ${iconClass}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeToast(toast);
    }, 5000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });
}

function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function setupSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                scrollToSection(targetId.substring(1));
            }
        });
    });
}

function setupHeaderScrollEffect() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

function handleKeyboardNavigation(e) {
    // ESC key closes modals
    if (e.key === 'Escape') {
        if (elements.productModal.classList.contains('show')) {
            closeProductModal();
        }
        if (elements.checkoutModal.classList.contains('show')) {
            closeCheckoutModal();
        }
        if (elements.cartSidebar.classList.contains('open')) {
            closeCart();
        }
    }
}

function handleWindowResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        elements.navMenu.classList.remove('active');
        const icon = elements.mobileMenuBtn?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

function handleWindowScroll() {
    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== LOCAL STORAGE FUNCTIONS =====
function getCart() {
    const cart = localStorage.getItem('americanburguer_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('americanburguer_cart', JSON.stringify(cart));
}

function loadSavedData() {
    // Load cart
    const cart = getCart();
    if (cart.length > 0) {
        updateCartDisplay();
    }
}

function loadCustomerData() {
    const savedData = localStorage.getItem('americanburguer_customer');
    if (savedData) {
        const customer = JSON.parse(savedData);
        
        // Fill form with saved data
        const fields = ['customer-name', 'customer-phone', 'customer-address', 
                       'customer-complement', 'customer-neighborhood', 'customer-cep', 
                       'customer-city', 'customer-reference'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && customer[fieldId]) {
                field.value = customer[fieldId];
            }
        });
    }
}

function saveCustomerData() {
    const customer = {};
    const fields = ['customer-name', 'customer-phone', 'customer-address', 
                   'customer-complement', 'customer-neighborhood', 'customer-cep', 
                   'customer-city', 'customer-reference'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            customer[fieldId] = field.value;
        }
    });
    
    localStorage.setItem('americanburguer_customer', JSON.stringify(customer));
}

// ===== GLOBAL FUNCTIONS (called from HTML) =====
window.openProductModal = openProductModal;
window.removeFromCart = removeFromCart;
window.scrollToSection = scrollToSection;

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Erro na aplicação:', e.error);
    showToast('Ocorreu um erro inesperado. Tente recarregar a página.', 'error');
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Tempo de carregamento: ${loadTime}ms`);
        }, 0);
    });
}
