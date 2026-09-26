const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Expected format: Bearer TOKEN
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access denied. Invalid token format."
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store admin information in request
        req.admin = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Access denied. Invalid or expired token."
        });
    }
};

module.exports = authMiddleware;