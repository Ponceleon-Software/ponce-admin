(function logoInAdmin() {
  const parentElement = document.getElementById("adminmenuwrap");
  const theFirstChild = parentElement.firstChild;
  const newElement = document.createElement("div");
  newElement.id = "logo";
  parentElement.insertBefore(newElement, theFirstChild);

  const buscoDivLogo = document.getElementById("logo");
  let preguntoPrimerElemento = buscoDivLogo.firstChild;
  let crearNuevo = document.createElement("p");

  buscoDivLogo.insertBefore(crearNuevo, preguntoPrimerElemento);

  document.querySelector(
    "#logo > p"
  ).innerHTML = `<img src='${paLogoUser}' class='ponce-admin-logo' />`;
  document.querySelector("#logo > p").style.textAlign = "center";
})();
