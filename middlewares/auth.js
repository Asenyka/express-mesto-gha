const jwt = require('jsonwebtoken');

const handleAutherror = (res) => {
  res.status(401).send({ message: 'Требуется авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return handleAutherror(res);
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    return handleAutherror(res);
  }
  req.user = payload;
  return next();
};
