const Anime = require('../models/anime.js');

module.exports = (router) => {

    // TODO: reinclude original routes
    router.post('/fetchAnime', (req, res) => {
        // Fetches all anime in the database associated with the current user

        var username = "flysaiah";

        Anime.find({ user: username}, (err, animeList) => {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            res.json({ success: true, animeList: animeList})
          }
        });
      });
  
  return router;
}
