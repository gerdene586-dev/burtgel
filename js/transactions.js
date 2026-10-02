document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkAuth();
  if (!session) return;

  if (session.guest) {
    const form = document.getElementById("transactionForm");
    if (form) form.hidden = true;
    document.getElementById("transactionsTable").innerHTML =
      '<tr><td colspan="5">Зочны горимд гүйлгээ хадгалах боломжгүй. Supabase-д нэвтэрнэ үү.</td></tr>';
    return;
  }

  loadTransactions(session.user.id);

  const form = document.getElementById("transactionForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const amount = document.getElementById("amount").value;
      const type = document.getElementById("type").value;
      const category = document.getElementById("category").value;

      await addTransaction(session.user.id, title, amount, type, category);
      form.reset();
      loadTransactions(session.user.id);
    });
  }
});

async function loadTransactions(userId) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return;

  const tbody = document.getElementById("transactionsTable");
  if (!tbody) return;

  tbody.innerHTML = "";
  data.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(t.created_at).toLocaleDateString()}</td>
      <td>${t.title}</td>
      <td>${t.category}</td>
      <td class="${t.type}">${t.type === 'income' ? '+' : '-'}$${Number(t.amount).toFixed(2)}</td>
      <td><button onclick="deleteTransaction('${t.id}')">Устгах</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function addTransaction(userId, title, amount, type, category) {
  const { error } = await supabaseClient
    .from('transactions')
    .insert([
      { user_id: userId, title, amount: parseFloat(amount), type, category }
    ]);

  if (error) {
    alert(error.message);
  }
}

async function deleteTransaction(id) {
  const { error } = await supabaseClient
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    alert(error.message);
    return;
  }

  const session = await supabaseClient.auth.getSession();
  if (session.data.session) {
    loadTransactions(session.data.session.user.id);
  }
}