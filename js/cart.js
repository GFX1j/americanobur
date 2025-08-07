// ===== CART JAVASCRIPT FILE =====
// American Burguer - Sistema de Carrinho e Checkout

// ===== CHECKOUT FUNCTIONS =====
function validateCheckoutForm() {
    const requiredFields = [
        { id: 'customer-name', name: 'Nome' },
        { id: 'customer-phone', name: 'Telefone' },
        { id: 'customer-address', name: 'Endereço' },
        { id: 'customer-neighborhood', name: 'Bairro' },
        { id: 'customer-city', name: 'Cidade' }
    ];
    
    const errors = [];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input || !input.value.trim()) {
            errors.push(field.name);
            if (input) {
                input.classList.add('error');
            }
        } else {
            if (input) {
                input.classList.remove('error');
            }
        }
    });
    
    // Validate phone format
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput && phoneInput.value) {
        const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
        if (!phoneRegex.test(phoneInput.value)) {
            errors.push('Telefone (formato inválido)');
            phoneInput.classList.add('error');
        }
    }
    
    // Validate payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) {
        errors.push('Forma de pagamento');
    }
    
    // Validate change amount if payment is cash
    if (paymentMethod && paymentMethod.value === 'dinheiro') {
        const changeInput = document.getElementById('change-amount');
        if (changeInput && changeInput.value) {
            const changeAmount = parseFloat(changeInput.value.replace(/[^\d,]/g, '').replace(',', '.'));
            const cart = getCart();
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 3.00; // +3 delivery fee
            
            if (changeAmount < total) {
                errors.push('Valor para troco (deve ser maior que o total)');
                changeInput.classList.add('error');
            } else {
                changeInput.classList.remove('error');
            }
        }
    }
    
    if (errors.length > 0) {
        showToast(`Preencha os campos obrigatórios: ${errors.join(', ')}`, 'error');
        return false;
    }
    
    return true;
}

function generateOrderMessage() {
    if (!validateCheckoutForm()) {
        return null;
    }
    
    // Save customer data
    saveCustomerData();
    
    const cart = getCart();
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerComplement = document.getElementById('customer-complement').value;
    const customerNeighborhood = document.getElementById('customer-neighborhood').value;
    const customerCep = document.getElementById('customer-cep').value;
    const customerCity = document.getElementById('customer-city').value;
    const customerReference = document.getElementById('customer-reference').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const changeAmount = document.getElementById('change-amount').value;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 3.00;
    const total = subtotal + deliveryFee;
    
    // Generate order number
    const orderNumber = Date.now().toString().slice(-6);
    
    // Build message
    let message = `🍔 *AMERICAN BURGUER* 🍔\n`;
    message += `📋 *Pedido #${orderNumber}*\n\n`;
    
    // Customer info
    message += `👤 *DADOS DO CLIENTE*\n`;
    message += `Nome: ${customerName}\n`;
    message += `Telefone: ${customerPhone}\n\n`;
    
    // Address
    message += `📍 *ENDEREÇO DE ENTREGA*\n`;
    message += `${customerAddress}`;
    if (customerComplement) {
        message += `, ${customerComplement}`;
    }
    message += `\n${customerNeighborhood}`;
    if (customerCep) {
        message += ` - CEP: ${customerCep}`;
    }
    message += `\n${customerCity}`;
    if (customerReference) {
        message += `\n📌 Referência: ${customerReference}`;
    }
    message += `\n\n`;
    
    // Order items
    message += `🛒 *ITENS DO PEDIDO*\n`;
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   Qtd: ${item.quantity}x\n`;
        
        if (item.extras && item.extras.length > 0) {
            message += `   Extras: ${item.extras.map(extra => extra.name).join(', ')}\n`;
        }
        
        if (item.observations) {
            message += `   Obs: ${item.observations}\n`;
        }
        
        message += `   Valor: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
    });
    
    // Payment info
    message += `💳 *FORMA DE PAGAMENTO*\n`;
    const paymentNames = {
        'dinheiro': '💵 Dinheiro',
        'cartao': '💳 Cartão',
        'pix': '📱 PIX'
    };
    message += `${paymentNames[paymentMethod] || paymentMethod}\n`;
    
    if (paymentMethod === 'dinheiro' && changeAmount) {
        const changeValue = parseFloat(changeAmount.replace(/[^\d,]/g, '').replace(',', '.'));
        const changeFor = changeValue - total;
        message += `Troco para: ${changeAmount}\n`;
        message += `Troco: R$ ${changeFor.toFixed(2).replace('.', ',')}\n`;
    }
    message += `\n`;
    
    // Totals
    message += `💰 *RESUMO DO PEDIDO*\n`;
    message += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    message += `Taxa de entrega: R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
    message += `*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    
    // Footer
    message += `⏰ Tempo estimado de entrega: 30-45 minutos\n`;
    message += `📞 Qualquer dúvida, entre em contato!\n\n`;
    message += `Obrigado pela preferência! 🙏`;
    
    return message;
}

function copyOrderMessage() {
    const message = generateOrderMessage();
    if (!message) return;
    
    // Copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(message).then(() => {
            showToast('Mensagem copiada para a área de transferência!', 'success');
            completeOrder();
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            fallbackCopyTextToClipboard(message);
        });
    } else {
        fallbackCopyTextToClipboard(message);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Mensagem copiada para a área de transferência!', 'success');
            completeOrder();
        } else {
            showToast('Erro ao copiar mensagem. Tente novamente.', 'error');
        }
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showToast('Erro ao copiar mensagem. Tente novamente.', 'error');
    }
    
    document.body.removeChild(textArea);
}

function sendWhatsAppOrder() {
    const message = generateOrderMessage();
    if (!message) return;
    
    // WhatsApp business number (replace with actual number)
    const whatsappNumber = '5581973437435'; // Replace with your WhatsApp number
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Complete order
    completeOrder();
    
    showToast('Redirecionando para o WhatsApp...', 'success');
}

function completeOrder() {
    // Clear cart
    localStorage.removeItem('americanburguer_cart');
    
    // Close modal
    setTimeout(() => {
        closeCheckoutModal();
        updateCartDisplay();
        
        // Show success message
        showToast('Pedido enviado com sucesso! Aguarde nosso contato.', 'success');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
}

// ===== CART PERSISTENCE =====
function clearCart() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        localStorage.removeItem('americanburguer_cart');
        updateCartDisplay();
        showToast('Carrinho limpo!', 'info');
    }
}

function updateCartItemQuantity(cartItemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(cartItemId);
        return;
    }
    
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === cartItemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCart(cart);
        updateCartDisplay();
    }
}

// ===== CART ANIMATIONS =====
function animateCartAdd() {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.classList.add('animate-pulse');
        setTimeout(() => {
            cartBtn.classList.remove('animate-pulse');
        }, 600);
    }
}

function animateCartRemove() {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.classList.add('animate-shake');
        setTimeout(() => {
            cartBtn.classList.remove('animate-shake');
        }, 600);
    }
}

// ===== CART SUMMARY =====
function getCartSummary() {
    const cart = getCart();
    
    return {
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: 3.00,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 3.00
    };
}

// ===== CART VALIDATION =====
function validateCart() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio!', 'warning');
        return false;
    }
    
    // Check if all products still exist
    const validCart = cart.filter(item => {
        const product = products.find(p => p.id === item.productId);
        return product !== undefined;
    });
    
    if (validCart.length !== cart.length) {
        saveCart(validCart);
        updateCartDisplay();
        showToast('Alguns itens foram removidos do carrinho pois não estão mais disponíveis.', 'warning');
    }
    
    return validCart.length > 0;
}

// ===== CART EXPORT/IMPORT =====
function exportCart() {
    const cart = getCart();
    const cartData = {
        cart: cart,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(cartData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `carrinho_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Carrinho exportado com sucesso!', 'success');
}

function importCart(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const cartData = JSON.parse(e.target.result);
            
            if (cartData.cart && Array.isArray(cartData.cart)) {
                saveCart(cartData.cart);
                updateCartDisplay();
                showToast('Carrinho importado com sucesso!', 'success');
            } else {
                showToast('Arquivo de carrinho inválido!', 'error');
            }
        } catch (error) {
            console.error('Erro ao importar carrinho:', error);
            showToast('Erro ao importar carrinho!', 'error');
        }
    };
    
    reader.readAsText(file);
}

// ===== CART STATISTICS =====
function getCartStatistics() {
    const cart = getCart();
    
    const stats = {
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        uniqueItems: cart.length,
        averageItemPrice: 0,
        mostExpensiveItem: null,
        cheapestItem: null,
        categoryBreakdown: {}
    };
    
    if (cart.length > 0) {
        const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        stats.averageItemPrice = totalValue / stats.totalItems;
        
        // Find most and least expensive items
        stats.mostExpensiveItem = cart.reduce((max, item) => 
            item.price > max.price ? item : max
        );
        
        stats.cheapestItem = cart.reduce((min, item) => 
            item.price < min.price ? item : min
        );
        
        // Category breakdown
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                const category = getCategoryName(product.category);
                stats.categoryBreakdown[category] = (stats.categoryBreakdown[category] || 0) + item.quantity;
            }
        });
    }
    
    return stats;
}

// ===== CART RECOMMENDATIONS =====
function getCartRecommendations() {
    const cart = getCart();
    const cartProductIds = cart.map(item => item.productId);
    
    // Get products not in cart
    const availableProducts = products.filter(product => 
        !cartProductIds.includes(product.id)
    );
    
    // Simple recommendation logic - suggest popular items or complementary items
    const recommendations = [];
    
    // If cart has burgers, suggest drinks
    const hasBurgers = cart.some(item => {
        const product = products.find(p => p.id === item.productId);
        return product && product.category === 'burguers';
    });
    
    if (hasBurgers) {
        const drinks = availableProducts.filter(p => 
            ['refrigerantes', 'sucos', 'milkshakes'].includes(p.category)
        );
        recommendations.push(...drinks.slice(0, 3));
    }
    
    // If cart has main items, suggest sides
    const hasMainItems = cart.some(item => {
        const product = products.find(p => p.id === item.productId);
        return product && ['burguers', 'hotdogs', 'wraps'].includes(product.category);
    });
    
    if (hasMainItems) {
        const sides = availableProducts.filter(p => 
            ['petiscos', 'coxinhas'].includes(p.category)
        );
        recommendations.push(...sides.slice(0, 2));
    }
    
    // Remove duplicates and limit to 5 recommendations
    const uniqueRecommendations = recommendations.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
    );
    
    return uniqueRecommendations.slice(0, 5);
}

// ===== CART DISCOUNT SYSTEM =====
function calculateDiscounts(cart) {
    const discounts = [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Discount for orders over R$ 50
    if (subtotal >= 50) {
        discounts.push({
            name: 'Desconto pedido acima de R$ 50',
            amount: 5.00,
            type: 'fixed'
        });
    }
    
    // Discount for multiple burgers
    const burgerCount = cart.reduce((count, item) => {
        const product = products.find(p => p.id === item.productId);
        return product && product.category === 'burguers' ? count + item.quantity : count;
    }, 0);
    
    if (burgerCount >= 3) {
        discounts.push({
            name: 'Desconto 3+ burguers',
            amount: 0.10, // 10%
            type: 'percentage'
        });
    }
    
    return discounts;
}

function applyDiscounts(subtotal, discounts) {
    let totalDiscount = 0;
    
    discounts.forEach(discount => {
        if (discount.type === 'fixed') {
            totalDiscount += discount.amount;
        } else if (discount.type === 'percentage') {
            totalDiscount += subtotal * discount.amount;
        }
    });
    
    return Math.min(totalDiscount, subtotal); // Don't let discount exceed subtotal
}

// ===== GLOBAL CART FUNCTIONS =====
window.copyOrderMessage = copyOrderMessage;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.clearCart = clearCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.exportCart = exportCart;
window.importCart = importCart;

// ===== CART EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Add cart keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+C to open cart
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            openCart();
        }
        
        // Ctrl+Shift+X to clear cart (with confirmation)
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
            e.preventDefault();
            clearCart();
        }
    });
});

// ===== CART DEBUG FUNCTIONS =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugCart = {
        getCart: getCart,
        saveCart: saveCart,
        clearCart: clearCart,
        getCartSummary: getCartSummary,
        getCartStatistics: getCartStatistics,
        getCartRecommendations: getCartRecommendations,
        calculateDiscounts: calculateDiscounts
    };
    
    console.log('Cart debug functions available in window.debugCart');
}