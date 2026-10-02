function enterGuestMode() {
  sessionStorage.setItem("studentFinanceGuest", "true");
  window.location.href = "dashboard.html";
}

async function registerUser(email, password, fullName) {
  if (!supabaseClient) {
    alert("Supabase тохиргоогүй байна. Зочны горимоор шууд орно уу.");
    return false;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { full_name: fullName }
    }
  });

  if (error) {
    alert(error.message);
    return false;
  }

  alert("Амжилттай бүртгэгдлээ!");
  window.location.href = "login.html";
}

async function loginUser(email, password) {
  if (!supabaseClient) {
    alert("Supabase тохиргоогүй байна. Зочны горимоор шууд орно уу.");
    return false;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert(error.message);
    return false;
  }

  window.location.href = "dashboard.html";
}

async function logoutUser() {
  if (sessionStorage.getItem("studentFinanceGuest") === "true") {
    sessionStorage.removeItem("studentFinanceGuest");
    window.location.href = "login.html";
    return;
  }

  if (!supabaseClient) {
    window.location.href = "login.html";
    return;
  }

  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    alert(error.message);
    return;
  }
  window.location.href = "login.html";
}

async function checkAuth() {
  if (sessionStorage.getItem("studentFinanceGuest") === "true") {
    return { user: { id: null }, guest: true };
  }

  if (!supabaseClient) {
    window.location.href = "login.html";
    return null;
  }

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
  }
  return session;
}