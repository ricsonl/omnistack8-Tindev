const User = require('../models/User');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const phash = require('password-hash');

module.exports = {
    async index(req, res){
        const { logged } = req.headers;

        const loggedUser = await User.findById(logged);

        const users = await User.find({
            $and: [
                { _id: { $ne: logged } },
                { _id: { $nin: loggedUser.likes } },
                { _id: { $nin: loggedUser.dislikes } },
            ],
        });

        return res.json(users);
    },

    async store(req, res){
        
        const { username, password, name, bio } = req.body;
        
        if(username && password && name && bio && req.file){

            const { filename: avatar } = req.file;

            const userExists = await User.findOne({ username: username });

            if(userExists){
                return res.json({ message: 'Nome de usuário indisponível' });
            }

            const [file] = avatar.split('.');
            const fileName = `${file}.jpg`;

            await sharp(req.file.path)
                .resize({width: 500, height: 500})
                .jpeg({ quality: 80 })
                .toFile(
                    path.resolve(req.file.destination, 'resized', fileName)
                );

            fs.unlinkSync(req.file.path);

            const user = await User.create({
                username,
                password: phash.generate(password),
                name,
                bio,
                avatar: fileName,
            });
            
            return res.json(user);
        } return res.json({ message: 'Preencha todos os campos' });
    },
};