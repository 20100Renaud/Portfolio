import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDepoCreatedEmail(email, depo) {
    await resend.emails.send({
        from: "delivered@resend.dev",
        // Si on créer un compte Reedus et avons un nom de domaine, nous pourrons déployer avec l'envoi des emails
        // Il suffira de remplir avec `email` au lieu de mon addresse mail perso
        to: "12168@holbertonstudents.com",
        subject: "Votre dépôt a été été créé",
        html: `
            <h1>Bonjour !</h1>
            <p>Votre dépôt "${depo.Title_Depo}" a bien été créé.</p>
        `
    });
}

export async function sendAnswerReceivedEmail(email, sender, depo, answer) {
    await resend.emails.send({
        from: "delivered@resend.dev",
        //email is the email of the owner of the depo. It has to be put here
        to: "12168@holbertonstudents.com",
        subject: `${depo.Title_Depo} got a new answer!`,
        html: `
            <h1><strong>${sender.Login_User}</strong> responded to your depo!</h1>
            <br>
            <p>${answer.Text_Answer}</p>
        `
    });
}
