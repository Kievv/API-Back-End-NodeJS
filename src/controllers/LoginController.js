const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../authDetran");

class LoginController {
  static generateToken(params = {}) {
    return jwt.sign(params, config.secret, {
      expiresIn: config.expireIn,
    });
  }

  async geraUsuario(req, res) {
    const { distintivo } = req.body;

    await User.findOne({ distintivo })
      .then((usuario) => {
        if (usuario) {
          return res.status(400).send({ error: "Usuário já existe" });
        } else {
          const user = new User(req.body);
          user.password = bcrypt.hashSync(user.password, 8);
          user.save();
          return res.send({
            user,
            token: generateToken({ id: user._id }),
          });
        }
      })
      .catch((error) => {
        return res.status(400).json("Deu erro");
      });
  }

  async index(req, res) {
    const { distintivo, password } = req.body;

    const userExist = await User.findOne({ distintivo }).select("+password");

    if (!userExist) {
      return res.status(400).json({
        error: true,
        message: "O usuário ou senha são inválidos",
      });
    }

    if (!(await bcrypt.compare(password, userExist.password))) {
      return res.status(400).json({
        error: true,
        message: "O usuário ou senha são inválidos",
      });
    }

    // Como fazer a autenticação checar se o usuário possui com função permitindo que acesse apenas as rotas referentes a tal órgão?
    return res.status(200).json({
      user: {
        nome: userExist.nome,
        password: userExist.distintivo,
        funcao: userExist.funcao,
      },
      token: this.generateToken({ id: User._id }),
    });
  }
}

module.exports = new LoginController();
