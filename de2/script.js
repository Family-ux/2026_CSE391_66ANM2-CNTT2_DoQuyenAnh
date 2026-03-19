const STORAGE_KEY = "hotelBookings";
const TOTAL_ROOMS = 100;

// ==================== COMMON ====================
function getBookings() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN");
}

function getRoomPrice(roomType) {
  const prices = {
    Standard: 500000,
    Deluxe: 800000,
    Suite: 1200000,
    VIP: 2000000
  };
  return prices[roomType] || 0;
}

function getDaysBetween(start, end) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diff = d2 - d1;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function clearErrors() {
  const errors = document.querySelectorAll(".error");
  errors.forEach(el => el.textContent = "");
}

function setError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function todayString() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ==================== VALIDATION ====================
function validateForm(isEdit = false, oldBookingId = null) {
  clearErrors();

  const bookingId = document.getElementById("bookingId").value.trim();
  const customerName = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const roomType = document.getElementById("roomType").value;
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const adults = Number(document.getElementById("adults").value);
  const children = Number(document.getElementById("children").value);
  const promoCode = document.getElementById("promoCode").value.trim();
  const confirmPromo = document.getElementById("confirmPromo").value.trim();

  let isValid = true;
  const bookings = getBookings();

  
  if (!/^PH\d{6}$/.test(bookingId)) {
    setError("bookingIdError", "Mã phải có dạng PH123456");
    isValid = false;
  } else {
    const exists = bookings.some(b => b.bookingId === bookingId && b.bookingId !== oldBookingId);
    if (exists) {
      setError("bookingIdError", "Mã đặt phòng đã tồn tại");
      isValid = false;
    }
  }

 
  if (!/^[A-Za-zÀ-Ỹà-ỹ\s]{2,50}$/.test(customerName)) {
    setError("customerNameError", "Tên 2-50 ký tự, chỉ chữ và khoảng trắng");
    isValid = false;
  }

 
  if (!/^0\d{9}$/.test(phone)) {
    setError("phoneError", "SĐT phải 10 số và bắt đầu bằng 0");
    isValid = false;
  }

 
  if (!roomType) {
    setError("roomTypeError", "Vui lòng chọn loại phòng");
    isValid = false;
  }

 
  const today = todayString();
  if (!checkIn) {
    setError("checkInError", "Vui lòng chọn ngày nhận phòng");
    isValid = false;
  } else if (checkIn < today) {
    setError("checkInError", "Check-in không được trước hôm nay");
    isValid = false;
  }

  if (!checkOut) {
    setError("checkOutError", "Vui lòng chọn ngày trả phòng");
    isValid = false;
  } else if (checkIn) {
    const nights = getDaysBetween(checkIn, checkOut);
    if (nights < 1) {
      setError("checkOutError", "Check-out phải sau Check-in ít nhất 1 ngày");
      isValid = false;
    } else if (nights > 30) {
      setError("checkOutError", "Thời gian ở không quá 30 ngày");
      isValid = false;
    }
  }

  
  if (isNaN(adults) || adults < 1 || adults > 4) {
    setError("adultsError", "Số người lớn từ 1 đến 4");
    isValid = false;
  }

  if (isNaN(children) || children < 0 || children > 6) {
    setError("childrenError", "Số trẻ em từ 0 đến 6");
    isValid = false;
  }

  
  if (!/^SAVE20%$/.test(promoCode)) {
    setError("promoCodeError", "Mã phải đúng định dạng SAVE20%");
    isValid = false;
  }

  
  if (confirmPromo !== promoCode) {
    setError("confirmPromoError", "Xác nhận mã phải trùng Promo Code");
    isValid = false;
  }

  if (!isValid) {
    showToast("Vui lòng kiểm tra lại thông tin!", "error");
    return null;
  }

  const totalNights = getDaysBetween(checkIn, checkOut);
  const totalPrice = getRoomPrice(roomType) * totalNights;

  return {
    bookingId,
    customerName,
    phone,
    roomType,
    checkIn,
    checkOut,
    adults,
    children,
    promoCode,
    confirmPromo,
    status: "Booked",
    createdAt: new Date().toISOString(),
    totalPrice
  };
}

// ==================== ADD / EDIT PAGE ====================
function initAddBookingPage() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const editId = params.get("edit");

  if (editId) {
    loadBookingToForm(editId);
    document.getElementById("submitBtn").textContent = "Cập nhật đặt phòng";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const bookingData = validateForm(!!editId, editId);
    if (!bookingData) return;

    let bookings = getBookings();

    if (editId) {
      const index = bookings.findIndex(b => b.bookingId === editId);
      if (index !== -1) {
        bookingData.createdAt = bookings[index].createdAt; // giữ ngày tạo cũ
        bookingData.status = bookings[index].status;       // giữ trạng thái cũ
        bookings[index] = bookingData;
        saveBookings(bookings);
        showToast("Cập nhật đặt phòng thành công!", "success");

        setTimeout(() => {
          window.location.href = "bookings.html";
        }, 2000);
      }
    } else {
      bookings.push(bookingData);
      saveBookings(bookings);
      showToast(`Đặt phòng ${bookingData.bookingId} thành công!`, "success");

      setTimeout(() => {
        window.location.href = "bookings.html";
      }, 2000);
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    form.reset();
    document.getElementById("adults").value = 1;
    document.getElementById("children").value = 0;
    clearErrors();
  });
}

function loadBookingToForm(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.bookingId === bookingId);
  if (!booking) return;

  document.getElementById("bookingId").value = booking.bookingId;
  document.getElementById("customerName").value = booking.customerName;
  document.getElementById("phone").value = booking.phone;
  document.getElementById("roomType").value = booking.roomType;
  document.getElementById("checkIn").value = booking.checkIn;
  document.getElementById("checkOut").value = booking.checkOut;
  document.getElementById("adults").value = booking.adults;
  document.getElementById("children").value = booking.children;
  document.getElementById("promoCode").value = booking.promoCode;
  document.getElementById("confirmPromo").value = booking.confirmPromo;
}

// ==================== LIST PAGE ====================
function initBookingsPage() {
  const tableBody = document.getElementById("bookingTableBody");
  if (!tableBody) return;

  renderBookingTable();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", renderBookingTable);

  document.getElementById("clearSearchBtn").addEventListener("click", () => {
    searchInput.value = "";
    renderBookingTable();
  });
}

function renderBookingTable() {
  const tableBody = document.getElementById("bookingTableBody");
  const searchKeyword = document.getElementById("searchInput").value.trim().toLowerCase();
  let bookings = getBookings();

  if (searchKeyword) {
    bookings = bookings.filter(b =>
      b.bookingId.toLowerCase().includes(searchKeyword) ||
      b.customerName.toLowerCase().includes(searchKeyword)
    );
  }

  tableBody.innerHTML = "";

  if (bookings.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="10">Không có dữ liệu đặt phòng</td>
      </tr>
    `;
  } else {
    bookings.forEach(booking => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${booking.bookingId}</td>
        <td>${booking.customerName}</td>
        <td>${booking.phone}</td>
        <td>${booking.roomType}</td>
        <td>${booking.checkIn}</td>
        <td>${booking.checkOut}</td>
        <td>${booking.adults}/${booking.children}</td>
        <td>${booking.promoCode}</td>
        <td>
          <span class="status ${booking.status === "Booked" ? "status-booked" : "status-cancelled"}">
            ${booking.status}
          </span>
        </td>
        <td>
          <div class="action-group">
            <button class="btn-edit" onclick="editBooking('${booking.bookingId}')">Sửa</button>
            <button class="btn-delete" onclick="deleteBooking('${booking.bookingId}')">Xóa</button>
            <button class="btn-cancel" onclick="cancelBooking('${booking.bookingId}')">Hủy</button>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  updateStats();
}

function updateStats() {
  const bookings = getBookings();
  const total = bookings.length;
  const bookedCount = bookings.filter(b => b.status === "Booked").length;
  const revenue = bookings
    .filter(b => b.status === "Booked")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  document.getElementById("totalBookings").textContent = total;
  document.getElementById("availableRooms").textContent = TOTAL_ROOMS - bookedCount;
  document.getElementById("estimatedRevenue").textContent = formatCurrency(revenue);
}

function editBooking(bookingId) {
  window.location.href = `add-booking.html?edit=${bookingId}`;
}

function deleteBooking(bookingId) {
  let bookings = getBookings();
  const booking = bookings.find(b => b.bookingId === bookingId);

  if (!booking) return;

  const confirmDelete = confirm(`Bạn có chắc muốn xóa đặt phòng ${bookingId}?`);
  if (!confirmDelete) return;

  bookings = bookings.filter(b => b.bookingId !== bookingId);
  saveBookings(bookings);

  showToast("Xóa đặt phòng thành công!", "success");
  renderBookingTable();
}

function cancelBooking(bookingId) {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.bookingId === bookingId);

  if (index === -1) return;

  bookings[index].status = "Cancelled";
  saveBookings(bookings);

  showToast("Hủy đặt phòng thành công!", "success");
  renderBookingTable();
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", function () {
  initAddBookingPage();
  initBookingsPage();
});