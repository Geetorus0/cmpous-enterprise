import nodemailer from "nodemailer";
import { logger } from "./logger";

// A promise that holds the initialization
let initPromise: Promise<nodemailer.Transporter> | null = null;

/**
 * Initializes the mailer.
 * Uses SMTP settings from environment variables if present.
 * Otherwise, creates an Ethereal test account automatically.
 */
export async function initMailer() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || "587"),
        secure: parseInt(SMTP_PORT || "587") === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
      logger.info(`Mailer initialized using SMTP: ${SMTP_HOST}`);
      return transporter;
    } else {
      // Generate a test account on Ethereal Email
      logger.info("No SMTP credentials found. Creating Ethereal test account in background...");
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info(`Ethereal test account created: ${testAccount.user}`);
      return transporter;
    }
  })();

  return initPromise;
}

// Kick off initialization immediately so it doesn't block the first request
initMailer().catch((err) => logger.error(`Failed to initialize mailer: ${err.message}`));

/**
 * Sends an email using the initialized transporter.
 */
export async function sendEmail(options: nodemailer.SendMailOptions) {
  const mailer = await initMailer();
  
  const defaultOptions: nodemailer.SendMailOptions = {
    from: '"Campus Enterprise" <noreply@campus-enterprise.edu>',
    ...options,
  };

  try {
    const info = await mailer.sendMail(defaultOptions);
    logger.info(`Email sent to ${options.to}: ${info.messageId}`);
    
    // If using Ethereal, log the preview URL so the developer can see the email
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info(`[MAILER] Preview URL: ${previewUrl}`);
      console.log(`\n\n📫 [MAILER] PREVIEW EMAIL: ${previewUrl}\n\n`);
    }
    
    return { success: true, info };
  } catch (err: any) {
    logger.error(`Error sending email: ${err.message}`);
    return { success: false, error: err.message };
  }
}
