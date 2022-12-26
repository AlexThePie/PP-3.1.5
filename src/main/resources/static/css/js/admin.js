//Таблица всех пользователей
const url = 'http://localhost:8080/api/admin';
const renderTable = document.getElementById("allUsersTable");
const addForm = document.getElementById("add-form");

const renderPosts = (users) => {
    let temp = '';
    users.forEach((u) => {
        temp += `<tr>
                                <td>${u.id}</td>
                                <td id=${'name' + u.id}>${u.name}</td>
                                <td id=${'last_name' + u.id}>${u.last_mame}</td>
                                <td id=${'username' + u.id}>${u.username}</td>
                                <td id=${'role' + u.id}>${u.roles.map(role => role.name).join(' ')}</td>
                                <td>
                                <button class="btn btn-info" type="button"
                                data-bs-toggle="modal" data-bs-target="#modalEdit"
                                onclick="editModal(${u.id})">Edit</button></td>
                                <td>
                                <button class="btn btn-danger" type="button"
                                data-bs-toggle="modal" data-bs-target="#modalDelete"
                                onclick="deleteModal(${u.id})">Delete</button></td>
                                </tr>
                                `
    })
    renderTable.innerHTML = temp;
}

function getAllUsers() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            renderPosts(data)
        })
}

getAllUsers()

// Добавление пользователя

addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let nameValue = document.getElementById("newUserFirstName").value;
    let lastNameValue = document.getElementById("newUserLastName").value;
    let emailValue = document.getElementById("newUserEmail").value;
    let passwordValue = document.getElementById("newUserPassword").value;
    let roles = getRoles(Array.from(document.getElementById("newUserRoles").selectedOptions).map(role => role.value));
    let newUser = {
        name: nameValue,
        last_name: lastNameValue,
        username: emailValue,
        password: passwordValue,
        roles: roles
    }
    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(newUser)
    }).then(data => {
        const dataArr = [];
        dataArr.push(data);
        getAllUsers(data);
    }).then(() => {
        document.getElementById("users-table-tab").click();
    })
})


function getRoles(rols) {
    let roles = [];
    if (rols.indexOf("ADMIN") >= 0) {
        roles.push({
            "id": 1,
            "name": "ROLE_ADMIN",
            "users": null,
            "authority": "ROLE_ADMIN"
        });
    }
    if (rols.indexOf("USER") >= 0) {
        roles.push({
            "id": 2,
            "name": "ROLE_USER",
            "users": null,
            "authority": "ROLE_USER"
        });
    }
    return roles;
}


// Delete
function deleteModal(id) {
    fetch(url + '/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(us => {
            document.getElementById('idDeleteUser').value = us.id;
            document.getElementById('deleteUserFirstName').value = us.name;
            document.getElementById('deleteUserLastName').value = us.last_name;
            document.getElementById('deleteUserEmail').value = us.username;
        })
    });
}

async function deleteUser() {
    console.log(document.getElementById('idDeleteUser').value)
    await fetch(url + '/' + document.getElementById('idDeleteUser').value, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(document.getElementById('idDeleteUser').value)
    })

    getAllUsers()
    document.getElementById("deleteFormCloseButton").click();
}

// Edit
function editModal(id) {
    fetch(url + '/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(us => {

            document.getElementById('idEditUser').value = us.id;
            document.getElementById('editUserFirstName').value = us.name;
            document.getElementById('editUserLastName').value = us.surname;
            document.getElementById('editUserEmail').value = us.username;
            document.getElementById('editUserPassword').value = us.password;

        })
    });
}

async function editUser() {
    let idValue = document.getElementById("idEditUser").value;
    let nameValue = document.getElementById("editUserFirstName").value;
    let lastNameValue = document.getElementById("editUserLastName").value;
    let emailValue = document.getElementById("editUserEmail").value;
    let passwordValue = document.getElementById("editUserPassword").value;
    let roles = getRoles(Array.from(document.getElementById("editUserRoles").selectedOptions).map(role => role.value));

    let user = {
        id: idValue,
        name: nameValue,
        surname: lastNameValue,
        username: emailValue,
        password: passwordValue,
        roles: roles

    }

    await fetch(url, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(user)
    });
    getAllUsers()
    document.getElementById("editFormCloseButton").click(); //???
}

//User
const tableForUser = document.getElementById("tableForUser");
const urlAuth = 'http://localhost:8080/api/admin/authentication';
const panel = document.getElementById("admin-panel1");

function userAuthInfo() {
    fetch(urlAuth)
        .then((res) => res.json())
        .then((u) => {
            let temp = '';
            temp += `<tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.last_name}</td>
             <td>${u.username}</td>
            <td>${u.roles.map(role => role.name).join(' ')}</td> 
            </tr>`;
            tableForUser.innerHTML = temp;
        });
}

userAuthInfo()

function userPanel() {
    fetch(urlAuth)
        .then((res) => res.json())
        .then((u) => {
            panel.innerHTML = `<h5>${u.username} with roles: ${u.roles.map(role => role.name).join(' ')}</h5>`
        });
}

userPanel()
