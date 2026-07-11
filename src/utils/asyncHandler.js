/**
 * Helper function that catches async errors in route handlers
 * @param { Function } fn async controller function 
 * @returns { Function } as Express middleware function
 */
const asyncHandler = (controllerFunc) => {
  return (request, response, next) => {
    Promise.resolve(controllerFunc(request, response, next)).catch(next);
  };
};

module.exports = asyncHandler;