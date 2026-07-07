import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!transporter && EMAIL_USER && EMAIL_PASS) {
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail', // Fallback or can use custom host/port
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
      console.log('✉️  Nodemailer SMTP Transporter initialized.');
    } catch (err) {
      console.error('✉️  Failed to initialize Nodemailer transporter:', err);
    }
  }
  return transporter;
}

// Send Admin Notification Email
export async function sendAdminInquiryNotification(inquiry: any) {
  const client = getTransporter();
  const subject = `[AURA DESIGN INTAKE] New Client Liaison - ${inquiry.name}`;
  const text = `
    A new client liaison request has been recorded.
    
    Name: ${inquiry.name}
    Email: ${inquiry.email}
    Phone: ${inquiry.phone || 'N/A'}
    Category: ${inquiry.category || 'N/A'}
    Guests Count: ${inquiry.guests || inquiry.guestsCount || 'N/A'}
    Details/Notes: ${inquiry.details || inquiry.notes || 'No notes provided'}
    
    Access the AURA Administrator Dashboard to manage this lead.
  `;

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #0B1B2A;">A U R A</span>
        <p style="font-size: 10px; text-transform: uppercase; tracking: 2px; color: #D4A737; margin-top: 5px;">Design Lab Intake Gate</p>
      </div>
      <h3 style="color: #0B1B2A; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">Liaison Record Registered</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4a4a4a; width: 120px;">Client Name:</td>
          <td style="padding: 8px 0; color: #0B1B2A;">${inquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4a4a4a;">Email Address:</td>
          <td style="padding: 8px 0; color: #0B1B2A;">${inquiry.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4a4a4a;">Phone:</td>
          <td style="padding: 8px 0; color: #0B1B2A;">${inquiry.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4a4a4a;">Event Type:</td>
          <td style="padding: 8px 0; color: #0B1B2A; text-transform: capitalize;">${inquiry.category || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4a4a4a;">Guest Metric:</td>
          <td style="padding: 8px 0; color: #0B1B2A;">${inquiry.guests || inquiry.guestsCount || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4a4a4a; vertical-align: top;">Special Notes:</td>
          <td style="padding: 8px 0; color: #4a4a4a; font-style: italic; line-height: 1.5;">${inquiry.details || inquiry.notes || 'None'}</td>
        </tr>
      </table>
      <div style="margin-top: 40px; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 20px;">
        <p style="font-size: 11px; color: #999;">AURA Mayfair Studio • Private Registry Protocol</p>
      </div>
    </div>
  `;

  if (client) {
    try {
      await client.sendMail({
        from: `"AURA Design Intake" <${EMAIL_USER}>`,
        to: EMAIL_USER,
        subject,
        text,
        html,
      });
      console.log(`✉️  Notification email successfully routed to administrator.`);
    } catch (err) {
      console.error('✉️  Failed to transmit admin notification email:', err);
    }
  } else {
    console.log('✉️  [SIMULATED EMAIL TO ADMIN] (Set EMAIL_USER & EMAIL_PASS to send real emails):');
    console.log(`To: ${EMAIL_USER || 'Admin'}\nSubject: ${subject}\nContent:\n${text}`);
  }
}

// Send Client Auto-Reply Email
export async function sendClientAutoReply(inquiry: any) {
  const client = getTransporter();
  const subject = `Establishing Connection: AURA Spatial Design Lab`;
  const text = `
    Dear ${inquiry.name},
    
    Thank you for establishing a connection with the AURA design studio.
    We have successfully registered your inquiry coordinates for ${inquiry.category || 'Bespoke Events'}.
    
    A senior lead director from our Mayfair headquarters will review your details and initiate direct liaison with you within 24 hours.
    
    With our highest esteem,
    
    The AURA Design Lab
    Mayfair, London
  `;

  const html = `
    <div style="font-family: 'Times New Roman', Times, serif; max-width: 600px; margin: 0 auto; padding: 50px 40px; border: 1px solid #eaeaea; background-color: #fafbfd; color: #0B1B2A;">
      <div style="text-align: center; margin-bottom: 40px;">
        <span style="font-size: 28px; font-weight: 300; letter-spacing: 6px; color: #0B1B2A; text-transform: uppercase;">A U R A</span>
        <div style="font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: #D4A737; margin-top: 8px;">London • Mayfair Studio</div>
      </div>
      
      <p style="font-size: 15px; line-height: 1.8; font-weight: 300; color: #1c2b39;">Dear ${inquiry.name},</p>
      
      <p style="font-size: 14px; line-height: 1.8; font-weight: 300; color: #3e4e5e; text-align: justify;">
        We acknowledge receipt of your correspondence. Your details regarding the orchestration of a prospective <strong>${inquiry.category || 'Bespoke Experience'}</strong> have been securely registered within the Private Registry.
      </p>
      
      <p style="font-size: 14px; line-height: 1.8; font-weight: 300; color: #3e4e5e; text-align: justify;">
        A senior spatial design director will personally analyze your details. We will initiate contact directly within the next 24 business hours to organize a private consultation.
      </p>
      
      <div style="margin: 40px 0; border-top: 1px double #d4a737; border-bottom: 1px double #d4a737; padding: 15px 0; text-align: center;">
        <span style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #D4A737;">Protocol Code: AUR-${Math.floor(Math.random() * 90000 + 10000)}</span>
      </div>
      
      <p style="font-size: 14px; line-height: 1.8; font-weight: 300; color: #1c2b39; margin-top: 40px;">
        With our highest esteem,
      </p>
      <p style="font-size: 14px; font-weight: bold; color: #0B1B2A; margin-top: 5px; letter-spacing: 1px;">
        AURA Design Director Suite
      </p>
      
      <div style="margin-top: 60px; text-align: center; border-top: 1px solid #eaeaea; padding-top: 20px; font-size: 10px; color: #999; letter-spacing: 1px;">
        Strict Confidentiality Assured • Mayfair Registry
      </div>
    </div>
  `;

  if (client) {
    try {
      await client.sendMail({
        from: `"AURA Design Director" <${EMAIL_USER}>`,
        to: inquiry.email,
        subject,
        text,
        html,
      });
      console.log(`✉️  Auto-reply email sent successfully to client ${inquiry.email}.`);
    } catch (err) {
      console.error('✉️  Failed to transmit client auto-reply email:', err);
    }
  } else {
    console.log('✉️  [SIMULATED EMAIL TO CLIENT] (Set EMAIL_USER & EMAIL_PASS to send real emails):');
    console.log(`To: ${inquiry.email}\nSubject: ${subject}\nContent:\n${text}`);
  }
}
