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
        iframe.style.top = "4%";
        iframe.style.height = "100%";
      } else {
        setTimeout(function () {
          console.log("a");
          iframe.style.height = "20vh";
          iframe.style.width = "6vw";
          iframe.style.top = "50%";
        }, 350);
      }
    });
  });
});
