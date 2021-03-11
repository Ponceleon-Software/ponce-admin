const ponceLogoForm = () => {
  const form = utils.createElement("form", {
    className: "grid grid-cols-1 gap-2 max-w-xs mx-auto",
  });

  const poncelogo = new Componente(form);
  poncelogo.state = {
    src: "",
    inAdmin: false,
    inLogin: false,
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
        title: "Choose Image",
        button: {
          text: "Choose Image",
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
  //#endregion inputLogo

  //#region inAdmin
  const [labelAdmin, inputAdmin] = utils.createToogle(poncelogo.state.inAdmin);
  poncelogo.inAdminToggle = inputAdmin;
  poncelogo.inAdminToggle.name = "inAdmin";
  const containerAdmin = utils.createElement(
    "div",
    { className: "flex items-center justify-around" },
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
    { className: "flex items-center justify-around" },
    [utils.createElement("span", { innerHTML: "Mostrar en Login" }), labelLogin]
  );
  poncelogo.inLoginToggle.addEventListener("click", (e) => {
    poncelogo.setState({ inLogin: !poncelogo.state.inLogin });
  });
  //#endregion inLogin

  //#region submit
  poncelogo.submit = utils.createElement("input", {
    type: "submit",
    value: "Guardar",
    className: "btn btn-sm text-white bg-gray-600 hover:bg-gray-500",
  });
  const containerSubmit = utils.createElement(
    "div",
    { className: "flex flex-row-reverse" },
    [poncelogo.submit]
  );
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const response = await wpRestApiPost("logo", form);
    console.log(await response.json());
  });
  //#endregion submit

  poncelogo.template = () => {
    const temp = [labelLI];
    if (poncelogo.state.src) {
      poncelogo.srcInput.value = poncelogo.state.src;
      temp.push(
        utils.createElement("div", { className: "relative w-max mx-auto" }, [
          utils.createElement("img", {
            src: poncelogo.state.src,
            alt: "logo",
          }),
        ]),
        containerAdmin,
        containerLogin,
        poncelogo.srcInput
      );
    }
    temp.push(containerSubmit);
    return temp;
  };

  poncelogo.render();

  return poncelogo;
};
