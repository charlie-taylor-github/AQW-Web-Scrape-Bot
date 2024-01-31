const { readFile, writeFile } = require('fs').promises;
const filePath = 'src/database/data/requests.json';

async function getRequests() {
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

async function writeRequests(requests) {
  try {
    await writeFile(filePath, JSON.stringify(requests));
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

async function create(serverId, messageId, userId, attachment, description) {
  const requests = await getRequests();
  requests.push({
    serverId, messageId, userId, attachment,
    description, suggestions: []
  });
  await writeRequests(requests);
  return {};
}

async function getByMessageId(messageId) {
  const requests = await getRequests();
  const request = requests.find(r => r.messageId === messageId);
  return { request };
}

async function getBySuggestionMessageId(messageId) {
  const requests = await getRequests();
  const request = requests.find(
    r => r.suggestions.find(s => s.messageId === messageId)
  );
  return { request };
}

async function getSuggestUserIdBySuggestMessageId(messageId) {
  const requests = await getRequests();
  const request = requests.find(
    r => r.suggestions.find(s => s.messageId === messageId)
  );
  const suggestion = request.suggestions.find(s => s.messageId === messageId);
  return { userId: suggestion?.userId };
}

async function getExistingRating(requestMessageId, suggesterId) {
  const { error, request } = await getByMessageId(requestMessageId);
  if (error || !request) return { error: 'failed to fetch request' };
  const existingRating = request.suggestions.find(
    s => s.userId === suggesterId && s.rating != null
  );
  return { existingRating: existingRating != null };
}

async function addSuggestion(
  requestMessageId, suggestionMessageId, userId,
  attachment, description
) {
  const requests = await getRequests();
  const request = requests.find(r => r.messageId === requestMessageId);
  if (!request) return { error: 'failed to fetch request' };

  request.suggestions.push({
    messageId: suggestionMessageId,
    userId, attachment, description, rating: null
  });

  await writeRequests(requests);

  return {};
}

async function rateSuggestion(requestMessageId, suggestionMessageId, rating = 5) {
  const requests = await getRequests();
  const request = requests.find(r => r.messageId === requestMessageId);
  if (!request) return { error: 'failed to fetch request' };
  request.suggestions.find(s => s.messageId === suggestionMessageId).rating = rating;
  await writeRequests(requests);
  return {};
}

module.exports = {
  create, getByMessageId, getBySuggestionMessageId,
  getSuggestUserIdBySuggestMessageId,
  addSuggestion, rateSuggestion, getExistingRating
};
