
var jwt = require('jsonwebtoken')
// Define a middleware function to authenticate and authorize requests
module.exports = function authenticateAndAuthorize(req, res, next) {
    // Get the JWT token from the request headers

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    const secretKey = 'my_secret_key';

    // Verify the JWT token
    try {
        const decoded = jwt.verify(token, secretKey);
        // Check if the user is authorized to access the resource

        if (decoded.exp === undefined) {
            // The token does not have an expiration time, so it is considered valid
            console.log('Token is valid');
        } else {
            // Check if the token has expired
            const now = Math.floor(Date.now() / 1000);
            if (now > decoded.exp) {
                console.log('Token has expired');
                return res.status(403).json({ error: 'Forbidden' });
            } else {
                next()
                console.log('Token is valid');
            }
        }
    } catch (err) {
        // The token is invalid or has expired, so return an error response
        console.log(err)
        return res.status(401).json({ error: 'Unauthorized' });
    }
}