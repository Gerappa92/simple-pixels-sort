let pixelsCanvas;
let pixelsContext;

window.addEventListener("load", () => loadPixelsCanvas());

window.addEventListener("load", () => setListeners());

function setListeners(){
    const inputX = document.getElementById("x");
    const inputY = document.getElementById("y");
    inputX.addEventListener("input", event => inputArrayValueChanged(event));
    inputY.addEventListener("input", event => inputArrayValueChanged(event));
}

function inputArrayValueChanged(event){
    const newValue = event.target.value;
    if(newValue > 1000){
        document.getElementById(event.target.id).value=1000;
    }
    loadPixelsCanvas();
}

function getXY(){
    const x = document.getElementById("x").value;
    const y = document.getElementById("y").value;
    return ({x, y});
}

const loadPixelsCanvas = () =>{
    let arraySize = getXY();
    
    pixelsCanvas = document.getElementById("pixels-canvas");
    pixelsCanvas.width = arraySize.x;
    pixelsCanvas.height = arraySize.y;

    pixelsContext = pixelsCanvas.getContext("2d");

    const Random255 = () =>  Math.round((Math.random() * 255));


    for (let i = 0; i < arraySize.x; i++) {
        for (let j = 0; j < arraySize.y; j++) {
            
            const R = Random255();
            const G = Random255();
            const B = Random255();
            
            pixelsContext.fillStyle = `rgb(${R},${G},${B})`;
            pixelsContext.fillRect(i,j,1,1);
        }   
    }    
}

const sort = () =>{
    const sortSelect = document.getElementById("sort-select");
    const sortType = sortSelect.value;

    const colorSelect = document.getElementById("color-select");
    const color = colorSelect.value;

    const arraySize = getXY()

    const imageData = pixelsContext.getImageData(0, 0, arraySize.x, arraySize.y);
    switch (sortType) {
        case "bubble":
            bubbleRecursiveSort(imageData, color);
            break;
        case "selection":
            selectionSort(imageData, color);
            break;
        case "input-red":
            inputRed(imageData);
        default:
            break;
    }
}

async function inputRed(imageData){
    const pixelsArray = imageData.data;
    for (let i = 0; i < imageData.data.length; i += 4) {
        
        imageData.data[i] = 255;
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;

        pixelsContext.putImageData(imageData, 0, 0);
        if(i % 100 == 0)
            await sleep(1);
    }
}

async function bubbleRecursiveSort(imageData, color){
    const pixelsArray = imageData.data;
    let recursive = false;
    for (let i = 4; i < pixelsArray.length; i += 4) {
        
        let color0 = setColorCase(color, pixelsArray, i - 4);
        let color1 = setColorCase(color, pixelsArray, i);

        if(color0 > color1)
        {
            replacePixles(pixelsArray, i, i - 4);
            recursive = true;
        }            
    }

    if(recursive){
        pixelsContext.putImageData(imageData, 0, 0);
        await sleep(1);
        bubbleRecursiveSort(imageData, color);
    }
}

async function selectionSort(imageData, color){
    const pixelsArray = imageData.data;


    for (let i = 0; i < pixelsArray.length; i += 4) {
        let color0 = setColorCase(color, pixelsArray, i);
        let minIndex = i;

        for (let j = i+4 ; j < pixelsArray.length; j+=4) {
            
            let color1 = setColorCase(color, pixelsArray, j);
            if(color1 <= color0){
                color0 = color1;
                minIndex = j
            }
        }

        replacePixles(pixelsArray, i, minIndex);

        if(i % 100 == 0){
            await sleep(1);
            pixelsContext.putImageData(imageData, 0, 0);
        }
    }
}

function replacePixles(pixelsArray, i, j){
    const r = pixelsArray[i];
        const g = pixelsArray[i + 1];
        const b = pixelsArray[i + 2];

        pixelsArray[i] = pixelsArray[j];
        pixelsArray[i + 1] = pixelsArray[j + 1];
        pixelsArray[i + 2] = pixelsArray[j + 2];

        pixelsArray[j] = r;
        pixelsArray[j + 1] = g;
        pixelsArray[j + 2] = b;
}

function setColorCase(color, pixelsArray, i){
    let color0 = 0;
    switch(color){
        case "r":
            color0 = pixelsArray[i];
            break;
        case "g":
            color0 = pixelsArray[i + 1];
            break;
        case "b":
            color0 = pixelsArray[i + 2];
            break;
        case "avg":
            color0 = (pixelsArray[i] + pixelsArray[i + 1] + pixelsArray[i + 2]) / 3;
            break;
        default: 
            return color0;
    }
    return color0;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
