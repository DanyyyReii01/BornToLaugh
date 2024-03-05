let nowUsername;
const navChatContainer = document.querySelector('.nav-chat-container');
const navChatText = document.querySelector('.nav-chat-text');
const navFriUsers = document.querySelector('.nav-friends-users');



function resMessenger() {
    if(screen.width < 1300) {
        navChatContainer.classList.add('chat-container');
        navChatText.classList.add('open-chat-text');
        navFriUsers.classList.add('friends-users');
    } else {
        navChatContainer.classList.remove('chat-container');
        navChatText.classList.remove('open-chat-text');
        navFriUsers.classList.remove('friends-users');
    }
}

resMessenger();

const openChatText = document.querySelector('.open-chat-text');

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        if(user.emailVerified) {

            firebase.firestore().collection('users').onSnapshot((users) => {
                var userDiv = document.querySelector('.friends-users');

                users.forEach((userDetail) => {
                    if(userDetail.data().uid === mainUid){
                        nowUsername = userDetail.data().username;
                    }
                    else if(userDetail.data().uid !== mainUid) {
                        var username = userDetail.data().username;
                        var userDetails = document.createElement('div');
                        userDetails.classList.add('friends-user-details');
                        userDiv.appendChild(userDetails);

                        var userHeaderDiv = document.createElement('div');
                        userHeaderDiv.classList.add('friends-user-header-div');
                        userDetails.appendChild(userHeaderDiv);

                        var userImgDiv = document.createElement('div');
                        userImgDiv.classList.add('friends-user-img-div');
                        userHeaderDiv.appendChild(userImgDiv);

                        var userImg = document.createElement('img');
                        userImg.setAttribute('src', 'images/profile.jpg');
                        userImg.classList.add('friends-user-img');
                        userImgDiv.appendChild(userImg);

                        if(userDetail.data().profilePic !== '') {
                            userImg.setAttribute('src', userDetail.data().profilePic);
                        }

                        var userData = document.createElement('div');
                        userData.classList.add('friends-user-data-div');
                        userHeaderDiv.appendChild(userData);

                        var userName = document.createElement('p');
                        userName.classList.add('friends-user-name');
                        userName.innerHTML = username;
                        userData.appendChild(userName);

                        var signUpDate = document.createElement('p');
                        signUpDate.classList.add('friends-signup-date');
                        signUpDate.innerHTML = userDetail.data().signUpDate;
                        userData.appendChild(signUpDate);

                        var dropDown = document.createElement('div');
                        dropDown.classList.add('friends-dropdown');
                        userDetails.appendChild(dropDown);

                        var dropDownShow = document.createElement('ion-icon');
                        dropDownShow.classList.add('friends-dropdown-show');
                        dropDownShow.setAttribute('name', 'caret-down-outline');
                        dropDown.appendChild(dropDownShow);

                        var dropDownHide = document.createElement('ion-icon');
                        dropDownHide.classList.add('friends-dropdown-hide');
                        dropDownHide.setAttribute('name', 'caret-up-outline');
                        dropDown.appendChild(dropDownHide);

                        var userPfDiv = document.createElement('div');
                        userPfDiv.classList.add('friends-user-pf-div');
                        userPfDiv.style.marginBottom = '5px';
                        userDetails.appendChild(userPfDiv);

                        var userPfImgDiv = document.createElement('div');
                        userPfImgDiv.classList.add('user-pf-img-div');
                        userPfDiv.appendChild(userPfImgDiv);

                        //var userCoverImgDiv = document.createElement('div');
                        //userCoverImgDiv.classList.add('user-cover-img-div');
                        //userPfDiv.appendChild(userCoverImgDiv);

                        //var userCoverImg = document.createElement('img');
                        //userCoverImg.classList.add('friends-user-cover-img');
                        //userCoverImgDiv.appendChild(userCoverImg);
                        //userCoverImg.setAttribute('src', 'images/cover-img.jpg');

                        userPfDiv.style.backgroundImage = `url(images/cover-img.jpg)`;
                        userPfDiv.style.backgroundPosition = 'center center';
                        userPfDiv.style.backgroundSize = 'cover';

                        if(userDetail.data().coverPic !== '') {
                            userPfDiv.style.backgroundImage = `url(${userDetail.data().coverPic})`
                        }

                        var userPfImg = document.createElement('img');
                        userPfImgDiv.appendChild(userPfImg);
                        userPfImg.classList.add('friends-user-pf-img');
                        userPfImg.setAttribute('src', 'images/profile.jpg');
                        
                        if(userDetail.data().profilePic) {
                            userPfImg.setAttribute('src', userDetail.data().profilePic);
                        };

                        var usernameDetail = document.createElement('p');
                        userPfDiv.appendChild(usernameDetail);
                        usernameDetail.classList.add('friends-user-pf-name');
                        usernameDetail.innerHTML = username;

                        dropDownShow.addEventListener('click', () => {
                            dropDownHide.style.display = 'block';
                            dropDownShow.style.display = 'none';
                            userPfDiv.style.transform = `scaleY(1)`;
                        })

                        dropDownHide.addEventListener('click', () => {
                            dropDownShow.style.display = 'block';
                            dropDownHide.style.display = 'none';
                            userPfDiv.style.transform = `scaleY(0)`;
                        })

                        var chatButton = createChatButton(userDetail, userPfDiv);
                        userDetails.appendChild(chatButton);
                        chatButton.classList.add("friends-chat-button");

                        chatButton.addEventListener('click', () => {
                            const otherUser = userDetail;
                            openChatText.style.display = 'none';
                            chatContainer.style.display = 'block';
                            initiateChat(otherUser);
                        });
                    }
                })
            })
        } else {
            window.location.assign('email-verification.html');
        }
    } else {
        window.location.assign('login-page.html');
    }
})

const chatContainer = document.querySelector('.chat-container');


function createChatButton(userDetail, userPfDiv) {
    const chatButton = document.createElement('button');
    chatButton.innerText = 'Chat';
    chatButton.classList.add('chat-button');

    return chatButton;
}

function initiateChat(otherUser) {
    const chatRef = getChatRef(otherUser.data().uid);
    chatContainer.innerHTML = ''; // Clear previous chat content
    chatRef.on('child_added', (snapshot) => {
        const messageData = snapshot.val();
        displayMessage(messageData);
    });
    displayChatInput(otherUser, chatRef);
}

function displayMessage(messageData) {
    const existingMessages = chatContainer.getElementsByClassName('message-text');
    const isMessageAlreadyDisplayed = Array.from(existingMessages).some((messageDiv) => {
        return messageDiv.innerText === `${messageData.senderName || 'Unknown User'} : ${messageData.message}`;
    });

    if (!isMessageAlreadyDisplayed) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-text');
        messageDiv.innerText = `${messageData.senderName || 'Unknown User'} : ${messageData.message}`;
        chatContainer.appendChild(messageDiv);
    }
}

function displayChatInput(otherUser, chatRef) {
    const chatInput = document.createElement('input');
    chatInput.classList.add('message-input');
    chatInput.setAttribute('placeholder', `Message ${otherUser.data().username || 'Unknown User'}`);

    const sendButton = document.createElement('button');
    sendButton.classList.add('message-send-btn');
    sendButton.innerText = 'Send';
    sendButton.addEventListener('click', async () => {
        const senderName = await nowUsername || 'Unknown User';
        sendMessage(chatInput.value, senderName, chatRef);
        chatInput.value = '';
    });

    // Add keypress event for Enter key
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click(); // Trigger the send button click event
        }
    });

    chatContainer.appendChild(chatInput);
    chatContainer.appendChild(sendButton);
}

function sendMessage(message, senderName, chatRef) {
    if(message.trim() !== '') {
        chatRef.push({
            message,
            senderName,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
        });
    }
}

function getChatRef(otherUserUid) {
    const currentUid = firebase.auth().currentUser.uid;
    const chatRoomId = determineChatRoomId(currentUid, otherUserUid);
    return firebase.database().ref(`chats/${chatRoomId}`);
}

function determineChatRoomId(uid1, uid2) {
    const sortedUids = [uid1, uid2].sort();
    return `${sortedUids[0]}_${sortedUids[1]}`;
}
