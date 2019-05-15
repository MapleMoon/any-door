const { createGzip, createDeflate } = require('zlib');
module.exports = (rs, req, res) => {
    const acceptEncoding = req.headers['accept-encoding'];
    console.log(acceptEncoding);
    if (!acceptEncoding || !/\b(gzip|deflate)\b/.test(acceptEncoding)) {
        return rs;
    } else if (/\bgzip\b/.test(acceptEncoding)) {
        res.setHeader('Content-Encoding', 'gzip');
        console.log('压缩gzip');
        return rs.pipe(createGzip());
    } else {
        res.setHeader('Content-Encoding', 'deflate');
        return rs.pipe(createDeflate());
    }
};