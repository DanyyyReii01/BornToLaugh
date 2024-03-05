let postText = document.querySelector('.upload-textarea');
let uploadPercent = document.querySelector('.upload-percentage');
let uploadDone = document.querySelector('.upload-done');
let uploadedMsg = document.querySelector('.uploaded-msg');
let createPostIcon = document.querySelector('.create-post-icon');
let currentUser = '';
let cpUrl = '';
let cpFileType = '';
let cpUid;

createPostIcon.addEventListener('click', () => {
    createPost();
})

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if(user.emailVerified) {
            setTimeout(() => {
                cpUid = user.uid;
            }, 1000);
        } else {
            setTimeout(() => {
                window.location.assign('./email-verification.html');
            }, 1000);
        }
    } else {
        setTimeout(() => {
            window.location.assign('./login-page.html');
        }, 1000)
    }
});

firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
});

function uploading(event) {
    cpFileType = event.target.files[0].type;

    let file = event.target.files[0];
    let storageRef = firebase.storage().ref(`posts/${file.name}`);
    let uploadTask = storageRef.put(file);

    uploadTask.on('state_changed',
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            let uploadPercentage = Math.round(progress);
            uploadPercent.style.visibility = 'visible';
            uploadPercent.textContent = `${uploadPercentage}%`;
        },
        (error) => {
            // Handle unsuccessful uploads
            console.error("Upload error:", error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                cpUrl = downloadURL;
                uploadDone.style.visibility = 'visible';
                uploadPercent.style.visibility = 'hidden';
            });
        }
    );
};

let d = new Date().toISOString().split('T')[0];

function createPost() {
    if(postText.value.trim() !== '' || cpUrl !== '') {
        console.log('clicked')
        firebase.firestore().collection('posts').add({
            postText: postText.value,
            uid: currentUser.uid,
            url: cpUrl,
            fileType: cpFileType,
            like: '',
            dislike: '',
            comment: '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            date: `${d}`,
        }
        ).then((res) => {
            firebase.firestore().collection('posts/').doc(res.id).update({
                id:res.id
            }).then(() => {
                uploadDone.style.visibility = 'hidden';
                uploadedMsg.style.visibility = 'visible';
                setTimeout(() => {
                    location.reload()
                }, 1000)
            })
        })
    }
}
