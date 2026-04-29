import Joi from "joi";

export const registerValidator = (data) => {
  // Schéma de validation pour l'inscription
  const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      "string.min": "Le nom d'utilisateur doit comporter au moins 3 caractères",
      "string.max":
        "Le nom d'utilisateur doit comporter au maximum 30 caractères",
      "string.empty": "Le nom d'utilisateur est requis",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Veuillez fournir une adresse email valide",
      "string.empty": "L'adresse email est requise",
    }),
    password: Joi.string()
      .min(12)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{12,}$/)
      .required()
      .messages({
        "string.min": "Le mot de passe doit comporter au moins 12 caractères",
        "string.pattern.base":
          "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
        "string.empty": "Le mot de passe est requis",
      }),
  });

  //  abortEarly = false pour récupérer toutes les erreurs de validation au lieu de s'arrêter à la première
  return registerSchema.validate(data, { abortEarly: false });
};
