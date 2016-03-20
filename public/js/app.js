
$(document).ready(function() {
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
}

function loadImageUrl() {
    $("#load-image").on('click', function() {
        // Set up canvas
        var canvas = document.querySelector('#select-color-canvas');
        var context = canvas.getContext('2d');

        // Instantiate JS image object, assign input url
        var imageObj = new Image;
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