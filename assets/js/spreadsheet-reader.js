var API_KEY = 'AIzaSyCi8vjEKia4ipK5pRbM3qJN6qMe-2S4bUc';
var SPREADSHEET_ID = '15EXjiKcRu6u4Mc-ni30oFeG1xA9grWuf4N3JTfaExIw';

// Executes an API request, and returns a Promise
function readTimetable() {
    console.log('will read spreadsheet here');
    return gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: '15EXjiKcRu6u4Mc-ni30oFeG1xA9grWuf4N3JTfaExIw',
          range: 'Sheet1!A1:H15',
          valueRenderOption: 'FORMULA'
      });
}

function renderTable(response){
    var range = response.result;
    if (range.values.length > 0) {
        var headers = range.values[0];
        var headerRow = $('<tr>')
        for (i = 0; i < headers.length; i++)
            headerRow.append($('<th>').html(headers[i]));
        $('#gsheet-table').append($('<thead>').html(headerRow));

        if (range.values.length > 1)
            for (i = 1; i < range.values.length; i++)
            {
                var timetableRow = $('<tr>');
                var row = range.values[i];

                for (j = 0; j < row.length; j++)
                {
                    m = /HYPERLINK\("(.*)","(.*)"\)/.exec(row[j]);

                    if (m)
                    {
                        var url = m[1];
                        var text = m[2];
                        timetableRow.append($('<td>').html($('<a>',{text: text, href:url})));
                    }
                    else
                        timetableRow.append($('<td>').html(row[j]));
                }

                $('#gsheet-table').append($('<tbody>').html(timetableRow));
            }

    } else {
        console.log('no timetable data found.');
    }
}

function start()
{
    gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
      return readTimetable();
    }).then(function(response) {
      renderTable(response);
    }, function(reason) {
      console.log('gapi init error: ' + reason);
    });
}

function handleClientLoad()
{
    gapi.load('client', start);
}
