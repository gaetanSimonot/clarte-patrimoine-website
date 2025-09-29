import { Resend } from 'resend';

export const config = {
  runtime: 'nodejs'
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Configuration CORS pour permettre les requêtes depuis votre domaine
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { prenom, nom, email, telephone, sujet, message, source } = req.body;

    // Validation des champs requis
    if (!prenom || !nom || !email || !sujet || !message) {
      return res.status(400).json({
        error: 'Tous les champs marqués avec * sont obligatoires'
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Adresse email invalide'
      });
    }

    // Mappage des sujets pour l'affichage
    const sujetsMap = {
      'audit-patrimoine': 'Audit de patrimoine',
      'gestion-assurance': 'Gestion du portefeuille d\'assurance',
      'planification-financiere': 'Planification financière',
      'optimisation-fiscale': 'Optimisation fiscale et retraite',
      'autre': 'Autre demande'
    };

    const sujetLibelle = sujetsMap[sujet] || sujet;

    // Email à Elodie
    const emailToElodie = {
      from: 'noreply@lebian-clartepatrimoine.ch',
      to: 'elodie@lebian-clartepatrimoine.ch',
      subject: `Nouvelle demande d'audit - Clarté Patrimoine`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2c5aa0 0%, #1e3f73 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Nouvelle Demande d'Audit</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Clarté Patrimoine</p>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #2c5aa0; margin-top: 0;">Informations du contact :</h2>

            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333; width: 120px;">Nom :</td>
                  <td style="padding: 8px 0; color: #666;">${nom} ${prenom}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Email :</td>
                  <td style="padding: 8px 0; color: #666;">
                    <a href="mailto:${email}" style="color: #2c5aa0; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                ${telephone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Téléphone :</td>
                  <td style="padding: 8px 0; color: #666;">
                    <a href="tel:${telephone}" style="color: #2c5aa0; text-decoration: none;">${telephone}</a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Sujet :</td>
                  <td style="padding: 8px 0; color: #666;">${sujetLibelle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #333;">Source :</td>
                  <td style="padding: 8px 0; color: #666;">${source || 'Site web'}</td>
                </tr>
              </table>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #2c5aa0; margin-top: 0;">Message :</h3>
              <div style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>
          </div>

          <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Cet email a été envoyé automatiquement depuis le site web Clarté Patrimoine.</p>
          </div>
        </div>
      `
    };

    // Email de confirmation au client
    const emailToClient = {
      from: 'noreply@lebian-clartepatrimoine.ch',
      to: email,
      subject: 'Merci pour votre demande d\'audit - Clarté Patrimoine',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2c5aa0 0%, #1e3f73 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Merci pour votre demande !</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Clarté Patrimoine</p>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <p style="font-size: 16px; color: #333; margin-top: 0;">Bonjour ${prenom},</p>

            <p style="color: #666; line-height: 1.6;">
              Merci pour votre demande d'audit ! J'ai bien reçu votre message concernant : <strong>${sujetLibelle}</strong>.
            </p>

            <p style="color: #666; line-height: 1.6;">
              Je vous recontacterai dans les <strong>24-48h</strong> pour organiser notre première consultation et répondre à toutes vos questions.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2c5aa0;">
              <h3 style="color: #2c5aa0; margin-top: 0;">Rappel de votre demande :</h3>
              <div style="color: #666; white-space: pre-wrap;">${message}</div>
            </div>

            <p style="color: #666; line-height: 1.6;">
              En attendant notre échange, n'hésitez pas à consulter ma page
              <a href="https://www.lebian-clartepatrimoine.ch/faq.html" style="color: #2c5aa0;">Questions Fréquentes</a>
              qui pourrait répondre à certaines de vos interrogations.
            </p>

            <p style="color: #666; line-height: 1.6;">
              Cordialement,<br>
              <strong>Elodie Le Bian</strong><br>
              Intermédiaire en assurance non liée, certifié FINMA
            </p>
          </div>

          <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #fff;">Clarté Patrimoine</strong> - Elodie Le Bian
            </p>
            <p style="margin: 0;">
              📧 elodie@lebian-clartepatrimoine.ch | 📞 +41 79 744 08 86
            </p>
          </div>
        </div>
      `
    };

    // Envoi des emails
    await resend.emails.send(emailToElodie);
    await resend.emails.send(emailToClient);

    return res.status(200).json({
      success: true,
      message: 'Email envoyé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return res.status(500).json({
      error: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
    });
  }
}