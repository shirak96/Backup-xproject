import * as HttpStatus from 'http-status-codes';

// TODO Utils should not contains any non functional programming code
// TODO: change the way of sending the auth token
export const jsonResponse = (data: any, statusCode: number = 200) => {
  return {
    status: {
      text: HttpStatus.getStatusText(statusCode),
      code: statusCode,
    },
    data,
  };
};
