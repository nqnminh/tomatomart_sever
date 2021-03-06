const jwt = require('jsonwebtoken');

module.exports.verifyToken = function(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  
  if (!token) return res.status(401).send('OK E');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    
    req.user = verified;
    next();
  } catch(err) {
    res.status(400).send('Lỗi');
  }
}