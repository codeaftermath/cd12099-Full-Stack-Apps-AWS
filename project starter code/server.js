import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";
import { router as authRoutes } from './routes/authRoutes.js';
import { requiresAuth } from './middleware/requiresAuthMiddleware.js'

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.use("/auth", authRoutes);

app.get("/filteredimage", requiresAuth(), (req, res) => {
  let resource_url;

  try {
    // parse and validate image_url
    const image_url = new URL(req.query.image_url);
    resource_url = image_url.href;
  } catch (err) {
    console.error(err);
    res.status(400).send(`Invalid image_url {${req.query.image_url}}`);
  }

  // check file extension of image_url target resource
  const ext = resource_url.split(".").pop();
  if (["png", "jpg"].findIndex((el) => el === ext.trim()) == -1) {
    console.error(`Target resource does not contain correct file extension {${ext}}`)
    res.status(400).send(`Invalid image file extension ${ext}`);
    return;
  }

  filterImageFromURL(resource_url)
    .then((outpath) => {
      console.log(`Sending filtered image at {${outpath}}`)
      res.sendFile(outpath, () => {
        console.log(`Deleting image file at {${outpath}}`)
        deleteLocalFiles([outpath]);
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(404)
        .send(`Unable to retreive image at image_url {${resource_url}}`);
    });
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
