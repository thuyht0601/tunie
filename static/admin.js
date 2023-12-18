document.addEventListener('DOMContentLoaded', function () {
    // Hiển thị danh sách giao dịch
    displayTransactionList();

    // Hiển thị tổng doanh thu
    displayTotalRevenue();
});

// Hàm hiển thị danh sách giao dịch
function displayTransactionList() {
    const transactionListContainer = document.getElementById('transactionList');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    if (transactions.length > 0) {
        const transactionListHTML = transactions.map(transaction => {
            return `<p>Sản phẩm ID: ${transaction.productId}, Số lượng: ${transaction.quantity}, Tổng giá: ${transaction.totalPrice}, Thời gian: ${transaction.timestamp}</p>`;
        }).join('');

        transactionListContainer.innerHTML = transactionListHTML;
    } else {
        transactionListContainer.innerHTML = '<p>Chưa có giao dịch nào.</p>';
    }
}

// Hàm hiển thị tổng doanh thu
function displayTotalRevenue() {
    const totalRevenueContainer = document.getElementById('totalRevenue');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    // const products = JSON.parse(localStorage.getItem('products')) || [];
    // const totalClicks = products[0].clicks;
    const totalRevenue = transactions.reduce((total, transaction) => total + transaction.totalPrice, 0);

    let totalQuantity = 0;

    transactions.forEach(transaction => {
        totalQuantity += transaction.quantity;
    });

    totalRevenueContainer.innerHTML = `<p style="font-size: 18px; color: red">Tổng doanh thu: ${totalRevenue} VNĐ</p>
    
    <p style="font-size: 18px; color: red">Số lượng sản phẩm được bán: ${totalQuantity}</p>`;

    // <p style="font-size: 18px; color: red">Tổng lượt xem sản phẩm: ${totalClicks}</p>
}
