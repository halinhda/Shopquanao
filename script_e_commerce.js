// ================== SỰ KIỆN LOAD TRANG ================== //
document.addEventListener('DOMContentLoaded', () => {

    // ================== BIẾN TOÀN CỤC ================== //
    const productContainer = document.querySelector('.products-container');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

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

        // Format số (thêm số 0 phía trước nếu < 10)
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        // Render ra UI
        document.getElementById('hour').textContent = formattedHours;
        document.getElementById('minute').textContent = formattedMinutes;
        document.getElementById('second').textContent = formattedSeconds;
        document.getElementById('ampm').textContent = ampm;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // ==================================================== //
    // =============== XỬ LÝ GIỎ HÀNG ===================== //
    // ==================================================== //

    // 1. Thêm sản phẩm vào giỏ
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        renderCart();
    }

    // 2. Render giỏ hàng ra UI
    function renderCart() {
        cartItemsList.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>${(item.price * item.quantity).toLocaleString()} VNĐ</span>
            `;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = total.toLocaleString();
    }

    // 3. Thanh toán
    function checkout() {
        if (cart.length > 0) {
            alert(`Tổng số tiền cần thanh toán là: ${cartTotalSpan.textContent} VNĐ. Cảm ơn bạn đã mua sắm!`);
            cart = [];
            renderCart();
        } else {
            alert('Giỏ hàng của bạn đang trống.');
        }
    }

    // ==================================================== //
    // =============== LẮNG NGHE SỰ KIỆN ================== //
    // ==================================================== //

    // Click nút thêm vào giỏ
    productContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productElement = e.target.closest('.product');
            const productId = productElement.dataset.id;
            const productName = productElement.dataset.name;
            const productPrice = parseFloat(productElement.dataset.price);

            addToCart(productId, productName, productPrice);
        }
    });

    // Click nút thanh toán
    checkoutBtn.addEventListener('click', checkout);

});
