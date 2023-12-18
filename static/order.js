document.addEventListener('DOMContentLoaded', function () {
    showSelectedProducts();
    // initializeProducts()
    // showRecommendedProducts();
});
let fromDb = null;
initializeProducts()
// // Hàm khởi tạo dữ liệu sản phẩm
function initializeProducts() {
    // Lấy dữ liệu từ file JSON hoặc từ API
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            fromDb = data;
        });
    
    // fromDb = JSON.parse(localStorage.getItem('products'))
}

// fetch('data/products.json')
//         .then(response => response.json())
//         .then(data => {
//             fromDb = data;
//         });


function showSelectedProducts() {
    // Lấy giỏ hàng từ Local Storage
    const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Hiển thị sản phẩm đã chọn trong trang thanh toán
    const selectedProductsContainer = document.querySelector('.selected-products');
    if (selectedProductsContainer) {
        selectedProductsContainer.innerHTML = '';
    } else {
        console.log('element not found');
    }

    shoppingCart.forEach(item => {
        const productItem = document.createElement('div');
        productItem.classList.add('box');
        productItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="content">
          <h3>${item.name}</h3>
          <span class="price">${item.price}VNĐ - </span>
          <span class="quantity">Số sản phẩm: ${item.quantity}</span>
        </div>
        <i class="fas fa-trash"></i>
      `;
        if (selectedProductsContainer) {

            selectedProductsContainer.appendChild(productItem);
        }
    });

    const trashIcons = document.querySelectorAll('.box i');
    trashIcons.forEach(trashIcon => {
        trashIcon.addEventListener('click', () => {
            removeItemFromCart(trashIcon);
            updateShoppingCart();
            // showSelectedProducts();
            // checkLoginStatus();
        });
    });
}

function showRecommendedProducts() {
    // Hiển thị sản phẩm gợi ý mua kèm (có thể làm tương tự như showSelectedProducts)
    // ...

    // Ví dụ: Tạo một sản phẩm gợi ý mua kèm để minh họa
    const recommendedProductsContainer = document.querySelector('.recommended-products');
    const recommendedProduct = document.createElement('div');
    recommendedProduct.classList.add('box');
    recommendedProduct.innerHTML = `
      <i class="fas fa-plus"></i>
      <img src="path/to/recommended-product.jpg" alt="Recommended Product">
      <div class="content">
        <h3>Recommended Product</h3>
        <span class="price">$19.99/-</span>
        <button onclick="addToCartRecommended()">Thêm vào giỏ hàng</button>
      </div>
    `;
    recommendedProductsContainer.appendChild(recommendedProduct);
}

function removeItemFromCart(trashIcon) {
    // Lấy giỏ hàng từ Local Storage
    let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Lấy index của sản phẩm trong giỏ hàng
    const index = Array.from(trashIcon.parentElement.parentElement.children).indexOf(trashIcon.parentElement);

    if (index !== -1) {
        // Giảm số lượng sản phẩm
        shoppingCart[index].quantity--;

        // Nếu số lượng sản phẩm là 0, loại bỏ sản phẩm khỏi giỏ hàng
        if (shoppingCart[index].quantity === 0) {
            shoppingCart.splice(index, 1);
        }

        // Lưu giỏ hàng mới vào Local Storage
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

        // Nếu giỏ hàng trống, làm mới trang
        location.reload();
    }
}

function applyDiscount() {
    // Xử lý áp dụng mã giảm giá (có thể thêm logic tại đây)
    // ...
}

function addToCartRecommended() {
    // Xử lý thêm sản phẩm gợi ý vào giỏ hàng (có thể thêm logic tại đây)
    // ...
}

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

function processPayment() {
    // Simulate a payment process (you may want to implement a real payment gateway here)
    // ...
    // Hiển thị thông báo hoàn tất thanh toán
    const successMessage = document.getElementById('payment-success-message');
    if (successMessage) {

        successMessage.style.display = 'block';
    }
    const order = JSON.parse(localStorage.getItem('shoppingCart'))
    if (order) {
        order.forEach(item =>{
            onProductSold(item.id, item.quantity, item.quantity * item.price)
        }) 
        // Xóa giỏ hàng sau khi thanh toán (bạn có thể điều chỉnh theo yêu cầu của bạn)
        localStorage.removeItem('shoppingCart');
    }

    // Cập nhật lại số lượng sản phẩm trong badge
    updateShoppingCart();
}

document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
});

function checkLoginStatus() {
    const account = JSON.parse(localStorage.getItem('Account'));

    const checkoutContainer = document.getElementById('checkout-container');
    const loginMessageContainer = document.getElementById('login-message');
    if (loginMessageContainer) {
        loginMessageContainer.innerHTML = ''; // Xóa nội dung cũ
    } else {
        console.log('element not found');
    }

    if (account && account.email && account.password) {
        // Nếu có thông tin tài khoản, cho rằng đã đăng nhập
        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Thanh toán';
        checkoutButton.classList.add('btn-checkout');
        checkoutButton.addEventListener('click', processPayment);
        
        if (checkoutContainer) {

            checkoutContainer.appendChild(checkoutButton);
        }
        
    } else {
        // Nếu không có thông tin tài khoản, hiển thị thông báo đăng nhập
        const loginMessage = document.createElement('p');
        loginMessage.textContent = 'Vui lòng đăng nhập để thanh toán.';
        if (loginMessageContainer) {

            loginMessageContainer.appendChild(loginMessage);
        }
    }
}

// Hàm lấy thông tin sản phẩm theo ID
function getProductById(productId) {
    // products = JSON.parse(localStorage.getItem('products'))
    // initializeProducts();
    console.log('====================================');
    console.log(fromDb);
    console.log('====================================');
    return fromDb.find(product => product.id === productId);
}

// Hàm cập nhật sản phẩm trong dữ liệu
function updateProduct(product) {
    const index = fromDb.findIndex(p => p.id === product.id);
    if (index !== -1) {
        fromDb[index] = product;
    }
}


// Gọi hàm khởi tạo dữ liệu khi trang được load

// Hàm khi sản phẩm được click
function onProductClick(productId) {
    const product = getProductById(productId);
    if (product) {
        product.clicks = (product.clicks || 0) + 1;
        updateProduct(product);
    }
}

// Hàm khi sản phẩm được bán
function onProductSold(productId, quantity, totalPrice) {
    const product = getProductById(productId);
    if (product) {
        product.quantitySold = (product.quantitySold || 0) + quantity;
        product.totalRevenue = (product.totalRevenue || 0) + totalPrice;
        updateProduct(product);

        // Lưu thông tin vào localStorage
        saveTransactionInfo(productId, quantity, totalPrice);
    }
}

// Hàm lưu thông tin giao dịch vào localStorage
function saveTransactionInfo(productId, quantity, totalPrice) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({
        productId: productId,
        quantity: quantity,
        totalPrice: totalPrice,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    // location.reload();
}


