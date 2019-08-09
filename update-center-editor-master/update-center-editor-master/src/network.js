const axios = require("axios");

module.exports.getBanks = function() {
  return axios.get(`${process.env.REACT_APP_API_ENDPOINT}/getAllTopics`, {});
  // context.setState({ banks: myJson });
};

module.exports.addBanks = function(topicDoc) {
  return axios.post(`${process.env.REACT_APP_API_ENDPOINT}/newTopic`, topicDoc);
};

module.exports.deleteBanks = function(delThis) {
  return axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/deleteTopic?_id=${delThis}`);
};

module.exports.updateTopic = function(topic, id) {
  return axios.post(`${process.env.REACT_APP_API_ENDPOINT}/updateTopic?_id=${id}`, { $set: { items: topic.items } });
};

module.exports.updateBankName = function(topic, id) {
  return axios.post(`${process.env.REACT_APP_API_ENDPOINT}/updateTopic?_id=${id}`, { $set: { bank: topic.bank } });
};
