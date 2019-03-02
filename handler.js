'use strict'

const AWS = require('aws-sdk')
let dynamo = new AWS.DynamoDB.DocumentClient()

require('aws-sdk/clients/apigatewaymanagementapi')

const CHATCONNECTION_TABLE = 'chatIdTable'

const successfullResponse = {
  statusCode: 200,
  body: 'everything is alright',
}

module.exports.connectionHandler = async (event, context) => {
  console.log(event)
  try {
    if (event.requestContext.eventType === 'CONNECT') {
      // Handle connection
      await addConnection(event.requestContext.connectionId)
      return successfullResponse
    } else if (event.requestContext.eventType === 'DISCONNECT') {
      // Handle disconnection
      await deleteConnection(event.requestContext.connectionId)
      return successfullResponse
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}

// THIS ONE DOES NOTHING
module.exports.defaultHandler = (event, context, callback) => {
  console.log('defaultHandler was called')
  console.log(event)

  callback(null, {
    statusCode: 200,
    body: 'defaultHandler',
  })
}

module.exports.sendMessageHandler = (event, context, callback) => {
  sendMessageToAllConnected(event)
    .then(() => {
      callback(null, successfullResponse)
    })
    .catch(err => {
      callback(null, JSON.stringify(err))
    })
}

const sendMessageToAllConnected = event => {
  return getConnectionIds().then(connectionData => {
    return connectionData.Items.map(connectionId => {
      return send(event, connectionId.connectionId)
    })
  })
}

const getConnectionIds = () => {
  const params = {
    TableName: CHATCONNECTION_TABLE,
    ProjectionExpression: 'connectionId',
  }

  return dynamo.scan(params).promise()
}

const send = (event, connectionId) => {
  const body = JSON.parse(event.body)
  const postData = body.data

  const endpoint =
    event.requestContext.domainName + '/' + event.requestContext.stage
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: endpoint,
  })

  const params = {
    ConnectionId: connectionId,
    Data: postData,
  }
  return apigwManagementApi.postToConnection(params).promise()
}

const addConnection = connectionId => {
  const params = {
    TableName: CHATCONNECTION_TABLE,
    Item: {
      connectionId: connectionId,
    },
  }

  return dynamo.put(params).promise()
}

const deleteConnection = connectionId => {
  const params = {
    TableName: CHATCONNECTION_TABLE,
    Key: {
      connectionId: connectionId,
    },
  }

  return dynamo.delete(params).promise()
}
