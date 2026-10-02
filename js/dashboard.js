document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkAuth();
  if (!session) return;

  if (session.guest) {
    document.getElementById("userName").textContent = "Зочин";
    document.getElementById("guestNotice").hidden = false;
    document.getElementById("recentTransactions").textContent =
      "Зочны горимд гүйлгээ харагдахгүй.";
    return;
  }

  const user = session.user;
  loadUserProfile(user.id);
  loadDashboardData(user.id);
});

async function loadUserProfile(userId) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (data) {
    const userNameEl = document.getElementById("userName");
    if (userNameEl) userNameEl.textContent = data.full_name || data.email;
  }
}

async function loadDashboardData(userId) {
  const { data: transactions, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error(error);
    return;
  }

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += Number(t.amount);
    } else {
      totalExpense += Number(t.amount);
    }
  });

  const balance = totalIncome - totalExpense;

  const balanceEl = document.getElementById("totalBalance");
  const incomeEl = document.getElementById("totalIncome");
  const expenseEl = document.getElementById("totalExpense");

  if (balanceEl) balanceEl.textContent = `$${balance.toFixed(2)}`;
  if (incomeEl) incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
  if (expenseEl) expenseEl.textContent = `$${totalExpense.toFixed(2)}`;

  renderRecentTransactions(transactions.slice(-5).reverse());
}

function renderRecentTransactions(list) {
  const container = document.getElementById("recentTransactions");
  if (!container) return;

  container.innerHTML = "";
  list.forEach(t => {
    const item = document.createElement("div");
    item.className = "transaction-item";
    item.innerHTML = `
      <div>
        <strong>${t.title}</strong>
        <p>${t.category}</p>
      </div>
      <span class="${t.type}">
        ${t.type === 'income' ? '+' : '-'}$${Number(t.amount).toFixed(2)}
      </span>
    `;
    container.appendChild(item);
  });
}