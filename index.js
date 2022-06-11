/*


How to build and upload the nodejs function to Lambda console:
https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html#nodejs-package-dependencies
https://aws.amazon.com/premiumsupport/knowledge-center/lambda-deployment-package-nodejs/

Sample project source:
https://github.com/aws-samples/amazon-dax-lambda-nodejs-sample

1. Install the dependencies

   npm install index
   npm install amazon-dax-client

2. Zip the function including all the dependencies

   zip -r ../function-name.zip .

   Make sure Node.js runtime on your Cloud Desktop matches with the Lambda runtime in the AWS
    account. In this case, both are Node.js 12.x.

3. Go to Lambda console and upload the zip file


*/

const AWS = require('aws-sdk');
const AmazonDaxClient = require('amazon-dax-client');

exports.handler = function(event) {

  const ddbClient = new AWS.DynamoDB.DocumentClient();

  console.log("Ken : 1")
  const dax = new AmazonDaxClient({
    endpoints: ["daxs://yiypan-dax-cluster.ccgwxw.dax-clusters.us-west-2.amazonaws.com"],
    region: "us-west-2",
  })
  const daxClient = new AWS.DynamoDB.DocumentClient({service: dax });

  var client = null;
  if (daxClient != null){
    console.log("Ken : use DAX")
    client = daxClient
  } else{
    console.log("Ken : use DDB")
    client = ddbClient
  }
  console.log("Ken : 2")
  const tableName = "MapleConfiguration-beta-na";

  // Set the parameters.
  const params = {
    TableName: tableName,
  };

  console.log("Ken : 3")
  try {
    console.log("Ken : trying execute daxClient.scan")
    client.scan(params, function (err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        // Scan succeeded
        console.log("Ken : Scan succeeded")
        console.log(data)
      }
    });
  } catch{
    console.error("Ken : failed to execute daxClient.scan")
  }

  console.log("Ken : 4")
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
