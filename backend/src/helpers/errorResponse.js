
export const sendErrorResponse = (res, status, message) => {
    return res.status(status).json({ error: message });
  };
  