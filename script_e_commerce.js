// ================== SỰ KIỆN LOAD TRANG ================== //
document.addEventListener('DOMContentLoaded', () => {

    // ================== BIẾN TOÀN CỤC ================== //
    const productContainer = document.querySelector('.products-container');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartPopup = document.getElementById('cart-popup');
    const accountPopup = document.getElementById('account-popup');
    const invoicePopup = document.getElementById('invoice-popup'); // Đã chuyển vào trong DOMContentLoaded
    const invoiceContentDiv = document.getElementById('invoice-content'); // Đã chuyển vào trong DOMContentLoaded

    let cart = []; // Giỏ hàng (array lưu sản phẩm)

    // ==================================================== //
    // =============== ĐỒNG HỒ HIỆN TẠI =================== //
    // ==================================================== //
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        document.getElementById('hour').textContent = formattedHours;
        document.getElementById('minute').textContent = formattedMinutes;
        document.getElementById('second').textContent = formattedSeconds;
        document.getElementById('ampm').textContent = ampm;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // ==================================================== //
    // =============== XỬ LÝ POPUP GIỎ HÀNG =============== //
    // ==================================================== //
    
    // Hàm hiển thị/ẩn pop-up giỏ hàng
    function toggleCartPopup() {
        cartPopup.classList.toggle('show');
    }

    // Gắn sự kiện click cho nút "Giỏ hàng" trong menu
    document.getElementById('cart-link').addEventListener("click", function(e) {
        e.preventDefault();
        toggleCartPopup();
    });

    // Gắn sự kiện click cho nút đóng pop-up giỏ hàng
    cartPopup.querySelector('.close-btn').addEventListener("click", function() {
        toggleCartPopup();
    });

    // ==================================================== //
    // ============== XỬ LÝ POPUP TÀI KHOẢN =============== //
    // ==================================================== //

    // Hàm hiển thị/ẩn pop-up tài khoản
    function toggleAccountPopup() {
        accountPopup.classList.toggle('show');
    }

    // Gắn sự kiện click cho nút "Tài khoản" trong menu
    document.getElementById('account-link').addEventListener("click", function(e) {
        e.preventDefault();
        toggleAccountPopup();
    });

    // Gắn sự kiện click cho nút đóng pop-up tài khoản
    accountPopup.querySelector('.close-btn').addEventListener("click", function() {
        toggleAccountPopup();
    });

    // ==================================================== //
    // ============== XỬ LÝ POPUP HÓA ĐƠN ================= //
    // ==================================================== //

    // Hàm hiển thị/ẩn pop-up hóa đơn
    function toggleInvoicePopup() {
        invoicePopup.classList.toggle('show');
    }
    
    // Gắn sự kiện click cho nút đóng pop-up hóa đơn
    if (invoicePopup) {
        invoicePopup.querySelector('.close-btn').addEventListener("click", function() {
            toggleInvoicePopup();
        });
    }

    // Gắn sự kiện để đóng tất cả pop-up khi click ra ngoài
    window.addEventListener('click', (e) => {
        if (e.target === cartPopup) {
            toggleCartPopup();
        }
        if (e.target === accountPopup) {
            toggleAccountPopup();
        }
        if (e.target === invoicePopup) {
            toggleInvoicePopup();
        }
    });

    // ==================================================== //
    // =============== XỬ LÝ THÊM VÀO GIỎ HÀNG ============ //
    // ==================================================== //

    // Hàm thêm sản phẩm vào giỏ hàng
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        updateCartDisplay();
        toggleCartPopup(); // Tự động mở giỏ hàng khi thêm sản phẩm
    }

    // Cập nhật giao diện giỏ hàng
    function updateCartDisplay() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ`;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = total.toLocaleString('vi-VN');
    }

    // ==================================================== //
    // ================== XUẤT HÓA ĐƠN ==================== //
    // ==================================================== //

    // Hàm tạo nội dung hóa đơn
    function generateInvoice() {
        let invoiceContent = '<h3>Hóa đơn thanh toán</h3>';
        invoiceContent += '<p><strong>SHOP WIND\'S</strong></p>';
        invoiceContent += '<p>Ngày: ' + new Date().toLocaleString('vi-VN') + '</p>';
        invoiceContent += '<hr>';
        invoiceContent += '<h4>Thông tin sản phẩm:</h4>';

        let total = 0;
        
        cart.forEach(item => {
            invoiceContent += `<p>${item.name} x${item.quantity} - ${item.price.toLocaleString('vi-VN')} VNĐ</p>`;
            total += item.price * item.quantity;
        });

        invoiceContent += '<hr>';
        invoiceContent += `<p><strong>Tổng tiền: ${total.toLocaleString('vi-VN')} VNĐ</strong></p>`;
        invoiceContent += '<p>Cảm ơn quý khách đã mua sắm!</p>';

        return invoiceContent;
    }

    // ==================================================== //
    // ================== THANH TOÁN ====================== //
    // ==================================================== //
    function checkout() {
        if (cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }
        
        const invoiceHTML = generateInvoice();
        
        // Chèn nội dung hóa đơn vào pop-up
        if (invoiceContentDiv) { // Kiểm tra để đảm bảo phần tử tồn tại
            invoiceContentDiv.innerHTML = invoiceHTML;
            
            // Hiển thị pop-up hóa đơn
            toggleInvoicePopup();
        }

        // Xóa giỏ hàng và cập nhật giao diện
        cart = [];
        updateCartDisplay();
        
        // Đóng pop-up giỏ hàng
        toggleCartPopup();
    }

    // ==================================================== //
    // =============== LẮNG NGHE SỰ KIỆN ================== //
    // ==================================================== //

    // Click nút "Thêm vào giỏ hàng"
    productContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productElement = e.target.closest('.product');
            const productId = productElement.dataset.id;
            const productName = productElement.dataset.name;
            const productPrice = parseFloat(productElement.dataset.price);

            addToCart(productId, productName, productPrice);
        }
    });

    // Click nút "Thanh toán"
    checkoutBtn.addEventListener('click', checkout);
});