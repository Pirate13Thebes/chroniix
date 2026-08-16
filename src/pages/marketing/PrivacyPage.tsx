import { Navbar } from '../../components/marketing/Navbar';
import { Footer } from '../../components/marketing/Footer';
import { useLanguage } from '../../hooks/useLanguage';

export function PrivacyPage() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const lastUpdatedDate = 'July 6, 2026';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '4rem 5%', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--chronix-navy)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
          {isFr ? `Dernière mise à jour : ${lastUpdatedDate}` : `Last updated: ${lastUpdatedDate}`}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
          <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>
            {isFr
              ? "Nous rédigeons ce document en français simple, car c'est ainsi que nous faisons tout le reste."
              : "We keep this in plain English, because that's how we do everything."}
          </p>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? 'Qui sommes-nous' : 'Who we are'}
            </h2>
            <p>
              {isFr
                ? "Chronix (« nous », « notre ») est une plateforme de gestion des présences opérée depuis Beau Plan, Pamplemousses, Maurice. Si votre employeur utilise Chronix, il est le responsable du traitement de vos données de travail ; nous traitons ces données en son nom. Pour toute question : chronix.mu@gmail.com."
                : 'Chronix ("we", "us") is a workforce attendance platform operated from Beau Plan, Pamplemousses, Mauritius. If your employer uses Chronix, they are the data controller for your work records; we process that data on their behalf. Questions: chronix.mu@gmail.com.'}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? 'Ce que nous collectons' : 'What we collect'}
            </h2>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <li>
                <strong>{isFr ? 'Détails du compte :' : 'Account details:'}</strong>{' '}
                {isFr ? 'votre nom, e-mail, téléphone, rôle et département — fournis par vous ou votre employeur.' : 'your name, email, phone number, role, and department — provided by you or your employer.'}
              </li>
              <li>
                <strong>{isFr ? 'Données de présence :' : 'Attendance data:'}</strong>{' '}
                {isFr ? 'vos heures d\'entrée et de sortie, les heures travaillées et la méthode de pointage utilisée.' : 'your clock-in and clock-out times, hours worked, and the check-in method used.'}
              </li>
              <li>
                <strong>{isFr ? 'Données de localisation :' : 'Location data:'}</strong>{' '}
                {isFr ? 'la position de votre appareil au moment précis où vous pointez, associée à votre fiche de présence. Nous ne suivons pas votre position en dehors du pointage.' : 'your device\'s location at the moment you clock in or out, attached to your attendance record. We do not track your location outside of clock-in and clock-out.'}
              </li>
              <li>
                <strong>{isFr ? 'Demandes et réclamations :' : 'Requests and claims:'}</strong>{' '}
                {isFr ? 'demandes de congés, remboursements de frais, justificatifs et tout document que vous importez.' : 'leave requests, expense claims, receipts, and any documents you attach.'}
              </li>
              <li>
                <strong>{isFr ? 'Données techniques de base :' : 'Technical basics:'}</strong>{' '}
                {isFr ? 'heures de connexion, type de navigateur et journaux systèmes pour maintenir le service sécurisé.' : 'login times, browser type, and similar logs that keep the service secure.'}
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? 'Pourquoi nous l\'utilisons' : 'What we use it for'}
            </h2>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <li>{isFr ? 'Enregistrer les présences et calculer précisément les heures travaillées.' : 'Recording attendance and calculating hours accurately.'}</li>
              <li>{isFr ? 'Permettre à votre employeur de gérer les congés, les frais professionnels et la paie.' : 'Letting your employer manage leave, expenses, and payroll.'}</li>
              <li>{isFr ? 'Sécuriser les comptes et prévenir les fraudes de pointage.' : 'Keeping accounts secure and preventing fraud.'}</li>
              <li>{isFr ? 'Améliorer le service et les fonctionnalités de Chronix.' : 'Improving Chronix.'}</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              {isFr
                ? "C'est tout. Nous ne vendons pas vos données. Nous n'affichons pas de publicité. Nous ne partageons vos informations avec personne, sauf avec les prestataires techniques indispensables au fonctionnement du service (comme l'hébergement), qui sont soumis à des contrats de confidentialité stricts."
                : "That's it. We do not sell your data. We do not show ads. We do not share your information with anyone except the service providers we need to run the platform (like hosting), and they're bound by strict contracts."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? 'Vos droits (Data Protection Act 2017)' : 'Your rights (Data Protection Act 2017)'}
            </h2>
            <p>
              {isFr
                ? 'Vous pouvez demander à voir les données personnelles que nous détenons à votre sujet, les corriger ou — lorsque la loi le permet — les supprimer. Écrivez à chronix.mu@gmail.com et nous vous répondrons. Vous pouvez également déposer une plainte auprès du bureau de protection des données de Maurice (Data Protection Office) si vous n\'êtes pas satisfait.'
                : 'You can ask to see the personal data we hold about you, correct it, or — where the law allows — have it deleted. Write to chronix.mu@gmail.com and we\'ll respond. You can also complain to the Data Protection Office of Mauritius if you\'re not satisfied.'}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? 'Combien de temps nous conservons les données' : 'How long we keep data'}
            </h2>
            <p>
              {isFr
                ? "Les dossiers de présence et de paie sont conservés aussi longtemps que votre employeur en a besoin pour répondre à ses obligations légales (la loi mauricienne sur le travail et la fiscalité impose de conserver les dossiers pendant plusieurs années). Lorsque les données ne sont plus nécessaires, elles sont supprimées."
                : "Attendance and payroll records are kept as long as your employer needs them to meet legal obligations (Mauritian employment and tax law requires records to be kept for several years). When data is no longer needed, it's deleted."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? 'Sécurité' : 'Security'}
            </h2>
            <p>
              {isFr
                ? "Les données sont cryptées en transit, les mots de passe sont hachés (jamais stockés en texte clair), et l'accès est limité par rôle — un employé ne voit que ses propres dossiers, les administrateurs ne voient que ceux de leur entreprise."
                : "Data is encrypted in transit, passwords are hashed (never stored in plain text), and access is limited by role — an employee sees only their own records; admins see only their own company."}
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? 'Modifications' : 'Changes'}
            </h2>
            <p>
              {isFr
                ? "Si nous modifions cette politique, nous mettrons à jour la date indiquée en haut et informerons les gérants de compte de tout changement important."
                : "If we change this policy, we'll update the date above and notify account owners of anything significant."}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
