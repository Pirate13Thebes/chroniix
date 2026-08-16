import { Navbar } from '../../components/marketing/Navbar';
import { Footer } from '../../components/marketing/Footer';
import { useLanguage } from '../../hooks/useLanguage';

export function TermsPage() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const lastUpdatedDate = 'July 6, 2026';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '4rem 5%', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--chronix-navy)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          {isFr ? 'Conditions d\'Utilisation' : 'Terms of Service'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
          {isFr ? `Dernière mise à jour : ${lastUpdatedDate}` : `Last updated: ${lastUpdatedDate}`}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
          <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>
            {isFr
              ? "Les règles écrites de manière simple et courte — comme promis."
              : "The fine print, kept plain and short — as promised."}
          </p>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? '1. Ce qu\'est Chronix' : '1. What Chronix is'}
            </h2>
            <p>
              {isFr
                ? "Chronix est une plateforme en ligne de gestion des présences et du temps de travail, accessible à l'adresse chronix.com. Il n'y a pas d'application à télécharger ; elle s'exécute directement dans votre navigateur internet."
                : "Chronix is a web-based workforce attendance and management platform, accessed at chronix.com. There is no downloadable app; it runs in your browser."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? '2. Votre compte' : '2. Your account'}
            </h2>
            <p>
              {isFr
                ? "Les entreprises s'inscrivent et ajoutent leurs employés. Vous êtes responsable de la confidentialité de vos identifiants de connexion et de tout ce qui se passe sous votre compte. Prévenez-nous immédiatement si vous pensez que quelqu'un d'autre y a accès."
                : "Businesses sign up and add their employees. You're responsible for keeping your login details private and for what happens under your account. Tell us immediately if you think someone else has access."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? '3. Tarifs et paiement' : '3. Pricing and payment'}
            </h2>
            <p>
              {isFr
                ? "Chronix coûte 100 Rs par employé actif et par mois, avec un minimum de 1 500 Rs par mois. Un « employé actif » désigne toute personne en mesure de pointer au cours de ce mois. Les factures sont émises mensuellement. Si un paiement échoue, nous vous en informerons avant de suspendre le service — nous ne sommes pas là pour vous surprendre."
                : "Chronix costs MUR 100 per active employee per month, with a minimum of MUR 1,500 per month. An \"active employee\" is anyone able to clock in during that month. Invoices are due monthly. If payment fails, we'll remind you before anything is suspended — we're not here to surprise you."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? '4. Usage loyal' : '4. Fair use'}
            </h2>
            <p>
              {isFr
                ? "Utilisez Chronix honnêtement. N'essayez pas de pirater le service, de le copier, de le revendre ou de l'utiliser pour enfreindre les droits de quiconque. Les employeurs doivent utiliser les fonctionnalités de présence et de localisation conformément aux lois en vigueur et en informer préalablement leurs employés — c'est une obligation légale, pas seulement une règle de courtoisie."
                : "Use Chronix honestly. Don't try to break it, copy it, resell it, or use it to violate anyone's rights. Employers must use attendance and location features lawfully and inform their employees about them — that's a legal requirement, not just good manners."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? '5. Vos données' : '5. Your data'}
            </h2>
            <p>
              {isFr
                ? "Les données de votre entreprise vous appartiennent. Nous les traitons uniquement pour faire fonctionner le service, comme décrit dans notre Politique de confidentialité. Si vous quittez Chronix, vous pouvez exporter vos dossiers avant votre départ, et nous supprimerons vos données après une période raisonnable de clôture."
                : "Your business data belongs to you. We process it to run the service, as described in our Privacy Policy. If you leave Chronix, you can export your records first, and we'll delete your data after a reasonable wind-down period."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? '6. Disponibilité' : '6. Availability'}
            </h2>
            <p>
              {isFr
                ? "Nous faisons tout notre possible pour que Chronix fonctionne 24h/24, mais aucun service n'est infaillible. Nous pouvons occasionnellement suspendre le service brièvement pour maintenance, et nous vous préviendrons à l'avance dans la mesure du possible."
                : "We work hard to keep Chronix running around the clock, but no service is perfect. We may occasionally take it down briefly for maintenance, and we'll give notice when we can."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? '7. Responsabilité' : '7. Liability'}
            </h2>
            <p>
              {isFr
                ? "Chronix fournit des registres de présence et des chiffres prêts pour la paie, mais votre entreprise reste seule responsable de ses décisions finales en matière de paie, de taxes et de droit du travail. Dans la mesure autorisée par la loi mauricienne, notre responsabilité est limitée aux frais payés au cours des 12 derniers mois."
                : "Chronix provides attendance records and payroll-ready numbers, but your business remains responsible for its final payroll, tax, and employment-law decisions. To the extent Mauritian law allows, our liability is limited to the fees you paid us in the previous 12 months."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? '8. Résiliation' : '8. Ending things'}
            </h2>
            <p>
              {isFr
                ? "Vous pouvez annuler votre abonnement à tout moment ; le service se poursuit jusqu'à la fin de la période payée. Nous pouvons suspendre les comptes qui ne respectent pas ces conditions — nous vous avertirons d'abord, sauf en cas de manquement grave."
                : "You can cancel anytime; the service runs until the end of your paid period. We can suspend accounts that break these terms — we'll warn you first unless the breach is serious."}
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--chronix-navy)', marginBottom: '0.5rem' }}>
              {isFr ? '9. Droit applicable' : '9. Law'}
            </h2>
            <p>
              {isFr
                ? "Ces conditions sont régies par les lois de la République de Maurice, et les tribunaux mauriciens ont compétence exclusive en cas de litige."
                : "These terms are governed by the laws of the Republic of Mauritius, and Mauritian courts have jurisdiction."}
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <p>
              {isFr 
                ? 'Pour toute question concernant ces conditions : chronix.mu@gmail.com.'
                : 'Questions about any of this: chronix.mu@gmail.com.'}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
