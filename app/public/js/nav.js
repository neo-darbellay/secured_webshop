// Fonction pour rafraîchir le token automatiquement
async function refreshToken() {
  try {
    // Envoyer une requête AVEC les cookies
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Erreur refresh:", err);
    return false;
  }
}

// un simple fetch, mais qui tente de rafraîchir le token si le token est expiré
async function fetchWithRefresh(url, options = {}) {
  // Toujours envoyer les cookies
  options.credentials = "include";

  let res = await fetch(url, options);

  // Si token expiré (401)
  if (res.status === 401) {
    const refreshed = await refreshToken();

    if (refreshed) {
      // Réessayer la requête originale
      res = await fetch(url, options);
    }
  }

  return res;
}

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

  async function checkAuth() {
    const res = await fetchWithRefresh("/api/auth/me");

    if (res.ok) {
      const user = await res.json();
      loggedIn = true;
      isAdmin = user.role === "admin";
      userName = user.username;
      updateNav();
    } else {
      loggedIn = false;
      isAdmin = false;
      updateNav();
    }
  }

  const updateNav = () => {
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
      logoutLink.addEventListener("click", (event) => {
        event.preventDefault();
        handleLogout();
      });
  };

  checkAuth();
});
