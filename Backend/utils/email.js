import sgMail from "@sendgrid/mail";

let initialized = false;

function initSendGrid() {
  if (initialized) return;

  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !apiKey.startsWith("SG.")) {
    throw new Error("SENDGRID_API_KEY missing or invalid");
  }

  if (!from) {
    throw new Error("SENDGRID_FROM_EMAIL missing");
  }

  sgMail.setApiKey(apiKey);
  initialized = true;
}

export async function sendEmail({ to, subject, html }) {
  initSendGrid();

  return sgMail.send({
    from: `fitness App <${process.env.SENDGRID_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
}
