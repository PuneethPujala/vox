export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  console.log('[Email Stub] Sending email:');
  console.log(`  To: ${options.to}`);
  console.log(`  Subject: ${options.subject}`);
  console.log(`  Body: ${options.body}`);
}

export function getVendorDocumentApprovedEmail(
  vendorName: string,
  vendorEmail: string
): EmailOptions {
  return {
    to: vendorEmail,
    subject: 'Your vendor verification documents have been approved',
    body: `Dear ${vendorName},\n\nYour vendor verification documents have been reviewed and approved. You can now access the product management features.\n\nBest regards,\nVox Admin Team`,
  };
}

export function getVendorDocumentRejectedEmail(
  vendorName: string,
  vendorEmail: string,
  notes: string
): EmailOptions {
  return {
    to: vendorEmail,
    subject: 'Your vendor verification documents require revision',
    body: `Dear ${vendorName},\n\nYour vendor verification documents have been reviewed and require revision.\n\nReviewer Notes:\n${notes}\n\nPlease resubmit your documents with the necessary corrections.\n\nBest regards,\nVox Admin Team`,
  };
}

export function getVendorDocumentSubmittedEmail(
  vendorName: string,
  adminEmail: string
): EmailOptions {
  return {
    to: adminEmail,
    subject: `New vendor verification submission from ${vendorName}`,
    body: `A new vendor verification submission has been received from ${vendorName}. Please review the documents in the admin panel.\n\nBest regards,\nVox System`,
  };
}
