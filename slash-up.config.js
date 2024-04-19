// slash-create's cli tool
export const token = process.env.TOKEN;
export const applicationId = process.env.APPID;
export const commandPath = './src/cmd';
export const env = {
  development: {
    globalToGuild: process.env.DEVID
  }
};