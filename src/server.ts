import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import isUrl from 'is-url';

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });

    // GET /filteredimage?image_url={{URL}}
    app.get("/filteredimage", async (req, res) => {
        // get URL image
        var imageUrl = req.query.image_url;
        // validate Image
        if (isUrl(imageUrl)) {
            // call filterImageFromURL
            try {
                var filterdImage = await filterImageFromURL(imageUrl);
                // send file for user
                res.sendFile(filterdImage, function (err) {
                    // delete file
                    if (!err) {
                        deleteLocalFiles([filterdImage]);

                    }
                });
            } catch (e) {
                res.send('image_url not found')
            }
        } else {
            res.send('image_url invalid')
        }
    });

    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();