
let imageUid;
let imageAllUsers = [];
let imageFileType;

firebase.firestore().collection('posts').orderBy('timestamp', 'desc').onSnapshot((result) => {
    mainLoadingText.style.display = 'none';
    let allPosts = [];

    if (result.size === 0) {
        mainLoadingText.style.display = 'block';
    } else {
        imagePostContainer.innerHTML = '';

        result.forEach((post) => {
            if(post.data().fileType === 'image/jpeg') {
                allPosts.push(post.data());
            }
        });


        for(let i=0; i < allPosts.length; i++) {
            let likeArray = allPosts[i].like || [];
            let dislikeArray = allPosts[i].dislike || [];
            let commentArray = allPosts[i].comment || [];


            postMain = document.createElement('div');
            imagePostContainer.appendChild(postMain);
            postMain.setAttribute('class', 'post-main');

            let postHeader = document.createElement('div');
            postMain.appendChild(postHeader);
            postHeader.setAttribute('class', 'post-header');

            firebase.firestore().collection('users/').doc(allPosts[i].uid).get().then((res) => {
                const userData = res.data();

                // Create user container
                let userProDev = document.createElement('div');
                userProDev.classList.add('user-pro-dev');

                // Create and set up profile image
                let userProfileImg = document.createElement('img');
                userProfileImg.classList.add('profile-img');
                userProfileImg.setAttribute('src', userData.profilePic || 'images/profile.jpg');

                // Create user information container
                let userDiv = document.createElement('div');
                
                // Create and set up user name
                let userName = document.createElement('h6');
                userName.innerHTML = userData.username;
                userName.classList.add('post-username');

                let date = document.createElement('h6');
                date.innerHTML = `${allPosts[i].date}`
                date.classList.add('post-date');

                let postDetail = document.createElement('p');
                postDetail.innerHTML = allPosts[i].postText;
                postDetail.classList.add('post-detail');

                // Append elements to the DOM
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

                /*
                dislikeButton.addEventListener('click', () => {
                    const isDisliked = dislikeArray.includes(mainUid);

                    if (isDisliked) {
                        dislikeArray = dislikeArray.filter(userId => userId !== mainUid);
                    } else {
                        dislikeArray.push(mainUid);
                    }

                    firebase.firestore().collection('posts').doc(allPosts[i].id).update({
                        dislike: dislikeArray,
                    }).then(() => {
                        
                        dislikeCount.innerHTML = `${dislikeArray.length}`;
                    }).catch(error => {
                        console.error('Error updating like:', error);
                    });
                });
                */

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