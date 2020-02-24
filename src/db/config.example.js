export const cfg = {
    "app":{
        "engine":"mongodb"
    },
    "mongo":{
        "host":"127.0.0.1",
        "port":27017,
        "db":"planning",
        "username": "",
        "password": "",
        "opts":{
            "auto_reconnect": true,
            "safe": true
        }
    },
    "redis": {
        "host":"127.0.0.1",
        "port":6379,
        "db":"planning"
    }
}
