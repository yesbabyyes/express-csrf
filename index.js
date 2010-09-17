var hashlib = require('hashlib');

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
    csrf = hashlib.md5('' + new Date().getTime() + req.session.lastAccess);
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
    if (req.method.toLowerCase() === 'post') {
      if (!('csrf' in req.body && req.body.csrf === req.session.csrf)) {
        return next(new Error("Cross-site request forgery attempt discovered!"));
      }
    }
    return next();
  };
};
