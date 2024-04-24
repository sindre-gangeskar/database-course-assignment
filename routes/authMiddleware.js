module.exports = {
    isAuthorized: function (req, res, next) {
        if (req.user) {
            next();
            return;
        }
        else {
            const message = 'Login required';
            res.status(401).send(message);
            console.log(message)
        }
    },

    isAdmin: function (req, res, next) {
        if (req.user.Role === 'Admin') {
            next();
            return;
        }
        else {
            const message = 'Admin privileges required';
            console.error(message);
            res.status(401).send(message);
        }
    },

    isMember: function (req, res, next) {
        if (req.user.Role == 'Member') {
            next();
            return;
        }
        else {
            const message = 'Only member accounts are permitted';
            res.status(401).send(message)
            console.error(message);
        }
    }
}