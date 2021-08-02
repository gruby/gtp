function dosmth() { 
  alert('hello'); 
}

//document.addEventListener('turbolinks:load', () => {  
document.addEventListener('DOMContentLoaded', () => {  
  const clickButton = document.getElementById("button-click");  

  clickButton.addEventListener("click", dosmth); 
});