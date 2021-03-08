const cardsEndpoints = {
  ponceTopBar: "topbar",
};

/**
 * Toma el arreglo de configuraciones de la base de datos y devuelve
 * las tarjetas correspondientes
 * @param {any[]} settings
 * @returns {TarjetaConfiguracion[]}
 */
const createAllCards = (settings) => {
  return settings.map((value) => {
    const name = value.name;
    const descripcion = value.description;
    const isActive = value.is_active === "1";
    const dbaction = cardsEndpoints[value.name]
      ? async () => await wpRestApi(cardsEndpoints[value.name])
      : () => {};

    const tarjeta = new TarjetaConfiguracion(name, descripcion, dbaction);
    tarjeta.setSwitch(isActive);
    tarjeta.addKeyWords(value.keywords);
    return tarjeta;
  });
};

/**
 * Controla la salida de las tarjetas y la manera en que se van a mostrar
 */
const cardsControl = (settings) => {
  const controlTarjetas = new Modificador();
  controlTarjetas.state = {
    buscador: "",
  };
  controlTarjetas.tarjetas = createAllCards(settings);
  controlTarjetas.addElements({
    container: "pa-container-config",
    buscador: "pa-buscador-config",
  });
  controlTarjetas.template = () => {
    const devuelto = [];
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
    const actual = controlTarjetas.container.children;

    template.forEach((value, index) => {
      if (actual[index] && value !== actual[index]) {
        controlTarjetas.container.replaceChild(value, actual[index]);
      } else if (!actual[index]) {
        controlTarjetas.container.appendChild(value);
      }
    });

    if (actual.length > template.length) {
      for (let i = template.length; i < actual.length; i++) {
        controlTarjetas.container.removeChild(actual[i]);
      }
    }
    controlTarjetas.buscador.focus();
  };

  controlTarjetas.buscador.addEventListener("keyup", () => {
    controlTarjetas.setState({ buscador: controlTarjetas.buscador.value });
  });

  controlTarjetas.render();

  return controlTarjetas;
};
