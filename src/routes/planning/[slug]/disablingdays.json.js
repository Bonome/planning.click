import * as engine from '../../../db/engine.js';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

export function post(req, res, next) {
    const body = req.body;
    const data = body.dates;
    res.setHeader('Content-Type', 'application/json');
    const {slug} = req.params;

    (async function () {
        const client = new MongoClient(engine.mongoUrl);

        try {
            await client.connect();

            const db = client.db(engine.dbName);
            console.log('disabling data');
            console.log(data);
            let response = [];
            for (let i = 0; i < data.length; i++) {
                let dataset = {
                    type: data[i].type,
                };
                if(data[i].comment != null) {
                    dataset.comment = data[i].comment
                }
                let res = await db.collection('userday').updateOne(
                    {
                        slug: slug,
                        date: new Date(data[i].date),
                        user: null
                    },        
                    {
                        $set: dataset
                    },
                    {
                        upsert: true
                    }
                );
                if(res.upsertedId != null) {
                    let day = {
                        slug: slug,
                        date: new Date(data[i].date),
                        user: null,
                        type: data[i].type,
                        _id: res.upsertedId._id
                    };
                    response.push(day);
                }
            }
            await db.collection('plannings').updateOne(
                {
                    slug: slug
                },        
                {
                    $set: {
                        "week.disabledStored": body.lastProcessed,
                    }
                }
            );
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(response));

        } catch (err) {
            console.log(err.stack);
        }

        // Close connection
        client.close();
    })();
}
