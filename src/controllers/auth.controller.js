import { Person, User, Role, UserFamiliar, UserAsistente } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { sequelize } from "../config/database.js"; // <--- 1. Importa sequelize para las transacciones

// Registro completo (Del asistente y familiar)
export const register = async (req, res) => {
  // 2. Iniciamos la transacción al comenzar la petición
  const t = await sequelize.transaction();

  try {
    const { nombre, apellido, telefono, email, password, rol, nombreAdulto, edadAdulto, necesidades } = req.body;

    const existe = await User.findOne({ where: { email } });
    if (existe) {
      await t.rollback(); // Cancelamos si ya existe el correo
      return res.status(400).json({ message: "El correo electrónico ya se encuentra registrado." });
    }

    const role = await Role.findOne({ where: { nombre: rol } });
    if (!role) {
      await t.rollback(); // Cancelamos si el rol no es válido
      return res.status(400).json({ message: "El rol indicado no es válido." });
    }

    // 3. Pasamos '{ transaction: t }' a cada operación de escritura
    const person = await Person.create(
      { nombre, apellido, telefono }, 
      { transaction: t }
    );

    const user = await User.create(
      {
        email,
        password: await hashPassword(password),
        personId: person.id,
      }, 
      { transaction: t }
    );

    // Importante: también se le pasa la transacción a las asociaciones y tablas hijas
    await user.addRole(role, { transaction: t });

    if (rol === "asistente") {
      await UserAsistente.create(
        { userId: user.id }, 
        { transaction: t }
      );
    } else {
      await UserFamiliar.create(
        { userId: user.id, nombreAdulto, edadAdulto, necesidades }, 
        { transaction: t }
      );
    }

    // 4. Si todo salió perfecto, confirmamos los cambios en la BD
    await t.commit();

    return res.status(201).json({ message: "El usuario fue registrado correctamente." });
    
  } catch (error) {
    // 5. Si ocurre cualquier error, revertimos todo para no dejar registros a medias
    await t.rollback();
    console.log(error);
    return res.status(500).json({ message: "Intente nuevamente más tarde." });
  }
};

// Login (Se mantiene igual, no requiere transacciones porque solo consulta)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }, include: [Person, Role] });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "El correo electrónico o la contraseña son incorrectos." });
    }

    const roles = user.Roles.map((r) => r.nombre);

    const perfil = roles.includes("asistente")
      ? await UserAsistente.findOne({ where: { userId: user.id } })
      : await UserFamiliar.findOne({ where: { userId: user.id } });

    const token = generateToken({ id: user.id, roles, perfilId: perfil?.id });

    return res.status(200).json({
      message: "Inicio de sesión correcto.",
      token,
      usuario: {
        nombre: user.Person.nombre,
        apellido: user.Person.apellido,
        email: user.email,
        roles,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Intente nuevamente más tarde." });
  }
};