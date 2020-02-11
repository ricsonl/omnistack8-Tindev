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
                } return res.json({ message: 'Senha incorreta' });

            } return res.json({ message: 'Nome de usuário inexistente' });
        }
        return res.json({ message: 'Preencha todos os campos' });
    },
};