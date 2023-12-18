let products = null;
// showDetail();
updateShoppingCart();
// get datas from file json
fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        showDetail();
    })

document.addEventListener('DOMContentLoaded', function () {
    const trashIcons = document.querySelectorAll('.box i');
    trashIcons.forEach(trashIcon => {
        trashIcon.addEventListener('click', () => {
            removeItemFromCart(trashIcon);
            updateShoppingCart();
            // showSelectedProducts();
            // checkLoginStatus();
        });
    });

    // Gọi hàm cập nhật số lượng khi trang web được load
    // updateShoppingCart();
});

function showDetail() {
    // remove datas default from HTML
    let detail = document.querySelector('.detail');
    let listProduct = document.querySelector('.listProduct');
    let productId = new URLSearchParams(window.location.search).get('id');
    let thisProduct = products.filter(value => value.id == productId)[0];
    //if there is no product with id = productId => return to home page
    if (!thisProduct) {
        window.location.href = "/tunie_v1.0/";
    }

    detail.querySelector('.image img').src = thisProduct.image;
    detail.querySelector('.name').innerText = thisProduct.name;

    let priceHTML = `<div class="price">`;
    if (thisProduct.discount > 0) {
        const discountedPrice = calculateDiscountedPrice(thisProduct.price, thisProduct.discount);
        priceHTML += `<span style="text-decoration: line-through;font-size: 20px;padding-right: 12px;">${thisProduct.price}</span>
        <span style="font-size: 20px;color: #1FB3C7;">${discountedPrice}VNĐ</span>`;
    } else {
        priceHTML += `${thisProduct.price}`
    }
    priceHTML += `</div>`;
    const discountBadge = detail.querySelector('.discount-badge');
    discountBadge.innerText = `-${thisProduct.discount}%`;
    detail.querySelector('.price').innerHTML = priceHTML;

    // detail.querySelector('.price').innerText = thisProduct.price + 'VNĐ';
    detail.querySelector('.description').innerText = thisProduct.description;


    (products.filter(value => value.id !== productId && value.type === thisProduct.type)).forEach(product => {
        let newProduct = document.createElement('a');
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
        newProduct.href = '/tunie_v1.0/product_detail.html?id=' + product.id;
        newProduct.classList.add('item');
        if (product.discount > 0) {
            newProduct.innerHTML =
                `<img src="${product.image}" alt="">
                <div class="discount-badge">-${product.discount}%</div>
                <h2>${product.name}</h2>
                <div class="price">
                <span class="original-price">${product.price}</span>
                <span class="discounted-price">${discountedPrice}VNĐ</span>
                </div>`;
        } else {
            newProduct.innerHTML =
                `<img src="${product.image}" alt="">
                <div class="discount-badge">-0%</div>
                <h2>${product.name}</h2>
                <div class="price">${product.price}VNĐ</div>`;
        }
        listProduct.appendChild(newProduct);

        // onProductClick(product.id);
    });

    const addToCartButton = document.querySelector('.add-to-cart-button');
    addToCartButton.addEventListener('click', () => {
        addToCart(thisProduct);
    });

    const commentList = document.querySelector('.comment-list');
    thisProduct.reviews.forEach(comment => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${comment.user}:</strong> ${comment.comment}`;
        if (commentList) {

            commentList.appendChild(listItem);
        }
    });
}

function addToCart(product) {
    console.log('====================================');
    console.log(product);
    console.log('====================================');
    // Lấy giỏ hàng từ Local Storage hoặc tạo mới nếu chưa tồn tại
    let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProduct = shoppingCart.find(item => item.id === product.id);

    if (existingProduct) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        existingProduct.quantity++;
    } else {
        let discountedPrice = 1;
        if (product.discount > 0) {
            discountedPrice = product.price - product.price * (product.discount/100)
        } else {
            discountedPrice = product.price
        }
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        shoppingCart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: discountedPrice,
            quantity: 1
        });
    }

    // Lưu giỏ hàng mới vào Local Storage
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

    // Cập nhật hiển thị giỏ hàng
    updateShoppingCart();
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

    // Cập nhật số lượng mặt hàng trong giỏ hàng
    const cartItemCountElement = document.getElementById('cartItemCount');
    if (cartItemCountElement) {
        const cartItemCount = shoppingCart.reduce((acc, item) => acc + item.quantity, 0);
        cartItemCountElement.innerText = cartItemCount.toString();
    }
}

function calculateDiscountedPrice(originalPrice, discountPercentage) {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    return (originalPrice - discountAmount);
}

function goBack() {
    // Chuyển hướng về trang danh sách sản phẩm (index.html)
    window.location.href = "/tunie_v1.0/products.html";
}


document.addEventListener('DOMContentLoaded', function () {
    // ... (Các phần còn lại) ...
    showComments();
});

function showComments() {
    const commentList = document.getElementById('comment-list');
    const productId = getProductIdFromUrl(); // Lấy productId từ URL

    const comments = getCommentsFromLocalStorage(productId);

    if (comments.length > 0) {
        commentList.innerHTML = '';
        comments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.classList.add('comment-item');
            commentItem.style.border = '1px solid #ddd';
            commentItem.style.borderRadius = '5px';
            commentItem.style.padding = '10px';
            commentItem.style.marginBottom = '10px';
            commentItem.style.backgroundColor = 'white'
            commentItem.innerHTML = `<p>${comment.username} - ${comment.time}: ${comment.text}</p>`;
            commentList.appendChild(commentItem);
        });
    } else {
        commentList.innerHTML = '<p>Chưa có bình luận nào.</p>';
    }
}

function addComment() {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    const productId = getProductIdFromUrl(); // Lấy productId từ URL

    if (commentText !== '') {
        const comments = getCommentsFromLocalStorage(productId);
        const username = getUsernameFromLocalStorage(); // Đặt tên người dùng từ Local Storage

        const newComment = {
            username: username,
            text: commentText,
            time: getCurrentTime()
        };

        comments.push(newComment);
        localStorage.setItem(`productComments_${productId}`, JSON.stringify(comments));

        // Hiển thị lại danh sách bình luận
        showComments();

        // Xóa nội dung trong ô nhập liệu
        commentInput.value = '';
    }
}

function getCommentsFromLocalStorage(productId) {
    return JSON.parse(localStorage.getItem(`productComments_${productId}`)) || [];
}

function getProductIdFromUrl() {
    // Giả sử rằng productId được truyền qua tham số trên URL
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('id');
}

function getUsernameFromLocalStorage() {
    // Giả sử rằng bạn đã lưu tên người dùng trong Local Storage khi đăng nhập
    return localStorage.getItem('username') || 'Anonymous';
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Hàm cập nhật sản phẩm trong dữ liệu
function updateProduct(product) {
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
        products[index] = product;
        localStorage.setItem('products', JSON.stringify(products));
    }
}


// Gọi hàm khởi tạo dữ liệu khi trang được load
// initializeProducts();

// Hàm khi sản phẩm được click
function onProductClick(productId) {
    const product = getProductById(productId);
    if (product) {
        product.clicks = (product.clicks || 0) + 1;
        updateProduct(product);
    }
}

