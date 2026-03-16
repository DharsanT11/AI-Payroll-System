export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function getAvatarColor(name) {
  const colors = [
    '#e5343d', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6',
  ];
  if (!name) return colors[0];
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[sum % colors.length];
}

export function getBadgeClass(status) {
  const map = {
    'Active': 'badge-active',
    'Inactive': 'badge-inactive',
    'Draft': 'badge-draft',
    'Pending': 'badge-pending',
    'Pending Approval': 'badge-pending',
    'Approved': 'badge-approved',
    'Paid': 'badge-paid',
    'Rejected': 'badge-rejected',
    'Cancelled': 'badge-cancelled',
    'Closed': 'badge-inactive',
  };
  return map[status] || 'badge-draft';
}
