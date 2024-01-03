// clear the entire spreadsheet
function clearSpreadsheet(){
  //clear spreadsheet
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Monday export").getRange("A1:FI10000").clearContent();
  console.log("-= spreadsheet cleaned =-");
}
