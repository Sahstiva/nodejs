exports.getChat = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/auth/login/')
    } else {
        res.render('chat', {});
    }
}
