document.addEventListener("DOMContentLoaded", async () => {
  const session = await checkAuth();
  if (!session) return;

  loadBudgets(session.user.id);

  const form = document.getElementById("budgetForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const category = document.getElementById("category").value;
      const limit = document.getElementById("limit").value;

      await addBudget(session.user.id, category, limit);
      form.reset();
      loadBudgets(session.user.id);
    });
  }
});

async function loadBudgets(userId) {
  const { data, error } = await supabaseClient
    .from('budgets')
    .select('*')
    .eq('user_id', userId);

  if (error) return;

  const container = document.getElementById("budgetsList");
  if (!container) return;

  container.innerHTML = "";
  data.forEach(b => {
    const div = document.createElement("div");
    div.style.cssText = "padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;";
    div.innerHTML = `
      <span><strong>${b.category}</strong></span>
      <span>Хязгаар: $${Number(b.limit_amount).toFixed(2)}</span>
    `;
    container.appendChild(div);
  });
}

async function addBudget(userId, category, limit) {
  const { error } = await supabaseClient
    .from('budgets')
    .insert([
      { user_id: userId, category, limit_amount: parseFloat(limit) }
    ]);

  if (error) alert(error.message);
}