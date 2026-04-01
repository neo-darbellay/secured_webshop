const handleLogin = (event) => {
  // Empêche le formulaire de se soumettre normalement
  event.preventDefault();

  // Récupère les données du formulaire
  const formData = new FormData(event.target);

  // Séparer les champs email et password
  const email = formData.get("email");
  const password = formData.get("password");

  // Faire un POST sur /api/auth/login avec les données du formulaire
  fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/profile";
      } else {
        alert("Email ou mot de passe incorrect.");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Erreur serveur");
    });
};

const handleRegister = (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then(async (response) => {
      if (response.ok) {
        window.location.href = "/profile";
      } else {
        const error = await response.json();
        alert("Erreur lors de l'inscription : " + error.error);
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Erreur serveur : " + error.message);
    });
};

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

if (registerForm) {
  registerForm.addEventListener("submit", handleRegister);
}
