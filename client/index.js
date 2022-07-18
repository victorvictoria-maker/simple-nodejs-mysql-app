// LOADING THE PAGE
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHtmlTable(data['dataFromDb']));
    // console.log('Page has loaded');
    // loadHtmlTable([]);
});

function loadHtmlTable(data) {
    const table = document.querySelector('table tbody');
    // console.log(data);
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='noData' colspan='5'>No Data</td></tr>";
        return;
    }
    
    let tableHtml = "";
    // we are going to get array of object so we use forEach
    data.forEach(function ({id, name, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td> ${id} </td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id="${id}">DELETE</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id="${id}">EDIT</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}


//GETTING THE VALUE FROM NAME INPUT
const addBtn = document.querySelector('#add-btn');
addBtn.onclick = function () {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value;
    nameInput.value = '';

    console.log(name);

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({nameValueFromFrontend: name})
    })
    .then(response => response.json())
    .then(data => insertData(data['dataFromDb']));
};

function insertData (data) {
    // console.log(data);
    const table = document.querySelector('table tbody');
    const isThereNoDataClass = document.querySelector('.noData');

    let tableHtml = '<tr>';

    for (let key in data) {
        if(data.hasOwnProperty(key)) {
            if(key === 'dateAdded') {
                data[key] = new Date (data[key]).toLocaleString();
            };

            tableHtml += `<td>${data[key]}</td>`;
        };
    };

    tableHtml += `<td><button class="delete-row-btn" data-id="${data.id}">DELETE</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id="${data.id}">EDIT</button></td>`;
    tableHtml += `</tr>`;

    if(isThereNoDataClass) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
};

//EDIT AND DELETE   
document.querySelector('table tbody').addEventListener('click', function(event) {
    // console.log(event.target);
    // DELETE A ROW
    if (event.target.className === 'delete-row-btn') {
        deleteRowById(event.target.dataset.id);
        // console.log(event.target.dataset.id);
    };

    //EDIT A ROW
    if (event.target.className === 'edit-row-btn') {
        handleEditRow(event.target.dataset.id);
    };
});

// delete
function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        // method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
};


// edit
function handleEditRow(id) {
    const editRow = document.querySelector('#editDiv');
    editRow.hidden = false;
    document.querySelector('#edit-name-input').dataset.id = id; 
}


const editBtn =  document.querySelector('#edit-btn');
editBtn.onclick = function () {
    const updateNameInput = document.querySelector('#edit-name-input');
    console.log(updateNameInput.value);

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
};


// search
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function() {
    const searchValue = searchInput.value;

    fetch('http://localhost:5000/search/' + searchValue, {
        // method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => loadHtmlTable(data['dataFromDb']));
    // });
};
