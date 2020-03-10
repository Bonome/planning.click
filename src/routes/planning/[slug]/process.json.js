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

            let planning = await db.collection('plannings').findOne({slug: slug});

            let pastDone = await db.collection('userday').aggregate([
                {
                    "$match": {
                        type: {$in: [1, 7]},
                        slug: slug,
                        date: {$lte: new Date(data.lastDayOfLastWeek)}
                    }
                },
                {
                    "$group": {
                        _id: { user: '$user', type: "$type" },
                        count: {$sum: 1}
                    }
                }
            ]).toArray();
            let pastDoneArray = [];
            for(let i=0; i<pastDone.length; i++) {
                let obj = pastDone[i];
                let coefType = 1;
                let event = planning.events.find(evt => evt.type==obj._id.type);
                if(event != null) {
                    if(event.duration != null) {
                        coefType = event.duration.t4;
                    }
                }
                let user = pastDoneArray.find(item => item._id == obj._id.user);
		if(user == null) {
                    pastDoneArray.push({_id: obj._id.user, count: obj.count*coefType});
		}else{
                    user.count = user.count + obj.count*coefType;
                }
	    }
            pastDone = pastDoneArray;

            let pastTodo = await db.collection('userday').aggregate([
                {
                    "$match": {
                        type: {$in: [-2, -1, 2, 3, 4, 5, 6, 7]},
                        slug: slug,
                        date: {$lte: new Date(data.lastDayOfLastWeek)}
                    }
                },
                {
                    "$group": {
                        _id: { user: '$user', type: "$type" },
                        count: {$sum: 1}
                    }
                }
            ]).toArray();
            let pastTodoArray = [];
            for(let i=0; i<pastTodo.length; i++) {
                let obj = pastTodo[i];
                let coefType = 1;
                let event = planning.events.find(evt => evt.type==obj._id.type);
                if(event != null) {
                    if(event.duration != null) {
                        coefType = event.duration.t4;
                    }
                }
                let user = pastTodoArray.find(item => item._id == obj._id.user);
		if(user == null) {
                    pastTodoArray.push({_id: obj._id.user, count: obj.count*coefType});
		}else{
                    user.count = user.count + obj.count*coefType;
                }
	    }
            pastTodo = pastTodoArray;

            let futurePlanned = await db.collection('userday').aggregate([
                {
                    "$match": {
			type: {$in: [1, 7]},
                        slug: slug,
                        date: {$gte: new Date(data.lastDayOfLastWeek), $lte: new Date(data.lastDisplayedDate)}
                    }
                },
                {
                    "$group": {
                        _id: { user: '$user', type: "$type" },
                        count: {$sum: 1}
                    }
                }
            ]).toArray();
	    let futurePlannedArray = [];
            for(let i=0; i<futurePlanned.length; i++) {
                let obj = futurePlanned[i];
                let coefType = 1;
                let event = planning.events.find(evt => evt.type==obj._id.type);
                if(event != null) {
                    if(event.duration != null) {
                        coefType = event.duration.t1;
                    }
                }
                let user = futurePlannedArray.find(item => item._id == obj._id.user);
		if(user == null) {
                    futurePlannedArray.push({_id: obj._id.user, count: obj.count*coefType});
		}else{
                    user.count = user.count + obj.count*coefType;
                }
	    }
            futurePlanned = futurePlannedArray;
            
            let futureTodo = await db.collection('userday').aggregate([
                {
                    "$match": {
                        type: {$in: [-2, -1, 2, 3, 4, 5, 6, 7]},
                        slug: slug,
                        date: {$gte: new Date(data.lastDayOfLastWeek), $lte: new Date(data.lastDisplayedDate)},
                    }
                },
                {
                    "$group": {
                        _id: { user: '$user', type: "$type" },
                        count: {$sum: 1}
                    }
                }
            ]).toArray();
            let futureTodoArray = [];
            for(let i=0; i<futureTodo.length; i++) {
                let obj = futureTodo[i];
                let coefType = 1;
                let event = planning.events.find(evt => evt.type==obj._id.type);
                if(event != null) {
                    if(event.duration != null) {
                        coefType = event.duration.t4;
                    }
                }
                let user = futureTodoArray.find(item => item._id == obj._id.user);
		if(user == null) {
                    futureTodoArray.push({_id: obj._id.user, count: obj.count*coefType});
		}else{
                    user.count = user.count + obj.count*coefType;
                }
	    }
            futureTodo = futureTodoArray;
            
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
