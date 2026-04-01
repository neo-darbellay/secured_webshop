// Navigation commune à toutes les pages
// Pour modifier le menu, éditer uniquement ce fichier
document.addEventListener("DOMContentLoaded", async () => {
  const nav = document.getElementById("topbar");
  if (!nav) return;
  let loggedIn = false;
  let isAdmin = false;
  let userName = "";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  };

  try {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const user = await res.json();
      loggedIn = true;
      isAdmin = user.role === "admin";
      userName = user.username;
    }
  } catch (err) {
    loggedIn = false;
    isAdmin = false;
  }

  nav.innerHTML = `
        <header class="topbar">
            <div class="container">
                <div class="brand">Secure Shop</div>
                <nav class="menu">
                    <a href="/">Accueil</a>
                    ${isAdmin && loggedIn ? '<a href="/admin">Admin</a>' : ""}
                    ${loggedIn ? `<a href="/profile">Profil (${userName})</a><a href="#" id="logout-link">Déconnexion</a>` : '<a href="/login">Connexion</a><a href="/register">Inscription</a>'}
                </nav>
            </div>
        </header>
    `;

  const logoutLink = document.getElementById("logout-link");
  if (logoutLink)
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      handleLogout();
    });
});
