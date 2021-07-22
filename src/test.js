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

    const names = []

    names.push(users.map(user => {
        const result = {};
        const userName = user['name'];

        user[userName] = {
            post: posts.filter(post => {
                return post.user_id === user.id
            }),
            comments: comments.filter(comment => {
                return comment.user_id === user.id
            })
        };

        result[userName] = user[userName];

        return result;
    }));

    return names
}

compileData().then(response => {
    console.log(response)
})

