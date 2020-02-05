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

        return res.json({ ok: true });
    }
};