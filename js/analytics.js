document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkAuth();
  if (!session) return;

  if (session.guest) {
    const chart = document.getElementById("expenseChart");
    if (chart) {
      const notice = document.createElement("p");
      notice.textContent = "Зочны горимд шинжилгээний өгөгдөл байхгүй.";
      chart.replaceWith(notice);
    }
    return;
  }

  loadAnalytics(session.user.id);
});

async function loadAnalytics(userId) {
  const { data: transactions, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('type', 'expense');

  if (error || !transactions) return;

  const categories = {};
  transactions.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
  });

  const ctx = document.getElementById('expenseChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']
      }]
    }
  });
}