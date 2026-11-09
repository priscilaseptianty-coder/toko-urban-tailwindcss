// ==========================================================================
// Kila Wonderland - E-Commerce Core & Interactivity (Tailwind CSS v4 Compatible)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Storage Keys & State
  // ------------------------------------------------------------------------
  const CART_STORAGE_KEY = 'kila_wonderland_cart';
  const CUSTOMER_STORAGE_KEY = 'kila_wonderland_customer';

  let cart = [];
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem('toko_urban_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      // Fallback if storage unavailable
    }
    updateCartUI();
  }

  // ------------------------------------------------------------------------
  // 2. Toast Notification System
  // ------------------------------------------------------------------------
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4';
    document.body.appendChild(toastContainer);
  }

  function showToast(title, subtitle, imgUrl) {
    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-brand-primary-border shadow-card text-brand-text-main text-xs sm:text-sm transform transition-all duration-300 translate-y-4 opacity-0';

    const imgMarkup = imgUrl
      ? `<img src="${imgUrl}" alt="${title}" class="w-11 h-11 rounded-xl object-cover border border-pink-100 shrink-0">`
      : `<div class="w-10 h-10 rounded-xl bg-pink-100 text-brand-primary flex items-center justify-center font-bold shrink-0">✓</div>`;

    toast.innerHTML = `
      ${imgMarkup}
      <div class="flex-1 min-w-0">
        <p class="font-bold text-brand-text-main truncate">${title}</p>
        <p class="text-[11px] text-brand-text-secondary truncate">${subtitle || 'Ditambahkan ke keranjang belanja'}</p>
      </div>
      <button type="button" class="text-xs font-bold text-brand-primary hover:text-brand-primary-hover px-2 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors shrink-0 cursor-pointer" id="toastOpenCart">
        Lihat
      </button>
    `;

    toast.querySelector('#toastOpenCart').addEventListener('click', () => {
      openCartDrawer();
      toast.remove();
    });

    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto dismiss after 3.5s
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ------------------------------------------------------------------------
  // 3. Cart UI & Render
  // ------------------------------------------------------------------------
  function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const cartSubtotalPrice = document.getElementById('cartSubtotalPrice');
    const checkoutWaBtn = document.getElementById('checkoutWaBtn');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cartBadge) {
      cartBadge.textContent = totalQty;
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center py-14 px-4 text-brand-text-muted">
          <div class="w-16 h-16 rounded-2xl bg-brand-primary-light/60 flex items-center justify-center text-brand-primary mb-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <p class="font-bold text-brand-text-main text-base mb-1">Keranjang Anda masih kosong</p>
          <p class="text-xs text-brand-text-secondary max-w-xs">Yuk jelajahi produk pilihan kami dan temukan barang favoritmu!</p>
        </div>
      `;
      if (cartTotalPrice) cartTotalPrice.textContent = 'Rp0';
      if (cartSubtotalPrice) cartSubtotalPrice.textContent = 'Rp0';
      if (checkoutWaBtn) {
        checkoutWaBtn.setAttribute('disabled', 'true');
        checkoutWaBtn.classList.add('opacity-50', 'pointer-events-none');
      }
      return;
    }

    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    });

    if (cartTotalPrice) cartTotalPrice.textContent = formatter.format(totalPrice);
    if (cartSubtotalPrice) cartSubtotalPrice.textContent = formatter.format(totalPrice);

    cartItemsContainer.innerHTML = cart
      .map(
        (item, index) => `
        <div class="cart-item flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-brand-primary-border shadow-subtle hover:border-brand-primary/40 transition-colors">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img w-16 h-16 rounded-xl object-cover border border-pink-100 shrink-0">
          <div class="cart-item-info flex-1 min-w-0">
            <h4 class="cart-item-title font-bold text-xs sm:text-sm text-brand-text-main truncate">${item.name}</h4>
            <p class="cart-item-variant text-[11px] text-brand-text-muted mt-0.5">Varian: <span class="font-medium text-brand-text-secondary">${item.variant || 'Standar'}</span></p>
            <p class="cart-item-price font-extrabold text-xs sm:text-sm text-brand-primary mt-1">${formatter.format(item.price)}</p>
          </div>
          <div class="cart-item-actions flex flex-col items-end gap-2 shrink-0">
            <div class="qty-control flex items-center border border-pink-200 rounded-lg bg-pink-50/50 overflow-hidden">
              <button type="button" class="qty-btn w-6 h-6 flex items-center justify-center text-brand-text-main hover:bg-pink-100 font-bold text-xs transition-colors cursor-pointer" data-action="decrease" data-index="${index}" aria-label="Kurangi jumlah">−</button>
              <span class="qty-val px-2 text-xs font-bold text-brand-text-main">${item.qty}</span>
              <button type="button" class="qty-btn w-6 h-6 flex items-center justify-center text-brand-text-main hover:bg-pink-100 font-bold text-xs transition-colors cursor-pointer" data-action="increase" data-index="${index}" aria-label="Tambah jumlah">+</button>
            </div>
            <button type="button" class="remove-item-btn text-brand-text-muted hover:text-rose-500 transition-colors p-1 cursor-pointer" data-index="${index}" aria-label="Hapus produk">
              <svg class="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        </div>
      `
      )
      .join('');

    if (checkoutWaBtn) {
      checkoutWaBtn.removeAttribute('disabled');
      checkoutWaBtn.classList.remove('opacity-50', 'pointer-events-none');
    }
  }

  function addToCart(item) {
    const existingIndex = cart.findIndex(
      (c) => c.id === item.id && c.variant === item.variant
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += item.qty || 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        variant: item.variant || 'Standar',
        img: item.img,
        qty: item.qty || 1,
      });
    }

    saveCart();
    showToast(item.name, `Varian: ${item.variant || 'Standar'} berhasil ditambahkan!`, item.img);
    openCartDrawer();
  }

  // ------------------------------------------------------------------------
  // 4. Cart Drawer Controls
  // ------------------------------------------------------------------------
  const cartOverlay = document.getElementById('cartOverlay');
  const cartTriggerBtn = document.getElementById('cartTriggerBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');

  function openCartDrawer() {
    if (cartOverlay) {
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    if (cartOverlay) {
      cartOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (cartTriggerBtn) {
    cartTriggerBtn.addEventListener('click', openCartDrawer);
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartDrawer);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) {
        closeCartDrawer();
      }
    });
  }

  // Keyboard accessibility: ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (checkoutModal && checkoutModal.classList.contains('open')) {
        closeCheckoutModal();
      } else if (cartOverlay && cartOverlay.classList.contains('open')) {
        closeCartDrawer();
      }
    }
  });

  // Quantity controls and remove button
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const index = parseInt(target.getAttribute('data-index'), 10);

      if (action === 'increase') {
        cart[index].qty += 1;
        saveCart();
      } else if (action === 'decrease') {
        if (cart[index].qty > 1) {
          cart[index].qty -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
      } else if (target.classList.contains('remove-item-btn')) {
        cart.splice(index, 1);
        saveCart();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. Checkout Modal & WhatsApp Order Generator
  // ------------------------------------------------------------------------
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutWaBtn = document.getElementById('checkoutWaBtn');

  function openCheckoutModal() {
    if (!checkoutModal) return;
    closeCartDrawer();

    // Prefill customer data if stored
    try {
      const savedCustomer = JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY) || '{}');
      if (savedCustomer.name) document.getElementById('custName').value = savedCustomer.name;
      if (savedCustomer.phone) document.getElementById('custPhone').value = savedCustomer.phone;
      if (savedCustomer.address) document.getElementById('custAddress').value = savedCustomer.address;
      if (savedCustomer.courier) document.getElementById('custCourier').value = savedCustomer.courier;
      if (savedCustomer.payment) document.getElementById('custPayment').value = savedCustomer.payment;
    } catch (e) {}

    // Update mini-summary in checkout modal
    const modalSummary = document.getElementById('modalOrderSummary');
    if (modalSummary) {
      const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
      const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      modalSummary.innerHTML = `
        <div class="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 text-xs text-brand-text-main space-y-1.5">
          <div class="flex justify-between font-bold">
            <span>Jumlah Pesanan (${cart.reduce((s, i) => s + i.qty, 0)} item)</span>
            <span class="text-brand-primary">${formatter.format(totalPrice)}</span>
          </div>
          <p class="text-[11px] text-brand-text-muted">Ongkos Kirim: <strong class="text-emerald-600">GRATIS (Promo Flash Sale)</strong></p>
        </div>
      `;
    }

    checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    if (!checkoutModal) return;
    checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (checkoutWaBtn) {
    checkoutWaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (cart.length === 0) return;
      openCheckoutModal();
    });
  }

  if (checkoutCloseBtn) {
    checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
  }

  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        closeCheckoutModal();
      }
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const custName = document.getElementById('custName')?.value.trim() || 'Pelanggan';
      const custPhone = document.getElementById('custPhone')?.value.trim() || '-';
      const custAddress = document.getElementById('custAddress')?.value.trim() || '-';
      const custCourier = document.getElementById('custCourier')?.value || 'J&T Express';
      const custPayment = document.getElementById('custPayment')?.value || 'BCA Virtual Account';
      const custNote = document.getElementById('custNote')?.value.trim() || '-';

      // Save to localStorage for convenience
      try {
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify({
          name: custName,
          phone: custPhone,
          address: custAddress,
          courier: custCourier,
          payment: custPayment,
        }));
      } catch (err) {}

      const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
      const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

      // Construct professional WhatsApp message
      let waMsg = `*FORM PEMESANAN RESMI KILA WONDERLAND*%0A`;
      waMsg += `==============================%0A%0A`;
      waMsg += `*Halo CS Kila Wonderland! Saya ingin memesan produk berikut:*%0A%0A`;

      cart.forEach((item, idx) => {
        waMsg += `${idx + 1}. *${item.name}*%0A`;
        waMsg += `   - Varian: ${item.variant || 'Standar'}%0A`;
        waMsg += `   - Jumlah: ${item.qty} pcs%0A`;
        waMsg += `   - Subtotal: ${formatter.format(item.price * item.qty)}%0A%0A`;
      });

      waMsg += `------------------------------%0A`;
      waMsg += `*Total Pembayaran: ${formatter.format(totalPrice)}*%0A`;
      waMsg += `*Ongkos Kirim: GRATIS (Promo Bebas Ongkir)*%0A%0A`;

      waMsg += `*DATA PENERIMA & PENGIRIMAN:*%0A`;
      waMsg += `- *Nama Penerima:* ${custName}%0A`;
      waMsg += `- *Nomor Kontak/WA:* ${custPhone}%0A`;
      waMsg += `- *Alamat Lengkap:* ${custAddress}%0A`;
      waMsg += `- *Pilihan Ekspedisi:* ${custCourier}%0A`;
      waMsg += `- *Metode Pembayaran:* ${custPayment}%0A`;
      if (custNote && custNote !== '-') {
        waMsg += `- *Catatan Khusus:* ${custNote}%0A`;
      }
      waMsg += `%0AMohon verifikasi ketersediaan stok & konfirmasi rekening tujuan. Terima kasih!`;

      closeCheckoutModal();

      // Open WhatsApp chat
      window.open(`https://wa.me/6281234567890?text=${waMsg}`, '_blank');
    });
  }

  // ------------------------------------------------------------------------
  // 6. Quick Add Buttons (Katalog index.html)
  // ------------------------------------------------------------------------
  const quickAddBtns = document.querySelectorAll('.quick-add-btn');
  quickAddBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      const variant = btn.getAttribute('data-variant');
      const img = btn.getAttribute('data-img');

      addToCart({ id, name, price, variant, img, qty: 1 });
    });
  });

  // ------------------------------------------------------------------------
  // 7. Detail Page Functionality (Size/Variant & Beli Sekarang)
  // ------------------------------------------------------------------------
  const sizeButtons = document.querySelectorAll('.size-btn');
  const buyButton = document.querySelector('.buy-button');
  const buyWaButton = document.querySelector('.buy-wa-button');
  const feedbackEl = document.getElementById('purchaseFeedback');

  let selectedOption = document.querySelector('.size-btn.active')?.textContent.trim() || '';

  sizeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      sizeButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      selectedOption = button.textContent.trim();

      if (feedbackEl) {
        feedbackEl.className = 'purchase-feedback';
        feedbackEl.textContent = '';
      }

      // Update WA Buy Button link if present
      if (buyWaButton) {
        const title = document.querySelector('.detail-title')?.textContent.trim() || 'Produk';
        const price = document.querySelector('.detail-price')?.textContent.trim() || '';
        const msg = `Halo Kila Wonderland, saya ingin memesan *${title}* varian *${selectedOption}* seharga *${price}*. Apakah stok masih tersedia?`;
        buyWaButton.href = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
      }
    });
  });

  if (buyButton) {
    buyButton.addEventListener('click', () => {
      const title = document.querySelector('.detail-title')?.textContent.trim() || 'Produk';
      const priceText = document.querySelector('.detail-price')?.textContent.replace(/[^0-9]/g, '') || '0';
      const imgEl = document.querySelector('.detail-image');
      const img = imgEl ? imgEl.getAttribute('src') : 'images/sepatu-urban.jpg';
      const id = window.location.pathname.includes('tas') ? 'tas-detail' : 'sepatu-detail';

      addToCart({
        id: id,
        name: title,
        price: parseInt(priceText, 10),
        variant: selectedOption,
        img: img,
        qty: 1,
      });

      if (feedbackEl) {
        feedbackEl.className = 'purchase-feedback show p-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 my-3';
        feedbackEl.innerHTML = `✓ Berhasil! <strong>${title} (${selectedOption})</strong> telah ditambahkan ke keranjang belanja Anda.`;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. Testimonial Tab Switcher
  // ------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.review-tabs .tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');

      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabPanels.forEach((panel) => panel.classList.remove('active'));

      button.classList.add('active');
      const activePanel = document.getElementById(targetId);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 9. Mobile Hamburger Navigation
  // ------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navbarMenu = document.getElementById('navbarMenu');

  if (menuToggle && navbarMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navbarMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navbarMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navbarMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Initialize cart on load
  updateCartUI();
});
