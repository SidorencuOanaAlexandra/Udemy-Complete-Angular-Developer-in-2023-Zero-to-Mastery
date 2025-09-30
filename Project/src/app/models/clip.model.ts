import firebase from 'firebase/compat/app'

export default interface IClip {
    uid: string;
    displayName: string;
    title: string;
    fileName: string;
    url: string;
    screenShotUrl: string;
    timestamps: firebase.firestore.FieldValue;
    docId?: string,
    screenshotFileName :string;
}