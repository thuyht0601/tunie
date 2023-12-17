let products = null;
let filteredProducts = null;

// Lấy dữ liệu từ file JSON và thêm vào HTML
fetch('data/products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    addDataToHTML(products);
  });

// Thêm sự kiện khi người dùng thay đổi giá trị trong ô tìm kiếm

const elSearch = document.getElementById('search');
if (elSearch) {
  elSearch.addEventListener('input', function () {
    searchProducts(this.value.trim());
  });
}

function addDataToHTML(products) {
  let listProductHTML = document.querySelector('.listProduct');

  // Xóa dữ liệu hiện tại từ HTML
  listProductHTML.innerHTML = '';

  // Thêm dữ liệu mới
  if (products != null) {
    products.forEach(product => {
      const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
      let newProduct = document.createElement('a');
      newProduct.href = '/product_detail.html?id=' + product.id;
      newProduct.classList.add('item');
      if (product.discount > 0) {
        newProduct.innerHTML = 
          `<img src="${product.image}" alt="">
          <div class="discount-badge">${product.discount}%</div>
          <h2>${product.name}</h2>
          <div class="price">
            <span class="original-price">${product.price}</span>
            <span class="discounted-price">${discountedPrice}VNĐ</span>
          </div>`;
      } else {
        newProduct.innerHTML = 
          `<img src="${product.image}" alt="">
          <div class="discount-badge">${product.discount}%</div>
          <h2>${product.name}</h2>
          <div class="price">${product.price}VNĐ</div>`;
      }
      listProductHTML.appendChild(newProduct);
    });
  }
}

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return (originalPrice - discountAmount);
}

function searchProducts(searchTerm) {
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  addDataToHTML(filteredProducts);
}

fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        filteredProducts = [...products];
        showProducts();
    });

function showProducts() {
  // Hiển thị danh sách sản phẩm sau khi áp dụng bộ lọc
  let listProduct = document.querySelector('.listProduct');
  listProduct.innerHTML = '';

  
  filteredProducts.forEach(product => {
    let newProduct = document.createElement('a');
    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
    newProduct.href = '/product_detail.html?id=' + product.id;
    newProduct.classList.add('item');
    if (product.discount > 0) {
      newProduct.innerHTML = 
        `<img src="${product.image}" alt="">
        <div class="discount-badge">${product.discount}%</div>
        <h2>${product.name}</h2>
        <div class="price">
          <span class="original-price">${product.price}</span>
          <span class="discounted-price">${discountedPrice}VNĐ</span>
        </div>`;
    } else {
      newProduct.innerHTML = 
        `<img src="${product.image}" alt="">
        <div class="discount-badge">${product.discount}%</div>
        <h2>${product.name}</h2>
        <div class="price">${product.price}VNĐ</div>`;
    }
    listProduct.appendChild(newProduct);
  });
}

function applyFilters() {
  // Lấy giá trị của các ô lọc
  const searchKeyword = document.getElementById('search').value.toLowerCase();
  const selectedCategory = document.getElementById('category').value;
  const sortBy = document.getElementById('sort').value;
  const filterBy = document.getElementById('filter').value;

  // Áp dụng bộ lọc
  filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchKeyword);
    const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sắp xếp danh sách sản phẩm
  if (sortBy === 'az') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'za') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }
  else if (sortBy === 'asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'dsc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Lọc theo thuộc tính được chọn (đây là ví dụ cho thuộc tính "discount")
  if (filterBy === 'discount') {
    filteredProducts = filteredProducts.filter(product => product.discount >= 0);
  } else {
    filteredProducts = filteredProducts.filter(product => product.discount == filterBy);
  }

  // Hiển thị danh sách sản phẩm sau khi áp dụng bộ lọc và sắp xếp
  showProducts();
}

document.addEventListener('DOMContentLoaded', function () {
  const trashIcons = document.querySelectorAll('.box i');
    trashIcons.forEach(trashIcon => {
        trashIcon.addEventListener('click', () => {
            removeItemFromCart(trashIcon);
            updateShoppingCart();
            // showSelectedProducts();
            checkLoginStatus();
        });
    }); // Nếu có thông tin đăng nhập, cập nhật trạng thái đăng nhập
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
  checkoutButton.href = '/order.html';
  checkoutButton.classList.add('btn');
  checkoutButton.innerText = 'Thanh toán';
  shoppingCartContainer.appendChild(checkoutButton);
}


//
// Hàm khởi tạo dữ liệu sản phẩm
function initializeProducts() {
  // Lấy dữ liệu từ file JSON hoặc từ API
  fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
      products = data;
    });
}

// Hàm lấy thông tin sản phẩm theo ID
function getProductById(productId) {
  return products.find(product => product.id === productId);
}

// Hàm cập nhật sản phẩm trong dữ liệu
function updateProduct(product) {
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
  }
}


// Gọi hàm khởi tạo dữ liệu khi trang được load
initializeProducts();

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
}
