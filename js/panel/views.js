/**
 * Crea un objeto que se encarga de cambiar las vistas de las
 * soluciones
 */
const viewsControl = async () => {
  const response = await wpRestApi("settings");
  const settings = await response.json();

  const allViews = {
    cards: cardsControl(settings),
  };
  const solutionsCreator = solutions(settings);
  const getView = (view) => {
    if (allViews[view]) {
      return allViews[view];
    } else {
      return solutionsCreator.create(view);
    }
  };

  const controlador = new Modificador({ view: "cards" });

  controlador.addElements({
    container: "pa-views-container",
  });
  controlador.cambiando = false;

  controlador.render = () => {
    const state = controlador.state;
    if (controlador.cambiando) {
      return;
    }
    controlador.cambiando = true;
    const classes = controlador.container.className;
    controlador.container.className =
      classes + " transition-opacity duration-300 opacity-0";
    setTimeout(() => {
      controlador.container.innerHTML = "";
      controlador.container.appendChild(getView(state.view).container);
      controlador.container.className = classes;
      controlador.cambiando = false;
    }, 300);
  };

  controlador.container.addEventListener("changeview", (e) => {
    const newView = e.view;
    if (!newView) {
      return;
    }
    controlador.setState({ view: newView });
  });
};
