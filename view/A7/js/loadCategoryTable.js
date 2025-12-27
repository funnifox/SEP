var categories = null;

document.addEventListener('DOMContentLoaded', function () {

    fetch(new Request('/api/getShowroomCategory', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + authToken
        }
    }))
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        categories = data;

        //---------- Category count -----------//
        var categoryCount = document.getElementById("categoryCount")
        if (categoryCount !== null) {
            categoryCount.innerHTML = data.length;
        }

        //------------- Table -----------------//
        var htmlTxt = '';

        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var category = data[i];

                htmlTxt += '\
                    <tr>\
                        <td>' + category.id + '</td>\
                        <td>' + category.name + '</td>\
                        <td>' + (category.description || '') + '</td>\
                    </tr>';
            }
        } else {
            htmlTxt = '\
                <tr>\
                    <td colspan="3" class="text-center text-muted">\
                        No showroom categories found\
                    </td>\
                </tr>';
        }

        var tableBody = document.getElementById("tableBody");
        if (tableBody) {
            tableBody.innerHTML = htmlTxt;
            $('#dataTables-example').dataTable();
        }

        //----------Dropdown category-----------//
        var categorySelect = document.getElementById("categorySelect");

        if (categorySelect && data && data.length > 0) {
            categorySelect.innerHTML = '<option value="">Select Category Associated</option>';

            for (var i = 0; i < data.length; i++) {
                var category = data[i];

                var option = document.createElement("option");
                option.value = category.id; 
                option.textContent = category.name;

                categorySelect.appendChild(option);
            }
        }
    })
    .catch(function (error) {
        console.log(error);
    });









// get showroom count
    fetch('/api/getShowroom', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    })
    .then(res => res.json())
    .then(data => {
        const showrooms = data; 

        if (!showrooms || showrooms.length === 0) {
            return;
        }else{
            document.getElementById("showroomCount").innerHTML = showrooms.length;
        }
    })





}, false);
