var crypto = require('crypto');

var csrf = null;

/**
 * Express dynamicHelper for adding parameter to views. Usage:
 *
 * var csrf = require('express-csrf');
 *
 * dynamicHelpers({
 *   csrf: csrf.token
 * });
 *
 * Add csrf parameter to view (jade example):
 * <form>
 *   <input type="hidden" name="csrf" value=csrf>
 * </form>
 */
exports.token = function(req, res) {
  if (!(typeof csrf !== "undefined" && csrf !== null)) {
    csrf = crypto.createHash('md5').update('' + new Date().getTime() + req.session.lastAccess).digest('hex');
    req.session.csrf = csrf;
  }
  return csrf;
};

/**
 * Express/Connect middleware function for checking csrf token. Usage:
 *
 * var csrf = require('express-csrf');
 *
 * app.use(csrf.check());
 */
exports.check = function() {
  return function(req, res, next) {
    csrf = null; // Clear csrf for next request
    if (req.body && req.method.toLowerCase() === 'post') {
      if (!('csrf' in req.body && req.body.csrf === req.session.csrf)) {
        return res.send("Cross-site request forgery attempt discovered!", 403);
      }
    }
    return next();
  };
};
