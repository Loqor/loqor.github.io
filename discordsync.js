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

    const url = 'file:///D:/Users/1zaia/OneDrive/Documents/GitHub/loqor.github.io/bot-status.json';

    fetch(url, {mode: 'no-cors'})
      .then(response => response)
      .then(data => {
        // Handle the JSON data here
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

});