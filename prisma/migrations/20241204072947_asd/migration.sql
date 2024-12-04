-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fcmToken" TEXT,
ADD COLUMN     "profileImage" TEXT NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/gixatco.firebasestorage.app/o/settings%2Fshared%2FuserDefult.png?alt=media&token=fd30d796-77fc-4ca5-86c9-9494c243d81e';
