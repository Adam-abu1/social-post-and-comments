const generateDelayTime = () => Math.random() * 1500 + 100;

const getComments = () => new Promise((resolve) => setTimeout(() => {
    resolve(
        fetch('./data/comments.json')
            .then(response => response.json()))
}, generateDelayTime()));

const getPosts = () => new Promise((resolve) => setTimeout(() => {
    resolve(
        fetch('./data/posts.json')
            .then(response => response.json()))
}, generateDelayTime()));

const getUsers = () => new Promise((resolve) => setTimeout(() => {
    resolve(
        fetch('./data/users.json')
            .then(response => response.json()))
}, generateDelayTime()));

/**
 *  Pulls json data and from 3 separate sources and compiles and relates the necessary data to each other in a single object
 *  then returns them in a promise.
 *
 * @return {Promise<*>}
 */
async function compileData() {
    let users = await getUsers().then(response => {
        return response.data;
    });

    let posts = await getPosts().then(response => {
        return response.data;
    });

    let comments = await getComments().then(response => {
        return response.data;
    });

    return posts.map(post => {
        const filterComments = comments.filter(comment => {
            return comment.post_id === post.id
        });

        filterComments.forEach(comment => {
            comment['user'] = users.find(user => comment.user_id === user.id)['name'];
        });

        return {
            id: post['id'],
            content: post['body'],
            created_at: post['created_at'],
            user: users.find(user => {
                return post.user_id === user.id
            }),
            comments: filterComments
        }
    });
}

/**
 * Creates a Date object then takes the necessary data out and formats it according to wireframe
 *
 * @param timestamp
 * @return {string}
 */
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = date.getMonth();
    const day = date.getDay();
    const formattedDate =  date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) ;
    const formattedTime = date.getHours() + ':' + date.getMinutes();

    return formattedDate + ' ' + formattedTime;
}

/**
 * Pulls the data and creates the social media page with post and comments by dynamically building the html
 *
 * @return {Promise<void>}
 */
async function buildElements() {
    let posts = await compileData().then(response => {
        return response;
    });

    posts.forEach(post => {
        const postList = document.getElementById('postList');

        const postData = document.createElement('li'),
            userName = document.createElement('span'),
            postDate = document.createElement('span'),
            postContent = document.createElement('div');

        userName.innerText = post?.user?.name;
        userName.className = 'user-name'

        postDate.innerText = formatDate(post?.created_at);
        postDate.className = 'post-date';

        postContent.innerText = post.content;
        postContent.className = 'post-content';


        postData.className = 'post-data';
        postData.appendChild(userName);
        postData.appendChild(postDate);
        postData.appendChild(postContent);

        post['displayComments'] = true;
        // Check if comments exist then display the number of comments
        if (post.comments.length) {
            const commentsData = document.createElement('ul'),
                commentsDatum = document.createElement('li');

            const numOfReplies = `${post.comments.length}` + (post.comments.length > 1 ? ' replies' : ' reply')
            commentsDatum.innerText = `Show ${numOfReplies}`;
            commentsDatum.classList.add('show-comments');
            commentsData.classList.add(`post-${post.id}-comments`);
            commentsData.style.display = 'none';
            showComments(post);
            commentsDatum.addEventListener('click',function() {
                if (post['displayComments']) {
                    post['displayComments'] = false;
                    commentsData.style.display = 'block';
                    commentsDatum.innerText = `Hide ${numOfReplies}`;
                } else {
                    post['displayComments'] = true;
                    commentsData.style.display = 'none';
                    commentsDatum.innerText = `Show ${numOfReplies}`;
                }
            });

            postData.appendChild(commentsDatum);
            postData.appendChild(commentsData);
        }

        postList.appendChild(postData);
    });
}

async function showComments(post) {
    const showCommentsLink = await document.getElementsByClassName(`post-${post['id']}-comments`);

    post.comments.forEach(comment => {
        const commentDatum = document.createElement('li'),
            userName = document.createElement('span'),
            commentDate = document.createElement('span'),
            commentContent = document.createElement('div');

        userName.innerText = comment?.user;
        userName.className = 'commenter-name';

        commentDate.innerText = formatDate(comment?.created_at);
        commentDate.className = 'comment-date';

        commentContent.innerText = comment.body;
        commentContent.className = 'comment-content';

        commentDatum.className = 'comment-datum';
        commentDatum.appendChild(userName);
        commentDatum.appendChild(commentDate);
        commentDatum.appendChild(commentContent);

        showCommentsLink[0].appendChild(commentDatum);
    });
}

buildElements();
