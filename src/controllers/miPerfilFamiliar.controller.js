
import { UserFamiliar, User, Person } from "../models/index.js";

// ==========================================
// OBTENER EL PERFIL DEL FAMILIAR LOGUEADO
// ==========================================
export const getMiPerfilFamiliar = async (req, res) => {
  try {
    const perfil = await UserFamiliar.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "email"],
          include: [
            {
              model: Person,
              attributes: ["nombre", "apellido"]
            }
          ]
        }
      ]
    });

    if (!perfil) {
      return res.status(404).json({
        message: "No se encontró el perfil familiar."
      });
    }

    return res.status(200).json(perfil);

  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return res.status(500).json({
      message: "No se pudo obtener el perfil."
    });
  }
};

// ==========================================
// ACTUALIZAR EL PERFIL DEL FAMILIAR LOGUEADO
// ==========================================
export const updateMiPerfilFamiliar = async (req, res) => {
  try {
    const perfil = await UserFamiliar.findOne({
      where: { userId: req.user.id }
    });

    if (!perfil) {
      return res.status(404).json({
        message: "No se encontró el perfil familiar."
      });
    }

    const { nombreAdulto, edadAdulto, necesidades } = req.body;

    if (!nombreAdulto || !nombreAdulto.trim()) {
      return res.status(400).json({
        message: "El nombre del adulto mayor es obligatorio."
      });
    }

    await perfil.update({
      nombreAdulto: nombreAdulto.trim(),
      edadAdulto,
      necesidades
    });

    return res.status(200).json({
      message: "Perfil actualizado correctamente.",
      perfil
    });

  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    return res.status(500).json({
      message: "No se pudo actualizar el perfil."
    });
  }
};
