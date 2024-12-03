import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

export const firebaseOvovex = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "gixatco",
        clientEmail: "firebase-adminsdk-ddc3f@gixatco.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCVHgO2+2y0TtEY\nMH7s2X8lp21VoNmwU/ryHKXFuVOXOAH/gOK0snkiEcwOXdzQ4mA+W0B8YP3bYDn0\nD8bzdtVstEDuUP9nOXTpph55Eo8ibqsD70TEUS6Yn+GEhcF8GWutdU/UzAkkGm9i\nDP2bZwLX0PbWE9en70oMqJGJmhFNo6GHHdGRa+U1sEm/ON8+U6EoTGRRMdTUx9r1\n1scO8u/kctbusFypES3z52+lKi+tAtu0Rn7SUSVBoXTD5MKn7iYSJpGjmfJu8FP+\n5hqOs2CO6Ksw+Sub38h4txanNckanHQ2LFprSh3E3v4X380oXZ4Wx9WaofWbI0UM\n/OeQGA+zAgMBAAECggEANlqU7w9xfb3XALK4qTvUWVTQiSxS/S93YuYnVM2rVw0O\nyWPg/w2pEs6a60eydB94BnK7rDqsfdjy9vADTH5t6CxCGLxEhItQftRS+j3WF65w\nPsRp9AdFbVOl3+jjcIlRkw4WVdIzqMnL/NkQXiNryV/9gWYFL00NWFTfi+ExWnNy\nbhfxiU3ScIW+dvYiiN9sIhCE4clPmTBAm8ZwLiQNdf9SuwWumJdAFtNk+dWA/lmg\nyy8JiCd9RZbo/m+CRwO40b3/OiM8eJUSsggvx8JmQXuU11nk1QIqpTsEjiptBOrP\npxYEha4GX+zVDxvApZR5Yh8Us6dDxN807EfFfCEFcQKBgQDQ17ihWL3WqX53y/o3\nbUYSBw/tXc7pQVTFE+KCQhf65UPwXyS+syronvDaOJ4IlRCUrVES/kCzvZL+wt2I\neMAG4SzrJQsoiifmZaIxkufjhRmftluZwUGsJRHrcBey0U4MXkH77NacZ1fmYJav\n+UmxP+TdXF5YK0gm8tbja17WYwKBgQC2ydQpROXvZuTe6jWvl2CiC2T5MfqpPFvI\n49WcBUUC5UBvh4UKjYR8kws3CVGVcqIRkJeG1O/5LhDSspgvvEoAojvnuVaBMfka\nyUKazWFHChQTpqb6ETJP7BXCFxzwO+FgLUlLV26c2SUnt1zVu9ZPsTq3yV6RVMwR\niueqPoM6cQKBgFZ8P1Vx7ovq/RiXPDOf6RimHA5sfrdR+szygyb2QAAC2bO9cvYW\nNHrI920nbSqYsJkhfSWkbR8CLtGZ2Swe9UbkETn/yTMso4FiLVziPW2XPRlK53ww\n8AVeBKG/ddDzpKKylhjB5841bc1VypFtZvskPp79FYTlx6d5gUwEtu2JAoGAJMYs\nMfVTkTuRNivGi0IYReGm+d+NP3kOOjdkJVSGEtQOh6GrKXlZOzrWGcd9K2T5qDD/\n2zeB5A7ZgZo+tfPaq4/4H2GRPsLQDAyLottJA+LKMT3pAAxvo9aqdfbycn6JlDDo\nOwknDtU8/WWNfs6gij3sw0b3CKQXvjvE6eJTwnECgYEAtUXyHb+3EqBwxU+0cDmt\niLLlHZmSmYqlYZYpJubSjXwNjQ3berC82Jl8WGG3jomveLsxQkqMzgAUorerVi/R\nYKdj6Ud7VZkO50KTJyIhJM+v094u3JwazsDcu7EyZoz8lJik9QGhkHjjcFLVLO4b\nFJBVffSaqNDDuO1eOblcYsE=\n-----END PRIVATE KEY-----\n",
    }),
    storageBucket: 'gixatco.firebasestorage.app',

}, 'ovovex');

export const firebasePointVs1 = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'pointsv1',
        clientEmail: "firebase-adminsdk-xzk1c@pointsv1.iam.gserviceaccount.com",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFJmypCCrwDfry\nBprNE1aZ9x6XbNX/FOHnO5GdmA+wQ4AzjDX+SL+WzS545tnEe9DFKwGwWUfyPasb\nc+jukPZWPkJP0BEwg/hCr8kSfcOHDlSgtpEFDwVLSJnDcvNtSTfTcAhUofyXM4zY\nEeWCG6cSLLiTOmFRlpn8UjIcvPHKYx8KvPFp4u2MREToB7Id93EdhioUOe0Urxv7\nADua+NZwI83Bc2GmN1DDqiZZ1c4Z2dOI3YrY9t3CQJDHAOwfdfHbMzFCnygl2zhb\np1LDVzl0+RVjWP23FKU5CmtdMGKBIh24+olhMTiP7SgcA5UVEUpXbN0f5xJ2VO/l\nVRfBpH0LAgMBAAECggEANxMY38+MTytYoyv9KrTwSGqkfSDGV0/6G6KkdyX3nAH/\nWmcc3kBsZTBEfzneM+ly1OHCwwTt+FoJ5s1mkN6mMkmKNMmnQ6paPCbnQOcpLB1w\nvsTBlmwvymwpqFQAdNMzaTmu2hW2fnbELcgyGTqoXYdouJhif2xW8An2Pdj6otK4\nRBQUJzuiBhbq866t997fSjyAq3oj1RnrUf0QE67uW9NKhpZs96+dbmVSBDgc8msF\naOqaLZ1WMaIKqkQxPa1gbAtqyG5DSttDQhlG5cHgsD10TkUBs9R5i6HSlY6Riuj0\nLpBOto3HkEeZHXfI/emttbQYv91NBMK839PsbPEIoQKBgQDqSfqBNRK/NbK82b7O\nEhk5gZ6zgqyI0kSRS0bb77oGhAu9AGCs3r4ZbYlLZfa/aUMyhysAhKgaZkNUs2LC\nCVGzadvuPki2xZqQ1KJhDAIp1VeoQ/kWyfTJfr6PlJRCp2yACys3GtNWI7S3FIqM\n3F4FApfKhF4Xje3NvmVDsI2X3QKBgQDXa2cZL51SRzrg5Sbqx0iq0CW7B4d49v7d\n+F/MRzJ6iB7phQt/R2GnOlkBTOKQlYSQuzkf//ggnLLz+ee4vhF6NshRAIUJt/lP\nzqkXF5SCbAgNtOsBQiqT9zcFWYNb9Nt+lmxqgl/soSTKOb4vdj5vO6NCUWWQGumn\nyxXqF4BOBwKBgQC0Vh8xBzYX4fBjdsNsgPfTkNckW4gMhLTslWHEduDclRUn9Lt1\nNLpkfjC4zZJBQXfM08ggzPtL3r0i3DU/H8c4b1ovJtf3f2B67IDUbFbZ9nJTfYak\nqOz3j8yEXhxEtfRJFs+7ybU0T6WRaok+5XylJJrL8lkujjumK1Bs6uACLQKBgEKi\nRlHUGKXKwruuJkuZOTEdEY641X7laBDhM0DNBSBB2s4BCX1lZx+DPOTaE3sFxOu/\n/fuYAfiUgAZX1wWeRWm4aF4l+wD2l3fIRSWPdbCiGhujSs4o2WLLpYlSFv/qzbpq\nbT7E9UcM0YR8OAgWW1ms6OMqqm/Y402z1COFAXshAoGAQeadNeqOusc5whdip0FC\nHq9EKpBFpRU4a5bFRSLTSbB0aKCfbyyYsdoeOYrXEhK+P1Uk3vxjlp63g/xwW2bi\nNcMYW3TnFftPUfdNOK/hw/L03hpWgV5JQNfiSVMV7NARVrXzFbGCPb6nhnQwDAr9\nF8MPUr4SENniVmh0xEcSD2M=\n-----END PRIVATE KEY-----\n",
    }),
}, 'pointvs1');


export const firestoreOvovex = firebaseOvovex.firestore();
export const firestorePointVs1 = firebasePointVs1.firestore();

