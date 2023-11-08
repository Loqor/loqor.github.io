//fetch(discordApi, {
//    method: 'GET',
//    mode: 'no-cors'
//})
//  .then(response => response.json())
//  .then(data => {
//    const element = document.getElementById('pfp');
//    
//    const loqorMember = data.members.find(member => member.username === "Loqor");
//    
//    if (loqorMember.status == "online") {
//      element.style.border = "5px solid #43b581";
//    } else if(loqorMember.status == "dnd") {
//        element.style.border = "5px solid #f04747";
//    } else if(loqorMember.status == "idle") {
//        element.style.border = "5px solid #faa61a";
//    } else {
//        element.style.border = "5px solid rgba(16 18 27 / 40%)";
//    }
// })
// .catch(error => {
//   console.error('API request error:', error);
// });
//
// console.log("what");

/*const widgetUrl = 'https://canary.discord.com/widget?id=859856751070937098';

// Make a request to the widget URL
fetch(widgetUrl, {mode: 'no-cors'})
  .then(response => response)
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching the widget data:', error);
  });*/
  document.addEventListener("DOMContentLoaded", function () {

    const express = require('express');
    const app = express();
    
    // Define a route to get the bot's status
    app.get('/bot-status', (req, res) => {
      const botStatus = client.user.presence.activities[0]; // Assuming the bot has one activity
      res.json({ status: botStatus });
    });
    
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });

});