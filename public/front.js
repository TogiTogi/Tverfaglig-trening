class User {
    constructor(id, username) {
    this.id = id;
    this.username = username;
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
        thisUser = new User(user[0], user[1], user[5])
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
    
    if (idRole == 1 ) {
      //document.getElementById('form1').style.display = 'inline';
      //document.getElementById('form2').style.display = 'inline';
      document.getElementById('registerForm').style.display = 'inline';
    }
}