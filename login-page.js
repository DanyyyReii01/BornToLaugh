const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const logInLink = document.querySelector('.log-in-link');
const logInBtn = document.querySelector('.log-in-btn');
const registerBtn = document.querySelector('.register-btn');
const logEmailInput = document.querySelector('.log-email-input');
const logPwInput = document.querySelector('.log-pw-input');
const regPwInput = document.querySelector('.reg-pw-input');
const regEmailInput = document.querySelector('.reg-email-input');
const logAlertText = document.querySelector('.log-alert-container');
const regAlertText = document.querySelector('.reg-alert-container');
const active = document.querySelector('.active')
const regUsernameInput = document.querySelector('.reg-username-input');
const regRePwInput = document.querySelector('.reg-re-pw-input');

function validateEmail (email) {
    return String(email)
    .toLowerCase()
    .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


function validation(email) {

    if(validateEmail(email)) {
        return true;
    } else {
        return false;
    }
};

function logAlert() {
    wrapper.style.height = '455px';
    wrapper.style.transition = 'all 0.3s ease'
    logAlertText.style.transform = 'scaleX(1)'
}

function regAlert() {
    wrapper.style.height = '570px';
    regAlertText.style.transform = 'scaleX(1)'
    wrapper.style.transition = 'all 0.3s ease'
}

function resetInput() {
    logEmailInput.value = '';
    regEmailInput.value = '';
    logPwInput.value = '';
    regPwInput.value = '';
    regUsernameInput.value = '';
    regRePwInput.value = '';
}

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
    logAlertText.style.transform = 'scaleX(0)'
    regAlertText.style.transform = 'scaleX(0)'
    wrapper.style.height = '540px';
    wrapper.style.transition = 'all 0.3s ease'
    resetInput();
})

logInLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
    regAlertText.style.transform = 'scaleX(0)'
    logAlertText.style.transform = 'scaleX(0)'
    wrapper.style.height = '430px';
    wrapper.style.transition = 'all 0.3s ease'
    resetInput();
})


logInBtn.addEventListener('click', () => {

    const logEmail = logEmailInput.value;
    const logPwConSpace = logPwInput.value.includes(' ');

    if(logEmailInput.value === '' && logPwInput.value === '') {
        logAlert();
        logAlertText.innerHTML = 'Please Fill Out Email and Password';
        resetInput();
    } else if(logEmailInput.value === '' && logPwInput.value !== '') {
        logAlert();
        logAlertText.innerHTML = 'Please Fill Out Email';
        logEmailInput.value = '';
    } else if (logEmailInput.value !== '' && logPwInput.value === '') {
        logAlert();
        logAlertText.innerHTML = 'Please Fill Out Password';
        regPwInput.value = '';
    } else if (!validation(logEmail)) {
        logAlert();
        logAlertText.innerHTML = 'You should add a valid email';
        logEmailInput.value = '';
    } else if(logPwInput.value.length < 8 || logPwInput.value.length > 15) {
        logAlert();
        logAlertText.innerHTML = 'Password should between 8 - 15 chars';
        logPwInput.value = '';
    } else if(logPwConSpace) {
        logAlert();
        logAlertText.innerHTML = "Password shouldn't includes spaces";
        logPwInput.value = '';
    }
    else {

        const userData = {
            email: logEmailInput.value,
            password: logPwInput.value
        }

        firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
        .then((userCredential) => {
            logAlert();
            logAlertText.innerHTML = 'Log in Sucessfully!';

            if(userCredential.user.emailVerified) {
                window.location.assign('./main-page.html');
            } else {
                window.location.assign('./email-verification.html');
            }
        })
        .catch((error) => {

            logAlertText.innerHTML = 'Check Your Email Or Password!';
            logAlert();

            console.log(error);
        });

        setTimeout(() => {
            resetInput();
        }, 2500);

        };
    }
);

registerBtn.addEventListener('click', () => {
    const logConSpace = regUsernameInput.value.includes(' ');
    const regEmail = regEmailInput.value;
    const regPwConSpace = regPwInput.value.includes(' ');
    const firstChar = regUsernameInput.value.charAt(0);
    const stWithChar = regUsernameInput.value.startsWith('!', '@', '#', '$', '%', '^', '&', '*', '<', '>', ',', '.', '/', '_', '-', '+', '=', '(', ')', '/', '?');

    if(regUsernameInput.value === '') {
        regAlert();
        regAlertText.innerHTML = 'Please Fill Out Username';
        regUsernameInput.value = '';
    } else if(regEmailInput.value === '') {
        regAlert();
        regAlertText.innerHTML = 'Please Fill Out Email';
        regEmailInput.value = '';
    } else if (regPwInput.value === '') {
        regAlert();
        regAlertText.innerHTML = 'Please Fill Out Password';
        regPwInput.value = '';
    } else if (regRePwInput.value === '') {
        regAlert();
        regAlertText.innerHTML = 'Please Re-enter Password';
        regRePwInput.value = '';
    } else if (regPwInput.value !== regRePwInput.value) {
        regAlert();
        regAlertText.innerHTML = "Re-Password doesn't Match";
        regRePwInput.value = '';
    } else if(!validation(regEmail)) {
        regAlert();
        regAlertText.innerHTML = 'You should add a valid email';
        regEmailInput.value = '';
    } else if(regPwInput.value.length < 8 || regPwInput.value.length > 15) {
        regAlert();
        regAlertText.innerHTML = 'Password should between 8 - 15 chars';
        regPwInput.value = '';
    } else if(regPwConSpace) {
        regAlert();
        regAlertText.innerHTML = "Password shouldn't includes spaces";
        regPwInput.value = '';
    } else if (stWithChar) {
        regAlert();
        regAlertText.innerHTML = "Username shouldn't start with Char";
        regUsernameInput.value = '';
    } else if (firstChar === '0' ||
    firstChar === '1' ||
    firstChar === '2' ||
    firstChar === '4' ||
    firstChar === '3' ||
    firstChar === '5' ||
    firstChar === '6' ||
    firstChar === '7' ||
    firstChar === '8' ||
    firstChar === '9') {
        regAlert();
        regAlertText.innerHTML = "Username shouldn't start with Numbers";
        regUsernameInput.value = '';
    } else if (logConSpace) {
        regAlert();
        regAlertText.innerHTML = "Username shouldn't includes spaces";
        regUsernameInput.value = '';
    } else if (regUsernameInput.value.length < 5 || regUsernameInput.value.length > 10) {
        regAlert();
        regAlertText.innerHTML = 'Username should between 5 - 10 chars';
        regUsernameInput.value = '';
    }
    else {

        firebase.auth().createUserWithEmailAndPassword(regEmailInput.value, regPwInput.value)
        .then((userCredential) => {

            let d = new Date().toISOString().split('T')[0];
            
            const userData = {
                username: regUsernameInput.value,
                email: regEmailInput.value,
                password: regPwInput.value,
                uid: userCredential.user.uid,
                profilePic: '',
                coverPic: '',
                desc: '',
                signUpDate: `${d}`
            }

            const batch = firebase.firestore().batch();

            const userDocRef = firebase.firestore().collection('users').doc(userCredential.user.uid);
            batch.set(userDocRef, userData);

            const emailVerificationPromise = userCredential.user.sendEmailVerification();

            // Commit the batch after sending email verification
            return Promise.all([emailVerificationPromise, batch.commit()]);
        })
        .then((responses) => {
            // Handle success, navigate to the email verification page or perform other actions
            setTimeout(() => {
                window.location.assign('./email-verification.html');
            }, 1000);
        })
        .catch((error) => {
            regAlertText.innerHTML = error.message
            resetInput();
            regAlert();
        });

        setTimeout(() => {
            resetInput();
        }, 2500);
    }
}
);