class User {
    constructor(id, username, role) {
    this.id = id;
    this.username = username;
    this.role = role;
    }
}
  
  
let users = null
let tasks = null
let done = null
let thisUser = null

async function main() {
    hideElementsBasedOnRole()
    fetchCurrentUser()
}

document.addEventListener('DOMContentLoaded', main)

async function fetchCurrentUser() {
    try {
        const response = await fetch('/currentUser')
        
        let user = await response.json()
        thisUser = new User(user[0], user[1], user[2])
        document.getElementById('loggedInAs').innerText = "logged in as: " + thisUser.username;
        console.log(thisUser)
    } catch (error) {
        console.log('Failed to fetch thisUser:', error);
    }
  }
  fetch('/currentUser')
    .then(response => response.json())
    //.then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  
    
  //Funker ikke, vet ikke hvorfor
  async function fetchCurrentUserRole() {
    try {
        const response = await fetch('/currentUser')
        
        let user = await response.json()
        return user[2]; // user[2] is the idRole
    } catch (error) {
        console.log('Failed to fetch currentUser:', error);
    }
}

async function hideElementsBasedOnRole() {
    const idRole = await fetchCurrentUserRole();
    console.log(`idRole: ${idRole}`); // Log the value of idRole
    
    if (idRole == 1 ) { //Om du er Admin (1) kan du se disse
      document.getElementById('delUserForm').style.display = 'block';
    }

    if (idRole == 1 || idRole == 2) { //Om du er Admin (1), eller Staff (2) kan du se denne
      document.getElementById('editUserForm').style.display = 'block';
      document.getElementById('registerForm').style.display = 'block';
    }
}

fetch('/roles')
.then(response => response.json())
.then(data => {
    const select = document.getElementById('regRoleId');
    data.data.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.text = role.name;
        select.appendChild(option);
    });
}).catch(error => console.error('Error:', error));

fetch('/klasse')
.then(response => response.json())
.then(data => {
    const select = document.getElementById('regKlasseId');
    data.data.forEach(klasse => {
        const option = document.createElement('option');
        option.value = klasse.id;
        option.text = klasse.name;
        select.appendChild(option);
    });
}).catch(error => console.error('Error:', error));

fetch('/delUser')
.then(response => response.json())
.then(data => {
    const select = document.getElementById('delUserId');
    let users = data.data; // Define users here
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.text = "VG"+user.idKlasse + " " + user.firstname + " " + user.lastname;
        select.appendChild(option);
    });
    select.addEventListener('change', function() {
        // Find the selected user's information
        let selectedUser = users.find(user => user.id == this.value);
        if (selectedUser) {
            // Display the selected user's information
            document.getElementById('delUserInfo').innerHTML = 
                'Name: ' + selectedUser.firstname + " " + selectedUser.lastname +
                '<br> Username: '+ selectedUser.username + 
                '<br> Email: ' + selectedUser.email +
                '<br> Class: VG' + selectedUser.idKlasse +
                '<br> Role: ' + selectedUser.idRole;
        }
    });
}).catch(error => console.error('Error:', error));

document.getElementById('delUserForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    var userId = document.getElementById('delUserId').value;
    fetch('/userDel/' + userId, {
        method: 'DELETE',
        redirect: 'follow'  // Set the redirect option to 'follow'
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data && data.message) {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
