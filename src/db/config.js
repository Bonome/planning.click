export const cfg = {
    "app":{
        "engine":"tingodb"
    },
    "mongo":{
        "host":"127.0.0.1",
        "port":27017,
        "db":"data",
        "opts":{
            "auto_reconnect": true,
            "safe": true
        }
    },
    "tingo":{
        "path":"./data"
    }
}
