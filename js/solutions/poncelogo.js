const ponceLogoForm = (options = {}) => {
  const form = utils.createElement("form", {
    className: "grid grid-cols-1 gap-2",
  });

  const poncelogo = new Componente(form);
  poncelogo.state = {
    ...options,
    saving: false,
  };

  //#region inputLogo
  poncelogo.logoInput = utils.createElement("input", {
    type: "button",
    id: "pa-logo-input",
  });
  poncelogo.srcInput = utils.createElement("input", {
    type: "text",
    name: "src",
    className: "hidden",
  });
  let mediaUploader;
  poncelogo.logoInput.addEventListener("click", (e) => {
    e.preventDefault();

    if (mediaUploader) {
      mediaUploader.open();
      return;
    }

    if (window.parent) {
      mediaUploader = window.parent.wp.media({
        title: "Elegir Imagen",
        button: {
          text: "Elegir Imagen",
        },
        library: {
          type: ["image"],
        },
        multiple: false,
      });
    }

    // When a file is selected, grab the URL and set it as the text field's value
    mediaUploader.on("select", function () {
      let attachment = mediaUploader.state().get("selection").first().toJSON();
      poncelogo.setState({
        src: attachment.url,
      });
    });

    // Open the uploader dialog
    mediaUploader.open();
  });
  const labelLI = utils.labelInputFile(poncelogo.logoInput, {
    title: "Subir logo",
  });
  labelLI.className += " max-w-xs";
  //#endregion inputLogo

  //#region inAdmin
  const [labelAdmin, inputAdmin] = utils.createToogle(poncelogo.state.inAdmin);
  poncelogo.inAdminToggle = inputAdmin;
  poncelogo.inAdminToggle.name = "inAdmin";
  const containerAdmin = utils.createElement(
    "div",
    { className: "flex items-center justify-between" },
    [utils.createElement("span", { innerHTML: "Mostrar en Admin" }), labelAdmin]
  );
  poncelogo.inAdminToggle.addEventListener("click", (e) => {
    poncelogo.setState({ inAdmin: !poncelogo.state.inAdmin });
  });
  //#endregion inAdmin

  //#region inLogin
  const [labelLogin, inputLogin] = utils.createToogle(poncelogo.state.inLogin);
  poncelogo.inLoginToggle = inputLogin;
  poncelogo.inLoginToggle.name = "inLogin";
  const containerLogin = utils.createElement(
    "div",
    { className: "flex items-center justify-between" },
    [utils.createElement("span", { innerHTML: "Mostrar en Login" }), labelLogin]
  );
  poncelogo.inLoginToggle.addEventListener("click", (e) => {
    poncelogo.setState({ inLogin: !poncelogo.state.inLogin });
  });
  //#endregion inLogin

  const contenedorSwitchs = utils.createElement("div", { className: "w-max" }, [
    containerAdmin,
    containerLogin,
  ]);

  const contenedorAlert = utils.createElement("div");

  //#region submit
  const loadCircle = utils.createElement("span", {
    className:
      "w-4 h-4 ml-2 rounded-full border-2 border-gray-200 animate-spin",
    style: "border-top-color: gray",
  });
  const showAlerts = utils.initAlerts(contenedorAlert);

  poncelogo.submit = utils.createElement("button", {
    type: "submit",
    className: "btn btn-sm text-white bg-gray-600 hover:bg-gray-500",
    innerHTML: "Guardar",
  });
  const containerSubmit = utils.createElement(
    "div",
    { className: "flex flex-row-reverse" },
    [poncelogo.submit]
  );
  let guardando = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const state = JSON.parse(JSON.stringify( poncelogo.state ));
    const {src, inAdmin, inLogin} = state;

    if (poncelogo.state.saving) return;
    poncelogo.setState({saving: true});

    const params = {src, inAdmin, inLogin};
    const response = await wpRestApiPost("options/ponceLogo", params);
    showAlerts(response.ok);

    poncelogo.setState({saving: false});
  });
  //#endregion

  //#region preview imagen
  const botonCancel = utils.createElement("button", {
    className: "btn btn-error btn-circle btn-xs absolute right-2 top-2",
    innerHTML: "x",
  });
  const previewImg = utils.createElement(
    "div",
    { className: "relative w-max" },
    [
      utils.createElement("img", {
        src: poncelogo.state.src,
        alt: "logo",
        width: "250",
        height: "250",
      }),
      botonCancel,
    ]
  );
  botonCancel.addEventListener("click", (e) => {
    poncelogo.setState({ src: "", inAdmin: false, inLogin: false });
  });
  //#endregion

  poncelogo.template = () => {
    const temp = [labelLI];

    const state = JSON.parse(JSON.stringify(poncelogo.state));
    const {src, inAdmin, inLogin, saving} = state;

    poncelogo.srcInput.value = src;
    previewImg.firstChild.src = src;

    poncelogo.inAdminToggle.checked = inAdmin;
    poncelogo.inLoginToggle.checked = inLogin;

    poncelogo.submit.innerHTML = "Guardar" 
      + (saving ? loadCircle.outerHTML : '');

    if (poncelogo.state.src) {
      temp.push(previewImg, contenedorSwitchs, poncelogo.srcInput);
    }
    temp.push(contenedorAlert, containerSubmit);
    return temp;
  };

  poncelogo.render();

  return poncelogo;
};
