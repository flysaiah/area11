const mongoose = require("mongoose");
const Anime = require('../models/anime.js');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { processAnime } = require("../utils/processAnime.js");
require("dotenv").config();

puppeteer.use(StealthPlugin())

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };

const updateAnime = async () => {
    Anime.find({}, async (err, animeList) => {
        if (err) {
            mongoose.disconnect();
            console.log("--FAILURE--")
            console.log(err);
        } else {
            let animeSet = new Set();
            let malIDSet = new Set();
            let fullAnimeList = [];

            console.log("Starting with enumerating.");

            // Enumerate
            for (let anime of animeList) {
                if (!malIDSet.has(anime.malID)) {
                    animeSet.add({name: anime.name, malID: anime.malID});
                    malIDSet.add(anime.malID);
                }

            }

            console.log("Finished enumerating " + animeSet.size + " anime out of " + animeList.length + " total. Moving to enriching.")

            let errorCount = 0;

            // Enrich
            for (let anime of animeSet) {

                await delay(20000);

                console.log("Current anime: " + anime.name);

                try {
                    await puppeteer.launch({ headless: 'new' }).then(async browser => {

                        const malURL = "https://myanimelist.net/anime/" + anime.malID;

                        const page = await browser.newPage();

                        await page.goto(malURL, {waitUntil: 'domcontentloaded', timeout: 0});
                        await page.setViewport({width: 1080, height: 1024});
                        
                        const html = await page.content();
                        await browser.close();
        
                        var tmp = processAnime(html, malURL, "placeholder", "placeholder", true);
                        var p = {
                            name: tmp.name,
                            description: tmp.description,
                            rating: tmp.rating,
                            thumbnail: tmp.thumbnail,
                            malID: tmp.malID,
                            genres: tmp.genres,
                            startDate: tmp.startDate,
                            endDate: tmp.endDate,
                            type: tmp.type,
                            englishTitle: tmp.englishTitle,
                            status: tmp.status,
                            runtime: tmp.runtime,
                            studios: tmp.studios,
                            ranking: tmp.ranking,
                            popularity: tmp.popularity
                        }
                        console.log(p);
                        fullAnimeList.push(p); 

                        console.log("Successfully processed anime.");
                    });
                } catch (e) {
                    errorCount += 1;
                    console.log("ERROR PROCESSING ANIME: " + anime.name);
                    console.log(e);
                    console.log("Continuing.");
                }
            }

            console.log("Finished enriching; encountered " + errorCount + " errors. Moving to updating.");

            let dbErrorCount = 0;

            // Update
            for (let anime of fullAnimeList) {
                Anime.updateMany({ malID: anime.malID }, { $set: anime }, ).then((data) => {
                    data.s
                }).catch((e) => {
                    dbErrorCount += 1;
                    console.log("--ERROR UPDATING--");
                    console.log(e);
                });
            }

            console.log("Finished updating. Error count: " + dbErrorCount);
        }
    });
}

mongoose.set("strictQuery", true);
mongoose
    .connect(
        process.env.MONGODB_CONNECTION_STRING,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            enableUtf8Validation: false
        }
    )
    .then(async () => {
        await updateAnime();
    })
    .catch((err) => console.log(err));
