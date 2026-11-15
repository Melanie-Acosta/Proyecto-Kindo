import {
  sequelize,
  Task,
  UserFamiliar,
  UserAsistente,
  User,
  Notificacion
} from "../models/index.js";

export const createTask = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { titulo, descripcion, fecha, asistenteId } = req.body;

    // Verificar que el familiar exista
    const familiar = await UserFamiliar.findByPk(req.user.perfilId);

    if (!familiar) {
      await t.rollback();
      return res.status(404).json({
        message: "No se encontró el perfil del familiar."
      });
    }

    // Buscar el asistente y su usuario
    const asistente = await UserAsistente.findByPk(asistenteId, {
      include: [{
        model: User,
        attributes: ["id"]
      }],
      transaction: t
    });

    if (!asistente) {
      await t.rollback();
      return res.status(404).json({
        message: "No se encontró el asistente seleccionado."
      });
    }

    // Crear la solicitud
    const task = await Task.create({
      titulo,
      descripcion,
      fecha,
      familiarId: familiar.id,
      asistenteId: asistente.id,
      estado: "pendiente"
    }, { transaction: t });

    // Crear una notificación para el usuario asistente
    await Notificacion.create({
      texto: "Tenés una nueva solicitud de servicio.",
      tipo: "nueva_task",
      leida: false,
      userId: asistente.User.id,
      taskId: task.id
    }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      message: "La solicitud fue creada correctamente.",
      task
    });

  } catch (error) {
    await t.rollback();

    console.log(error);

    return res.status(500).json({
      message: "Ocurrió un error al crear la solicitud."
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    return res.status(200).json(await Task.findAll());
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocurrió un error interno del servidor."
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "No se encontró el pedido solicitado."
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocurrió un error interno del servidor."
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "No se encontró el pedido solicitado."
      });
    }

    await task.update(req.body);

    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocurrió un error interno del servidor."
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "No se encontró el pedido solicitado."
      });
    }

    await task.destroy();

    return res.status(200).json({
      message: "El pedido fue eliminado correctamente."
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ocurrió un error interno del servidor."
    });
  }
};