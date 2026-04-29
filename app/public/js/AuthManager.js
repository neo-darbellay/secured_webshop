const handleLogin = (event) => {
  // Empêche le formulaire de se soumettre normalement
  event.preventDefault();

  // Récupère l'élément du message d'erreur
  const errorDiv = document.getElementById("error-message");

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
    .then(async (response) => {
      if (response.ok) {
        window.location.href = "/profile";
      } else {
        const result = await response.json();

        // Affiche le(s) message(s) d'erreur dans la div erreur
        errorDiv.innerText = result.errors?.join("\n") || result.error;
        errorDiv.style.display = "block";
      }
    })
    .catch((error) => {
      // Affiche un message d'erreur générique en cas de problème de connexion
      errorDiv.innerText =
        error.message ||
        "Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.";
      errorDiv.style.display = "block";
      console.error("Erreur lors de la connexion :", error);
    });
};

function getPasswordStrength(password) {
  let score = 0;
  if (password.length > 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!#$%&?* "'()\[\]{}<>@\^\-_=+\/\\|;:,\.]/.test(password)) score += 1;
  return score;
}

function updatePasswordStrength(password) {
  const strengthBar = document.getElementById("password-strength-bar");
  const strengthText = document.getElementById("password-strength-text");
  if (!strengthBar || !strengthText) return;

  const score = getPasswordStrength(password);
  let label = "Très faible";
  let color = "#d32f2f";
  let width = "20%";

  if (password.length === 0) {
    label = "rien saisi";
    color = "#777";
    width = "0%";
  } else if (password.length < 12) {
    label = "Trop court";
    color = "#d32f2f";
    width = "20%";
  } else if (score <= 2) {
    label = "Faible";
    color = "#f57c00";
    width = "40%";
  } else if (score === 3) {
    label = "Moyen";
    color = "#fbc02d";
    width = "60%";
  } else if (score === 4) {
    label = "Bon";
    color = "#388e3c";
    width = "80%";
  } else {
    label = "Très bon";
    color = "#2e7d32";
    width = "100%";
  }

  strengthBar.style.width = width;
  strengthBar.style.backgroundColor = color;
  if (label === "rien saisi") {
    strengthText.style.display = "none";
    strengthBar.style.display = "none";
  } else {
    strengthText.style.display = "block";
    strengthBar.style.display = "block";
    strengthText.textContent = `Force du mot de passe : ${label}`;
  }
}

const handleRegister = async (event) => {
  event.preventDefault();

  // Récupère l'élément du message d'erreur
  const errorDiv = document.getElementById("error-message");

  const formData = new FormData(event.target);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const location = formData.get("location");
  const image = formData.get("image");

  fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, location }),
  })
    .then(async (registerResponse) => {
      // Upload l'image si elle existe
      if (registerResponse.ok) {
        if (image && image.size > 0) {
          const photoData = new FormData();
          photoData.append("photo", image);

          await fetch("/api/profile/photo", {
            method: "POST",
            body: photoData,
          }).then(async (photoResponse) => {
            if (!photoResponse.ok) {
              console.error("Erreur lors de l'upload de la photo");
            }
          });
        }

        window.location.href = "/profile";
      } else {
        const result = await registerResponse.json();

        // Affiche le(s) message(s) d'erreur dans la div erreur
        errorDiv.innerText = result.errors?.join("\n") || result.error;
        errorDiv.style.display = "block";
      }
    })
    .catch((error) => {
      // Affiche un message d'erreur générique en cas de problème d'inscription
      console.error("Erreur lors de l'inscription :", error);
      errorDiv.innerText =
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
      errorDiv.style.display = "block";
    });
};

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

if (registerForm) {
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.addEventListener("input", (event) => {
      updatePasswordStrength(event.target.value);
    });
  }
  registerForm.addEventListener("submit", handleRegister);
}
