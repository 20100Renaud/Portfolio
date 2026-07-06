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
