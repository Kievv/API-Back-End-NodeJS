const Carro = require('../models/carroModel.js');

class PMController {
  static async listarCarros(req, res) {
    await Carro.find({})
      .then((carros) => {
        return res.status(200).json(carros);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  static async listarCarrosPorId(req, res) {
    await Carro.findOne({ placa: req.params.id })
      .then((carro) => {
        if (carro) {
          return res.json(carro);
        } else {
          return res.status(404).json('Carro não localizado');
        }
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  static async atualizarCarro(req, res) {
    await Carro.findOneAndUpdate({ placa: req.params.id }, req.body, { runValidators: true })
      .then((carro) => {
        if (carro) {
          return res.status(204).end();
        } else {
          return res.status(404).json('Carro não localizado');
        }
      })
      .catch((error) => {
        const msgErro = {};
        Object.values(error.errors).forEach(({ properties }) => {
          msgErro[properties.path] = properties.message;
        });
        return res.status(422).json(msgErro);
      });
  }
}

module.exports = PMController;
