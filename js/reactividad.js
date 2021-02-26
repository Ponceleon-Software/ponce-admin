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
  const stateDash = { lateralOpen: false };
  const idElements = {
    lateral: "pa-lateral-deslizable",
    botonAbrir: "pa-button-fixed",
    botonCerrar: "pa-boton-cerrar-lateral",
  };

  //Se inicializa un objeto modificador con un estado lateralOpen que
  //indica si la barra lateral está mostrada y se le añaden los
  //elementos que modificara en cada render
  const modDashboard = utils.createModificador(stateDash, idElements);

  //Guardo las clases iniciales de los elementos
  const classesL = modDashboard.lateral.className;

  //Creo y ejecuto por primera vez la función render que se encarga
  //de modificar las clases css del elemento según el state
  modDashboard.render = () => {
    modDashboard.lateral.className =
      classesL + (modDashboard.state.lateralOpen ? " right-0" : " -right-3/4");
  };
  modDashboard.render();

  //Añado un eventlistener al botón que cambie el estado al dar click
  //a cualquiera de los dos botones
  const setLateralOpen = (e) => {
    modDashboard.setState({ lateralOpen: !modDashboard.state.lateralOpen });
  };
  modDashboard.botonAbrir.addEventListener("click", setLateralOpen);
  modDashboard.botonCerrar.addEventListener("click", setLateralOpen);
});
