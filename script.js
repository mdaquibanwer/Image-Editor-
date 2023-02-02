const fileInput = document.querySelector(".file-input");
const chooseImgBtn = document.querySelector(".choose-img");
const filterOptions = document.querySelectorAll(".filter .btn");
const rotateFlipOption = document.querySelectorAll(".rotate .icons");
const filterName = document.querySelector(".slider .name");
const filterValue = document.querySelector(".slider .value");
const filterSliderInput = document.querySelector(".slider input");
const previewImg = document.querySelector(".preview-img img");
const resetFilterBtn = document.querySelector(".reset-filter")
const saveImgBtn = document.querySelector(".save-img")

let brightness = 100, saturation= 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = ()=>{
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipVertical}, ${flipHorizontal})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImg = ()=>{
    let file = fileInput.files[0];  // getting user selected files
    if(!file){  // return if user hasn't selected file
        return
    }
    // console.log(file)
    previewImg.src = URL.createObjectURL(file)  // passing file url as preview img src
    previewImg.addEventListener("load",()=>{
        resetFilterBtn.click(); // clicking reset btn so that filter value get reset for new image
        document.querySelector(".container").classList.remove("disable");
    })
}

filterOptions.forEach(option=>{
    option.addEventListener("click",()=>{ // adding event listener to all filter option button
        document.querySelector(".filter .active").classList.remove("active");   // removing active class from other filter option
        option.classList.add("active"); // adding active class to the click filter option
        filterName.innerText = option.innerText; // changinging the name of the filter info
        
        // setting the value of all the filter options
        if(option.id === "brightness"){
            filterSliderInput.max = "200";
            filterSliderInput.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if(option.id === "saturation"){
            filterSliderInput.max = "200";
            filterSliderInput.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if(option.id === "inversion"){
            filterSliderInput.max = "100";
            filterSliderInput.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else{
            filterSliderInput.max = "100";
            filterSliderInput.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    })
})

const updateFilter = ()=>{
    filterValue.innerText = `${filterSliderInput.value}%`;
    const selectedFilter = document.querySelector(".filter .active");   // getting selected filter option button;
    // changing/updating the filter value on the selected option
    if(selectedFilter.id === "brightness"){
        brightness = filterSliderInput.value;
    }else if(selectedFilter.id === "saturation"){
        saturation = filterSliderInput.value;
    }else if(selectedFilter.id === "inversion"){
        inversion = filterSliderInput.value;
    }else {
        grayscale = filterSliderInput.value;
    }
    applyFilters();
}

rotateFlipOption.forEach(option => {
    option.addEventListener("click",()=>{   // adding click event to all rotate/flip buttons
        if(option.id === "left"){
            rotate -= 90;
        }else if(option.id === "right"){
            rotate += 90;
        }
        else if(option.id === "horizontal"){
            flipHorizontal = flipHorizontal === 1 ? -1 : 1 // if value of fliphorizontal is 1 then change it to -1 else make it 1;
        }else{
            flipVertical = flipVertical === 1 ? -1 : 1 // if value of flipvertical is 1 then change it to -1 else make it 1;
        }
        applyFilters();
    })
})

const resetFilters = ()=>{
    // resetting all filters applied on the image
    brightness = 100; saturation= 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click(); // clicking brightness btn, so the brightness selected by default;
    applyFilters();
}

const saveImage = ()=>{
    saveImgBtn.innerText = "saving image...";
    setTimeout(() => {
        
        const canvas = document.createElement("canvas") // creating a canvas element
        const drawContext = canvas.getContext("2d")     // canvas.getContext return a drawing context on the canvas
        canvas.width = previewImg.naturalWidth;
        canvas.height = previewImg.naturalHeight;
        // applying user selected filter to canva filter
        drawContext.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
        drawContext.translate(canvas.width / 2, canvas.height / 2)    // translating canvas from center
        if(rotate !==0){    // if rotation happened
            drawContext.rotate(rotate * Math.PI / 180);
        }
        drawContext.scale(flipVertical,flipHorizontal)  // flip canvas hoizontally / vertically
        drawContext.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        // document.body.appendChild(canvas);
        const link = document.createElement("a")    // creating an <a> link element
        link.download = "image.jpg";
        link.href = canvas.toDataURL()  // it will return a data url containing a representaion of image;
        link.click();   // clicking <a> tag so that image download

        saveImgBtn.innerText = "save image";
    }, 500);
}

fileInput.addEventListener("change",loadImg);   // adding a event listener when we choose a image
filterSliderInput.addEventListener("input",updateFilter);   //adding an event listener to update the value of the filter option;
resetFilterBtn.addEventListener("click",resetFilters);
saveImgBtn.addEventListener("click",saveImage);
chooseImgBtn.addEventListener("click",()=>{ // adding a event listener to choose image
    fileInput.click();
})