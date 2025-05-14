const { database } = require("../config/mongodb");

class Follow {
    static collection() {
        return database.collection("follows")
    }

    static async follow(followingId, followerId) {
        
    }
}

module.exports = Follow;
