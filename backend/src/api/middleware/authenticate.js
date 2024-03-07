const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        // Retrieve the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send('Authentication token is missing or invalid');
        }

        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
        req.user = decoded; // Add the decoded user data to the request object

        next(); // Proceed to the next middleware/function
    } catch (error) {
        // Handle errors (e.g., token expired or invalid)
        return res.status(401).send('Authentication failed');
    }
};

module.exports = authenticate;
