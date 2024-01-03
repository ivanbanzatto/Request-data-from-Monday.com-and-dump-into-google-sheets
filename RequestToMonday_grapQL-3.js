//main function
// the API version written in this code is depricated, pls consult the new version on the Monday.com wibsite
function requestMonday() {

  let base_url= "https://api.monday.com/v2";
  let apiKey = "";

  // query just to get board name, groups ids and names
  let query = `query {
    boards(limit:1,ids:[...]) { 
        name
            groups{
              id
              title
                  }
          }
        }`;

  let headers = {
      "Authorization": apiKey,
      "Content-Type": "application/json"
    }

  let options = {
      headers: headers,
      method: "POST",
      payload: JSON.stringify({query})
    }

  let response = UrlFetchApp.fetch(base_url,options).getContentText();
  let result = JSON.parse(response);

  //console.log("Group to be written: ",result.data.boards[0].groups[0].title) 

  let groups = result.data.boards[0].groups
  console.log(groups.title);

  //clear spreadsheet
  console.log("-= Clearing spreadsheet =-");
  clearSpreadsheet();

  //write headers
  console.log("-= Writing headers =-");
  writeHeaders();

  

  //write data
  for(let i = 0; i < groups.length;i++){
      writeSpreadsheet(groups[i].id);
       
  }
     
}
















