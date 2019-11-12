function menuToggle(button) {
  let menu = document.getElementById("aside");
  menu.classList.toggle("open");
  button.innerHTML === "Menu &gt;" ? button.innerHTML = "&lt; Close" : button.innerHTML = "Menu &gt;";
}