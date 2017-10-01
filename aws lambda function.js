'use strict';
var aws = require('aws-sdk');
var ses = new aws.SES({
   region: 'us-east-1'
});
var docClient = new aws.DynamoDB.DocumentClient({region: 'us-east-1'});
    
    
console.log('Loading function');

exports.handler = (event, context, callback) => {
var listening = false;
var meeting = "Meetup";
var time = "Five";
var input = "nothing";
var email = "";
var ending = "";
var mailProvider = "";
var senderMail = "antarpreet13@hotmail.com";
var dateAdded = "";  //date in the transcription if available

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION");
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`);
        
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Welcome to Meetscribe, your personal transcriber", false),
            {}
          )
        );
        
        listening = true;
        break;

      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`);
        switch(event.request.intent.name) {
            case "CreateANewLecture":
                if(event.request.intent.slots.LectureName.value !== undefined){
                    meeting = event.request.intent.slots.LectureName.value;
                }
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(`Creating new ${meeting} lecture`, false),
                    {}
                  )
                );
                break;
            case "RecordForMinutes":
                if(event.request.intent.slots.ForMinutes.value !== undefined){
                    time = event.request.intent.slots.ForMinutes.value;
                    time = time.match(/\d/g).join("");
                }
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(`Starting new Lecture for ${time} minutes`, false),
                    {}
                  )
                );
                break;
            case "GetTheMessage":
                var sub = "";
                var physicskey = "";
                var chemkey = "";
                var biokey = "";
                var msg = "Lecture not found";
                if(event.request.intent.slots.subject.value !== undefined){
                    sub = event.request.intent.slots.subject.value.toLowerCase();
                }
                if(event.request.intent.slots.physicskey.value !== undefined){
                    physicskey = event.request.intent.slots.physicskey.value.toLowerCase();
                }
                if(event.request.intent.slots.chemkey.value !== undefined){
                    chemkey = event.request.intent.slots.chemkey.value.toLowerCase();
                }
                if(event.request.intent.slots.biokey.value !== undefined){
                    biokey = event.request.intent.slots.biokey.value.toLowerCase();
                }
                var fetchedDatamoc = [];
                    var fetchedDataStringmoc = "";
                    var selectedParameters = {
                        TableName: 'transcription',
                        Limit: 100
                    };
                    
                if(sub !== ""){
                    docClient.scan(selectedParameters, function(err, data) {
                        if(err){
                            callback(err, null);
                        }else{
                            fetchedDatamoc = data.Items;
                            fetchedDataStringmoc = JSON.stringify(data);
                            for(var i=0;i<data.Count;i++){
                                if(fetchedDatamoc[i].message.toLowerCase().indexOf(sub) >= 0){
                                    msg = fetchedDatamoc[i].message;
                                }
                            }
                            
                            callback(null, data);
                            
                        }
                    });
                }else if(physicskey !== ""){
                    docClient.scan(selectedParameters, function(err, data) {
                        if(err){
                            callback(err, null);
                        }else{
                            fetchedDatamoc = data.Items;
                            fetchedDataStringmoc = JSON.stringify(data);
                            for(var i=0;i<data.Count;i++){
                                if(fetchedDatamoc[i].message.toLowerCase().indexOf(physicskey) >= 0){
                                    msg = fetchedDatamoc[i].message;
                                }
                            }
                            
                            callback(null, data);
                            
                        }
                    });
                }else if(chemkey !== ""){
                    docClient.scan(selectedParameters, function(err, data) {
                        if(err){
                            callback(err, null);
                        }else{
                            fetchedDatamoc = data.Items;
                            fetchedDataStringmoc = JSON.stringify(data);
                            for(var i=0;i<data.Count;i++){
                                if(fetchedDatamoc[i].message.toLowerCase().indexOf(chemkey) >= 0){
                                    msg = fetchedDatamoc[i].message;
                                }
                            }
                            
                            callback(null, data);
                            
                        }
                    });
                }else if(biokey !== ""){
                    docClient.scan(selectedParameters, function(err, data) {
                        if(err){
                            callback(err, null);
                        }else{
                            fetchedDatamoc = data.Items;
                            fetchedDataStringmoc = JSON.stringify(data);
                            for(var i=0;i<data.Count;i++){
                                if(fetchedDatamoc[i].message.toLowerCase().indexOf(biokey) >= 0){
                                    msg = fetchedDatamoc[i].message;
                                }
                            }
                            
                            callback(null, data);
                            
                        }
                    });
                }
                context.succeed(
                              generateResponse(
                                buildSpeechletResponse(`${msg} ${sub}`, false),
                                {}
                              )
                            );
                break;
            case "CheckForDeadline":
                var fetchedData = [];
                var fetchedDataString = "";
                var selectedParameter = {
                    TableName: 'transcription',
                    Limit: 100
                };
                docClient.scan(selectedParameter, function(err, data) {
                    if(err){
                        callback(err, null);
                    }else{
                        fetchedData = data.Items;
                        fetchedDataString = JSON.stringify(data);
                        for(var i=0;i<data.Count;i++){
                            if(fetchedData[i].message.match(/\d+/g)){
                                dateAdded = fetchedData[i].message.match(/\d{2}([\/.-])\d{2}\1\d{4}/g);
                            }
                        }
                        if(dateAdded === ""){
                            context.succeed(
                              generateResponse(
                                buildSpeechletResponse(`No date specified in last transcribe`, false),
                                {}
                              )
                            );
                        }else{
                            context.succeed(
                              generateResponse(
                                buildSpeechletResponse(`The deadline for last assignment is ${dateAdded}`, false),
                                {}
                              )
                            );
                        }
                        callback(null, data);
                    }
                });
                
                
                
                break;
            case "AddMyEmail":
                if(event.request.intent.slots.emails.value !== undefined){
                    email = event.request.intent.slots.emails.value.toLowerCase();
                }
                if(event.request.intent.slots.ending.value !== undefined){
                    ending = event.request.intent.slots.ending.value.toLowerCase().split(" ").join(".");
                }
                if(event.request.intent.slots.mailProvider.value !== undefined){
                    mailProvider = event.request.intent.slots.mailProvider.value.toLowerCase();
                }
                if(email !== "" && ending !== "" && mailProvider !== ""){
                    senderMail = email + "@" + mailProvider + "." + ending;
                }
                context.succeed(
                  generateResponse(
                    buildSpeechletResponse(`Your Email ID is ${senderMail}`, false),
                    {}
                  )
                );
                break;
            case "CatchAllIntent":
                if(event.request.intent.slots.CatchAll.value !== undefined){
                    input = event.request.intent.slots.CatchAll.value;
                }/*
                if(input !== "nothing"){
                    dateAdded = input.match(/\d{2}([\/.-])\d{2}\1\d{4}/g) 
                    || input.toLowerCase().match(/january|february|march|april|may|june|july|august|september|october|november|december/);
                }
                */
                //DynamoDB
                var parameters = {
                    Item: {
                        date: Date.now(),
                        message: input
                    },
                    TableName: 'transcription'
                };
                
                //Email
                var eParams = {
                    Destination: {
                        ToAddresses: [senderMail]
                    },
                    Message: {
                        Body: {
                            Text: {
                                Data: input
                            }
                        },
                        Subject: {
                            Data: meeting + " Transcription"
                        }
                    },
                    Source: "antarpreet13@gmail.com"
                };
    
                console.log('===SENDING EMAIL===');
                var emailToUser = ses.sendEmail(eParams, function(err, data){
                    if(err) console.log(err);
                    else {
                        docClient.put(parameters, function(err, data) {
                           if(err){
                               callback(err, null);
                           } else {
                               callback(null, data);
                           }
                        });
                        console.log("===EMAIL SENT===");
                        console.log(data);
            
            
                        console.log("EMAIL CODE END");
                        console.log('EMAIL: ', email);
                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse(`You said ${input}, an Email has been sent to your account!`, false),
                                {}
                              )
                            );
            
                    }
                });
                break;
            default:
                context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);
        }
        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`);
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

};

// Helpers
var buildSpeechletResponse = (outputText, shouldEndSession) => {
    
  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  };

};

var generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };

};