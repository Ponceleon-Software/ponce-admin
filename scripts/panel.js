const createToogle = (checked) =>
  utils.createElement("input", {
    type: "checkbox",
    className: "toggle toggle-primary",
    checked: checked,
  });
const labelToogle = (nombre, checkbox) =>
  utils.createElement(
    "label",
    { className: "label justify-around cursor-pointer" },
    [
      utils.createElement("span", {
        className: "label-text",
        innerText: nombre,
      }),
      utils.createElement("div", {}, [
        checkbox,
        utils.createElement("span", { className: "toggle-mark" }),
      ]),
    ]
  );
const labeledInputFile = (input, attributes) => {
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
};

const tarjetaLogo = () => {
  const tarjetaLogo = new TarjetaConfiguracion(
    "Ponce Logo",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit Cras vulputate consequat vestibulum. Sed suscipit sollicitudin sem"
    /*{
      isLogo: false,
      src: "",
      inLogin: false,
      inAdmin: false,
    }*/
  );
  tarjetaLogo.addKeyWords(["logo", "imagen", "image"]);
  /*tarjetaLogo.inputs = {
    src: utils.createElement("input", {
      type: "file",
      accept: "image/jpeg,image/png",
      id: "pa-logo-input",
    }),
    inLogin: createToogle(tarjetaLogo.state.inLogin),
    inAdmin: createToogle(tarjetaLogo.state.inAdmin),
  };
  tarjetaLogo.inputs.inLogin.name = "inLogin";
  tarjetaLogo.inputs.inAdmin.name = "inAdmin";
  const src = labeledInputFile(tarjetaLogo.inputs.src, {
      title: "Subir un logo",
    }),
    inLogin = labelToogle("Login", tarjetaLogo.inputs.inLogin),
    inAdmin = labelToogle("Admin", tarjetaLogo.inputs.inAdmin);
  tarjetaLogo.template = () => {
    const content = [src];
    if (tarjetaLogo.state.isLogo) {
      content.push(inLogin, inAdmin);
    }
    return content;
  };
  tarjetaLogo.handleToogle = (e) => {
    tarjetaLogo.setState({ [e.target.name]: e.target.checked });
  };
  tarjetaLogo.inputs.inLogin.addEventListener(
    "change",
    tarjetaLogo.handleToogle
  );
  tarjetaLogo.inputs.inAdmin.addEventListener(
    "change",
    tarjetaLogo.handleToogle
  );*/
  return tarjetaLogo;
};

const tarjetaTopBar = () => {
  const changeTopBar = async () => await wpRestApi("topbar");

  const tarjetaTopBar = new TarjetaConfiguracion(
    "Ponce Topbar",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit Cras vulputate consequat vestibulum. Sed suscipit sollicitudin sem",
    changeTopBar
    //{ isActive: true }
  );
  tarjetaTopBar.addKeyWords(["top bar", "barra superior", "admin bar"]);
  /*tarjetaTopBar.inputs = {
    isActive: createToogle(tarjetaTopBar.state.isActive),
  };
  const isActive = labelToogle("Mostrar", tarjetaTopBar.inputs.isActive);
  tarjetaTopBar.template = () => {
    return [isActive];
  };
  tarjetaTopBar.inputs.isActive.addEventListener("change", (e) => {
    tarjetaTopBar.setState({ isActive: e.target.checked });
  });*/
  return tarjetaTopBar;
};

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

const controlar = async () => {
  const settings = await wpRestApi("settings");
  console.log(settings);

  const controlTarjetas = new Modificador();
  controlTarjetas.state = {
    buscador: "",
  };
  controlTarjetas.tarjetas = [tarjetaLogo(), tarjetaTopBar()];
  controlTarjetas.addElements({
    contenedor: "pa-container-config",
    buscador: "pa-buscador-config",
  });
  controlTarjetas.contenedorBuscador = controlTarjetas.contenedor.children[0];
  controlTarjetas.template = () => {
    const devuelto = [controlTarjetas.contenedorBuscador];
    return devuelto.concat(
      controlTarjetas.tarjetas
        .filter((value) =>
          value.keyword.some((word) =>
            word
              .toLowerCase()
              .includes(controlTarjetas.state.buscador.toLowerCase())
          )
        )
        .map((value) => value.tarjeta)
    );
  };
  controlTarjetas.render = () => {
    const template = controlTarjetas.template();
    const actual = controlTarjetas.contenedor.children;

    template.forEach((value, index) => {
      if (actual[index] && value !== actual[index]) {
        controlTarjetas.contenedor.replaceChild(value, actual[index]);
      } else if (!actual[index]) {
        controlTarjetas.contenedor.appendChild(value);
      }
    });

    if (actual.length > template.length) {
      for (let i = template.length; i < actual.length; i++) {
        controlTarjetas.contenedor.removeChild(actual[i]);
      }
    }
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
});
