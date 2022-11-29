(function () {
    window.addEventListener("load", function () {
        setTimeout(function () {
            var logo = document.getElementsByClassName('link'); //For Changing The Link On The Logo Image
            logo[0].href = "https://myrkclasses.com/";
            logo[0].target = "_blank";
            logo[0].children[0].alt = "Implemeting Swagger";
            logo[0].children[0].src = "https://myrkclasses.com/images/DrPriyanka_Main_Logo_2.png"; //For Changing The Logo Image
            

            /*var bodyBG = document.body.style.backgroundColor = "#fffdf1";*/
            var bodyBG = document.getElementById("swagger-ui").style.backgroundColor = "#eef8ff";
            //var navbar = document.getElementsByClassName("swagger-ui").style.backgroundColor = "#8acaf7";
            //var navbar = document.getElementsByClassName("swagger-ui")[0];
            //navbar.getElementsByClassName("topbar")[0].style.backgroundColor = "#fde384";

            
        });
    });
})();