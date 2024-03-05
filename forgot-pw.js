const email = document.querySelector('.email-input');
const message = document.querySelector('.alert-container');
const wrapper = document.querySelector('.container');
const btn = document.querySelector('.forgot-pw-btn');

function msgAlert() {
    wrapper.style.height = '440px';
    message.style.transform = 'scaleX(1)'
}

btn.addEventListener('click', () => {
    if(email.value === '') {
        message.innerHTML = 'Email Address is Required!'
        msgAlert();
    }

    firebase.auth().sendPasswordResetEmail(email.value)
    .then(() => {
        message.innerHTML = 'Check your email!'
        msgAlert();
    })
    .catch((error) => {
        message.innerHTML = error.message;
    })
} )