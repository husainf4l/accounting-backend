import { Module, Global } from '@nestjs/common';
import { firebaseOvovex, firebasePointVs1 } from './firebase.config';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
    providers: [
        {
            provide: 'FIREBASE_APP_OVOVEX',
            useValue: firebaseOvovex, // Provide the first Firebase Admin App instance
        },
        {
            provide: 'FIREBASE_APP_POINTVS1',
            useValue: firebasePointVs1, // Provide the second Firebase Admin App instance
        },
        FirebaseService,
    ],
    exports: ['FIREBASE_APP_OVOVEX', 'FIREBASE_APP_POINTVS1', FirebaseService],
})
export class FirebaseModule { }
