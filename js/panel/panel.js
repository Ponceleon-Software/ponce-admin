/**
 * Función que inicializa el control del panel lateral de forma
 * reactiva
 */
const controlPanel = () => {
  const statePanel = {
    lateralOpen: false,
    posicionBoton: { x: null, y: null },
    botonDragging: false,
  };
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
  const iframe = window.parent.document.getElementById("iframe");

  //Guardo las clases iniciales de los elementos
  const classesL = modPanel.lateral.className;
  const classesBoton = modPanel.contenedorBoton.className;
  const classesCubierta = modPanel.cubierta.className;
  const imgBoton = modPanel.botonAbrir.innerHTML;

  let prevStyle = null;

  const iFrame = {
    set maximized(is) {
      if (is) {
        iframe.style.width = "100vw";
        iframe.style.top = "0";
        iframe.style.marginTop = "0";
        iframe.style.height = "100%";
      } else {
        iframe.style = null;
      }
    },
  };
  let movementStart = { x: 0, y: 0 };
  let botonMoved = false;
  const dragButton = {
    move: (e) => {
      e.preventDefault();
      botonMoved = true;
      modPanel.setState({
        posicionBoton: { x: e.x - movementStart.x, y: e.y - movementStart.y },
      });
    },
    mouseDown: (e) => {
      e.preventDefault();
      movementStart = {
        x: e.offsetX - e.target.offsetWidth,
        y: e.offsetY - 20,
      };
      modPanel.setState({ botonDragging: true });
    },
    mouseUp: (e) => {
      e.preventDefault();
      if (!botonMoved)
        modPanel.setState({ lateralOpen: !modPanel.state.lateralOpen });
      modPanel.setState({ botonDragging: false });
      botonMoved = false;
    },
  };

  //Creo y ejecuto por primera vez la función render que se encarga
  //de modificar las clases css del elemento según el state
  modPanel.render = () => {
    const state = JSON.parse(JSON.stringify(modPanel.state));
    iFrame.maximized = true;

    modPanel.lateral.className =
      classesL + (state.lateralOpen ? " right-0" : " -right-3/4");

    if (!state.lateralOpen) {
      prevStyle = {
        transition: modPanel.lateral.style.transition,
        width: modPanel.lateral.style.width,
      };
      modPanel.lateral.style = null;
      //modPanel.contenedorBoton.style = null;
    } else {
      modPanel.lateral.style.width = modPanel.contenedorBoton.style.right =
        prevStyle.width;
      setTimeout(() => {
        modPanel.lateral.style.transition = prevStyle.transition;
        modPanel.lateral.dispatchEvent(new Event("resize"));
      }, 500);
    }

    //#region Mover boton
    modPanel.contenedorBoton.style.transition = state.botonDragging
      ? "none"
      : null;
    modPanel.botonAbrir.onmousedown = state.lateralOpen
      ? null
      : dragButton.mouseDown;
    window.onmousemove = state.botonDragging ? dragButton.move : null;
    window.onmouseup = state.botonDragging ? dragButton.mouseUp : null;

    if (state.botonDragging) {
      const { x, y } = state.posicionBoton;
      modPanel.contenedorBoton.style.top = `${y}px`;
      modPanel.contenedorBoton.style.bottom = null;
      modPanel.contenedorBoton.style.right = `${window.innerWidth - x}px`;
    } else if (
      !state.lateralOpen &&
      (state.posicionBoton.x || state.posicionBoton.y)
    ) {
      const { x, y } = state.posicionBoton;
      modPanel.contenedorBoton.style.top = `${y}px`;
      modPanel.contenedorBoton.style.right = null;
    }
    //#endregion

    modPanel.contenedorBoton.className =
      classesBoton +
      (state.lateralOpen
        ? " right-3/4 top-12 -mt-6 h-8 w-8"
        : " right-0 top-1/2 -mt-6 h-12 w-12");
    modPanel.cubierta.className =
      classesCubierta + (state.lateralOpen ? "" : " hidden");
    modPanel.botonAbrir.innerHTML = state.lateralOpen ? "X" : imgBoton;
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

  /**
   * Función que engancha el ancho del panel al mouse
   * @param {MouseEvent} e El evento del mouse
   */
  const move = (e) => {
    if (e.screenX < 50 || window.innerWidth - e.screenX < 280) return;

    botonAbrir.style.right = panel.style.width = `calc( 100% - ${e.screenX}px )`;
    panel.dispatchEvent(new Event("resize"));
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
    if (
      panel.offsetWidth < 280 &&
      window.innerWidth == window.parent.innerWidth
    ) {
      panel.style.width = botonAbrir.style.right = "280px";
    }
    panel.dispatchEvent(new Event("resize"));
  });

  const ajustarTamannoGrid = () => {
    gridCards.className = `grid gap-4 grid-cols-${Math.floor(
      panel.offsetWidth / 260
    )}`;
  };

  panel.addEventListener("resize", ajustarTamannoGrid);
};

window.addEventListener("DOMContentLoaded", (e) => {
  controlPanel();

  viewsControl();
});
