const config = require('../../config.js');

async function getServerHelperRoleId(serverId) {
  try {
    return { roleId: config.servers[serverId].helperRoleId };
  } catch (e) {
    return { error: e.message };
  }
}

async function getServerItemRequestsChannelId(serverId) {
  try {
    return { channelId: config.servers[serverId].itemRequestsChannelId };
  } catch (e) {
    return { error: e.message };
  }
}

module.exports = {
  getServerHelperRoleId,
  getServerItemRequestsChannelId
};
