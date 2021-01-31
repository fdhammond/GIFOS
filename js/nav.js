
var theme = localStorage.getItem("theme");
const header = document.querySelector(".header");
const menu = document.querySelector(".header__menu");
const headerLogo = document.querySelector("#headerLogo");
const icon = document.getElementById("icon");
const device = window.matchMedia("screen and (max-width: 900px)");
const createGifoLink = document.querySelector('.createGifoLink');
const mode = document.getElementById("change-mode");
const css = document.getElementById("mode-style");
window.document.addEventListener("scroll", eventScroll);
device.addEventListener("change", validation);
mode.addEventListener("click", changeMode);
let falsy = false;



let createGif = () => {
  createGifoLink.setAttribute("href", "crear-gifo.html");
}

function eventScroll(event) {
  let position = window.scrollY

  if(position > 0){
    header.classList.add("scroll-header")
  }else{
    header.classList.remove("scroll-header")
  }
}
if (theme === undefined || theme === null) {  
  css.href = "css/style.css";  
  localStorage.setItem("theme", "light");  
  mode.innerHTML = "MODO NOCTURNO";

} else if (theme == "dark") {  
  css.href = "css/night-mode.css";  
  headerLogo.src = "assets/Logo-modo-noc.svg";
  mode.innerHTML = "MODO DIURNO";  
} else if(theme == "light"){  
  css.href = "css/style.css";
  mode.innerHTML = "MODO NOCTURNO";
}

function validation(event) {
  if (event.matches) {
    icon.classList.add("fa-bars");
    icon.classList.remove("fa-plus");
    icon.removeEventListener("click", createGif);
    icon.addEventListener("click", showMenu);
  } else {
    icon.classList.add("fa-plus");
    icon.classList.remove("fa-bars");
    icon.classList.remove("fa-times");
    icon.addEventListener("click", createGif);    
    icon.removeEventListener("click", showMenu);
  }
}
//TOGGLE MENU
function showMenu(event) {
  icon.classList.toggle("fa-times");
  menu.classList.toggle("show-menu");
}

//TOGGLE CHANGE MODE

function changeMode (event) {
  if (localStorage.getItem("theme") == "dark") {
    localStorage.setItem("theme", "light");
    css.href = "css/style.css";
    mode.innerHTML = "MODO NOCTURNO";
    headerLogo.src = "assets/logo-desktop.svg"; 
  } else if (localStorage.getItem("theme") == "light") {
    localStorage.setItem("theme", "dark");
    css.href = "css/night-mode.css";
    mode.innerHTML = "MODO DIURNO";
    headerLogo.src = "assets/Logo-modo-noc.svg";  
  }
}

validation(device);
