import nodemailer from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport'

const sgOptions = {
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD
  }
}

const transporter = process.env.NODE_ENV === 'production' ?
  nodemailer.createTransport(sgTransport(sgOptions)) :
  nodemailer.createTransport( 'smtps://mailer.learnersguild@gmail.com:tensionresolved@smtp.gmail.com' );

const sendInviteEmail = user => {
  return transporter.sendMail( inviteOptions( user.email, user.token ), ( err , res ) => {
    if (err){
      console.log(err)
    } else {
      console.log(res);
    }
  })
}

const sendWelcomeEmail = user => {
  return transporter.sendMail( welcomeOptions( user.email, user.name ))
}

const fromAddress = 'no-reply@trossello.com'

const inviteOptions = ( toAddress, token ) => {
  const url = process.env.NODE_ENV === 'production' ?
  `trossello.herokuapp.com/invites/verify/${token}`:
  `/api/invites/verify/${token}`

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

const welcomeOptions = ( userEmail, userName) => {
  return {
    from: `"Trossello" ${fromAddress}`,
    to: userEmail,
    subject: `Welcome to Trossello`,
    text: 'Welcome to Trossello.',
    html: ( `<p>Welcome ${userName}</p>` ),
  }
}
export { sendInviteEmail, sendWelcomeEmail }
