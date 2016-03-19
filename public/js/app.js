
$(document).ready(function() {
    // Event handlers
    loadImageUrl();
});

function loadImageUrl() {
    $("#load-image").on('click', function() {
        // Set up canvas
        var canvas = document.querySelector('#select-color-canvas');
        var context = canvas.getContext('2d');

        // Instantiate JS image object, assign input url
        var imageObj = new Image;
        imageObj.src = $("#url-input").val();

        // Load valid image urls, continue to select color view
        imageObj.onload = function(){
            context.drawImage(imageObj,0,0);
            console.log("Valid image url. Continue to selector view");
        };

        // Display error message for invalid image urls
        imageObj.onerror = function(){
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
                context.drawImage(imageObj,0,0);
            },
        false);

        if (file) {
            reader.readAsDataURL(file);
        }
    } else {
        console.log('Javascript File API not supported.');
    }
}