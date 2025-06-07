let order = [];
let total = 0;

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('hidden');
}

function addToOrder(item, price) {
  order.push({ item, price });
  total += price;
  updateOrderSummary();
}

function updateOrderSummary() {
  const orderItems = document.getElementById('orderItems');
  const orderTotal = document.getElementById('orderTotal');
  orderItems.innerHTML = '';
  order.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.item} - ₦${item.price}`;
    orderItems.appendChild(li);
  });
  orderTotal.textContent = total;
}

function submitOrder() {
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('customerAddress').value;

  if (!name || !phone || !address || order.length === 0) {
    alert('Please fill in all fields and add items to your order.');
    return;
  }

  const orderData = {
    name,
    phone,
    address,
    items: order,
    total
  };

  // Store order locally (for demo purposes)
  localStorage.setItem('lastOrder', JSON.stringify(orderData));
  alert('Order submitted successfully! Check console for details.');
  console.log('Order Details:', orderData);

  // Reset form
  order = [];
  total = 0;
  updateOrderSummary();
  document.getElementById('customerName').value = '';
  document.getElementById('customerPhone').value = '';
  document.getElementById('customerAddress').value = '';
}

// Scroll effect for menu items
function handleScroll() {
  const menuItems = document.querySelectorAll('.menu-item');
  const triggerBottom = window.innerHeight * 0.85; // Trigger when item is 85% in view

  menuItems.forEach(item => {
    const boxTop = item.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      item.classList.add('visible');
    } else {
      item.classList.remove('visible');
    }
  });
}

// Run on scroll and initial load
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);