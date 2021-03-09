const ponceLogoForm = () => {
  const form = utils.createElement("form", {
    className: "grid grid-cols-1 gap-2 max-w-xs mx-auto",
  });

  const poncelogo = new Componente(form);
  poncelogo.state = {
    preview: "",
    file: "",
    inAdmin: false,
    inLogin: false,
  };

  //#region inputLogo
  poncelogo.logoInput = utils.createElement("input", {
    type: "file",
    accept: "image/png,image/jpeg",
    id: "pa-logo-input",
    name: "image",
  });
  poncelogo.logoInput.addEventListener("change", (e) => {
    console.log(e.target.files[0]);
    poncelogo.setState({
      file: e.target.files[0],
      preview: URL.createObjectURL(e.target.files[0]),
    });
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
    const response = wpRestApiPost("poncelogo", form);
    console.log(await response.json());
  });
  //#endregion submit

  poncelogo.template = () => {
    const temp = [labelLI];
    if (poncelogo.state.preview) {
      temp.push(
        utils.createElement("div", { className: "relative w-max mx-auto" }, [
          utils.createElement("img", {
            src: poncelogo.state.preview,
            alt: "logo",
          }),
        ]),
        containerAdmin,
        containerLogin
      );
    }
    temp.push(containerSubmit);
    return temp;
  };

  poncelogo.render();

  return poncelogo;
};
