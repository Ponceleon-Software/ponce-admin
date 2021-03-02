/**
 * Objeto que se encarga de modificar un componente de acuerdo al
 * state que tenga. Actúa como componente reactivo sin tener que
 * escribir el html directamente en el javascript
 * @param {Object} state El estado inicial del componente
 */
function Modificador(state = {}) {
  this.state = state;

  this.render = (props = {}) => {};
}
Modificador.prototype.setState = function (newState) {
  let cambio = false;
  for (let key in newState) {
    if (this.state.hasOwnProperty(key) && this.state[key] !== newState[key]) {
      this.state[key] = newState[key];
      cambio = true;
    }
  }
  if (cambio) {
    this.render();
  }
};
Modificador.prototype.addElements = function (ids) {
  for (let key in ids) {
    this[key] = document.getElementById(ids[key]);
  }
};

function TarjetaConfiguracion(titulo, descripcion = "", opciones = {}) {
  this.titulo = titulo;
  this.descripcion = descripcion;

  this.keyword = [];

  this.initOptions = JSON.parse(JSON.stringify(opciones));

  this.state = opciones;

  this.contenido = utils.createElement("div", {
    className: "form-control my-4",
  });

  this.botonEnviar = utils.createElement("button", {
    className: "btn btn-sm text-white bg-gray-600 hover:bg-gray-500",
    innerText: "Guardar",
  });
  this.classesEnviar = this.botonEnviar.className;
  this.botonEnviar.addEventListener("click", (e) => console.log("Enviar"));

  this.tarjeta = utils.createElement("div", { className: "card shadow-lg" }, [
    utils.createElement("div", { className: "card-body p-4" }, [
      utils.createElement("h2", { className: "card-title", innerHTML: titulo }),
      utils.createElement("div", { innerText: this.descripcion }),
      this.contenido,
      utils.createElement("div", { className: "flex flex-row-reverse" }, [
        this.botonEnviar,
      ]),
    ]),
  ]);
}
TarjetaConfiguracion.prototype = Object.create(Modificador.prototype);
TarjetaConfiguracion.prototype.addKeyWords = function (keywords) {
  this.keyword = this.keyword.concat(keywords);
};
TarjetaConfiguracion.prototype.addContenido = function (nodeList) {
  nodeList
    .filter((value) => value instanceof Node)
    .forEach((value) => {
      this.contenido.appendChild(value);
    });
};
TarjetaConfiguracion.prototype.render = function () {
  const template = this.template();
  const actual = this.contenido.children;

  template.forEach((value, index) => {
    if (actual[index] && value !== actual[index]) {
      this.contenido.replaceChild(value, actual[index]);
    } else if (!actual[index]) {
      this.contenido.appendChild(value);
    }
  });

  if (actual.length > template.length) {
    for (let i = template.length; i < actual.length; i++) {
      this.contenido.removeChild(actual[i]);
    }
  }

  let cambio = false;
  for (let key in this.state) {
    if (this.initOptions[key] !== this.state[key]) {
      cambio = true;
      break;
    }
  }
  if (cambio) {
    this.botonEnviar.className = this.classesEnviar;
  } else {
    this.botonEnviar.className = "hidden";
  }
};

const utils = {
  createModificador: (state = {}, ids = {}) => {
    const modificador = new Modificador(state);

    modificador.addElements(ids);

    return modificador;
  },
  createElementFromHTML: (htmlString) => {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  },
  createElement: (tagName, attributes = {}, children = []) => {
    const elemento = document.createElement(tagName);

    for (let key in attributes) {
      if (elemento[key] !== undefined) {
        elemento[key] = attributes[key];
      }
    }

    children.forEach((value) => {
      elemento.appendChild(value);
    });

    return elemento;
  },
};
