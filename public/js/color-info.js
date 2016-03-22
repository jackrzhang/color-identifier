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