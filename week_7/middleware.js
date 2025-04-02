const jwt = require('jwt')

module.exports = function() {
    function requireToken(req, res, next){
        const authHeader = req.headers['authorization']
        if (!authHeader){
            
        }
        // "Bearer <token>"
        const token = authHeader.split(' ')[0]

    }
}