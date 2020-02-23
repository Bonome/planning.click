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

            let pastDone = await db.collection('userday').aggregate([
                {
                    "$match": {
                        type: data.type,
                        slug: slug,
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

            let pastTodo = await db.collection('userday').aggregate([
                {
                    "$match": {
                        type: {$in: [-2, -1, 2, 3, 4]},
                        slug: slug,
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

            let futurePlanned = await db.collection('userday').aggregate([
                {
                    "$match": {
                        type: data.type,
                        slug: slug,
                        date: {$gte: data.lastDayOfLastWeek, $lte: data.lastDisplayedDate}
                    }
                },
                {
                    "$group": {
                        _id: '$user',
                        count: {$sum: 1}
                    }
                }
            ]).toArray();
            
            
            let futureTodo = await db.collection('userday').aggregate([
                {
                    "$match": {
                        type: {$in: [-2, -1, 2, 3, 4]},
                        slug: slug,
                        date: {$gte: data.lastDayOfLastWeek, $lte: data.lastDisplayedDate},
                    }
                },
                {
                    "$group": {
                        _id: '$user',
                        count: {$sum: 1}
                    }
                }
            ]).toArray();
            console.log(pastTodo);
            
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify(
                {
                    pastDone: pastDone,
                    pastTodo: pastTodo,
                    futurePlanned: futurePlanned,
                    futureTodo: futureTodo
                }
            ));

        } catch (err) {
            console.log(err.stack);
        }

        // Close connection
        client.close();
    })();
}
