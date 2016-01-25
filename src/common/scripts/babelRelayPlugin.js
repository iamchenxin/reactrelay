/**
 * Created by iamchenxin on 1/22/16.
 */
var getBabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../data/rblog/schema.json');

module.exports = getBabelRelayPlugin(schema.data);