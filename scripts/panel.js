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

function TarjetaConfiguracion(titulo, opciones = {}) {
  this.titulo = titulo;

  this.keyword = [];

  this.state = opciones;

  this.contenido = utils.createElement("div", { className: "form-control" });

  this.tarjeta = utils.createElement("div", { className: "card shadow-lg" }, [
    utils.createElement("div", { className: "card-body" }, [
      utils.createElement("h2", { className: "card-title", innerHTML: titulo }),
      this.contenido,
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

const createToogle = (checked) =>
  utils.createElement("input", {
    type: "checkbox",
    className: "toggle toggle-primary",
    checked: checked,
  });
const labelToogle = (nombre, checkbox) =>
  utils.createElement("label", { className: "cursor-pointer label" }, [
    utils.createElement("span", { className: "label-text", innerText: nombre }),
    utils.createElement("div", {}, [
      checkbox,
      utils.createElement("span", { className: "toggle-mark" }),
    ]),
  ]);

const controlPanel = () => {
  const statePanel = { lateralOpen: false };
  const idElements = {
    lateral: "pa-lateral-deslizable",
    botonAbrir: "pa-button-fixed",
    contenedorBoton: "pa-contenedor-boton-fixed",
  };

  //Se inicializa un objeto modificador con un estado lateralOpen que
  //indica si la barra lateral está mostrada y se le añaden los
  //elementos que modificara en cada render
  const modPanel = utils.createModificador(statePanel, idElements);

  //Guardo las clases iniciales de los elementos
  const classesL = modPanel.lateral.className;
  const classesBoton = modPanel.contenedorBoton.className;
  const imgBoton = modPanel.botonAbrir.innerHTML;

  //Creo y ejecuto por primera vez la función render que se encarga
  //de modificar las clases css del elemento según el state
  modPanel.render = () => {
    modPanel.lateral.className =
      classesL + (modPanel.state.lateralOpen ? " right-0" : " -right-3/4");

    modPanel.contenedorBoton.className =
      classesBoton +
      (modPanel.state.lateralOpen
        ? " right-3/4 top-12 -mt-6 h-8 w-8"
        : " right-0 top-1/2 -mt-6 h-12 w-12");
    modPanel.botonAbrir.innerHTML = modPanel.state.lateralOpen ? "X" : imgBoton;
  };
  modPanel.render();

  //Añado un eventlistener al botón que cambie el estado al dar click
  //a cualquiera de los dos botones
  const setLateralOpen = (e) => {
    modPanel.setState({ lateralOpen: !modPanel.state.lateralOpen });
  };
  modPanel.botonAbrir.addEventListener("click", setLateralOpen);
};

const tarjetaLogo = new TarjetaConfiguracion("Logo", {
  isLogo: false,
  src: "",
  inLogin: false,
  inAdmin: false,
});
tarjetaLogo.addKeyWords(["logo", "imagen", "image"]);
tarjetaLogo.inputs = {
  src: utils.createElement("input", { type: "file" }),
  inLogin: createToogle(tarjetaLogo.state.isLogin),
  inAdmin: createToogle(tarjetaLogo.state.isAdmin),
};
const src = tarjetaLogo.inputs.src,
  inLogin = labelToogle("Login", tarjetaLogo.inputs.inLogin),
  inAdmin = labelToogle("Admin", tarjetaLogo.inputs.inAdmin);
tarjetaLogo.render = () => {
  tarjetaLogo.contenido.innerHTML = "";
  tarjetaLogo.contenido.appendChild(src);
  if (tarjetaLogo.state.isLogo) {
    tarjetaLogo.contenido.appendChild(inLogin);
    tarjetaLogo.contenido.appendChild(inAdmin);
  }
};
tarjetaLogo.inputs.inLogin.addEventListener("click", (e) => {
  tarjetaLogo.setState({ inLogin: !tarjetaLogo.state.inLogin });
});
tarjetaLogo.inputs.inLogin.addEventListener("click", (e) => {
  tarjetaLogo.setState({ inAdmin: !tarjetaLogo.state.inAdmin });
});

const controlar = () => {
  const controlTarjetas = new Modificador();
  controlTarjetas.state = {
    buscador: "",
  };
  controlTarjetas.tarjetas = [tarjetaLogo];
  controlTarjetas.addElements({
    contenedor: "pa-container-config",
    buscador: "pa-buscador-config",
  });
  controlTarjetas.contenedorBuscador = controlTarjetas.contenedor.children[0];
  controlTarjetas.render = () => {
    controlTarjetas.contenedor.innerHTML = "";
    controlTarjetas.contenedor.appendChild(controlTarjetas.contenedorBuscador);
    controlTarjetas.tarjetas
      .filter((value) =>
        value.keyword.some((word) =>
          word
            .toLowerCase()
            .includes(controlTarjetas.state.buscador.toLowerCase())
        )
      )
      .forEach((value) => {
        controlTarjetas.contenedor.appendChild(value.tarjeta);
      });
    controlTarjetas.buscador.focus();
  };

  controlTarjetas.buscador.addEventListener("keyup", () => {
    controlTarjetas.setState({ buscador: controlTarjetas.buscador.value });
  });

  controlTarjetas.render();
};

window.addEventListener("DOMContentLoaded", (e) => {
  controlPanel();

  controlar();
  tarjetaLogo.render();
});
