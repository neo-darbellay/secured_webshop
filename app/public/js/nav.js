let csrfToken = null;

async function initCsrf() {
  const res = await fetch("/api/csrf-token");
  const data = await res.json();
  csrfToken = data.csrfToken;
}

// Fonction pour rafraîchir le token automatiquement
async function refreshToken() {
  try {
    // Envoyer une requête AVEC les cookies
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "CSRF-Token": csrfToken,
      },
    });

    if (res.ok) {
      await initCsrf();

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
  await initCsrf();

  const nav = document.getElementById("topbar");
  if (!nav) return;
  let loggedIn = false;
  let isAdmin = false;
  let userName = "";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "CSRF-Token": csrfToken,
      },
    });
    window.location.href = "/login";
  };

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        headers: {
          "CSRF-Token": csrfToken,
        },
      });

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
    } catch (err) {
      loggedIn = false;
      isAdmin = false;
      updateNav();
    }
  }

  const updateNav = () => {
    nav.innerHTML = "";

    const header = document.createElement("header");
    header.className = "topbar";

    const container = document.createElement("div");
    container.className = "container";

    const brand = document.createElement("div");
    brand.className = "brand";
    brand.innerText = "Secure Shop";

    const menu = document.createElement("nav");
    menu.className = "menu";

    const homeLink = document.createElement("a");
    homeLink.href = "/";
    homeLink.innerText = "Accueil";

    menu.appendChild(homeLink);

    if (isAdmin && loggedIn) {
      const adminLink = document.createElement("a");
      adminLink.href = "/admin";
      adminLink.innerText = "Admin";
      menu.appendChild(adminLink);
    }

    if (loggedIn) {
      const profileLink = document.createElement("a");
      profileLink.href = "/profile";
      profileLink.innerText = `Profil (${userName})`;

      const logoutLink = document.createElement("a");
      logoutLink.href = "#";
      logoutLink.innerText = "Déconnexion";
      logoutLink.addEventListener("click", (event) => {
        event.preventDefault();
        handleLogout();
      });

      menu.appendChild(profileLink);
      menu.appendChild(logoutLink);
    } else {
      const loginLink = document.createElement("a");
      loginLink.href = "/login";
      loginLink.innerText = "Connexion";

      const registerLink = document.createElement("a");
      registerLink.href = "/register";
      registerLink.innerText = "Inscription";

      menu.appendChild(loginLink);
      menu.appendChild(registerLink);
    }

    container.appendChild(brand);
    container.appendChild(menu);
    header.appendChild(container);
    nav.appendChild(header);
  };

  checkAuth();
});
