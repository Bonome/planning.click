/* 
 * Copyright (C) 2020 bonome
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


import * as engine from '../../../db/engine.js';
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

export function post(req, res, next) {
    const data = req.body;
    res.setHeader('Content-Type', 'application/json');
    const {slug} = req.params;

    (async function () {
        const client = new MongoClient(engine.mongoUrl);

        try {
            await client.connect();

            const db = client.db(engine.dbName);

            let r = await db.collection('userday').aggregate([
                {
                    "$match": {
                        type: data.type,
                        slug: 'tenderspage',
                        date: {$lte: data.lastDayOfLastWeek}
                    }
                },
                {
                    "$group": {
                        _id: '$user',
                        count: {$sum: 1}
                    }
                }
            ]).toArray();
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
