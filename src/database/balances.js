const { readFile, writeFile } = require('fs').promises;
const filePath = 'src/database/data/balances.json';


async function getBalances() {
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

async function writeBalances(balances) {
  try {
    await writeFile(filePath, JSON.stringify(balances));
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

async function getBalance(userId) {
  const balances = await getBalances();
  if (!Object.keys(balances).includes(userId)) {
    balances[userId] = 0;
  }
  await writeBalances(balances);
  return { balance: balances[userId] };
}

async function addToBalance(userId, amount) {
  const balances = await getBalances();
  if (!Object.keys(balances).includes(userId)) {
    balances[userId] = 0;
  }
  balances[userId] += amount;
  await writeBalances(balances);
  return { balance: balances[userId] };
}


module.exports = { getBalance, addToBalance };
