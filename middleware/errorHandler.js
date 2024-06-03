export const errorHandler = (err, req, res, next) => {
    console.log("first")
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
};
