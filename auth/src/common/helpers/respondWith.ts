/**
 * 
 * @param statusCode 
 * @param message 
 * @param data 
 * @param DataModel the model  of  the data, if data is sent, model must be sent.
 * @returns 
 */

const respondWith = (statusCode: number, message: string, data: any = {}, dataModel = null) => {
   // dataModel will be removed later in the dynamic response interceptor.
  return { statusCode, message, data, dataModel };
};


export default respondWith;
