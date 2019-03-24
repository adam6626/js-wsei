let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d');

let imageLoader = document.querySelector("#imageLoader");
    imageLoader.addEventListener('change', createImage, false);

function createImage(e) {
    let fileReader = new FileReader();

    fileReader.onload = function(event) {
        let image = new Image();
        image.onload = function() {
            ctx.drawImage(image, 0 , 0, canvas.width, canvas.height);
        }
        image.src = event.target.result;
    }
    fileReader.readAsDataURL(e.target.files[0]);

}

let brightnessFilter = document.querySelector("#brightness");

    brightnessFilter.addEventListener('change', function (event){
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        doBrightness(imageData.data, parseInt(brightnessFilter.value, 10)
        );

        ctx.putImageData(imageData, 0, 0);
    });

function doBrightness (data, brightness) {
    for(let i = 0; i < data.length; i+=4) {
        data[i] += 255 * (brightness / 100);
        data[i+1] += 255 * (brightness / 100);
        data[i+2] += 255 * (brightness / 100);
    }
}

let contrastFilter = document.querySelector("#contrast");

    contrastFilter.addEventListener('change', function (event)
    {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        doContrast(imageData.data, parseInt(contrastFilter.value, 10)
        );
        ctx.putImageData(imageData, 0, 0);
    });

function settingColor(value) {
    if (value <0 ) {
        value = 0;
    }
    else if (value > 255) {
        value = 255;
    }
    return value;
}

function doContrast(data, contrast) {
    let factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));

    for(let i = 0; i < data.length; i+=4) {
        data[i] = settingColor(factor * (data[i] - 128.0) + 128.0);
        data[i+1] = settingColor(factor * (data[i+1] - 128.0) + 128.0);
        data[i+2] = settingColor(factor * (data[i+2] - 128.0) + 128.0);
    }
}

let redFilter = document.querySelector("#red");

    redFilter.addEventListener('change', function (event) {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        doRed(imageData.data, parseInt(redFilter.value, 10)
        );
        ctx.putImageData(imageData, 0, 0);
    });

function doRed(data, red) {
    for(let i = 0; i < data.length; i+=4) {
        data[i] += red * 0.4;
    }
}

let greenFilter = document.querySelector("#green");

    greenFilter.addEventListener('change', function (event) {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        doGreen(imageData.data, parseInt(greenFilter.value, 10)
        );
        ctx.putImageData(imageData, 0, 0);
    });

function doGreen(data, green) {
    for(let i = 0; i < data.length; i+=4) {
        data[i+1] += green * 0.4;
    }
}

let blueFilter = document.querySelector("#blue");

    blueFilter.addEventListener('change', function (event) {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        doBlue(imageData.data, parseInt(blueFilter.value, 10)
        );
        ctx.putImageData(imageData, 0, 0);
    });

function doBlue(data, blue) {
    for(let i = 0; i < data.length; i+=4) {
        data[i+2] += blue * 0.4;
    }
}
