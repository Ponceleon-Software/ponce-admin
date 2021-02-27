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
  for (let key in newState) {
    if (this.state.hasOwnProperty(key)) {
      this.state[key] = newState[key];
    }
  }
  this.render();
};
Modificador.prototype.addElements = function (ids) {
  for (let key in ids) {
    this[key] = document.getElementById(ids[key]);
  }
};

const utils = {
  createModificador: (state = {}, ids = {}) => {
    const modificador = new Modificador(state);

    modificador.addElements(ids);

    return modificador;
  },
};

window.addEventListener("DOMContentLoaded", (e) => {
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
});
