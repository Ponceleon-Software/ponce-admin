window.addEventListener("load", function () {
  let frame;
  htmlbutton = `${`<iframe name="iframe" id="iframe" src="/wordpress/wp-content/plugins/Ponce-admin/Html/preview.html"></iframe>`}`;

  function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  frame = createElementFromHTML(htmlbutton);
  element = document.querySelector("#wpbody-content");
  element.appendChild(frame);
});
