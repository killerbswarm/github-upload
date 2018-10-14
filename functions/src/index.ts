import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
//admin.initializeApp(functions.config().firebase);
admin.initializeApp();
/*
var serviceAccount = require('../../src/environments/chat-sdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-sdk-15611.firebaseio.com"
});
*/
export const subscribeToTopic = functions.https.onCall(
    async (data, context) => {
      await admin.messaging().subscribeToTopic(data.token, data.topic);
  
      return `subscribed to ${data.topic}`;
    }
);
  
export const unsubscribeFromTopic = functions.https.onCall(
  async (data, context) => {
    await admin.messaging().unsubscribeFromTopic(data.token, data.topic);
  
    return `unsubscribed from ${data.topic}`;
  }
);
/*
export const sendOnFirestoreCreate = functions.firestore
.document('messages/{messageId}')
.onCreate(async snapshot => {
  const message = snapshot.data();

  const notification: admin.messaging.Notification = {
    title: 'New Message Recieved!',
    body: message.title
  };

  const payload: admin.messaging.Message = {
    notification,
    webpush: {
      notification: {
        icon: '../../src/assets/imgs/logo.png',
      }
    },
    topic: 'messages'
  };

  return admin.messaging().send(payload);
});
*/
export const newMessageRecieved = functions.firestore
.document('messages/{messagesId}')
.onUpdate((change, context) => {
  // Get an object representing the document
  // e.g. {'name': 'Marie', 'age': 66}
  const newMessage = change.after.data();
  // ...or the previous value before this update
  //const previousValue = change.before.data();
  // access a particular field as you would any JS property
  //const message = newValue.message;
    if (newMessage.read == true){
      console.log('do nothing')
      return null;
    } else {
  const notification: admin.messaging.Notification = {
    title: 'New Message Recieved!',
    body: newMessage.message
  };
  const payload: admin.messaging.Message = {
    notification,
    webpush: {
      notification: {
        icon: 'https://firebasestorage.googleapis.com/v0/b/ionic3chat-1cac4.appspot.com/o/29a75-A2769_3-184.jpg?alt=media&token=4b69ff87-9e23-4bcb-8033-e563e3ebfa20',
      }
    },
    topic: 'messages'
  };
  return admin.messaging().send(payload);
}
});