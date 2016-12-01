import nodemailer from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport'

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

export default {

  transporter: (env => {
    switch(env){

      case 'test':
        const testMailer = {
          sendMail(options){
            this.sentEmails.push(options)
            return Promise.resolve({options})
          },
          reset(){
            this.sentEmails = []
            return this
          }
        }
        return testMailer.reset()

      case 'production':
        return nodemailer.createTransport(
          sgTransport({
            auth: {
              api_user: process.env.SENDGRID_USERNAME,
              api_key: process.env.SENDGRID_PASSWORD
            }
          })
        )

      case 'development':
        return nodemailer.createTransport( 'smtps://mailer.learnersguild@gmail.com:tensionresolved@smtp.gmail.com' )

      default:
        throw new Error('unknown mail transporter for NODE_ENV='+env)
    }
  })(process.env.NODE_ENV),

  sendInviteEmail(invite){
    return this.transporter.sendMail( inviteOptions( invite.email, invite.token ))
  },

  sendWelcomeEmail(user){
    return this.transporter.sendMail( welcomeOptions( user.email, user.name ))
  }

}
