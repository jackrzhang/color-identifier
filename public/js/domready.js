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
});