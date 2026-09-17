import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Send email to the depo owner on receiving an answer
export async function sendAnswerReceivedEmail(email, sender, depo, answer) {
    await resend.emails.send({
        from: "delivered@resend.dev",
        // Si on créer un compte Reedus et avons un nom de domaine, nous pourrons déployer avec l'envoi des emails
        // Il suffira de remplir avec `email` au lieu de mon addresse mail perso
        to: "12156@holbertonstudents.com",
        subject: `${depo.Title_Depo} got a new answer!`,
        html: `
            <h1><strong>${sender.Login_User}</strong> responded to your depo!</h1>
            <br>
            <p>${answer.Text_Answer}</p>
        `
    });
}

// 2 choices : Send a private message or send a public message

// Send email from user (applicant) to owner to exchange contact info (email)
export async function AskEmail(email, owner, applicant, depo) {
    await resend.emails.send({
        from: "delivered@resend.dev",
        to: "12156@holbertonstudents.com",
        subject: `${applicant.Login_User} want to share his email with you !`,
        html: `
        Hello ${owner.Login_User} !
        ${applicant.Login_user} wants to share his coordinates with you to discuss about your post: ${depo.Title_Depo}
        <br>
        You can make contact with him with this email:
        ${applicant.Email_user}
        `
    })
}
