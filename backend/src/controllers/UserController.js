const axios = require('axios');
const User = require('../models/User');

module.exports = {
    async store(req, res){
        const { username } = req.body;

        const userExists = await User.findOne({ gitUser: username });

        if(userExists){
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url } = response.data;

        const user = await User.create({
            name,
            gitUser: username,
            bio,
            avatar: avatar_url
        });
        
        return res.json(user);
    } 
};