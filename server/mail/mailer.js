import nodemailer from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport'

const transporter = nodemailer.createTransport( 'smtps://mailer.learnersguild@gmail.com:tensionresolved@smtp.gmail.com' );

const sendInviteEmail = user => {
  return transporter.sendMail( inviteOptions( user.email, user.token ))
}

const sendWelcomeEmail = user => {
  return transporter.sendMail( welcomeOptions( user ) )
}

const fromAddress = 'mailer.learnersguild@gmail.com'

const inviteOptions = ( toAddress, token ) => {
  const url = `/api/invites/verify/${token}`

  return {
    from: `"Trossello" ${fromAddress}`,
    to: toAddress,
    subject: `You've been invited to a Trossello board`,
    text: 'Welcome to your new board. Click the link below to join this board',
    html: (
      `<p> You received this email because someone invited you to a Trossello board. Click this link to accept the invitation <strong><a href=${url}>Invite Link</a></strong></p>`
    ),
  }
}

const welcomeOptions = userEmail => {
  return {
    from: `"Trossello" ${fromAddress}`,
    to: userEmail,
    subject: `Welcome to Trossello`,
    text: 'Welcome to Trossello.',
    html: ( '<p>Welcome</p>' ),
  }
}

// const mailer = (email, token) => {
//   if (process.env.NODE_ENV === 'production') {
//     const options = {
//     auth: {
//       api_user: process.env.SG_USER,
//       api_key: process.env.SG_PASS
//     }
//   }
//   const transport = nodemailer.createTransport( sgTransport( options ))
//   } else {
//   const transporter = nodemailer.createTransport('smtps://mailer.learnersguild@gmail.com:tensionresolved@smtp.gmail.com');
//   }
//
//   const fromAddress = 'mailer.learnersguild@gmail.com'
//   const invitesEmail = transporter.templateSender({
//     subject: `You've been invited to a Trossello board`,
//     text: 'Welcome to your new board. Click the link below to join this board'
//     html: (
//       '<p> You received this email because someone invited you to a Trossello board. Click this link to accept the invitation <strong><a href="{{inviteLink}}">Invite Link</a></strong></p>'
//     ),
//   }, {
//     from: fromAddress
//   })
// }
export default { sendInviteEmail, sendWelcomeEmail }
