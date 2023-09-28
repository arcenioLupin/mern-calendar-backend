const { response } = require("express");
const Evento = require("../models/Evento");

// {
//   ok: true ,
//   msg: "eliminarEvento",
// }

const getEventos = async (req, res = response) => {
  try {
    const eventos = await Evento.find().populate("user", "name  email"); // usando populate después del find para traer mas datos de "user" ( email, password)
    console.log(eventos);
    res.status(200).json({
      ok: true,
      eventos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al listar los eventos",
    });
  }
};

const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();
    res.status(200).json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contacte al admnistrador",
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  console.log(req.params);
  const { id } = req.params;
  const { uid } = req;

  try {
    // Verificar si el evento existe en la DB
    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }

    // Verificar si la persona que creó el evento desea modificarla
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene provilegios de editar este evento",
      });
    }
    // Pasó las validaciones, ahora creamos el nuevo evento que va a actualizar al actual
    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    // Se actualiza el evento
    const eventoActualizado = await Evento.findByIdAndUpdate(id, nuevoEvento, { new: true })

    // Se envía la respuesta

    res.status(200).json({
      ok: true,
      evento: eventoActualizado
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contacte al admnistrador",
    });
  }
};

const eliminarEvento = async(req, res = response) => {
  console.log(req.params);
  const { id } = req.params;
  const { uid } = req;

  try {
    // Verificar si el evento existe en la DB
    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese id",
      });
    }

    // Verificar si la persona que creó el evento desea modificarla
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene provilegios de eliminar este evento",
      });
    }

    // Se elimina el evento
    const eventoEliminado = await Evento.findByIdAndDelete(id)

    // Se envía la respuesta

    res.status(200).json({
      ok: true,
      eventoEliminado
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contacte al admnistrador",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
