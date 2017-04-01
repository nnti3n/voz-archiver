const scrapeIt = require("scrape-it");

var box = 33;

var bodyId = `threadbits_forum_${box}`;

var date = new Date();

var parseTime = function (time) {
    let dateText = time.split(" ")[0];
    let timeText = time.split(" ")[1].slice(0,5);

    date.setHours(timeText.split(":")[0]);
    date.setMinutes(timeText.split(":")[1]);
    date.setSeconds(0);
    date.setSecond
    if (dateText === "Yesterday") {
        date.setDate(date.getDay() -1);
    }
    return date;
}

scrapeIt(`https://vozforums.com/forumdisplay.php?f=${box}`, {
    // Fetch the articles
    showthreads: {
        listItem: `#${bodyId} > tr`
        , data: {

            // Get the title
            title: {
                selector: "td:nth-child(2) > div:first-child > a:last-of-type",
                convert: text => text ? text : 'error'
            }

            , id: {
                selector: "td:nth-child(2) > div:first-child a:last-child",
                attr: "href",
                convert: url => parseInt(url.split("t=")[1].split("&")[0])
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

            , user: "td:nth-child(2) div.smallfont span"

            , lastUpdated: {
                selector: "td:nth-child(3) > div",
                convert: time => parseTime(time)
            }

        }
    }

}, (err, page) => {
    console.log(err || page);
});