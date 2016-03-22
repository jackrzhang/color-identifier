$(document).ready(function() {
    // Instantiate selected color variables & information variables
    var r, g, b;
    var rgbInfo, hexInfo, hsvInfo, hslInfo, hwbInfo, cmykInfo, xyzInfo;

    // Event listeners
    loadImageUrl();
    selectColorUI();
    routeViews();
});

// Event handlers for moving between all views except for input-view->select-color-view
function routeViews() {
    // Start application with loading view to input view
    $('#loading-view').fadeIn(400, function() {
        changeView('loading-view', 'input-view');
    });

    $("#forward-to-identify-color").on('click', function() {
        prepareColorInfo();
        changeView('select-color-view', 'identify-color-view');
    });

    $("#back-to-select-color").on('click', function() {
        changeView('identify-color-view', 'select-color-view');
    });

    $("#back-to-input").on('click', function() {
        changeView('select-color-view', 'input-view');
    });
}

function changeView(currentView, upcomingView) {
    $('#' + currentView).fadeOut(500, function() {
        $('#' + upcomingView).fadeIn(500);
    });
}

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
        updateSelectedColor();
    });
}

function updateSelectedColor() {
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
}

function prepareColorInfo() {
    // Apply the currently selected color to the display
    $('#identified-color-display').css('background-color', 
        'rgba(' + r + ',' + g + ',' + b + ')');

    // Calculate and apply tint for identified-color-tint div
    var rTint = Math.round(r + (255 - r) / 6);
    var gTint = Math.round(g + (255 - g) / 6);
    var bTint = Math.round(b + (255 - b) / 6);
    console.log(rTint + ',' + gTint + ',' + bTint);
    $('#identified-color-tint').css('background-color', 
        'rgba(' + rTint + ',' + gTint + ',' + bTint + ')');

    // Determine identified color information values
    rgbInfo = r + ', ' + g + ', ' + b;
    hexInfo = rgbToHex(r, g, b);
    hsvInfo = rgbToHsv(r, g, b);
    hslInfo = rgbToHsl(r, g, b);
    hwbInfo = rgbToHwb(r, g, b);
    cmykInfo = rgbToCmyk(r, g, b);
    xyzInfo = rgbToXyz(r, g, b);

    // Update display with values
    $('#rgb-color-info').html(rgbInfo);
    $('#hex-color-info').html(hexInfo);
    $('#hsv-color-info').html(hsvInfo);
    $('#hsl-color-info').html(hslInfo);
    $('#hwb-color-info').html(hwbInfo);
    $('#cmyk-color-info').html(cmykInfo);
    $('#xyz-color-info').html(xyzInfo);
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

function rgbToHsl(r, g, b){
    var rRatio = r/255;
    var gRatio = g/255
    var bRatio = b/255;
    var max = Math.max(rRatio, gRatio, bRatio), min = Math.min(rRatio, gRatio, bRatio);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case rRatio: h = (gRatio - bRatio) / d + (gRatio < bRatio ? 6 : 0); break;
            case gRatio: h = (bRatio - rRatio) / d + 2; break;
            case bRatio: h = (rRatio - gRatio) / d + 4; break;
        }
        h /= 6;
    }

    // Round and convert from 0-1 to degrees and percentages
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return h + '&deg, ' + s + '%, ' + l + '%';
}

function rgbToHwb(r, g, b) {
    var rRatio = r/255;
    var gRatio = g/255
    var bRatio = b/255;
    var min = Math.min(rRatio, gRatio, bRatio), max = Math.max(rRatio, gRatio, bRatio);
    
    // Establish blackness
    var bk = 1 - max;

    if(max == min){
        h = w = 0; // achromatic
    } else {
        var f = rRatio === min ? gRatio - bRatio : (gRatio === min ? bRatio - rRatio : rRatio - gRatio);
        var i = rRatio === min ? 3 : (gRatio === min ? 5 : 1);
        var h = (i - f / (max - min)) / 6
        var w = min;
    }

    // Round and convert from 0-1 to degrees and percentages
    h = Math.round(h * 360);
    w = Math.round(w * 100);
    bk = Math.round(bk * 100);
    return h + '&deg, ' + w + '%, ' + bk + '%';
}

function rgbToCmyk(r, g, b) {
    var rRatio = r/255;
    var gRatio = g/255
    var bRatio = b/255;
    var max = Math.max(rRatio, gRatio, bRatio), min = Math.min(rRatio, gRatio, bRatio);
    var c, m, y, k;

    // Establish k (achromatic) value
    k = 1 - max;

    if(max == min) {
        c = m = y = 0; // achromatic
    } else {
        c = (1 - rRatio - k) / (1 - k);
        m = (1 - gRatio - k) / (1 - k);
        y = (1 - bRatio - k) / (1 - k);
    }

    // Round and convert to percentages
    c = Math.round(c * 100);
    m = Math.round(m * 100);
    y = Math.round(y * 100);
    k = Math.round(k * 100);
    return c + '%, ' + m + '%, ' + y + ',% ' + k + '%';

}

function rgbToXyz(r, g, b)
{
    var rRatio = r/255;
    var gRatio = g/255
    var bRatio = b/255;

    if ( rRatio > 0.04045 ) 
        rRatio = Math.pow(((rRatio + 0.055) / 1.055), 2.4);
    else                   
        rRatio = rRatio / 12.92;

    if ( gRatio > 0.04045 ) 
        gRatio = Math.pow(((gRatio + 0.055) / 1.055), 2.4);
    else                   
        gRatio = gRatio / 12.92;

    if ( bRatio > 0.04045 ) 
        bRatio = Math.pow(((bRatio + 0.055) / 1.055 ), 2.4);
    else                   
        bRatio = bRatio / 12.92;

    // Observer. = 2°, Illuminant = D65
    var x = rRatio * 0.4124 + gRatio * 0.3576 + bRatio * 0.1805;
    var y = rRatio * 0.2126 + gRatio * 0.7152 + bRatio * 0.0722;
    var z = rRatio * 0.0193 + gRatio * 0.1192 + bRatio * 0.9505;

    // Round and convert to percentages
    x = Math.round(x * 100);
    y = Math.round(y * 100);
    z = Math.round(z * 100);
    return x + '%, ' + y + '%, ' + z + '%';
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

            // Update display to select-color-view
            updateSelectedColor();
            changeView('input-view', 'select-color-view');
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
                
                // Update display to select-color-view
                updateSelectedColor();
                changeView('input-view', 'select-color-view');
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