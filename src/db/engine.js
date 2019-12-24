var db,engine,getDBtmp;

// load config
import { cfg } from './config.js';

// load requestd engine and define engine agnostic getDB function
if (cfg.app.engine=="mongodb") {
    engine = require("mongodb");
    getDBtmp = function () {
        if (!db) db = new engine.Db(cfg.mongo.db,
            new engine.Server(cfg.mongo.host, cfg.mongo.port, cfg.mongo.opts),
                {native_parser: false, safe:true});
        return db;
    }
} else {
    engine = require("tingodb")({apiLevel:220});
    getDBtmp = function () {
        if (!db) db = new engine.Db(cfg.tingo.path, {});
        return db;
    }
}
export const getDB = getDBtmp;
// Depending on engine this can be different class
export const ObjectID = engine.ObjectID;
