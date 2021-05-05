const menu = document.getElementById("menu");
menu.style.opacity = "1";
menu.style.border = "red";
menu.onmousedown = () => setTimeout(menu.hide.bind(menu));

menu.show = function () {
  this.style.opacity = 1;
  //this.style.bottom = 30;
  this.style.bottom = 1;
  console.log("show menu");

  document.querySelector("#menuopen .container").style.transform =
    "rotateZ(180deg)";
};

menu.hide = function () {
  this.style.opacity = 0;
  this.style.bottom = -this.clientHeight - 100;

  document.querySelector("#menuopen .container").style.transform =
    "rotateZ(0deg)";
};
