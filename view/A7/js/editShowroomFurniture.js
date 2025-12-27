let param1="showroomId"
let currentImage = null;


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

// function getFurniture(arr){
//     console.log(arr);

//     let furnitureHTML = '';
//     // let draggableFurnitureHTML = '';
//     for (let i = 0; i < arr.length; i++) {
//         furnitureHTML += `
//         <div class="furniture-item">
//             <b>${arr[i].NAME}</b><br>
//             <img src="${arr[i].IMAGEURL}" alt="${arr[i].NAME}"><br>
//             <button class="btn-delete btn" style="width:100%;" data-id="${arr[i].ID}"><i class="fas fa-trash"></i> Delete</button>
//         </div>
//             `

//         // draggableFurnitureHTML += `
//         // <div id="drag-${i}" class="draggable">
//         //     <div id="drag-${i}-header" class="drag-header">
//         //         <img src="${arr[i].IMAGEURL}" alt="${arr[i].NAME}"><br>
//         //     </div>
//         // </div>
//         // `;

//     }


//     furnitureHTML += `
//         <div class="furniture-item add-furniture" style="background-color: transparent;">
//             <button class="popup-btn"><i class="fas fa-plus-circle"></i></button>
//         </div>
        
//     `
    
    
//     document.getElementById('furniture-list').innerHTML = furnitureHTML;
//     // const showroom = document.getElementById('showroom');
//     // showroom.innerHTML += draggableFurnitureHTML;

//     // // Wait for DOM to render
//     // requestAnimationFrame(() => {
//     //     const draggables = document.querySelectorAll('#showroom .draggable');
//     //     draggables.forEach(div => dragElement(div));
//     // });




// } 

/// no you cannot add a kit kat to the showroom.
// function add(furnitureName){
//     let staff = JSON.parse(sessionStorage.getItem("staff"))
//     const data = {
//         staffId: parseInt(staff.id),
//         furnitureName: furnitureName
//     }

//     fetch(`/api/addShowroomFurniture/${GetURLParameter(param1)}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     }).then(function (response) {
//         location.reload();
//         return response.json();
//     }).catch(function(error) {
//         console.log(error);
//     });
// }

// function del(id){
//     let staff = JSON.parse(sessionStorage.getItem("staff"))
//     const data = {
//         staffId: parseInt(staff.id),
//         furnitureId: id
//     }

//     fetch(`/api/delShowroomFurniture/${GetURLParameter(param1)}`, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     }).then(function (response) {
//         location.reload();
//         return response.json();
//     }).catch(function(error) {
//         console.log(error);
//     });
// }

// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_draggable
//Make the DIV element draggagle:
// function dragElement(elmnt) {
//     let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

//     // Select the header inside this div
//     const header = elmnt.querySelector(".draggableDivheader"); 
//     if (header) {
//         header.onmousedown = dragMouseDown;
//     } else {
//         elmnt.onmousedown = dragMouseDown;
//     }

//     function dragMouseDown(e) {
//         e.preventDefault();
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         document.onmouseup = closeDragElement;
//         document.onmousemove = elementDrag;
//     }

//     function elementDrag(e) {
//         e.preventDefault();
//         pos1 = pos3 - e.clientX;
//         pos2 = pos4 - e.clientY;
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//     }

//     function closeDragElement() {
//         document.onmouseup = null;
//         document.onmousemove = null;
//     }
// }



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









const canvas = document.getElementById("showroom-canvas");
const ctx = canvas.getContext("2d");

function setShowroomImage(src) {
  const img = new Image();
  img.src = src;

  img.onload = () => {
    // Match canvas resolution to image
    currentImage = img;              
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}








document.addEventListener('DOMContentLoaded', function () {

    fetch(`/api/getShowroomById/${GetURLParameter(param1)}`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        // getFurniture(data.furniture)
        const img = document.getElementById("showroom-img");

        // img.src = `${data.showroom.cover_image_url}`;
        // img.alt = data.showroom.cover_image_url;
        setShowroomImage(`${data.showroom.cover_image_url}`);
        
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
// disabl right click for canva point removal
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});









// canvas
const points = [];

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);

  points.push({ x, y });
  redraw();
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentImage instanceof HTMLImageElement) {
    ctx.drawImage(currentImage, 0, 0);
    }

    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);

        ctx.fillStyle = "#ffffffff";
        ctx.fill();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#ff4d4d";
        ctx.stroke();
    });
}

canvas.addEventListener("mousedown", (e) => {
    if (e.button !== 2) return; // 2 = right click

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    removeNearestPoint(x, y);
});

function removeNearestPoint(x, y) {
    const hitRadius = 20;

    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        const dx = p.x - x;
        const dy = p.y - y;

        if (Math.sqrt(dx * dx + dy * dy) <= hitRadius) {
            points.splice(i, 1);
            redraw();
            return;
        }
    }
}
