// Lấy thông tin từ localStorage
const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Hiển thị thông tin trên trang admin
transactions.forEach(transaction => {
    // Hiển thị thông tin giao dịch
    console.log(`Product ID: ${transaction.productId}, Quantity: ${transaction.quantity}, Total Price: ${transaction.totalPrice}, Timestamp: ${transaction.timestamp}`);
});
