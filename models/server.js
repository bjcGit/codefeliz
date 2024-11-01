const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.patchs = {
      users: "/v1/users",
      auth: "/v1/auth",
      roles: "/v1/roles",
      codes: "/v1/codes"
    };
    this.app = express();
    this.port = process.env.PORT;
   
    this.conectarDB();
    this.middlewares();
    this.routes();
  }

  async conectarDB() {
    await dbConnection();   
  }

  middlewares() {   
    this.app.use(cors());  
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.patchs.auth, require('../routes/auth'));
    this.app.use(this.patchs.users, require('../routes/users'));
    this.app.use(this.patchs.roles, require('../routes/roles'));
    this.app.use(this.patchs.codes, require('../routes/codes'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Iniciando por el puerto", this.port);
    });
  }
}

module.exports = Server;