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

/**
 * Crea una tarjeta estandar del panel
 * @param {string} titulo
 * @param {string} descripcion
 * @param {function} dbaction
 * @param {any} ajustes
 */
function TarjetaConfiguracion(
  titulo,
  descripcion = "",
  dbaction = () => {},
  ajustes = {}
) {
  this.titulo = titulo;
  this.descripcion = descripcion;
  this.dbaction = dbaction;
  this.ajustes = ajustes;

  this.keyword = [];

  this.contenido = utils.createElement("div", {
    className: "form-control my-4",
  });

  this.botonAjustes = utils.createElement("button", {
    className: "btn btn-sm text-white bg-gray-600 hover:bg-gray-500",
    innerText: "Ir Ajustes",
  });
  this.botonAjustes.addEventListener("click", (e) => console.log(this.ajustes));

  this.doingAction = false;
  const [checkContainer, checkInput] = utils.createToogle(false);
  this.checkbox = checkInput;
  this.checkbox.addEventListener("click", async (e) => {
    if (this.doingAction) {
      e.preventDefault();
    }
    this.doingAction = true;
    await this.dbaction();
    this.doingAction = false;
  });

  this.tarjeta = utils.createElement(
    "div",
    { className: "card shadow-lg rounded-xl" },
    [
      utils.createElement("div", { className: "card-body p-4" }, [
        utils.createElement("h2", {
          className: "card-title text-base",
          innerHTML: this.titulo,
        }),
        utils.createElement("div", {
          innerHTML: this.descripcion,
          className: "text-sm max-h-10 overflow-hidden pa-max-lines-2",
        }),
        utils.createElement(
          "div",
          { className: "flex justify-between items-center mt-2" },
          [checkContainer, this.botonAjustes]
        ),
      ]),
    ]
  );
}
/**
 * Añade a la tarjeta palabras clave para ayudar al buscador
 * @param {string[]} keywords Arreglo de palabras clave a añadir
 */
TarjetaConfiguracion.prototype.addKeyWords = function (keywords) {
  this.keyword = this.keyword.concat(keywords);
};

const utils = {
  createModificador: (state = {}, ids = {}) => {
    const modificador = new Modificador(state);

    modificador.addElements(ids);

    return modificador;
  },
  createElementFromHTML: (htmlString) => {
    const div = document.createElement("div");
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
  /**
   * Crea un tooglede daisy ui sin el label
   * @param {boolean} checked El estado inicial de la prpiedad
   * checked del input
   * @returns {[Node, Node]} Un arreglo con el toogle completo en
   * la primera posición y el input solo en la segunda
   */
  createToogle: (checked) => {
    const input = utils.createElement("input", {
      type: "checkbox",
      className: "toggle toggle-primary",
      checked: checked,
    });
    const all = utils.createElement("div", {}, [
      input,
      utils.createElement("span", { className: "toggle-mark" }),
    ]);
    return [all, input];
  },
};
