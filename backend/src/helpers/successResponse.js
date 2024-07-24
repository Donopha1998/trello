export const sendSuccessResponse = (res, statusCode, data, message = '') => {
    res.status(statusCode).json({ message, data });
  };