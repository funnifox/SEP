let param1="showroomId"


// url param reader
// https://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery

function GetURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function getFurniture(arr){
    console.log(arr);

    let furnitureHTML = '';
    let draggableFurnitureHTML = '';
    for (let i = 0; i < arr.length; i++) {
        furnitureHTML += `
        <div class="furniture-item">
            <b>${arr[i].NAME}</b><br>
            <img src="${arr[i].IMAGEURL}" alt="${arr[i].NAME}"><br>
            <button class="btn-delete btn" style="width:100%;" data-id="${arr[i].ID}"><i class="fas fa-trash"></i> Delete</button>
        </div>
            `

        draggableFurnitureHTML += `
            <div id="mydiv">
            <div id="mydivheader">Click here to move</div>
            <p>Move</p>
            <p>this</p>
            <p>DIV</p>
            </div>
            `

    }


    furnitureHTML += `
        <div class="furniture-item add-furniture" style="background-color: transparent;">
            <button class="popup-btn"><i class="fas fa-plus-circle"></i></button>
        </div>
        
    `
    
    
    document.getElementById('furniture-list').innerHTML = furnitureHTML;
    const showroom = document.getElementById('showroom');

    // this is to prevent the drag element thing from being unable to find the 
    // div when it hasnt loaded yet. temp to serve as a placehodler for while draggabel div aint loaded
    const temp = document.createElement('div');
    temp.innerHTML = draggableFurnitureHTML.trim();
    const newDiv = temp.firstChild;
    showroom.appendChild(newDiv);
    dragElement(newDiv);

} 

/// no you cannot add a kit kat to the showroom.
function add(furnitureName){
    let staff = JSON.parse(sessionStorage.getItem("staff"))
    const data = {
        staffId: parseInt(staff.id),
        furnitureName: furnitureName
    }

    fetch(`/api/addShowroomFurniture/${GetURLParameter(param1)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        location.reload();
        return response.json();
    }).catch(function(error) {
        console.log(error);
    });
}

function del(id){
    let staff = JSON.parse(sessionStorage.getItem("staff"))
    const data = {
        staffId: parseInt(staff.id),
        furnitureId: id
    }

    fetch(`/api/delShowroomFurniture/${GetURLParameter(param1)}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(function (response) {
        location.reload();
        return response.json();
    }).catch(function(error) {
        console.log(error);
    });
}

// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
//Make the DIV element draggagle:
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


function openPopup() {document.getElementById("popup").style.display = "block";}
function closePopup() {document.getElementById("popup").style.display = "none";}
// Close popup if user clicks outside the content box
window.onclick = function(event) {
    const popup = document.getElementById("popup");
    if (event.target === popup) {
        popup.style.display = "none";
    }
};

// get single item by sku (country id is not needed but nice to have)
// fetch(`/api/getFurnitureBySku?sku=${arr[i].SKU}&countryId=${countryId}`, {
//     method: 'GET',
// }).then(function (response) {
//     return response.json();
// }).then(function (product) {
//     console.log(product);
// }).catch(function(error) {
//     console.log(error);
// });


document.addEventListener('DOMContentLoaded', function () {
    
    fetch(`/api/getShowroomById/${GetURLParameter(param1)}`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        getFurniture(data.furniture)
        const img = document.getElementById("showroom-img");

        img.src = `${data.showroom.cover_image_url}`;
        img.alt = data.showroom.cover_image_url;

        
    })
    .catch(err => {
        console.error(err);
        alert('Failed to load showroom');
    });

});







// assign btns
// doing it like this instead of onclick="del()" for scalability
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        del(id);
    }

    if (e.target.classList.contains("btn-add")) {
        event.preventDefault();
        add(document.getElementById("furniture-name").value);
    }

    if (e.target.classList.contains("popup-btn")) {
        openPopup()
    }
});

