const Anime = require('../models/anime.js');

module.exports = (router) => {

    router.post('/fetchAnime', (req, res) => {
        Anime.find({ user: req.body.username }, (err, animeList) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                res.json({ success: true, animeList: animeList })
            }
        });
    });

    return router;
}
