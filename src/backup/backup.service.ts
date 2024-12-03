import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as admin from 'firebase-admin';
import { Cron } from '@nestjs/schedule';
import * as url from 'url';
import archiver from 'archiver';



@Injectable()
export class BackupService {
    constructor(
        @Inject('FIREBASE_APP_OVOVEX') private readonly firebaseAppOvovex: admin.app.App,
    ) { }


    @Cron('0 0 * * *') // Run daily at midnight
    async scheduleBackup() {
        await this.backupDatabase();
    }

    async generateBackup(): Promise<string> {
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
            throw new Error('DATABASE_URL is not defined in the environment variables.');
        }

        const parsedUrl = new url.URL(databaseUrl);
        const dbUser = parsedUrl.username;
        const dbPassword = parsedUrl.password;
        const dbHost = parsedUrl.hostname;
        const dbPort = parsedUrl.port || '5432'; // Default to 5432 if not provided
        const dbName = parsedUrl.pathname.replace('/', ''); // Remove the leading /

        const backupDir = path.resolve(__dirname, '../../backups');
        const backupPath = path.resolve(backupDir, `backup-${new Date().toISOString().replace(/:/g, '-')}.sql`);

        // Ensure the backups directory exists
        await fs.ensureDir(backupDir);

        // Construct the pg_dump command
        const command = `PGPASSWORD=${dbPassword} pg_dump -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} > ${backupPath}`;

        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error creating database backup:', stderr);
                    reject(error);
                } else {
                    console.log('Database backup created:', backupPath);
                    resolve(backupPath);
                }
            });
        });
    }



    async uploadToFirebase(localPath: string): Promise<void> {
        const bucket = this.firebaseAppOvovex.storage().bucket();
        const fileName = path.basename(localPath);
        const zipFileName = `${fileName}.zip`;
        const zipFilePath = path.resolve(path.dirname(localPath), zipFileName);

        try {
            // Step 1: Create a zip file
            console.log(`Zipping the backup file: ${fileName}`);
            await this.createZip(localPath, zipFilePath);

            // Step 2: Upload the zip file to Firebase
            await bucket.upload(zipFilePath, {
                destination: `ovovex_db/papayatrading/${zipFileName}`,
                metadata: {
                    contentType: 'application/zip',
                },
            });
            console.log(`Backup ${zipFileName} uploaded to Firebase successfully.`);

            // Step 3: Cleanup the local zip file
            await fs.unlink(zipFilePath);
            console.log(`Local zip file ${zipFilePath} deleted.`);
        } catch (error) {
            console.error(`Error uploading backup ${zipFileName} to Firebase:`, error);
            throw error;
        }
    }

    /**
     * Creates a zip file from the specified file.
     * @param sourceFile - The path of the source file to zip.
     * @param zipFilePath - The destination path of the zip file.
     */
    private async createZip(sourceFile: string, zipFilePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver('zip', {
                zlib: { level: 9 }, // Compression level
            });

            output.on('close', () => {
                console.log(`Zip file created: ${zipFilePath} (${archive.pointer()} total bytes)`);
                resolve();
            });

            archive.on('error', (err) => {
                console.error('Error creating zip file:', err);
                reject(err);
            });

            archive.pipe(output);
            archive.file(sourceFile, { name: path.basename(sourceFile) });
            archive.finalize();
        });
    }


    // Perform the full backup process
    async backupDatabase(): Promise<void> {
        try {
            const backupPath = await this.generateBackup();
            await this.uploadToFirebase(backupPath);
            await fs.unlink(backupPath);
        } catch (error) {
            console.error('Error during backup process:', error);
        }
    }
    async restoreDatabase(filePath: string): Promise<void> {
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
            throw new HttpException('DATABASE_URL is not defined in the environment variables.', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const parsedUrl = new URL(databaseUrl);
        const dbUser = parsedUrl.username;
        const dbPassword = parsedUrl.password;
        const dbHost = parsedUrl.hostname;
        const dbPort = parsedUrl.port || '5432';
        const dbName = parsedUrl.pathname.replace('/', '');

        const systemDatabase = 'postgres'; // Use the system database for management commands

        const terminateConnectionsCommand = `
          PGPASSWORD=${dbPassword} psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${systemDatabase} -c "
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '${dbName}'
            AND pid <> pg_backend_pid();
          "
        `;

        const dropCommand = `PGPASSWORD=${dbPassword} psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${systemDatabase} -c "DROP DATABASE IF EXISTS ${dbName};"`;
        const createCommand = `PGPASSWORD=${dbPassword} psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${systemDatabase} -c "CREATE DATABASE ${dbName};"`;
        const restoreCommand = `PGPASSWORD=${dbPassword} psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} -f ${filePath}`;

        console.log(`Restoring database from file: ${filePath}`);

        try {
            // Terminate active connections
            console.log(`Terminating active connections to database: ${dbName}`);
            await this.execPromise(terminateConnectionsCommand);
            console.log(`Active connections to ${dbName} terminated successfully.`);

            // Drop the database
            console.log(`Dropping database: ${dbName}`);
            await this.execPromise(dropCommand);
            console.log(`Database ${dbName} dropped successfully.`);

            // Create the database
            console.log(`Creating database: ${dbName}`);
            await this.execPromise(createCommand);
            console.log(`Database ${dbName} created successfully.`);

            // Restore the database
            console.log(`Restoring database: ${dbName}`);
            await this.execPromise(restoreCommand);
            console.log(`Database restored successfully.`);
        } catch (error) {
            console.error('Error during database restoration:', error);
            throw new HttpException('Database restoration failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper function to handle exec promises
    private execPromise(command: string): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error:', stderr);
                    reject(error);
                } else {
                    console.log('Output:', stdout);
                    resolve();
                }
            });
        });
    }







}
