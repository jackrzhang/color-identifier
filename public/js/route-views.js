// Event listeners for moving between all views except for input-view->select-color-view
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