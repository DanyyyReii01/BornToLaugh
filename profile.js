const pfImg = document.querySelector('.pf-img');
const pfWallpaper = document.querySelector('.pf-wallpaper');
const pfUploadPercent = document.querySelector('.pf-upload-percentage');
const wallpaperUploadPercent = document.querySelector('.wallpaper-upload-percentage');
const pfUsername = document.querySelector('.pf-username');
const pfCard = document.querySelector('.profile-card');
const pfContent = document.querySelector('.profile-content');

let pfFileType = '';
let pfUid;
let updateUrl;
let allUsers = [];

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            pfUid = user.uid;
            firebase.firestore().collection('users/').onSnapshot((snapshot) => {
                snapshot.forEach((doc) => {
                    const userData = doc.data();
                    
                    if (userData.uid === pfUid) {
                        pfUsername.textContent = userData.username;

                        if (userData.profilePic !== '' || userData.coverPic !== '') {
                            pfImg.setAttribute('src', userData.profilePic || 'images/profile.jpg');
                            pfCard.style.backgroundImage = `url(${userData.coverPic}` || 'images/cover-img.jpg';
                            pfUsername.textContent = userData.username;
                        }
                    }
                });
            });
        } else {
            window.location.assign('./email-verification.html');
        }
    } else {
        window.location.assign('./login-page.html');
    }
});

function changePfWallpaper(event) {

    let file = event.target.files[0];
    let storageRef = firebase.storage().ref(`users/${pfUid}/coverPicture`);
    let uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            let uploadPercentage = Math.round(progress);
            wallpaperUploadPercent.style.visibility = 'visible';
            wallpaperUploadPercent.textContent = `${uploadPercentage}%`;
        },
        (error) => {
            // Handle unsuccessful uploads
            console.error("Upload error:", error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                wallpaperUploadPercent.style.visibility = 'hidden';
                firebase.firestore().collection('users/').doc(pfUid).update({
                    coverPic: downloadURL
                })

            });
        }
    );
};

function changePfImage(event) {

    let file = event.target.files[0];
    let storageRef = firebase.storage().ref(`users/${pfUid}/profilePicture`);
    let uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            let uploadPercentage = Math.round(progress);
            pfUploadPercent.style.visibility = 'visible';
            pfUploadPercent.textContent = `${uploadPercentage}%`;
        },
        (error) => {
            // Handle unsuccessful uploads
            console.error("Upload error:", error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                pfUploadPercent.style.visibility = 'hidden';
                firebase.firestore().collection('users/').doc(pfUid).update({
                    profilePic: downloadURL
                })

            });
        }
    );
};

function loadUserProfileData(uid) {

    firebase.firestore().collection('users').doc(uid).get().then((doc) => {
        const userData = doc.data();
        if (userData) {
            pfImg.setAttribute('src', userData.profilePic || 'images/profile.jpg');
            pfCard.style.backgroundImage = `url(${userData.coverPic}` || 'images/cover-img.jpg';
        }
    }).catch((error) => {
        console.error('Error loading user profile data:', error);
    });
}



