import * as engine from '../db/engine.js';
const MongoClient = require('mongodb').MongoClient;

export const day = (socket, event) => {
    (async function () {
        const client = new MongoClient(engine.mongoUrl);

        try {
            await client.connect();

            const db = client.db(engine.dbName);
//            console.log(event);
            let r = await db.collection('userday').updateOne(
                {
                    slug: event.data.slug,
                    date: new Date(event.data.date),
                    user: event.data.user
                },        
                {
                    $set: {
                        type: event.data.type,
                    }
                },
                {
                    upsert: true
                }
            );
//            assert.equal(1, r.upsertedCount+r.modifiedCount); 

            if(r.upsertedId != null) {
                event.data._id = r.upsertedId._id;
            }

            socket.to(event.slug).emit('day', event.data);//emit to all others
            socket.emit('day', event.data);//emit back to emitter
        } catch (err) {
            console.log(err.stack);
        }

        // Close connection
        client.close();
    })();
};