const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mogpxeu.mongodb.net/?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // connecting to mongodb
        client.connect();
        console.log("Mongodb Connected successfully");

        const DestinationCollection = client.db("Air-BnB").collection("destinations");


        // Routes
        app.get("/destination/find", async (req, res) => {
            const {
                location,
                subCategory,
                type,
                propertyType,
                capacity,
                bedRoom,
                bed,
                bathRoom,
                minPrice,
                maxPrice,
                availabilityStart
            } = req.query;

            let filter = {};

            if (location) {
                const locationRegex = new RegExp(location, 'i');
                filter.location = locationRegex;
            }
            if (subCategory) filter.subCategory = subCategory;
            if (type) filter.type = type;
            if (propertyType) filter.propertyType = propertyType;
            if (bedRoom) filter.bedRoom = parseInt(bedRoom);
            if (bed) filter.bed = parseInt(bed);
            if (bathRoom) filter.bathRoom = parseInt(bathRoom);
            if (maxPrice) {
                filter.price = {
                    $lte: parseInt(maxPrice)
                }
            }
            if (capacity) {
                filter.capacity = {
                    $gt: parseInt(capacity)
                }
            }
            if (availabilityStart) {
                const availabilityRegex = new RegExp(availabilityStart, 'i');
                filter.availabilityStart = availabilityRegex;
            }



            const destinations = await DestinationCollection.find(filter).toArray();
            const count = destinations.length;
            res.send({ destinations: destinations.slice(0, 20), count });
        });

        // app.get("/update", async (req, res) => {
        //     const filter = {
        //         price: {
        //             $gt: 1000
        //         }
        //     }
        //     const updatedDocument = {
        //         $set: {
        //             price: 650
        //         }
        //     }
        //     const options = { upsert: true };

        //     const result = await DestinationCollection.updateMany(filter, updatedDocument, options);
        //     res.send(result);
        // })

    } catch (error) {
        console.error(error);
    }
}
run();


app.get("/", (req, res) => {
    res.send("Server is running fine - AirBnB")
});


app.listen(port, () => {
    console.log(`Running on ${port}`);
})
