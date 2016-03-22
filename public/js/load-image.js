function loadImageUrl() {

    function loadImageUrlActions() {
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
    }

    // image url loaded through clicking the 'OK' button
    $("#load-image").on('click', function() {
        loadImageUrlActions();
    });

    // image url loaded through pressing the 'enter' key
    $("#url-input").keypress(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            loadImageUrlActions();
        }
    });
}

// Function triggered by #image-input file input element
function loadImageFile(e) {
    // Set up canvas
    var canvas = document.querySelector('#select-color-canvas');
    var context = canvas.getContext('2d');

    // Instantiate JS image object
    var imageObj = new Image;
    imageObj.src = URL.createObjectURL(e.target.files[0]);

    // Load image src into imageObj, draw imageObj onto canvas
    imageObj.onload = function() {
        drawImageScaled(imageObj, context);
        updateSelectedColor();
        changeView('input-view', 'select-color-view');
    };
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