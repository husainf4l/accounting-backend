import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
    constructor(
        @Inject('FIREBASE_APP_OVOVEX') private readonly firebaseAppPoint: admin.app.App,
        @Inject('FIREBASE_APP_POINTVS1') private readonly firebaseAppPointVs1: admin.app.App,
    ) { }

    async sendNotification(token: string, title: string, body: string, app: 'point' | 'pointvs1') {
        const firebaseApp = app === 'point' ? this.firebaseAppPoint : this.firebaseAppPointVs1;

        console.log('Firebase App Instance:', firebaseApp.name);
        console.log('Messaging Service:', typeof firebaseApp.messaging);

        const message = {
            token,
            notification: {
                title,
                body,
            },
        };

        try {
            const response = await firebaseApp.messaging().send(message);
            console.log('Notification sent successfully:', response);
            return { success: true, response };
        } catch (error) {
            console.error('Error sending notification:', error);
            throw new Error('Failed to send notification');
        }
    }
}
