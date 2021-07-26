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
    const formattedDate =  date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
    const formattedTime = date.getHours() + ':' + date.getMinutes();

    return formattedDate + ' ' + formattedTime;
}

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

        // Check if comments exist then display the number of comments
        if (post.comments.length) {
            const commentsData = document.createElement('ul'),
                commentsDatum = document.createElement('li');

            commentsDatum.innerText = `Show ${post.comments.length}` + (post.comments.length > 1 ? ' replies' : ' reply');
            commentsDatum.classList.add('show-comments');
            commentsData.classList.add(`post-${post.id}-comments`);
            commentsDatum.addEventListener('click',function() {
                commentsDatum.innerText = `Hide ${post.comments.length}` + (post.comments.length > 1 ? ' replies' : ' reply');
                commentsDatum.addEventListener('click',function() {
                    hideComments(post)
                });
                showComments(post);
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

function buildSocialPost() {

}

buildElements();
