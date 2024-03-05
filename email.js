let email = document.querySelector('.email-id');
let message = document.querySelector('.message');

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if(user.emailVerified) {
        window.location.assign('./main-page.html');
    } else {
        email.innerHTML = user.email;
    }
  } else {
    window.location.assign('./main-page.html');
  }
});

function resend() {
    firebase.auth().sendEmailVerification().then(() => {
        message.innerHTML = 'Resent to your email!';
    })
};

function reload() {
    location.reload();
}