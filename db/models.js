// import uuid from 'uuid/v4';
const uuid = require('uuid/v4');
exports.User = class User {
    constructor(config) {
        this.id = config.id || config.uid || uuid();
        this.name = config.displayName || config.name;
        this.profilePicture =
            config.profilePicture || config.photoURL || '/static/assets/users/1.jpeg';
    }
}

exports.Post = class Post {
    constructor(config) {
        this.id = config.id || uuid();
        this.comments = config.comments || [];
        this.content = config.content || null;
        this.date = config.date || new Date().getTime();
        this.image = config.image || null;
        this.likes = config.likes || [];
        this.link = config.link || null;
        this.location = config.location || null;
        this.userId = config.userId;
    }
}

exports.Like = class Like {
    constructor(config) {
        this.id = config.id || uuid();
        this.postId = config.postId;
        this.userId = config.userId;
    }
}

exports.Comment = class Comment {
    constructor(config) {
        this.id = config.id || uuid();
        this.content = config.content || null;
        this.date = config.date || new Date().getTime();
        this.userId = config.userId;
        this.postId = config.postId;
    }
}
