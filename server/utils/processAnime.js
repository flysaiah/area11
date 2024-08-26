const Anime = require('../models/anime.js');

const processAnime = (html, malUrl, username, category) => {

    if (!html || !malUrl || !username || !category) {
        throw "Missing input";
    }

    // Description
    const description = html.split('itemprop="description">')[1].split("</p>")[0];

    // Rating
    let rating;
    let r = html.split('itemprop="ratingValue"');
    if (r.length > 1) {
    rating = r[1].split(">")[1].split("<")[0].trim();
    }

    // Thumbnail
    const thumbnail = html.split('property="og:image" content="')[1].split('">')[0].trim();

    // Genres
    let genreArr = [];
    let genresIdentifier = "Genres:";

    if (html.indexOf(genresIdentifier) == -1) {
        genresIdentifier = "Genre:";
    }
    
    if (html.indexOf(genresIdentifier) != -1) {
        const foo = html.split(genresIdentifier)[1].split("</div>")[0].replace(/["]+/g, '').split("title=");
        for (let i=1; i<foo.length; i++) {
        let tmp = foo[i];
        genreArr.push(tmp.split("<a")[0].split(">")[0]);
        }
    } else {
        genreArr.push("No Genres");
    }
    
    // Start Date, End Date and Runtime
    let runtime = "";
    const airing = html.split('class="dark_text">Aired:</span>')[1].split('</div>')[0].trim();
    let startDate = "Unknown";
    let endDate = "Unknown";

    if (airing.split(" to ").length > 1) {
        let start = new Date(airing.split(" to ")[0]);
        let end = new Date(airing.split(" to ")[1]);

        if (start.toLocaleDateString() == "Invalid Date") {
            startDate = airing.split(" to ")[0];
        } else {
            startDate = start.toLocaleDateString();
        }

        if (end.toLocaleDateString() == "Invalid Date") {
            endDate = airing.split(" to ")[1];
        } else {
            endDate = end.toLocaleDateString();
        }
    } else {
        let start = new Date(airing);
        if (start.toLocaleDateString() == "Invalid Date") {
            startDate = airing;
        } else {
            startDate = start.toLocaleDateString();
        }
        endDate = "OneAiredDate";
        try {
            runtime = html.split('class="dark_text">Duration:</span>')[1].split('</div>')[0].trim();
        } catch (err) {
            console.log("Could not get runtime.");
        }
    }
    // Type
    const type = html.split('class="dark_text">Type:</span>')[1].split('</a></div>')[0].split(">")[1].split("<")[0].trim();

    // English Title
    let englishTitle = "Unknown";
    let et = html.split('English:</span>');
    if (et.length > 1) {
        englishTitle = et[1].split('</div>')[0].trim();
    }

    // Status, name, studios, MAL ID
    const status = html.split('class="dark_text">Status:</span>')[1].split('</div>')[0].trim();
    const name = html.split('class="title-name h1_bold_none"><strong>')[1].split('<')[0].trim();
    const studios = html.split('class="dark_text">Studios:</span>')[1].split('</a>')[0].split('>')[1].trim();
    const malID = malUrl.split("/anime/")[1].split("/")[0];

    // Ranking
    let ranking = html.split('class="dark_text">Ranked:</span>')[1].split('<sup>')[0].trim().replace("#", "");
    if (isNaN(ranking)) {
        ranking = null;
    }

    // Popularity
    let popularity = html.split('class="dark_text">Popularity:</span>')[1].split('</div>')[0].trim().replace("#", "");
    if (isNaN(popularity)) {
        popularity = null;
    }

    return new Anime({
        user: username,
        name: name,
        description: description,
        rating: rating,
        thumbnail: thumbnail,
        malID: malID,
        category: category,
        isFinalist: false,
        genres: genreArr,
        startDate: startDate,
        endDate: endDate,
        type: type,
        englishTitle: englishTitle,
        status: status,
        runtime: runtime,
        studios: studios,
        ranking: ranking,
        popularity: popularity
    });
}

module.exports = { processAnime };