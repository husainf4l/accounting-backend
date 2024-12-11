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
  ) {}

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

    await fs.ensureDir(backupDir);

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
      console.log(`Zipping the backup file: ${fileName}`);
      await this.createZip(localPath, zipFilePath);

      await bucket.upload(zipFilePath, {
        destination: `ovovex_db/papayatrading/${zipFileName}`,
        metadata: {
          contentType: 'application/zip',
        },
      });
      
      console.log(`Backup ${zipFileName} uploaded to Firebase successfully.`);
      await fs.unlink(zipFilePath);
    } catch (error) {
      console.error(`Error uploading backup ${zipFileName} to Firebase:`, error);
      throw error;
    }
  }

  private async createZip(sourceFile: string, zipFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
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

    const terminateConnectionsCommand = `
      PGPASSWORD=${dbPassword} psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d postgres -c "
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${dbName}'
        AND pid <> pg_backend_pid();
      "
    `;
    const dropCommand = `PGPASSWORD=${dbPassword} psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d postgres -c "DROP DATABASE IF EXISTS ${dbName};"`;
    const createCommand = `PGPASSWORD=${dbPassword} psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d postgres -c "CREATE DATABASE ${dbName};"`;
    const restoreCommand = `PGPASSWORD=${dbPassword} psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} -f ${filePath}`;

    try {
      await this.execPromise(terminateConnectionsCommand);
      await this.execPromise(dropCommand);
      await this.execPromise(createCommand);
      await this.execPromise(restoreCommand);
    } catch (error) {
      console.error('Error during database restoration:', error);
      throw new HttpException('Database restoration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private execPromise(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error:', stderr);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
