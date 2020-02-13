const User = require('../models/User');

module.exports = {
    async store(req, res){
        const { logged } = req.headers;
        const { targetId } = req.params;

        const loggedUser = await User.findById(logged);
        const targetUser = await User.findById(targetId);

        if (!targetUser){
            return res.status(400).json({ error: 'User does not exist' });
        }

        if(targetUser.likes.includes(loggedUser._id)){
            const loggedSocket = req.connectedUsers[logged];
            const targetSocket = req.connectedUsers[targetId];

            if(loggedSocket){
                req.io.to(loggedSocket).emit('match', targetUser);
            }

            if(targetSocket){
                req.io.to(targetSocket).emit('match', loggedUser);
            }
        }

        loggedUser.likes.push(targetUser._id);

        await loggedUser.save();

        return res.json(loggedUser);
    }
};