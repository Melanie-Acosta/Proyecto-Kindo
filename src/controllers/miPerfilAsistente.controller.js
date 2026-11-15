
import { UserAsistente, User, Person } from "../models/index.js";

// ==========================================
// OBTENER EL PERFIL DEL ASISTENTE LOGUEADO
// ==========================================
export const getMiPerfilAsistente = async (req, res) => {
  try {
    const perfil = await UserAsistente.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "email"],
          include: [
            {
              model: Person,
              attributes: ["nombre", "apellido", "telefono"]
            }
          ]
        }
      ]
    });

    if (!perfil) {
      return res.status(404).json({
        message: "No se encontró el perfil del asistente."
      });
    }

    return res.status(200).json(perfil);

  } catch (error) {
    console.error("Error al obtener el perfil del asistente:", error);

    return res.status(500).json({
      message: "No se pudo obtener el perfil."
    });
  }
};

// ==========================================
// ACTUALIZAR EL PERFIL DEL ASISTENTE LOGUEADO
// ==========================================
export const updateMiPerfilAsistente = async (req, res) => {
  try {
    const perfil = await UserAsistente.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          include: [Person]
        }
      ]
    });

    if (!perfil) {
      return res.status(404).json({
        message: "No se encontró el perfil del asistente."
      });
    }

    const {
      nombre,
      apellido,
      telefono,
      email,
      foto,
      descripcion,
      experiencia,
      especialidad,
      zona,
      tarifa,
      disponibleAhora
    } = req.body;

    // Actualizar datos personales
    if (perfil.User?.Person) {
      await perfil.User.Person.update({
        ...(nombre !== undefined && { nombre }),
        ...(apellido !== undefined && { apellido }),
        ...(telefono !== undefined && { telefono })
      });
    }

    // Actualizar correo electrónico
    if (email !== undefined) {
      await perfil.User.update({ email });
    }

    // Actualizar datos profesionales
    await perfil.update({
      ...(foto !== undefined && { foto }),
      ...(descripcion !== undefined && { descripcion }),
      ...(experiencia !== undefined && { experiencia }),
      ...(especialidad !== undefined && { especialidad }),
      ...(zona !== undefined && { zona }),
      ...(tarifa !== undefined && { tarifa }),
      ...(disponibleAhora !== undefined && { disponibleAhora })
    });

    // Volver a consultar el perfil actualizado
    const perfilActualizado = await UserAsistente.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "email"],
          include: [
            {
              model: Person,
              attributes: ["nombre", "apellido", "telefono"]
            }
          ]
        }
      ]
    });

    return res.status(200).json({
      message: "Perfil actualizado correctamente.",
      perfil: perfilActualizado
    });

  } catch (error) {
    console.error("Error al actualizar el perfil del asistente:", error);

    return res.status(500).json({
      message: "No se pudo actualizar el perfil."
    });
  }
};
