function doGet() {
    return HtmlService.createTemplateFromFile('index').evaluate();
}

function getQuestions(selectedCategory) {
    var spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your actual spreadsheet ID
    var sheetName = 'Sheet1'; // Replace with your actual sheet name
    var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    var data = sheet.getDataRange().getValues();

    // Assuming header row, so start from index 1
    var questions = [];
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var category = row[2]; // Category is the 3rd column (index 2)
        var question = row[3]; // Question is the 4th column (index 3)

        if (selectedCategory === 'All' || category === selectedCategory) {
            questions.push({ category: category, question: question });
        }
    }

    // Shuffle and select 3 random questions
    questions.sort(function () { return 0.5 - Math.random() });
    return questions.slice(0, 3);
}

function getCategories() {
    var spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your actual spreadsheet ID
    var sheetName = 'Sheet1'; // Replace with your actual sheet name
    var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    var data = sheet.getDataRange().getValues();

    var categories = new Set();
    for (var i = 1; i < data.length; i++) {
        categories.add(data[i][2]); // Category is the 3rd column (index 2)
    }
    return ['All'].concat(Array.from(categories));
}