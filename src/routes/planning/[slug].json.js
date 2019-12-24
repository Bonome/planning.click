import * as engine from '../../db/engine.js';
var db = engine.getDB();

export function get(req, res, next) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const { slug } = req.params;
    
    db.open((err,db) => {
        db.collection('plannings', (err, plannings) => {
            plannings.findOne({slug: slug}, (err, planning) => {
                if(err) {
                    res.writeHead(404, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        message: `Not found`
                    }));
                }
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });

                res.end(planning);
            });
        });
    });
}
