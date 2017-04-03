const scrapeIt = require("scrape-it");

var id = 5948445;

scrapeIt(`https://vozforums.com/showthread.php?t=${id}`, {
    // Fetch the articles
    posts: {
        listItem: "#posts > div"
        , data: {

            postCount: {
                selector: "tr:first-child td div:first-child a:first-child",
                attr: "name",
                convert: text => parseInt(text)
            }

            , postId: {
                selector: "tr:first-child td div:first-child a:first-child",
                attr: "href",
                convert: url => parseInt(url.split("=")[1].split("&")[0])
            }

            , time: {
                selector: "tr:first-child td.thead div:nth-child(2)"
            }

            , userID: {
                selector: ".bigusername",
                attr: "href",
                convert: text => text.split("u=")[1]
            }

            , userName: {
                selector: ".bigusername"
            }

            , content: {
                selector: ".voz-post-message"
            }

        }
    }

}, (err, page) => {
    console.log(err || page);
});

insert();