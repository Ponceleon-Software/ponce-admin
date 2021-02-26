
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




//Para renderizar sin iframe, usar esto en lugar de htmlButton en el momento de crear un elemento de HTML

/*htmlbuttonString=`${`<div class="fixed right-0 -mr-2 m-auto top-0 bottom-0 h-12 w-12">
  <span
    class="z-40 absolute ponce-admin__ping-decoration bg-black h-full w-full rounded-full bg-opacity-20"
  ></span>
  <span
    class="z-40 absolute ponce-admin__ping-decoration ponce-admin__ping-decoration--2 bg-black h-full w-full rounded-full bg-opacity-20"
  ></span>
  <span
    class="z-40 absolute ponce-admin__ping-decoration ponce-admin__ping-decoration--3 bg-black h-full w-full rounded-full bg-opacity-20"
  ></span>
  <button
    class="z-50 absolute rounded-full h-full w-full flex items-center justify-center bg-black text-white font-semibold focus:outline-none"
  >
    <img src="/wordpress/wp-content/plugins/Ponce-admin/assets/img/logo-ponceleon.svg" alt="logo" />
  </button>
</div>
`}`;*/