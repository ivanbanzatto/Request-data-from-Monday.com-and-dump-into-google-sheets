#main function
function requestMondayNewAlgorithm() {

  let base_url= "https://api.monday.com/v2";
  let apiKey = "";

  let query = `query {
    boards(limit:1,ids:[120818187]) { # query just to get board name, groups ids and names
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

  #console.log("Group to be written: ",result.data.boards[0].groups[0].title) 

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

#we query the board Monday.com API, quer get the name of the columns, writing them in the sheet firstly.
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

#to avoid too much data in one query, we query Monday.com API by group, and write in the googlesheet by group as well
function writeSpreadsheet(group){

  let base_url= "https://api.monday.com/v2";
  let apiKey = "";

  let page = 1
  let number_of_items = 20
  let groups = []
  let items = []
  let column_values = []

  while (number_of_items <= 20 && number_of_items > 0){
    let query = `query {
    boards(limit:1,ids:[120818187]) {
            groups(ids:[`+group+`]){
              title
              items (limit: 20, page: `+page+` ){
                  name
                  column_values{
                    text
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

    groups = result.data.boards[0].groups
    let items = groups[0].items  

    for (let j = 0; j < items.length; j++){    
      
      let new_row = []
      column_values = items[j].column_values
      new_row.push(groups[0].title)
      new_row.push(items[j].name)

      for (let k = 0; k < column_values.length; k++){  
            new_row.push(column_values[k].text)
      }

      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Monday export").appendRow(new_row);
      }
    
    number_of_items = items.length;
    console.log("Number of items: ", number_of_items);
    console.log("Page: ", page," for ",group);
    page++;
  }
}

function clearSpreadsheet(){
  //clear spreadsheet
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Monday export").getRange("A1:FI10000").clearContent();
  console.log("-= spreadsheet cleaned =-");
}














