import { countUsers } from "./users.service.js";
import { prisma } from "../utils/prisma.js";
import { updateUserPassword } from "./users.service.js";
import { createManyUsers } from "./users.service.js";


import {
createUser,
findUserByEmail,
listUsers,
getUserById,
deleteUser,
updateUser
} from "./users.service.js";
import { validateUser, validateUpdateUser } from "./users.validation.js";

export async function handleCreateUser(req, res) {
try {
const result = validateUser(req.body);

if (!result.ok) {
return res.status(400).json({
message: "Validate failed",
errors: result.errors,
});
}

// Check if user already exists
const existingUser = await findUserByEmail(req.body.email);
if (existingUser) {
return res.status(409).json({ message: "User already exist" });
}

// Create user
const User = await createUser(req.body);
return res.status(201).json(User);
} catch (error) {
return res.status(500).json({ error: error.message });
}
}
export async function handleListUsers(req, res) {
try {
const users = await listUsers();
return res.json(users);
} catch (error) {
return res.status(500).json({ error: error.message });
}
}
export async function handleGetUserById(req, res) {
try {
const { id } = req.params;
if (!id) {
return res.status(400).json({ message: " Missing user ID" });
}
const user = await getUserById(id);
if (!user) {
return res.status(404).json({ message: "User not found" });
}

return res.status(200).json(user);
} catch (error) {
return res.status(500).json({ error: error.message });
}
}
export async function handleDeleteUser(req, res) {
try {
const { id } = req.params;
if (!id) {
return res.status(400).json({ message: "Missing user ID" });
}
const user = await getUserById(id);
if (!user) {
return res.status(404).json({ message: "User not found" });
}

await deleteUser(id);

return res.status(200).json({
message: "User deleted successfully",
});
} catch (error) {
return res.status(500).json({ error: error.message });
}
}

// modif 1

export async function handleUpdateUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    // 1️⃣ Vérifier que l'utilisateur existe
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Validation des données
    const results = validateUpdateUser(req.body);
    if (!results.ok) {
      return res.status(400).json({
        message: "Validation failed",
        errors: results.errors,
      });
    }

    // 🔥 NOUVELLE RÈGLE : body vide ou aucun champ autorisé
    if (Object.keys(results.data).length === 0) {
      return res.status(400).json({
        error: "Validation error",
        fields: {
          body: "Provide at least one field to update",
        },
      });
    }

    // 3️⃣ Vérification unicité email
    if (results.data.email) {
      const existingUser = await findUserByEmail(results.data.email);

      if (existingUser && existingUser.id !== Number(id)) {
        return res.status(409).json({
          error: "Email already in use",
        });
      }
    }

    // 4️⃣ Mise à jour
    const updatedUser = await updateUser(id, results.data);

    return res.status(200).json(updatedUser);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function handleSearchUserByEmail(req, res) {
  try {
    const { email } = req.query;

    // 1️⃣ Email absent
    if (!email) {
      return res.status(400).json({
        error: "Validation error",
        fields: {
          email: "Email query parameter is required",
        },
      });
    }

    // 2️⃣ Recherche utilisateur
    const user = await findUserByEmail(email);

    // 3️⃣ Non trouvé
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // 4️⃣ Trouvé
    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function handleCountUsers(req, res) {
  try {
    const count = await countUsers();

    return res.status(200).json({
      "Users count": count,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function handleUpdateUserPassword(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // 1️⃣ Vérifier ID
    if (!id) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    // 2️⃣ Vérifier user existe
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 3️⃣ Vérifier password
    if (!password || password.length < 8) {
      return res.status(400).json({
        error: "Validation error",
        fields: {
          password: "Password must be at least 8 characters long",
        },
      });
    }

    // 4️⃣ Update password
    const updatedUser = await updateUserPassword(id, password);

    // 5️⃣ Ne jamais retourner le password
    return res.status(200).json(updatedUser);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function handleCreateUsersBulk(req, res) {
  try {
    const { users } = req.body;

    // 1️⃣ Vérifier structure
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        error: "Validation error",
        fields: {
          users: "Users array is required",
        },
      });
    }

    // 2️⃣ Validation de chaque user
    const errors = [];
    const normalizedUsers = [];

    for (let i = 0; i < users.length; i++) {
      const result = validateUser(users[i]);

      if (!result.ok) {
        errors.push({
          index: i,
          errors: result.errors,
        });
      } else {
        // normalisation email
        normalizedUsers.push({
          ...result.data,
          email: result.data.email.trim().toLowerCase(),
        });
      }
    }

    // ❌ Un seul invalide ⇒ tout refusé
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation error",
        details: errors,
      });
    }

    // 3️⃣ Vérifier unicité email (DB)
    for (const user of normalizedUsers) {
      const existingUser = await findUserByEmail(user.email);
      if (existingUser) {
        return res.status(409).json({
          error: "Email already in use",
          email: user.email,
        });
      }
    }

    // 4️⃣ Création
    const createdUsers = await createManyUsers(normalizedUsers);

    return res.status(201).json(createdUsers);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

