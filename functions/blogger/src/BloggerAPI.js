const axios = require('axios');
const querystring = require('querystring');

//constantly constant
const VERSION = 'v3';
const bloggerURL = `https://www.googleapis.com/blogger/${VERSION}`;
const BLOGS = 'blogs';
const USERS = 'users';
const POSTS = 'posts';
const PAGES = 'pages';
const SELF = 'self';
const COMMENTS = 'comments';

module.exports = class BloggerAPI {
    constructor(id, key) {
        this.id = id;
        this.key = key;
        this.keyParam = `key=${this.key}`;
    }

    get blogsEndpoint() {
        return `${bloggerURL}/${BLOGS}/${this.id}`;
    }

    get usersEndpoint() {
        return `${bloggerURL}/${USERS}`;
    }

    get postsEndpoint() {
        return `${this.blogsEndpoint}/${POSTS}`;
    }

    get pagesEndpoint() {
        return `${this.blogsEndpoint}/${PAGES}`;
    }

    appendKey(endpoint) {
        return `${endpoint}?${this.keyParam}`;
    }

    get(endpoint, params = null) {
        let paramStr = (params == null) ? '' : querystring.stringify(params);
        return axios.get(this.appendKey(endpoint) + '&' + paramStr);
    }

    getUser(userID) {
        return this.get(`${this.usersEndpoint}/${userID}`);
    }

    getUserBlogs(userID) {
        return this.get(`${this.usersEndpoint}/${userID}/${BLOGS}`);
    }

    getMyUser() {
        return this.get(`${this.usersEndpoint}/${SELF}`);
    }

    getMyBlogs() {
        return this.get(`${this.usersEndpoint}/${SELF}/${BLOGS}`);
    }

    /**
     * Retrieves the Blog object
     *
     * @see https://developers.google.com/blogger/docs/3.0/reference/blogs/get
     * @return Blog
     */
    getBlog() {
        return this.get(this.blogsEndpoint);
    }

    getPosts(params = null) {
        return this.get(this.postsEndpoint,params);
    }

    getPost(postID) {
        return this.get(`${this.postsEndpoint}/${postID}`);
    }

    getPostComments(postID) {
        return this.get(`${this.postsEndpoint}/${postID}/${COMMENTS}`);
    }

    getPostComment(postID,commentID) {
        return this.get(`${this.postsEndpoint}/${postID}/${COMMENTS}/${commentID}`);
    }

    getPages(params = null) {
        return this.get(this.pagesEndpoint,params);
    }

    getPage(id) {
        return this.get(`${this.pagesEndpoint}/${id}`);
    }
}

