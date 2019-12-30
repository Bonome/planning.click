import * as engine from '../../../db/engine.js';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

export function get(req, res, next) {
    const data = req.body;
    res.setHeader('Content-Type', 'application/json');
    const {slug} = req.params;

    (async function () {
        const client = new MongoClient(engine.mongoUrl);

        try {
            await client.connect();

            const db = client.db(engine.dbName);

            let r = await db.collection('userday').find(
                {
                    slug: slug,
                }
            ).toArray();
//            assert.equal(1, r.upsertedCount+r.modifiedCount);
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(r));

        } catch (err) {
            console.log(err.stack);
        }

        // Close connection
        client.close();
    })();
}
