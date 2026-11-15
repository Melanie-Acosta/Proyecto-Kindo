import { Notificacion } from "../models/index.js";

// Obtener las notificaciones del usuario autenticado
export const getAllNotificaciones = async (req, res) => {
  try {
    const notificaciones = await Notificacion.findAll({
      where: {
        userId: req.user.id
      },
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(notificaciones);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error al obtener las notificaciones."
    });
  }
};

// Marcar una notificación propia como leída
export const updateNotificacion = async (req, res) => {
  try {
    const notificacion = await Notificacion.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!notificacion) {
      return res.status(404).json({
        message: "No se encontró la notificación."
      });
    }

    await notificacion.update({
      leida: true
    });

    return res.status(200).json({
      message: "Notificación marcada como leída.",
      notificacion
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error al actualizar la notificación."
    });
  }
};