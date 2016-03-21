$(document).ready(function() {
    // Instantiate selected color variables & information variables
    var r, g, b;
    var hexInfo, rgbInfo, hsvInfo, cmykInfo, pmsInfo, copicInfo;

    // Event listeners
    loadImageUrl();
    selectColorUI();
});

function selectColorUI() {
    // JQuery UI - make cursor draggable 
    $('#select-color-cursor').draggable({
        containment: 'parent'
    });

    // Change cursor as user drags/drops the color selector cursor
    $('#select-color-cursor').on('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('dragging');
    }).on('mouseup', function () {
        $(this).removeClass('dragging');
    });

    $('#select-color-cursor').on('drag', function(e) {
        // Determine position of the select-color-cursor
        var position = $('#select-color-cursor').position();
        console.log(position.left + ' ' + position.top);

        // Utilize HTML5 to get rgb values from the canvas 
        var canvas = document.querySelector('#select-color-canvas');
        var context = canvas.getContext('2d');
        var color = context.getImageData(position.left, position.top, 1, 1).data;
        r = color[0], g = color[1], b = color[2];
        console.log(r + ',' + g + ',' + b);

        // Update selected-color-display div
        $('#selected-color-display').css('background-color', 
        'rgba(' + r + ',' + g + ',' + b + ')');

        prepareColorInfo();
    });
}

function prepareColorInfo() {
    // Apply the currently selected color to the display
    $('#identified-color-display').css('background-color', 
        'rgba(' + r + ',' + g + ',' + b + ')');

    // Calculate and apply tint for identified-color-tint div
    var rTint = Math.round(r + (255 - r) / 5);
    var gTint = Math.round(g + (255 - g) / 5);
    var bTint = Math.round(b + (255 - b) / 5);
    console.log(rTint + ',' + gTint + ',' + bTint);
    $('#identified-color-tint').css('background-color', 
        'rgba(' + rTint + ',' + gTint + ',' + bTint + ')');

    // Determine identified color information values
    hexInfo = rgbToHex(r, g, b);
    rgbInfo = r + ', ' + g + ', ' + b;
    hsvInfo = rgbToHsv(r, g, b);

    // Update display with values
    $('#hex-color-info').html(hexInfo);
    $('#rgb-color-info').html(rgbInfo);
    $('#hsv-color-info').html(hsvInfo);
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    var hexUnformatted = ((r << 16) | (g << 8) | b).toString(16);

    var hexFormatted = '#' + ('000000' + hexUnformatted).slice(-6);
    return hexFormatted;
}

function rgbToHsv(r, g, b){
    var rRatio = r/255;
    var gRatio = g/255
    var bRatio = b/255;
    var max = Math.max(rRatio, gRatio, bRatio), min = Math.min(rRatio, gRatio, bRatio);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case rRatio: h = (gRatio - bRatio) / d + (gRatio < bRatio ? 6 : 0); break;
            case gRatio: h = (bRatio - rRatio) / d + 2; break;
            case bRatio: h = (rRatio - gRatio) / d + 4; break;
        }
        h /= 6;
    }

    // Round and convert from 0-1 to degrees and percents
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    v = Math.round(v * 100);
    return h + '&deg, ' + s + '%, ' + v + '%';
}

function loadImageUrl() {
    $("#load-image").on('click', function() {
        // Set up canvas
        var canvas = document.querySelector('#select-color-canvas');
        var context = canvas.getContext('2d');

        // Instantiate JS image object, assign input url
        var imageObj = new Image;
        imageObj.crossOrigin = "Anonymous";
        imageObj.src = $("#url-input").val();

        // Load valid image urls, continue to select color view
        imageObj.onload = function() {
            drawImageScaled(imageObj, context);
            console.log("Valid image url. Continue to selector view");
        };

        // Display error message for invalid image urls
        imageObj.onerror = function() {
            if ($("#url-input").val() !== '') {
                $('p.url-input-error').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1}, 'slow');
                console.log("Invalid image url.");
            }
        };
    });
}

// Function triggered by #image-input file input element
function loadImageFile() {
    // FileReader support
    if (FileReader) {
        // Set up canvas
        var canvas = document.querySelector('#select-color-canvas');
        var context = canvas.getContext('2d');

        // Set up file reader
        var file = document.querySelector('#image-input').files[0];
        var reader = new FileReader();

        // Instantiate JS image object
        var imageObj = new Image;

        // Load file src into imageObj, draw imageObj onto canvas
        reader.addEventListener("load", 
            function () {
                imageObj.src = reader.result;
                drawImageScaled(imageObj, context);
                console.log("Successful image file read. Continue to selector view");
            },
        false);

        if (file) {
            reader.readAsDataURL(file);
        }
    } else {
        console.log('Javascript File API not supported.');
    }
}

// Fits and centers input image to canvas
function drawImageScaled(imageObj, context) {
    // Get canvas
    var canvas = context.canvas;

    // Adjust canvas height (fixed canvas width), based on the image
    var imageRatio = imageObj.height / imageObj.width;
    canvas.height = canvas.width * imageRatio;

    // Draw and scale image to canvas dimensions
    var imageToCanvasRatio = canvas.width / imageObj.width;
    context.clearRect(0,0,canvas.width, canvas.height);
    context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, 
        0, 0, imageObj.width * imageToCanvasRatio, imageObj.height * imageToCanvasRatio);

    // Match canvas wrapper dimensions for color-selector-cursor interface
    $("#canvas-wrapper").css('height', canvas.height);
}