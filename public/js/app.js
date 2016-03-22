$(document).ready(function() {
    // Instantiate selected color variables & information variables
    var r, g, b;
    var rgbInfo, hexInfo, hsvInfo, hslInfo, hwbInfo, cmykInfo, xyzInfo;

    // Event listeners
    var fileInput = document.getElementById('image-input');
    fileInput.addEventListener('change', loadImageFile);
    loadImageUrl();
    selectColorUI();
    routeViews();

    resizeCanvasForMobile();
});

// Adjust canvas width for extra small screen widths less than 445px
function resizeCanvasForMobile() {
    if ( $(window).width() < 445 ) {
        var canvas = document.querySelector('#select-color-canvas');
        canvas.width = $(window).width() * 95/100;
    }
}