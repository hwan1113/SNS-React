import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDYJ7CjkaUnP3MJbHXxWVxwk4CiZEFkw34",
    authDomain: "sns-react.firebaseapp.com",
    databaseURL: "https://sns-react.firebaseio.com",
    projectId: "sns-react",
    storageBucket: "sns-react.appspot.com",
    messagingSenderId: "220516660340",
    appId: "1:220516660340:web:e545954b326a83e01b8d21",
    measurementId: "G-QPCSCM7RPK"
};

try {
    firebase.initializeApp(config);
    // firebase.analytics();
} catch (e) {
    console.error('Error initializing firebase — check your source code');
    console.error(e);
}

export { firebase };
