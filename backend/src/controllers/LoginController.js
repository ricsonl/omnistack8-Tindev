const User = require('../models/User');
const phash = require('password-hash');

module.exports = {
    async store(req, res) {
        const { username, password } = req.body;
        
        if(username && password){

            const userExists = await User.findOne({ username: username });

            if(userExists){

                const verif = phash.verify(password, userExists.password);

                if(verif){

                    return res.json(userExists);

                } return res.json({ message: 'Wrong password' });

            } return res.json({ message: 'This user does not exist' });
        }
        return res.json({ message: 'Please, fill in all fields' });
    },
};