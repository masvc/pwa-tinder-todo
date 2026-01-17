// Swipe Todo - Google Apps Script
const HEADERS = ['id', 'title', 'description', 'priority', 'status', 'createdAt'];

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'setup') return setup();
  if (action === 'fetch') return fetchTodos();
  if (action === 'sync') {
    const todos = JSON.parse(decodeURIComponent(e.parameter.data || '[]'));
    return syncTodos(todos);
  }
  return jsonResponse({ error: 'Invalid action' });
}

function setup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getRange(1, 1).getValue() !== 'id') {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  }
  return jsonResponse({ success: true });
}

function fetchTodos() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return jsonResponse({ todos: [] });
  const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const todos = data.filter(row => row[0]).map(row => ({
    id: String(row[0]), title: row[1] || '', description: row[2] || '',
    priority: row[3] || 'medium', status: row[4] || 'pending', createdAt: row[5] || Date.now()
  }));
  return jsonResponse({ todos });
}

function syncTodos(todos) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, HEADERS.length).clearContent();
  if (todos && todos.length > 0) {
    const values = todos.map(t => [t.id, t.title, t.description || '', t.priority || 'medium', t.status || 'pending', t.createdAt || Date.now()]);
    sheet.getRange(2, 1, values.length, HEADERS.length).setValues(values);
  }
  return jsonResponse({ success: true, count: todos ? todos.length : 0 });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
