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
