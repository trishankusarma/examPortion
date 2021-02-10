const moment = require('moment');

const sendMessage = ( username , text )=>{
  return {
      username,
      text,
      time:moment().format('h:mm a')
  }
}

module.exports = sendMessage;