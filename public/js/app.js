
$(document).ready(function() {
    loadImage();
    imageError();
});

function loadImage() {
    $("#load-image").on('click', function(){
        $("#selected-image").attr("src", $("#url-input").val());
        console.log($("#url-input").val());
    });

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