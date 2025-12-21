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

        document.getElementById("tableBody").innerHTML = htmlTxt;
        $('#dataTables-example').dataTable();
    })
    .catch(function (error) {
        console.log(error);
    });

}, false);
