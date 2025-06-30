document.addEventListener("DOMContentLoaded", function () {
  const bookings = JSON.parse(localStorage.getItem("bookingHistory")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const bookingsList = document.getElementById("bookings-list");

  if (!currentUser || !currentUser.username) {
    bookingsList.innerHTML = "<p>Please log in to see your bookings.</p>";
    return;
  }

  const userBookings = bookings.filter(
    booking => booking.user === currentUser.username
  );

  if (userBookings.length === 0) {
    bookingsList.innerHTML = "<p>No bookings found.</p>";
    return;
  }

  userBookings.forEach(booking => {
    const card = document.createElement("div");
    card.className = "booking-card";
    card.innerHTML = `
      <h3>Flight: ${booking.flight?.id} (${booking.flight?.airline})</h3>
      <p><strong>Route:</strong> ${booking.flight?.origin} → ${booking.flight?.destination}</p>
      <p><strong>Date:</strong> ${new Date(booking.flight?.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${booking.status}</p>
      <p><strong>Total Paid:</strong> $${booking.totalPrice}</p>
      <p><strong>Booked At:</strong> ${new Date(booking.bookedAt).toLocaleString()}</p>
      <p><strong>Booking Ref:</strong> ${booking.reference}</p>
    `;
    bookingsList.appendChild(card);
  });
});
