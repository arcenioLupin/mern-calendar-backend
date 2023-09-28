const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    // console.log(usuario);
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con ese email",
      });
    }
    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();
    // Generar el JWT
    const token = await generarJWT(usuario.id, usuario.name);
    res.status(201).json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con mesa de ayuda",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    console.log(usuario);
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con ese email",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: true,
        msg: "Password incorrecto",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      usuario,
      msg: "Login exitoso",
      token
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con mesa de ayuda",
    });
  }
};

const revalidarToken = async(req, res = response) => {

  const { uid, name } = req;

  // Generar un nuevo JWT y retornarlo en esta petición
  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    token
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
