/**
 * Default 200 (Success) handler
 *
 * Override w/ any custom logic for your app
 * Negotatiates content-type to send back, then does so.
 *
 * This middleware can be invoked from a controller or policy:
 * Usage: res.success( [data], [redirectTo] )
 */

module.exports[200] = function pageNotFound(data, redirectTo, req, res) {

  /*
   * NOTE: This function is Sails middleware-- that means that not only do `req` and `res`
   * work just like their Express equivalents to handle HTTP requests, they also simulate
   * the same interface for receiving socket messages.
   */

  // Guess view path by using controller/action
  var viewFilePath;
  if (req.target.controller && req.target.action) {
    viewFilePath = req.target.controller + '/' + req.target.action;
  }

  var statusCode = 200;
  var result = {
    status: statusCode
  };

  // Use data if specified (instead of statusCode)
  if ( sails.util.isObject(data) ) {
    result = data;
  }


  // If the user-agent wants a JSON response, send json
  if (req.wantsJSON) {
    return res.json(result, result.status);
  }


  res.status(result.status);

  // Apply view locals
  // (Note: you'll want to be careful sending arrays this way)
  if ( sails.util.isObject(data) ) {
    sails.util.extend(res.locals, data);
  }
  
  res.render(viewFilePath, function(err) {
    // If the view doesn't exist, or a rendering error occured, 
    // just send json
    if (err) {
      return res.json(result, result.status);
    }

    // Otherwise, serve the page
    res.render(viewFilePath);
  });

};