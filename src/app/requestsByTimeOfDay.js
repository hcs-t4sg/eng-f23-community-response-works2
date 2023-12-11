const functions = require('@google-cloud/functions-framework');
const {MongoClient, ObjectId} = require('mongodb');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const secretClient = new SecretManagerServiceClient();

//const uri = "mongodb+srv://fetcher:8x0EPUV2XInGEsNx@cluster0.ri5il.mongodb.net//test?retryWrites=true&w=majority";

functions.http('requestsByTimeOfDay', async (req, res) => {

  // this is where we access the db username and password stored in google secrets
    SECRET_ID = "projects/455228467064/secrets/mongodb/versions/3";
   const [response] = await secretClient.accessSecretVersion({
    name: SECRET_ID
   });
   const responsePayload = response.payload.data.toString('utf8'); 
   secret = JSON.parse(responsePayload);

   USER = secret["DB_USER"];
   PW = secret["DB_PW"];

  // this URI is crucial for connecting to the DB, the current URI listed from the mongodb nodejs driver is 
  // mongodb+srv://<username>:<password>@cluster0.ri5il.mongodb.net/?retryWrites=true&w=majority
    const uri = `mongodb+srv://${USER}:${PW}@cluster0.zlpbo.mongodb.net/test?retryWrites=true&w=majority`;
    // this is where the request is processed
    // either send as a command line curl or as a GET request
    const reqId = req.body.reqId || req.query.reqId; 
    
    // all you have to do to create the DB connection
    const client = new MongoClient(uri);

    try {
      await client.connect();
      // Make the appropriate DB calls
      // orgId: 62da9695bfd645465b542368

      // this handles what types of data you want to receive, putting a 1 by the 
      // name of the parameter is what tells the client to fetch that data
      const projection = {
        type:1,
        teamEvents:1,
        location:1,
        callStartedAt:1,
        callEndedAt:1,
        priority:1,
        tagHandles:1,
        statusEvents:1,
        status:1,
        displayId:1,
        createdAt:1,
        updatedAt:1 
      }; 

      // retrieving the requested data
      const orgRequestsCursor = await client
        .db("patch") // selecting the patch project 
        .collection("help_requests") // selecting the collection type
        .find({ "_id": new ObjectId(reqId)}) // selecting the id to find
        .project(projection).toArray(); // selecting all the data defined in the projections

      // qeury the specific date
      const date = orgRequestsCursor ? projection.createdAt : undefined;

      if (date) {
        // Obtain information for time of day
          const timeOfDay = {
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            milliseconds: date.getMilliseconds()
          }
          res.send(timeOfDay); 
      }
    } catch (e) {
        res.send('err:' + e);
    } finally {
        await client.close();
    }
});