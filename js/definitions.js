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
 * @param {() => void} dbaction
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
  this.botonAjustes.addEventListener("click", (e) => {
    const event = new Event("changeview");
    event.view = this.titulo;
    document.getElementById("pa-views-container").dispatchEvent(event);
  });

  /**
   * Muestra una alerta para indicar al usuario si el request fue
   * exitoso o no
   * @param {boolean} success Indica si el request fue exitoso
   */
  const showAlert = (success) => {
    const body = this.tarjeta.firstChild;

    const show = (alerta) => {
      body.appendChild(alerta);
      setTimeout(() => {
        body.removeChild(alerta);
      }, 2000);
    };

    if (success) {
      show(this.alerta);
    } else {
      show(this.alertaEror);
    }
  };

  this.switch = new LockeableSwitch(this.dbaction, showAlert);

  this.alerta = utils.alertaCambios("success", "Se han guardado los cambios");
  this.alertaEror = utils.alertaCambios("error", "Ha ocurrido un error");

  const tituloMostrado = this.titulo
    .split(/([A-Z][a-z]*)/)
    .filter((value) => Boolean(value))
    .join(" ");

  this.tarjeta = utils.createElement(
    "div",
    { className: "card shadow-lg rounded-xl" },
    [
      utils.createElement("div", { className: "card-body p-4" }, [
        utils.createElement("h2", {
          className: "card-title text-base capitalize",
          innerHTML: tituloMostrado,
        }),
        utils.createElement("div", {
          innerHTML: this.descripcion,
          className: "text-sm max-h-10 overflow-hidden pa-max-lines-2",
        }),
        utils.createElement(
          "div",
          { className: "flex justify-between items-center mt-2" },
          [this.switch.elementoPadre, this.botonAjustes]
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
/**
 * Cambia el estado del switch sin alterar la db
 * @param {boolean} checked Si el switch va estar activo o no
 */
TarjetaConfiguracion.prototype.setSwitch = function (checked) {
  this.switch.setChecked(checked);
};

/**
 * Define un objeto que crea la vista individual de una solución
 * @param {string} name Nombre de la solución
 * @param {string} description Descripción de la solución
 */
function SolucionIndvidual(name, description = "", form = null) {
  this.name = name;
  this.description = description;

  this.botonVolver = utils.createElement("button", {
    innerHTML: "Volver",
    className: "btn btn-primary btn-sm",
  });
  this.botonVolver.addEventListener("click", (e) => {
    const event = new Event("changeview");
    event.view = "cards";
    document.getElementById("pa-views-container").dispatchEvent(event);
  });

  this.form = form ? form.elementoPadre : utils.createElement("div");

  const titulo = this.name
    .split(/([A-Z][a-z]*)/)
    .filter((value) => Boolean(value))
    .join(" ");

  this.container = utils.createElement("div", {}, [
    utils.createElement("div", { className: "flex" }, [
      utils.createElement("h3", {
        innerHTML: titulo,
        className: "flex-grow text-xl capitalize font-bold",
      }),
      this.botonVolver,
    ]),
    utils.createElement("p", {
      innerHTML: this.description,
      className: "my-4",
    }),
    this.form,
  ]);
}

/**
 * Encapsula funcionalidad compartida entre todos los componentes
 * reactivos
 * @param {Node} elemento
 * @param {() => Node[]} template
 */
function Componente(elemento = null, template = () => []) {
  this.elementoPadre = elemento;
  this.template = template;
}
Componente.prototype = Object.create(Modificador.prototype);
Componente.prototype.render = function () {
  const template = this.template();
  const children = this.elementoPadre.children;

  template.forEach((value, index) => {
    if (children[index]) {
      if (value !== children[index]) {
        this.elementoPadre.replaceChild(value, children[index]);
      }
    } else {
      this.elementoPadre.appendChild(value);
    }
  });

  if (children.length > template.length) {
    for (let i = template.length; i < children.length; i++) {
      this.elementoPadre.removeChild(children[i]);
    }
  }
};

/**
 *
 * @param {() => Promise<Response>} action
 * @param {(success:boolean) => void} onFinish
 */
function LockeableSwitch(action, onFinish = null) {
  this.state = { locked: false };

  const [label, input] = utils.createToogle();
  this.label = label;
  this.input = input;
  this.toggleMark = this.label.querySelector("span.toggle-mark");

  this.loadCircle = utils.createElement("span", {
    className:
      "w-4 h-4 ml-2 rounded-full border-2 border-gray-200 animate-spin",
    style: "border-top-color: gray",
  });

  this.elementoPadre = utils.createElement(
    "div",
    { className: "flex items-center" },
    [this.label]
  );

  this.action = action;
  this.onFinish = onFinish;

  this.input.addEventListener("click", async (e) => {
    if (this.state.locked) {
      e.preventDefault();
      return;
    }
    this.setState({ locked: true });
    const response = await this.action();
    this.setState({ locked: false });
    if (this.onFinish) {
      const success = response.ok;
      this.onFinish(success);
      if (!success) {
        this.input.checked = !this.input.checked;
      }
    }
  });
}
LockeableSwitch.prototype = Object.create(Componente.prototype);
LockeableSwitch.prototype.template = function () {
  this.toggleMark.style = this.state.locked ? "cursor: default;" : "";

  const temp = [this.label];
  if (this.state.locked) {
    temp.push(this.loadCircle);
  }
  return temp;
};
/**
 *
 * @param {boolean} checked Si el switch está activo no
 */
LockeableSwitch.prototype.setChecked = function (checked) {
  this.input.checked = checked;
};

/*function LabeledInputFile(accept = "image/*", id = "pa-file-input") {
  this.state = {
    value: "",
  };

  this.input = utils.createElement(
    "input",
    { className: "hidden", type: "file", accept, id },
    []
  );
  this.input.addEventListener("change", (e) => {
    this.setState({ value: e.target.value });
  });

  this.label = utils.createElement("label", {
    htmlFor: id,
    className: "btn btn-circle btn-primary",
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="30px" height="30px"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>`,
  });

  this.elementoPadre = utils.createElement("div", {}, [this.label, this.input]);
}
LabeledInputFile.prototype = Object.create(Componente.prototype);*/

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
  /**
   * Función para facilitar la creación de elementos del DOM
   * @param {string} tagName Nombre de la etiqueta del elemento a crear
   * @param {any} attributes Objeto con los atributos html del elemento
   * @param {Node[]} children Arreglo de elementos hijos
   * @returns {Node}
   */
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
   * @param {boolean} checked El estado inicial de la propiedad
   * checked del input
   * @returns {[Node, Node]} Un arreglo con el toogle completo en
   * la primera posición y el input solo en la segunda
   */
  createToogle: (checked = false) => {
    const input = utils.createElement("input", {
      type: "checkbox",
      className: "toggle toggle-primary",
      checked: checked,
    });
    const all = utils.createElement("label", { className: "label" }, [
      input,
      utils.createElement("span", { className: "toggle-mark" }),
    ]);
    return [all, input];
  },
  alertaCambios: (severity = "success", text = "") =>
    utils.createElement(
      "div",
      { className: `alert alert-${severity} px-3 mt-2 pa-aparecer` },
      [
        utils.createElement(
          "div",
          {
            className: "flex-1",
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> 
          </svg>`,
          },
          [
            utils.createElement("label", {
              innerHTML: text,
            }),
          ]
        ),
      ]
    ),
  /**
   * Función que crea un boton redondo como label para un input de tipo file
   * @param {Node} input El input de tipo file al que hace referencia el label
   * @param {any} attributes algunos atributos para modificar el label
   * @returns {Node}
   */
  labelInputFile: (input, attributes) => {
    input.className += " hidden";
    return utils.createElement("div", { className: "flex justify-center" }, [
      utils.createElement(
        "label",
        {
          ...attributes,
          htmlFor: input.id,
          className: "btn btn-circle btn-primary",
          innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="30px" height="30px"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>`,
        },
        [input]
      ),
    ]);
  },
};
