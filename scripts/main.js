window.addEventListener("load", function () {
  let frame;
  htmlbutton = `${`<iframe name="iframe" id="iframe" src="/wordpress/wp-content/plugins/Ponce-admin/html/boton-flotante.html"></iframe>`}`;

  function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  frame = createElementFromHTML(htmlbutton);
  element = document.querySelector("#wpbody-content");
  element.appendChild(frame);
  let iframe = document.getElementById("iframe");
  iframe.addEventListener("load", function (e) {
    let p_button = iframe.contentWindow.document.getElementById(
      "pa-button-fixed"
    );
    p_button.addEventListener("click", function () {
      if (iframe.style.width != "100vw") {
        iframe.style.width = "100vw";
        iframe.style.top = "32px";
        iframe.style.marginTop = "0";
        iframe.style.height = "calc(100% - 32px)";
      } else {
        setTimeout(function () {
          iframe.style = null;
        }, 350);
      }
    });
  });
});

/*Esta es una llamada al endpoint creado en ponce-admin.php, su ubicación y funcionalidad son temporales. Se planea
implementar una ruta para cada ajuste próximamente*/
//Esta ruta es válida sólo para instalaciones locales, en caso de dominios en linea usar: domainName.com/sub-folder/?rest_route=/ponceadmin/v2/prueba
//colocar subfolder solo en caso de trabajar sobre un multisite
async function wpRestApi() {
  let response;
  try {
    response = await fetch(`/wordpress/wp-json/ponceadmin/v2/prueba`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      mode: "cors",
      credentials: "include",
    });
    let data = await response.json();
    return data;
  } catch (e) {
    alert(e);
  }
}

let result = wpRestApi();
result.then((r) => {
  console.log(r);
});
