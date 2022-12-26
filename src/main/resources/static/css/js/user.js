const data = document.getElementById("data-user");
const url = 'http://localhost:8080/api/users/authentication';
const panel = document.getElementById("user-panel1");

function userAuthInfo() {
    fetch(url)
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
            data.innerHTML = temp;
            panel.innerHTML = `<h5>${u.username} with roles: ${u.roles.map(role => role.name).join(' ')}</h5>`
        });
}

userAuthInfo()