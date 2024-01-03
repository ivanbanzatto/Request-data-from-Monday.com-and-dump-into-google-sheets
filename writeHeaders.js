//we query the board Monday.com API, quer get the name of the columns, writing them in the sheet firstly.
function writeHeaders(){

  let base_url= "https://api.monday.com/v2";
  let apiKey = "";


  let query = `query {
    boards(limit:1,ids:[120818187]) {
            groups{
              items (limit: 1, ids:[4309279481]){
                  column_values{
                    title
                  }
              }
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

  let groups = result.data.boards[0].groups
  let items = groups[0].items      
  let column_values = items[0].column_values   

  let column_titles = ["Group","Name"]
  for (let k = 0; k < column_values.length; k++){  
               column_titles.push(column_values[k].title)
      }

  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Monday export").appendRow(column_titles);

}
