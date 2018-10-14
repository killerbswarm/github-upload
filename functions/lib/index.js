"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
//admin.initializeApp(functions.config().firebase);
admin.initializeApp();
/*
var serviceAccount = require('../../src/environments/chat-sdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-sdk-15611.firebaseio.com"
});
*/
exports.subscribeToTopic = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    yield admin.messaging().subscribeToTopic(data.token, data.topic);
    return `subscribed to ${data.topic}`;
}));
exports.unsubscribeFromTopic = functions.https.onCall((data, context) => __awaiter(this, void 0, void 0, function* () {
    yield admin.messaging().unsubscribeFromTopic(data.token, data.topic);
    return `unsubscribed from ${data.topic}`;
}));
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
exports.newMessageRecieved = functions.firestore
    .document('messages/{messagesId}')
    .onUpdate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newMessage = change.after.data();
    // ...or the previous value before this update
    //const previousValue = change.before.data();
    // access a particular field as you would any JS property
    //const message = newValue.message;
    if (newMessage.read == true) {
        console.log('do nothing');
        return null;
    }
    else {
        const notification = {
            title: 'New Message Recieved!',
            body: newMessage.message
        };
        const payload = {
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
//# sourceMappingURL=index.js.map