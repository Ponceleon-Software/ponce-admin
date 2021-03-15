/**
 * Función que inicializa el control del panel lateral de forma
 * reactiva
 */
const controlPanel = () => {
  const statePanel = { lateralOpen: false };
  const idElements = {
    lateral: "pa-lateral-deslizable",
    botonAbrir: "pa-button-fixed",
    contenedorBoton: "pa-contenedor-boton-fixed",
    cubierta: "pa-cubierta",
  };

  //Se inicializa un objeto modificador con un estado lateralOpen que
  //indica si la barra lateral está mostrada y se le añaden los
  //elementos que modificara en cada render
  const modPanel = utils.createModificador(statePanel, idElements);

  //Guardo las clases iniciales de los elementos
  const classesL = modPanel.lateral.className;
  const classesBoton = modPanel.contenedorBoton.className;
  const classesCubierta = modPanel.cubierta.className;
  const imgBoton = modPanel.botonAbrir.innerHTML;

  let prevStyle = null;

  //Creo y ejecuto por primera vez la función render que se encarga
  //de modificar las clases css del elemento según el state
  modPanel.render = () => {
    modPanel.lateral.className =
      classesL + (modPanel.state.lateralOpen ? " right-0" : " -right-3/4");

    if (!modPanel.state.lateralOpen) {
      prevStyle = {
        transition: modPanel.lateral.style.transition,
        width: modPanel.lateral.style.width,
      };
      modPanel.lateral.style = null;
      modPanel.contenedorBoton.style = null;
    } else {
      modPanel.lateral.style.width = modPanel.contenedorBoton.style.right =
        prevStyle.width;
      setTimeout(() => {
        modPanel.lateral.style.transition = prevStyle.transition;
      }, 500);
    }

    modPanel.contenedorBoton.className =
      classesBoton +
      (modPanel.state.lateralOpen
        ? " right-3/4 top-12 -mt-6 h-8 w-8"
        : " right-0 top-1/2 -mt-6 h-12 w-12");
    modPanel.cubierta.className =
      classesCubierta + (modPanel.state.lateralOpen ? "" : " hidden");
    modPanel.botonAbrir.innerHTML = modPanel.state.lateralOpen ? "X" : imgBoton;
  };
  modPanel.render();

  //Añado un eventlistener al botón que cambie el estado al dar click
  //a cualquiera de los dos botones
  const setLateralOpen = (e) => {
    modPanel.setState({ lateralOpen: !modPanel.state.lateralOpen });
  };
  modPanel.botonAbrir.addEventListener("click", setLateralOpen);
  modPanel.cubierta.addEventListener("click", setLateralOpen);

  initResize();
};

/**
 * Contiene los event listener necesarios para el correcto resizing
 * del panel
 */
const initResize = () => {
  const panel = document.getElementById("pa-lateral-deslizable");
  const draggableBorder = document.getElementById("pa-resizer");
  const gridCards = document.getElementById("pa-container-config");

  const botonAbrir = document.getElementById("pa-contenedor-boton-fixed");

  const ajustarTamannoGrid = () => {
    gridCards.className = `grid gap-4 grid-cols-${Math.floor(
      panel.offsetWidth / 260
    )}`;
  };

  /**
   * Función que engancha el ancho del panel al mouse
   * @param {MouseEvent} e El evento del mouse
   */
  const move = (e) => {
    if (e.screenX < 50 || window.innerWidth - e.screenX < 280) return;

    botonAbrir.style.right = panel.style.width = `calc( 100% - ${e.screenX}px )`;
    ajustarTamannoGrid();
  };

  const onMouseOut = (e) => {
    botonAbrir.style.transition = panel.style.transition = "none";
    panel.className += " pa-resize-border";
    window.addEventListener("mousemove", move);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    draggableBorder.addEventListener("mouseout", onMouseOut);
  };

  draggableBorder.addEventListener("mousedown", onMouseDown);

  window.addEventListener("mouseup", (e) => {
    window.removeEventListener("mousemove", move);
    draggableBorder.removeEventListener("mouseout", onMouseOut);
    let index = panel.className.indexOf(" pa-resize-border");
    if (index > 0) panel.className = panel.className.substring(0, index);
  });

  window.addEventListener("resize", (e) => {
    if (panel.offsetWidth < 280) {
      panel.style.width = botonAbrir.style.right = "280px";
    }
    ajustarTamannoGrid();
  });
};

window.addEventListener("DOMContentLoaded", (e) => {
  controlPanel();

  viewsControl();
});

/*const labeledInputFile = (input, attributes) => {
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
};*/
