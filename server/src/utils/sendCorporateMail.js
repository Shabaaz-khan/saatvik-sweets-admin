import transporter from "./mailer.js";

export default async function sendCorporateMail(data) {
  /*
      OWNER EMAIL
  */

  await transporter.sendMail({
    from: `"Saatvik Website" <${process.env.SMTP_USER}>`,

    to: process.env.MAIL_TO,

    cc: process.env.MAIL_CC,

    subject: `New Corporate Inquiry - ${data.company}`,

    html: `
    <div style="font-family:Arial;padding:20px">

        <h2 style="color:#7a1f2b">
            New Corporate Inquiry
        </h2>

        <table
            cellpadding="8"
            cellspacing="0"
            border="1"
            style="border-collapse:collapse;width:100%"
        >

            <tr>
                <td><b>Company</b></td>
                <td>${data.company}</td>
            </tr>

            <tr>
                <td><b>Contact Person</b></td>
                <td>${data.contact}</td>
            </tr>

            <tr>
                <td><b>Email</b></td>
                <td>${data.email}</td>
            </tr>

            <tr>
                <td><b>Phone</b></td>
                <td>${data.phone}</td>
            </tr>

            <tr>
                <td><b>Quantity</b></td>
                <td>${data.quantity}</td>
            </tr>

            <tr>
                <td><b>Event Date</b></td>
                <td>${data.eventDate || "-"}</td>
            </tr>

            <tr>
                <td><b>Budget</b></td>
                <td>${data.budget || "-"}</td>
            </tr>

            <tr>
                <td><b>Message</b></td>
                <td>${data.message || "-"}</td>
            </tr>

        </table>

    </div>
    `,
  });

  /*
      CUSTOMER EMAIL
  */

  await transporter.sendMail({
    from: `"Saatvik Sweets" <${process.env.SMTP_USER}>`,

    to: data.email,

    subject: "Thank You For Contacting Saatvik Sweets",

    html: `
    <div style="font-family:Arial;padding:25px">

        <h2 style="color:#7a1f2b">
            Thank You!
        </h2>

        <p>

            Dear <b>${data.contact}</b>,

        </p>

        <p>

            Thank you for contacting
            <b>Saatvik Sweets & Savouries.</b>

        </p>

        <p>

            We have successfully received your
            corporate gifting inquiry.

        </p>

        <p>

            Our team will contact you within
            <b>one business day.</b>

        </p>

        <br>

        <p>

            Regards,

        </p>

        <b>

            Saatvik Sweets & Savouries

        </b>

    </div>
    `,
  });
}