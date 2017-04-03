require('dotenv').config();
const scrapeIt = require("scrape-it");

const pool = require('./lib/pool');

var box = 33;

var bodyId = `threadbits_forum_${box}`;

var date = new Date();

function parseTime(time) {
    let dateText = time.split(" ")[0];
    let timeText = time.split(" ")[1].slice(0,5);

    date.setHours(timeText.split(":")[0]);
    date.setMinutes(timeText.split(":")[1]);
    date.setSeconds(0);
    if (dateText === "Yesterday") {
        date.setDate(date.getDay() -1);
    }
    return date;
}

function parseUrl(url) {
    return parseInt(url.split("t=")[1]);
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

scrapeIt(`https://vozforums.com/forumdisplay.php?f=${box}`, {
    // Fetch the articles
    threads: {
        listItem: `#${bodyId} > tr`
        , data: {

            // Get the title
            title: {
                selector: "td:nth-child(2) > div:first-child > a:last-of-type",
                convert: text => text ? text : 'error'
            }

            , id: {
                selector: "td:nth-child(2) > div:first-child > a:last-of-type",
                attr: "href",
                convert: url => parseUrl(url)
            }

            , source: {
                selector: "td:nth-child(2)",
                attr: "title"
            }

            , pages : {
                selector: "td:nth-child(2) div:first-child span.smallfont a:last-child",
                attr: "href",
                convert: pageUrl => pageUrl ? pageUrl.split("page=")[1] : 1
            }

            , user_name: "td:nth-child(2) div.smallfont span"

            , user_id: {
                selector: "td:nth-child(2) div.smallfont > span:last-child",
                attr: "onclick",
                convert: text => parseInt(text.split("u=")[1].split("\'")[0])
            }

            , lastUpdated: {
                selector: "td:nth-child(3) > div",
                convert: time => parseTime(time)
            }

        }
    }

}, (err, result) => {

    console.log(err || result);

    if (!isEmpty(result)) {
        result.threads.forEach(function(thread) {
            pool.query(`INSERT INTO threads (id, title, source, pages, user_name, user_id, last_updated) VALUES (${thread.id}, $token$${thread.title.replace('/', '')}$token$, '${thread.source}', '${thread.pages}', '${thread.user_name}', ${thread.user_id}, '${thread.lastUpdated.toISOString()}') ON CONFLICT (id) DO NOTHING`, function(err, res) {
              if (err) {
                return console.error('error running query', err);
            }
                console.log(res);
            });
        }); 
    }

});