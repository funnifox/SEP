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

function getFurniture(arr){

    points.length = 0;
    // let furnitureHTML = '';
    // let draggableFurnitureHTML = '';
    for (let i = 0; i < arr.length; i++) {
        let posJSON = arr[i].position_json;
        let pos = JSON.parse(posJSON);

        points.push({
            x: pos.x, 
            y: pos.y, 
            id: arr[i].ID, 
            name: arr[i].NAME,
            description: arr[i].DESCRIPTION, 
            imgurl: arr[i].IMAGEURL, 
            tagged: true
        });

        // furnitureHTML += `
        // <div class="furniture-item">
        //     <b>${arr[i].NAME}</b><br>
        //     <img src="${arr[i].IMAGEURL}" alt="${arr[i].NAME}"><br>
        //     <button class="btn-delete btn" style="width:100%;" data-id="${arr[i].ID}"><i class="fas fa-trash"></i> Delete</button>
        // </div>
        //     `

        // draggableFurnitureHTML += `
        // <div id="drag-${i}" class="draggable">
        //     <div id="drag-${i}-header" class="drag-header">
        //         <img src="${arr[i].IMAGEURL}" alt="${arr[i].NAME}"><br>
        //     </div>
        // </div>
        // `;

    }
    redraw();

    // furnitureHTML += `
    //     <div class="furniture-item add-furniture" style="background-color: transparent;">
    //         <button class="popup-btn"><i class="fas fa-plus-circle"></i></button>
    //     </div>
        
    // `
    
    
    // document.getElementById('furniture-list').innerHTML = furnitureHTML;
    // const showroom = document.getElementById('showroom');
    // showroom.innerHTML += draggableFurnitureHTML;

    // // Wait for DOM to render
    // requestAnimationFrame(() => {
    //     const draggables = document.querySelectorAll('#showroom .draggable');
    //     draggables.forEach(div => dragElement(div));
    // });

} 



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

function add(furnitureName, x, y){

    let pos = `{"x": ${x}, "y":${y}}`;
// no you cannot add a kit kat to the showroom.
    let staff = JSON.parse(sessionStorage.getItem("staff"))
    const data = {
        staffId: parseInt(staff.id),
        furnitureName: furnitureName,
        position_json: pos
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

function openPopup(){document.getElementById("popup").style.display = "block";}
function closePopup(){document.getElementById("popup").style.display = "none";}
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






// canvas
const points = [];

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
    redraw();
  };
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX-rect.left)*(canvas.width/rect.width);
    const y = (e.clientY-rect.top)*(canvas.height/rect.height);

    points.push({x, y, tagged: false});

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


        if(p.tagged){
            ctx.fillStyle = "#ffffffff";
            ctx.fill();

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = "#ff0000ff";
            ctx.stroke();
        }else{
            ctx.fillStyle = "#ffffffff";
            ctx.fill();

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = "#646464ff";
            ctx.stroke();
        }
        
    });
}

function getPointAt(x, y, radius) {
  let nearestPoint = null;

  for (let p of points) {
    const dx = p.x - x;
    const dy = p.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      nearestPoint = p;
      break; // stop at the first matching point
    }
  }

  return nearestPoint;
}










// assign btns
// doing it like this instead of onclick="del()" for scalability
document.addEventListener("click", function(e) {
    //for canva
// Hide menu if clicking elsewhere
    if(!canvas.contains(e.target)){
        document.getElementById("context-menu").style.display = "none";
    }

    // if (e.target.classList.contains("btn-delete")) {
    //     const id = e.target.dataset.id;
    //     del(id);
    // }

    if(e.target.classList.contains("btn-add")){
        e.preventDefault();

        if(clickedPointIndex !== null){
            const point = points[clickedPointIndex];
            add(document.getElementById("furniture-name").value, point.x, point.y);
        }else{
            document.getElementById("context-menu").style.display = "none";
        }
    }

    if(e.target.id === "remove-point-btn"){
        if(clickedPointIndex !== null){
            points.splice(clickedPointIndex, 1);
            redraw();
            clickedPointIndex = null;
            document.getElementById("context-menu").style.display = "none";
        }
    }

    // if (e.target.classList.contains("popup-btn")) {
    //     openPopup()
    // }

    if(e.target.id === "tag-furniture-btn"){
        openPopup()
    }
});
// custom context menu 
canvas.addEventListener("mousedown", e => {
    if (e.button !== 2) return; // right-click only

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Find nearest point
    const hitRadius = 10;
    clickedPointIndex = null;

    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        const dx = p.x - x;
        const dy = p.y - y;
        if (Math.sqrt(dx*dx + dy*dy) <= hitRadius) {
            clickedPointIndex = i;
            break;
        }
    }

    const menu = document.getElementById("context-menu");

    if (clickedPointIndex !== null) {
        const point = points[clickedPointIndex];

        // Show menu at cursor
        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;
        menu.style.display = "block";

        // Remove previous info
        const prevInfo = document.getElementById("furniture-info");
        if (prevInfo) prevInfo.remove();
                            
        // Only show furniture info if tagged
        if(point.tagged){
            const infoDiv = document.createElement("div");
            infoDiv.id = "furniture-info";
            infoDiv.style.display = "flex";
            infoDiv.style.gap = "1rem";
            infoDiv.innerHTML = `
                <div style="width: 10rem">
                <br>
                    <img src="${point.imgurl}" alt="${point.name}" style="max-width: 100px; max-height: 100px; border-radius: 4px;">
                </div>
                <div style="width:17rem;">
                    <b>${point.name}</b>
                    <p style="margin:0;">${point.description}</p>
                </div>
            `;
            menu.appendChild(infoDiv);

            document.getElementById("context-menu-buttons").innerHTML = `<button class="btn context-menu-btn" id="remove-point-btn">Remove</button>`;
        }else{
            document.getElementById("context-menu-buttons").innerHTML = `
                <button class="btn context-menu-btn" id="tag-furniture-btn">Tag furniture</button>
                <button class="btn context-menu-btn" id="remove-point-btn">Remove</button>
            `;
        }

    } else {
        menu.style.display = "none"; // hide if no point nearby
    }
});
// disabl right click for canva point removal
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});










document.addEventListener('DOMContentLoaded', function () {

    fetch(`/api/getShowroomById/${GetURLParameter(param1)}`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
        getFurniture(data.furniture)
        // const img = document.getElementById("showroom-img");

        // img.src = `${data.showroom.cover_image_url}`;
        // img.alt = data.showroom.cover_image_url;
        setShowroomImage(`${data.showroom.cover_image_url}`);
    })
    .catch(err => {
        console.error(err);
        alert('Failed to load showroom');
    });

});
