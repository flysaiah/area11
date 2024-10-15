const Anime = require('../models/anime.js');
const User = require('../models/user.js');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { processAnime } = require('../utils/processAnime.js');
puppeteer.use(StealthPlugin())

module.exports = (router) => {
    router.get('/fetchAnime', (req, res) => {

        Anime.find({ user: req.decoded.username }, (err, animeList) => {
            if (err) {
                console.log(err);
                res.json({ success: false, message: "Error finding user.", data: err });
            } else {
                res.json({ success: true, data: { animeList: animeList } });
            }
        });
    });

    router.post('/updateAnime', (req, res) => {
        Anime.findOneAndUpdate({ _id: req.body.id }, { category: req.body.category, recommenders: req.body.recommenders }, (err, anime) => {
            if (err) {
                console.log(err);
                res.json({ success: false, message: "Error finding anime.", data: err });
            } else {
                res.json({ success: true });
            }
        });
    });

    router.post('/deleteAnime', (req, res) => {
        if (!req.body?.id) {
            res.json({ success: false, message: "No ID in request"});
            return;
        }

        Anime.findOneAndDelete({ _id: req.body.id }, (err, anime) => {
            if (err) {
                res.json({ success: false, message: "Error finding anime.", data: err });
            } else if (!anime) {
                res.json({ success: false, message: "Anime already deleted." });
            }
            else {
                res.json({ success: true, message: "Successfully deleted anime!"});
            }
        });
    });

    router.post('/addAnime', async (req, res) => {
        
        await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] }).then(async browser => {

            const page = await browser.newPage();

            try {
                await page.goto(req.body.malUrl, {waitUntil: 'domcontentloaded', timeout: 0});
                await page.setViewport({width: 1080, height: 1024});
                
                const html = await page.content();
                await browser.close();

                let newAnime = processAnime(html, req.body.malUrl, req.decoded.username, req.body.category);

                User.findOne({ "username": req.decoded.username }, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.json({ success: false, message: "Error finding user.", data: err });
                    } else if (!user) {
                        res.json({ success: false, message: "User doesn't exist" })
                    } else {

                        // Make sure user hasn't already added this

                        Anime.findOne({"user": req.decoded.username, "malID": newAnime.malID}, (err, anime) => {
                            if (err) {
                                console.log(err);
                                res.json({ success: false, message: "Error when searching for whether anime was already added.", data: err });
                            } else if (anime) {
                                res.json({ success: false, message: "Area11Error.Conflict - Anime has already been added." })
                            } else {
                                newAnime.save((err) => {
                                    if (err) {
                                        console.log(err);
                                        res.json({ success: false, message: err });
                                    } else {
                                        res.json({ success: true, message: 'Anime added to catalog!' });
                                    }
                                });
                            }
                        })
                    }
                });

            } catch (e) {
                console.log("ERROR -- see below");
                console.log(e);

                res.json({ success: false, message: "Error adding anime.", data: e });
            }
        });

        
    });

    return router;
}
