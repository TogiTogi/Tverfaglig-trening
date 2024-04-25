const loginForm = document.getElementById('loginForm');
const loginFeedback = document.getElementById('loginFeedback');

loginForm.addEventListener('submit', login)

async function login(evt) {
    evt.preventDefault(); // Prevent the default form submission
    try {
        const formData = new FormData(loginForm);
        const response = await fetch('/login', {
            method: 'POST',
            body: formData
        });
        
        const user = await response.json();

        if (user){ 
            console.log(user);
            window.location.href = '/app.html'; 
            // Possibly redirect the user or update UI to show a successful login
        } else {
            // Handle case where user data is not in the expected format
            throw new Error('Unsuccessful login. Please try again.');
        }
    } catch (error) {
        console.log('Failed to fetch thisUser:', error);
        loginFeedback.innerText = error.message || 'Unsuccessful login. Please try again.';
        loginFeedback.style.color = 'red';
    }
}