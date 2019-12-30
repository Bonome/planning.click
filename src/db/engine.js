var db,engine,getDBtmp;
let uri='';
const assert = require('assert');
// load config
import { cfg } from './config.js';

// load requestd engine and define engine agnostic getDB function
if (cfg.app.engine=="mongodb") {
    engine = require("mongodb");
    let auth = '';
    if(cfg.mongo.username != null && cfg.mongo.username != '') {
        if(cfg.mongo.password != null && cfg.mongo.password != '') {
            auth = ':' + cfg.mongo.password;
        }
        auth = cfg.mongo.username + auth + '@';
    }
    const MongoClient = require('mongodb').MongoClient;
    uri = "mongodb://"+auth+cfg.mongo.host+":"+cfg.mongo.port+"/"+cfg.mongo.db+"?useUnifiedTopology=true&retryWrites=true&w=majority";
//    const client = new MongoClient(uri, { useNewUrlParser: true });
//    getDBtmp = function () {
//        if (!db) db = new engine.Db(cfg.mongo.db,
//            new engine.Server(cfg.mongo.host, cfg.mongo.port, cfg.mongo.opts),
//                {native_parser: false, safe:true});
//        return db;
//    }
//} else {
//    engine = require("tingodb")({apiLevel:220});
//    getDBtmp = function () {
//        if (!db) db = new engine.Db(cfg.tingo.path, {});
//        return db;
//    }
}
//export const getClient = client;
// Depending on engine this can be different class
export const ObjectID = engine.ObjectID;

export const mongoUrl = uri;
export const dbName = cfg.mongo.db;
