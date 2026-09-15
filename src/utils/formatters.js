export function formatINR(paise) {
  if (paise === null || paise === undefined || isNaN(paise)) return '₹0.00';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(rupees);
}

export function formatKolkataTime(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pending': return 'badge-status-pending';
    case 'Accepted': return 'badge-status-accepted';
    case 'Preparing': return 'badge-status-preparing';
    case 'Ready for Pickup': return 'badge-status-ready';
    case 'Completed': return 'badge-status-completed';
    case 'Cancelled': return 'badge-status-cancelled';
    case 'Paid': return 'badge-status-completed';
    case 'Failed': return 'badge-status-cancelled';
    default: return 'badge-status-pending';
  }
}
