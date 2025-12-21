function addCategory() {
    const name = document.querySelector('input[name="name"]').value.trim();
    const description = document.querySelector('input[name="description"]').value.trim();

    if (!name) {
        alert("Category name is required");
        return;
    }

    fetch('/api/addShowroomCategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + authToken
        },
        body: JSON.stringify({
            name: name,
            description: description
        })
    })
    .then(function (response) {
        return response.json().then(data => ({
            status: response.status,
            body: data
        }));
    })
    .then(function (res) {

        // 201 Created
        if (res.status === 201) {
            alert("Category added successfully");
            window.location.href = "showroomCategoryManagement.html";
            return;
        }

        // 409 Duplicate
        if (res.status === 409) {
            alert(res.body.message);
            return;
        }

        // 400 Validation
        if (res.status === 400) {
            alert(res.body.message);
            return;
        }

        alert("Failed to add category");
    })
    .catch(function (error) {
        console.error(error);
        alert("Server error");
    });
}
