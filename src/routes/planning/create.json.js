import * as engine from '../../db/engine.js';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//var db = engine.getDB();


export function post(req, res, next) {
    console.log('post reception');
    console.log(req.body);
    const data = req.body;
    res.setHeader('Content-Type', 'application/json');


    (async function () {
        const client = new MongoClient(engine.mongoUrl);

        try {
            await client.connect();
            console.log("Connected correctly to server");

            const db = client.db(engine.dbName);

            // Insert a single document
            let r = await db.collection('plannings').insertOne(data);
            assert.equal(1, r.insertedCount);

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(data));

        } catch (err) {
            console.log(err.stack);
        }

        // Close connection
        client.close();
    })();




//    db.open((err, db) => {
//        db.collection('plannings', (err, plannings) => {
//            plannings.insert(data, (err, data) => {
////                console.log(planning);
//                console.log(err);
////                if(err) {
////                    res.writeHead(404, {
////                        'Content-Type': 'application/json'
////                    });
////
////                    res.end(JSON.stringify({
////                        message: `Not found`
////                    }));
////                }
//                res.writeHead(200, {
//                    'Content-Type': 'application/json'
//                });
//
//                res.end(JSON.stringify(data));
//            });
//        });
//    });
}
