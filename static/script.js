let searchForm = document.querySelector('.search-form');
// let loginForm = document.querySelector('.login-form');
document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    // loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

let shoppingCart = document.querySelector('.shopping-cart');

document.querySelector('#cart-btn').onclick = () => {
    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    // loginForm.classList.remove('active');
    navbar.classList.remove('active');
}



document.querySelector('#login-btn').onclick = () => {
    // loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    // loginForm.classList.remove('active');
}

window.onscroll = () => {
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function () {
    updateShoppingCart();
    const trashIcons = document.querySelectorAll('.box i');
    trashIcons.forEach(trashIcon => {
        if (trashIcon) {
            trashIcon.addEventListener('click', () => {
                removeItemFromCart(trashIcon);
                updateShoppingCart();
                // showSelectedProducts();
                // checkLoginStatus();
            });
        }
    });
});

function updateShoppingCart() {
    // Lấy giỏ hàng từ Local Storage
    const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Hiển thị giỏ hàng trong header
    const shoppingCartContainer = document.querySelector('.shopping-cart');
    shoppingCartContainer.innerHTML = '';

    shoppingCart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('box');
        const price = item.price - item.price * item.discount;
        cartItem.innerHTML = `
        <i class="fas fa-trash"></i>
        <img src="${item.image}" alt="${item.name}">
        <div class="content">
            <h3>${item.name}</h3>
            <span class="price">${item.price}VNĐ -</span>
            <span class="quantity">Số lượng: ${item.quantity}</span>
        </div>
        `;
        shoppingCartContainer.appendChild(cartItem);
    });

    // Tính tổng cộng và hiển thị
    const total = shoppingCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalElement = document.createElement('div');
    totalElement.classList.add('total');
    totalElement.innerText = `Tổng cộng: ${total} VNĐ`;
    shoppingCartContainer.appendChild(totalElement);

    // Hiển thị nút thanh toán
    const checkoutButton = document.createElement('a');
    checkoutButton.href = '/tunie_v1.0/order.html';
    checkoutButton.classList.add('btn');
    checkoutButton.innerText = 'Thanh toán';
    shoppingCartContainer.appendChild(checkoutButton);
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            displayProductsByCategory('new-arrivals-list', data, 'New Arrivals');
            displayProductsByCategory('best-selling-list', data, 'Best-Selling');
            displayProductsByCategory('sale-off-list', data, 'Sale Off');
        });
});

function displayProductsByCategory(containerId, products, category) {
    const container = document.getElementById(containerId);
    const categoryProducts = products.filter(product => product.category === category);

    if (categoryProducts.length > 0) {
        categoryProducts.forEach(product => {
            const productElement = createProductElement(product);
            if (container) {

                container.appendChild(productElement);
            }
        });
    } else {
        container.innerHTML = '<p>No products available in this category.</p>';
    }
}

function createProductElement(product) {
    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="discount-badge" >${product.discount}%</div>
        <h2>${product.name}</h2>
        <div class="price" >${product.price} VNĐ</div>
        <span class="discounted-price">${discountedPrice}VNĐ</span>
    `;

    return productElement;
}

function calculateDiscountedPrice(originalPrice, discountPercentage) {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    return (originalPrice - discountAmount);
}
