
$(document).ready(function() {
    // Event handlers
    loadImageUrl();
    continueToSelectColor();
});

function loadImageUrl() {
    $("#load-image").on('click', function(){
        $("#selected-image").attr("src", $("#url-input").val());
        console.log($("#url-input").val());
    });
}

function loadImageFile() {
    // FileReader support
    if (FileReader) {
        var display = document.querySelector('#selected-image');
        var file = document.querySelector('#image-input').files[0];
        var reader = new FileReader();

        reader.addEventListener("load", 
            function () {
                display.src = reader.result;
            },
        false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

function continueToSelectColor() {
    $('#selected-image').on({
        load: function(){
            console.log("Continue to the select color view.");
        },
        error: function(){
            console.log("Invalid image url.");
            $('p.url-input-error').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1}, 'slow');
        }
    })
}