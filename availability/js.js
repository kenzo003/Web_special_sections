var text_min = false;
var text_max = false;
var prev_cell = null;
var color;
var back_color;

var vsn = document.getElementById('vision');
vsn.addEventListener("click", function (e) {
    var accessibility = document.getElementById("accessibility-panel");

    if (accessibility.hidden) {
        accessibility.hidden = false;
        e.target.className = "bi bi-eye-slash-fill fs-3";
        document.getElementById('whiteOnBlack').click();
        document.getElementById('imgBlackOfWhite').click();
    } else {
        accessibility.hidden = true;
        e.target.className = "bi bi-eye-fill fs-3";

        if (prev_cell)
        prev_cell.style.border = "";
        defaultColorSite();
        defaultFontSize();
        defaultEvents();
        document.getElementById('imgOn').click();
    }
});

//Уменьшение шрифта
document.getElementById('fs-').addEventListener("click", (e) => {
    var texts = document.getElementsByClassName("acc-txt");

    for (var text of texts) {
        var fs = getComputedStyle(text).getPropertyValue('font-size');
        var size = Number(fs.substr(0, fs.length - 2)) - 1;
        text.style.setProperty('font-size', size + "px", 'important');
    }
});

//Увеличение шрифта
document.getElementById('fs+').addEventListener("click", (e) => {
    var texts = document.getElementsByClassName("acc-txt");

    for (var text of texts) {
        var fs = getComputedStyle(text).getPropertyValue('font-size');
        var size = Number(fs.substr(0, fs.length - 2)) + 1;
        text.style.setProperty('font-size', size + "px", 'important');
    }
});

//Изменение цветовой гаммы
document.getElementById('blackOnWhite').addEventListener("click", (e) => {
    back_color = "white";
    color = "black";
    colorSite();
    events();
})
document.getElementById('whiteOnBlack').addEventListener("click", (e) => {
    back_color = "black";
    color = "white";
    colorSite();
    events();
})
document.getElementById('darkBlueOnBlue').addEventListener("click", (e) => {
    back_color = "#9DD1FF";
    color = "#063462";
    colorSite();
    events();
})
document.getElementById('brownOnBeige').addEventListener("click", (e) => {
    back_color = "#F7F3D6";
    color = "#4D4B43";
    colorSite();
    events();
})
document.getElementById('greenOnDarkBrown').addEventListener("click", (e) => {
    back_color = "#3B2716";
    color = "#A9E44D";
    colorSite();
    events();
})

//Работа с изображением
document.getElementById('imgOn').addEventListener("click", (e) => {
    var img = document.getElementsByTagName('img');
    for (var imgElement of img) {
        imgElement.style.filter = "none";
        imgElement.style.visibility = "visible";
    }
});
document.getElementById('imgOff').addEventListener("click", (e) => {
    var img = document.getElementsByTagName('img');
    for (var imgElement of img) {
        imgElement.style.visibility = "hidden";
    }
});
document.getElementById('imgBlackOfWhite').addEventListener("click", (e) => {
    var img = document.getElementsByTagName('img');
    for (var imgElement of img) {
        imgElement.style.visibility = "visible";
        imgElement.style.filter = "grayscale(100%)";
    }
});


//№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№
function colorSite() {
    var block = document.getElementsByClassName('acc-block');
    for (var blockElement of block) {
        blockElement.style.setProperty('background-color', back_color, 'important');
        blockElement.style.setProperty('color', color, 'important');
        blockElement.style.setProperty('border', "2px solid " + color, 'important');
    }

    var texts = document.getElementsByClassName('acc-txt');
    for (var text of texts) {
        text.setAttribute("title", text.textContent);
        text.style.color = color;
    }
}

function defaultColorSite() {
    var block = document.getElementsByClassName('acc-block');
    for (var blockElement of block) {
        blockElement.style.color = "";
        blockElement.style.backgroundColor = "";
        blockElement.style.border = "";
    }

    var texts = document.getElementsByClassName('acc-txt');
    for (var text of texts) {
        text.style.color = "";
        text.style.backgroundColor = "";
    }
}

function defaultFontSize() {
    var texts = document.getElementsByClassName("acc-txt");
    for (var text of texts) {
        text.style.fontSize = "";
    }
}

function clickItem() {
    var item = this;
    if (prev_cell)
        prev_cell.style.border = "";
    prev_cell = item;
    item.style.border = "3px solid red";
    document.getElementById('div-for-aria-reader').textContent = item;

}

function mouseoutItem() {
    var item = this;
    item.style.backgroundColor = "";
    item.style.color = color;
}

function mouseoverItem() {
    var item = this;
    item.style.backgroundColor = color;
    item.style.color = back_color;
}


function events() {
    var texts = document.getElementsByClassName('acc-txt');
    if (prev_cell)
        prev_cell.style.border = "";
    for (var item of texts) {
        //Наведение курсора мыши на элемент
        item.addEventListener("mouseover", mouseoverItem);
        item.addEventListener("mouseout", mouseoutItem);
        item.addEventListener("click", clickItem);
    }
}

function defaultEvents() {
    var texts = document.getElementsByClassName('acc-txt');
    for (var text of texts) {
        text.removeEventListener("mouseover", mouseoverItem);
        text.removeEventListener("mouseout", mouseoutItem);
        text.removeEventListener("click", clickItem);
    }

}