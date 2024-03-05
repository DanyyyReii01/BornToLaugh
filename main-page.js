const uploadIcon = document.querySelector('.upload-icon');
const uploadContent = document.querySelector('.upload-content');
const profileIcon = document.querySelector('.profile-icon');
const profileContent = document.querySelector('.profile-content');
const mainPagePf = document.querySelector('.sec2-pf-img');
const mainPageUploadBtn = document.querySelector('.sec2-upload-link');
const mainPgPfHeader = document.querySelector('.pf-upload-header');
const allPostContainer = document.querySelector('.sec2-all-post-container');
const imagePostContainer = document.querySelector('.sec2-image-post-container');
const videoPostContainer = document.querySelector('.sec2-video-post-container');
const allPostIcon = document.querySelector('.all-post-icon');
const imagePostIcon = document.querySelector('.image-post-icon');
const videoPostIcon = document.querySelector('.video-post-icon');
const allFeedText = document.querySelector('.all-feed');
const videoFeedText = document.querySelector('.video-feed');
const imageFeedText = document.querySelector('.image-feed');
const settingIcon = document.querySelector('.setting-icon');
const settingContent = document.querySelector('.setting-content');
const navProfileContent = document.querySelector('.nav-profile-content');
const mainSec3 = document.querySelector('.main-sec3');
const mainSec1 = document.querySelector('.main-sec1');
const navMsgerContent =  document.querySelector('.nav-messenger-content');
const navMsgerIcon = document.querySelector('.messenger-icon');

function activeFeedIconRemover() {
    allPostIcon.classList.remove('active-feed');
    imagePostIcon.classList.remove('active-feed');
    videoPostIcon.classList.remove('active-feed');
}

function activeFeedRemover() {
    allPostContainer.style.display = 'none';
    imagePostContainer.style.display = 'none';
    videoPostContainer.style.display = 'none';
}

function activeFeedTextRemover() {
    allFeedText.style.transform = 'scaleY(0)';
    videoFeedText.style.transform = 'scaleY(0)';
    imageFeedText.style.transform = 'scaleY(0)';
}
/*
settingIcon.addEventListener('mouseover', () => {
    settingIcon.style.backgroundColor = 'white';
    settingIcon.style.color = 'black';
})

settingIcon.addEventListener('mouseout', () => {
    settingIcon.style.backgroundColor = 'black';
    settingIcon.style.color = 'white';
})
*/

function activeIconRemover() {
    settingIcon.classList.remove('active-nav-icon');
    profileIcon.classList.remove('active-nav-icon');
    navMsgerIcon.classList.remove('active-nav-icon');
}

settingIcon.addEventListener('click', () => {
    activeIconRemover();
    navMsgerContent.style.transform = 'scaleY(0)';
    navProfileContent.style.transform = 'scaleY(0)';
    uploadContent.style.transform = 'scaleY(0)';

    if(settingContent.style.transform !== 'scaleY(1)') {
        settingContent.style.transform = 'scaleY(1)'
        settingIcon.classList.add('active-nav-icon');

    } else {
        settingContent.style.transform = 'scale(0)';
        settingIcon.classList.remove('active-nav-icon');
    }
});

let mainUid;
let mainAllUsers = [];
let mainFileType;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            mainUid = user.uid;

            firebase.firestore().collection('users/').onSnapshot((result) => {
                mainAllUsers = [];
                result.forEach((userData) => {
                    const userDoc = userData.data();
                    mainAllUsers.push(userDoc);

                    if (userDoc.uid === mainUid) {
                        mainFileType = userDoc.fileType;
                        mainPageUploadBtn.innerHTML = `What's in your mind, ${userDoc.username} !`;

                        if (userDoc.profilePic !== '') {
                        mainPagePf.setAttribute('src', userDoc.profilePic);
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

profileIcon.addEventListener('click',() => {
    activeIconRemover();
    navMsgerContent.style.transform = 'scaleY(0)';
    settingContent.style.transform = 'scaleY(0)';
    uploadContent.style.transform = 'scaleY(0)';

    if(navProfileContent.style.transform !== 'scaleY(1)') {
        navProfileContent.style.transform = 'scaleY(1)';
        profileIcon.classList.add('active-nav-icon');
    } else if(navProfileContent.style.transform === 'scaleY(1)'){
        navProfileContent.style.transform ='scale(0)'; 
        profileIcon.classList.remove('active-nav-icon');
    }
}); 

mainPageUploadBtn.addEventListener('click',() => {
    activeIconRemover();
    navMsgerContent.style.transform = 'scaleY(0)';
    navProfileContent.style.transform = 'scaleY(0)';
    settingContent.style.transform = 'scaleY(0)';
    
    if(uploadContent.style.transform !== 'scaleY(1)') {
        uploadContent.style.transform = 'scaleY(1)';

    } else if(uploadContent.style.transform === 'scaleY(1)'){
        uploadContent.style.transform = 'scaleY(0)'
    }
});

const mainLoadingText = document.querySelector('.post-loading-text');

firebase.firestore().collection('posts').orderBy('timestamp', 'desc').onSnapshot((result) => {
    mainLoadingText.style.display = 'none';
    let allPosts = [];

    if (result.size === 0) {
        mainLoadingText.style.display = 'block';
    } else {
        allPostContainer.innerHTML = '';

        result.forEach((post) => {
            const postData = post.data();
            allPosts.push(postData);
        });


        for(let i=0; i < allPosts.length; i++) {
            let likeArray = allPosts[i].like || [];
            let dislikeArray = allPosts[i].dislike || [];
            let commentArray = allPosts[i].comment || [];


            let postMain = document.createElement('div');
            allPostContainer.appendChild(postMain);
            postMain.setAttribute('class', 'post-main');

            let postHeader = document.createElement('div');
            postMain.appendChild(postHeader);
            postHeader.setAttribute('class', 'post-header');

            firebase.firestore().collection('users/').doc(allPosts[i].uid).get().then((res) => {
                const userData = res.data();

                let userProDev = document.createElement('div');
                userProDev.classList.add('user-pro-dev');

                let userProfileImg = document.createElement('img');
                userProfileImg.classList.add('profile-img');
                userProfileImg.setAttribute('src', userData.profilePic || 'images/profile.jpg');

                let userDiv = document.createElement('div');
                
                let userName = document.createElement('h6');
                userName.innerHTML = userData.username;
                userName.classList.add('post-username');

                let date = document.createElement('h6');
                date.innerHTML = `${allPosts[i].date}`
                date.classList.add('post-date');

                let postDetail = document.createElement('p');
                postDetail.innerHTML = allPosts[i].postText;
                postDetail.classList.add('post-detail');

                postHeader.appendChild(userProDev);
                userProDev.appendChild(userProfileImg);
                userProDev.appendChild(userDiv);
                userProDev.appendChild(userName);
                userProDev.appendChild(date);
                postHeader.appendChild(postDetail);

                if(allPosts[i].url !== '') {
                    if(allPosts[i].fileType === 'image/png' ||
                    allPosts[i].fileType === 'image/jpg' ||
                    allPosts[i].fileType === 'image/jpeg') {
                        let postImage = document.createElement('img');
                        postImage.setAttribute('src', allPosts[i].url);
                        postImage.classList.add('post-image');

                        let postImageContainer = document.createElement('div');
                        postImageContainer.classList.add('post-image-container');

                        postImageContainer.appendChild(postImage);
                        postHeader.appendChild(postImageContainer);
                    } else {
                        let postVideo = document.createElement('video');
                        postVideo.setAttribute('controls', 'true');
                        postVideo.classList.add('post-video');

                        let postVideoContainer = document.createElement('div');
                        postVideoContainer.classList.add('post-video-container');

                        let source = document.createElement('source');
                        source.setAttribute('src', allPosts[i].url);
                        source.setAttribute('Type', 'video/mp4');

                        postVideo.appendChild(source);
                        postVideoContainer.appendChild(postVideo);
                        postHeader.appendChild(postVideoContainer);
                    }
                };

                let footerDiv = document.createElement('div');
                footerDiv.setAttribute('class', 'post-footer-div');
                postHeader.appendChild(footerDiv);

                let likeButtonContainer = document.createElement('div');
                likeButtonContainer.classList.add('post-like-container');

                let dislikeButtonContainer = document.createElement('div');
                dislikeButtonContainer.classList.add('post-dislike-container');

                let commentButtonContainer = document.createElement('div');
                commentButtonContainer.classList.add('post-comment-container');

                let likeButton = document.createElement('button');
                likeButton.setAttribute('class', 'post-like-button');

                let dislikeButton = document.createElement('button');
                dislikeButton.setAttribute('class', 'post-unlike-button');

                let commentButton = document.createElement('button');
                commentButton.setAttribute('class', 'post-comment-button');

                let likeIcon = document.createElement('ion-icon');
                likeIcon.setAttribute('class', 'post-like-icon');
                likeIcon.setAttribute('name', 'heart-outline');

                let dislikeIcon = document.createElement('ion-icon');
                dislikeIcon.setAttribute('class', 'post-dislike-icon');
                dislikeIcon.setAttribute('name', "heart-dislike-outline");

                let commentIcon = document.createElement('ion-icon');
                commentIcon.setAttribute('class', 'post-comment-icon');
                commentIcon.setAttribute('name', 'chatbox-ellipses-outline');

                let likeCount = document.createElement('p');
                likeCount.setAttribute('class', 'post-imp-count');
                likeCount.innerHTML = `${likeArray.length}`;

                let dislikeCount = document.createElement('p');
                dislikeCount.setAttribute('class', 'post-imp-count');
                dislikeCount.innerHTML = `${dislikeArray.length}`

                let commentCount = document.createElement('p');
                commentCount.setAttribute('class', 'post-imp-count');
                commentCount.innerHTML = `${commentArray.length}`;

                likeButtonContainer.appendChild(likeCount);
                likeButton.appendChild(likeIcon);
                likeButtonContainer.appendChild(likeButton);
                footerDiv.appendChild(likeButtonContainer);

                dislikeButtonContainer.appendChild(dislikeCount);
                dislikeButton.appendChild(dislikeIcon);
                dislikeButtonContainer.appendChild(dislikeButton);
                footerDiv.appendChild(dislikeButtonContainer);

                commentButtonContainer.appendChild(commentCount);
                commentButton.appendChild(commentIcon);
                commentButtonContainer.appendChild(commentButton);
                footerDiv.appendChild(commentButtonContainer);

                for (let likeIndex = 0; likeIndex < likeArray.length; likeIndex ++) {
                    if(likeArray[likeIndex] === mainUid) {
                        likeIcon.style.color = 'white';
                    }
                }

                likeButton.addEventListener('click', () => {
                    const isLiked = likeArray.includes(mainUid);

                    if (isLiked) {
                        likeArray = likeArray.filter(userId => userId !== mainUid);
                    } else {
                        likeArray.push(mainUid);
                    }

                    firebase.firestore().collection('posts').doc(allPosts[i].id).update({
                        like: likeArray,
                    }).then(() => {
                        
                        likeCount.innerHTML = `${likeArray.length}`;
                    }).catch(error => {
                        console.error('Error updating like:', error);
                    });
                });

                for (let dislikeIndex = 0; dislikeIndex < dislikeArray.length; dislikeIndex ++) {
                    if(dislikeArray[dislikeIndex] === mainUid) {
                        dislikeIcon.style.color = 'white';
                    }
                };

                let commentContainer = document.createElement('div');
                commentContainer.classList.add('post-comment-content');
                postHeader.appendChild(commentContainer);

                if(commentArray.length !== 0) {
                    for(let commentIndex = 0; commentIndex < commentArray.length; commentIndex ++) {
                        let commentMain = document.createElement('div');
                        commentContainer.appendChild(commentMain);
                        commentMain.setAttribute('class', 'post-comment-main');

                        let commentSec1 = document.createElement('div');
                        commentSec1.classList.add('post-comment-sec1');

                        let commentSec2 = document.createElement('div');
                        commentSec2.classList.add('post-comment-sec2');

                        let commentPfImg = document.createElement('img');
                        commentSec1.appendChild(commentPfImg);
                        commentMain.appendChild(commentSec1);
                        commentPfImg.classList.add('post-comment-pf-img');

                        let commentMsg1 = document.createElement('div');
                        let commentUsername = document.createElement('h6');

                        commentSec1.appendChild(commentUsername);
                        commentSec2.appendChild(commentMsg1);
                        commentMain.appendChild(commentSec2);

                        firebase.firestore().collection('users').doc(commentArray[commentIndex].uid).get().then((comment) => {
                            commentPfImg.setAttribute('src', 'images/profile.jpg');

                            if(comment.data().profilePic !== '') {
                                commentPfImg.setAttribute('src', comment.data().profilePic);
                            }

                            commentUsername.innerHTML = comment.data().username;

                            const commentValue = commentArray[commentIndex].commentValue;

                            commentMsg1.innerHTML = commentValue;
                        }) 
                    }
                }

                let writeComment = document.createElement('div');
                        writeComment.classList.add('post-write-comment');
                        commentContainer.appendChild(writeComment);

                        let commentInput = document.createElement('input');
                        commentInput.classList.add('post-comment-input');
                        commentInput.setAttribute('placeholder', "What you think . . .?");
                        writeComment.appendChild(commentInput);

                        let sendCommentBtn = document.createElement('ion-icon');
                        sendCommentBtn.classList.add('comment-send-btn');
                        sendCommentBtn.setAttribute('name', 'chevron-up-outline');
                        writeComment.appendChild(sendCommentBtn);

                        commentInput.addEventListener('keypress', (event) => {
                            if (event.key === 'Enter') {
                                sendCommentBtn.click();
                            }
                        });

                        sendCommentBtn.addEventListener('click', () => {
                            if(commentInput !== '') {
                                let commentData = {
                                    commentValue: commentInput.value,
                                    uid: mainUid,
                                }

                                commentArray.push(commentData);
                                firebase.firestore().collection('posts').doc(allPosts[i].id).update({
                                    comment: commentArray,
                                })
                            }
                        })

                        commentIcon.addEventListener('click', () => {
                            if(commentContainer.style.display !== 'block') {
                                commentContainer.style.display = 'block';
                            } else {
                                commentContainer.style.display = 'none';
                            } 
                        })

            });
        }
    }
});

allPostIcon.addEventListener('click', () => {
    activeFeedRemover();
    activeFeedIconRemover();
    activeFeedTextRemover();

    allPostContainer.style.display = 'block';
    allPostIcon.classList.add('active-feed');
    allFeedText.style.transform = 'scaleY(1)';
});

videoPostIcon.addEventListener('click', () => {
    activeFeedIconRemover();
    activeFeedRemover();
    activeFeedTextRemover();

    videoPostContainer.style.display = 'block';
    videoPostIcon.classList.add('active-feed');
    videoFeedText.style.transform = 'scaleY(1)';
})

imagePostIcon.addEventListener('click', () => {
    activeFeedIconRemover();
    activeFeedRemover();
    activeFeedTextRemover();

    imagePostContainer.style.display = 'block';
    imagePostIcon.classList.add('active-feed');
    imageFeedText.style.transform = 'scaleY(1)';
})

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.assign('./login-page.html');
    })
};

const profileHtml = `
    <div class="profile-card">
                        <div class="pf-wallpaper-container">
                            <div class="pf-wallpaper-upload">
                                <input type="file" name="pf-wallpaper-input" id="pf-wallpaper-input" onchange="changePfWallpaper(event)">
                                <label for="pf-wallpaper-input">
                                    <ion-icon class="pf-wallpaper-upload-icon" name="arrow-up-circle-outline"></ion-icon>
                                </label>  
                                <div class="wallpaper-upload-percentage">0%</div>
                            </div>
                        </div>
                            
                        <div class="pf-img-container">
                            <div class="pf-img-card">
                                <img class="pf-img" src="images/profile.jpg" alt="profile-image">
                                <div class="pf-img-upload">
                                    <input type="file" name="pf-img-input" id="pf-img-input"
                                    onchange="changePfImage(event)">
                                    <label for="pf-img-input">
                                        <ion-icon class="pf-img-upload-icon" name="aperture-outline"></ion-icon>
                                    </label>
                                    <div class="pf-upload-percentage">0%</div>
                                </div>
                                
                            </div>
                        </div>
                        <div class="pf-username">
                            Danyyy
                        </div>
                    </div>    
`;

function genProfileHtml() {
    if(screen.width > 1300) {
        navProfileContent.innerHTML = '';
    } else if(window.screen.width < 1300) {
        navProfileContent.innerHTML = profileHtml;
    }
}

genProfileHtml();

navMsgerIcon.addEventListener('click', () => {
    activeIconRemover();
    navProfileContent.style.transform = 'scaleY(0)';
    settingContent.style.transform = 'scaleY(0)';
    uploadContent.style.transform = 'scaleY(0)';
    
    if(navMsgerContent.style.transform !== 'scaleY(1)') {
        navMsgerContent.style.transform = 'scaleY(1)'
        navMsgerIcon.classList.add('active-nav-icon');
    } else {
        navMsgerContent.style.transform = 'scaleY(0)'
        navMsgerIcon.classList.remove('active-nav-icon');
    };
});

function clearPopUp() {
    navMsgerContent.style.transform = 'scaleY(0)';
    navProfileContent.style.transform = 'scaleY(0)';
    settingContent.style.transform = 'scaleY(0)';
    uploadContent.style.transform = 'scaleY(0)';
}

/*function sec3IconOrg() {
    profileIcon.style.backgroundColor = 'black';
    profileIcon.style.color = 'white';
    navMsgerIcon.style.backgroundColor = 'black';
    navMsgerIcon.style.color = 'white';
    settingIcon.style.color = 'white';
    settingIcon.style.backgroundColor = 'black';
}*/

const root = document.querySelector(':root');
const bWTheme = document.querySelector('.b-w-theme');
const retroTheme = document.querySelector('.retro-theme');
const energyTheme = document.querySelector('.energy-theme');

let black = localStorage.getItem('black') || '#000000';
let yellow = localStorage.getItem('yellow') || '#ffc567';
let pink = localStorage.getItem('pink') || '#fb7da8';
let orange = localStorage.getItem('orange') || '#fd5a46';
let purple = localStorage.getItem('purple') || '#552cb7';
let green = localStorage.getItem('green') || '#00995e';
let blue = localStorage.getItem('blue') || '#058cd7';
let hoOrange = localStorage.getItem('hoOrange') || '#fd5a46';
let hoPurple = localStorage.getItem('hoPurple') || '#552cb7';
let hoWhite = localStorage.getItem('hoWhite') || '#ffffff';
let boWhite = localStorage.getItem('boWhite') || '#ffffff';
let boBlack = localStorage.getItem('boBlack') || '#000000';


function genColor() {
    root.style.setProperty('--black', black);
    root.style.setProperty('--yellow', yellow);
    root.style.setProperty('--pink', pink);
    root.style.setProperty('--orange', orange);
    root.style.setProperty('--purple', purple);
    root.style.setProperty('--green', green);
    root.style.setProperty('--blue', blue);
    root.style.setProperty('--ho-orange', hoOrange);
    root.style.setProperty('--ho-purple', hoPurple);
    root.style.setProperty('--ho-white', hoWhite);
    root.style.setProperty('--bo-white', boWhite);
    root.style.setProperty('--bo-black', boBlack);
}

genColor();

bWTheme.addEventListener('click', () => {
    localStorage.setItem('black', '#FFFFFF');
    localStorage.setItem('yellow', '#000000');
    localStorage.setItem('pink', '#000000');
    localStorage.setItem('orange', '#000000');
    localStorage.setItem('purple', '#000000');
    localStorage.setItem('green', '#000000');
    localStorage.setItem('blue', '#000000');
    localStorage.setItem('hoOrange', '#ffffff');
    localStorage.setItem('hoPurple', '#ffffff');
    localStorage.setItem('hoWhite', '#000000');
    localStorage.setItem('boWhite', '#ffffff');
    localStorage.setItem('boBlack', '#ffffff');
    genColor();
    location.reload();
    bWTheme.classList.add('active-theme');
    retroTheme.classList.remove('active-theme');
});

retroTheme.addEventListener('click', () => {
    localStorage.setItem('black', '#000000');
    localStorage.setItem('yellow', '#ffc567');
    localStorage.setItem('pink', '#fb7da8');
    localStorage.setItem('orange', '#fd5a46');
    localStorage.setItem('purple', '#552cb7');
    localStorage.setItem('green', '#00995e');
    localStorage.setItem('blue', '#058cd7');
    localStorage.setItem('hoOrange', '#fd5a46');
    localStorage.setItem('hoPurple', '#552cb7');
    localStorage.setItem('hoWhite', '#ffffff');
    localStorage.setItem('boWhite', '#ffffff');
    localStorage.setItem('boBlack', '#000000');
    genColor();
    location.reload();
    retroTheme.classList.add('active-theme');
    bWTheme.classList.remove('active-theme');
});

energyTheme.addEventListener('click', () => {
    localStorage.setItem('black', '#000000');
    localStorage.setItem('yellow', '#e6e1dd');
    localStorage.setItem('pink', '#efe1A0');
    localStorage.setItem('orange', '#e2f3fd');
    localStorage.setItem('purple', '#304f6d');
    localStorage.setItem('green', '#e07d54');
    localStorage.setItem('blue', '#899481');
    localStorage.setItem('hoOrange', '#e2f3fd');
    localStorage.setItem('hoPurple', '#899481');
    localStorage.setItem('hoWhite', '#ffffff');
    localStorage.setItem('boWhite', '#000000');
    localStorage.setItem('boBlack', '#000000');
    genColor();
    location.reload();
    retroTheme.classList.add('active-theme');
    bWTheme.classList.remove('active-theme');
});

