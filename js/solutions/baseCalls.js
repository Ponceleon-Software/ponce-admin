function getHomeUrl() {
  var href = window.location.href;
  var index = href.indexOf("/wp-content");
  var homeUrl = href.substring(0, index);
  return homeUrl;
}

const endpointurl = getHomeUrl();

async function wpRestApi(path) {
  let response;
  try {
    response = await fetch(`${endpointurl}/wp-json/ponceadmin/v2/${path}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      mode: "cors",
      credentials: "include",
    });
    return response;
  } catch (e) {
    alert(e);
  }
}

/**
 * Hace una llamada a la api rest a partir de un formulario
 * @param {string} path ruta del endpoint
 * @param {HTMLFormElement} form Formulario a enviar
 * @returns {Response} Respuesta del endpoint
 */
async function wpRestApiPost(path, form) {
  let response;
  let formData = new FormData(form);
  try {
    response = await fetch(`${endpointurl}/wp-json/ponceadmin/v2/${path}`, {
      method: "POST",
      "Access-Control-Allow-Origin": "*",
      mode: "cors",
      credentials: "include",
      body: formData,
    });
    console.log(await response.json());
    return response;
  } catch (e) {
    alert(e);
  }
}
