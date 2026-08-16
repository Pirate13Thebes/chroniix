import { Navbar } from '../../components/marketing/Navbar';
import { Footer } from '../../components/marketing/Footer';
import { useLanguage } from '../../hooks/useLanguage';

export function AboutPage() {
  const { lang } = useLanguage();

  const isFr = lang === 'fr';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Navbar />
      
      <main style={{ flexGrow: 1, padding: '4rem 5%', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--chronix-navy)', marginBottom: '2rem', letterSpacing: '-0.5px' }}>
          {isFr ? 'À Propos de Chronix' : 'About Chronix'}
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--chronix-navy)', lineHeight: 1.6 }}>
            {isFr 
              ? "Nous en avions assez de voir des entreprises sérieuses perdre de l'argent à cause d'une simple feuille de papier."
              : "We got tired of watching good businesses lose money to a piece of paper."}
          </p>

          <p>
            {isFr
              ? "À travers Maurice, les propriétaires et les gérants continuent de suivre les présences sur des cahiers ou des feuilles Excel. Chaque mois, quelqu'un passe ses soirées à faire correspondre les noms avec les heures travaillées, en espérant que les calculs soient justes. Parfois, ce n'est pas le cas. Des employés sont payés pour des heures non effectuées, ou à l'inverse, des travailleurs honnêtes se retrouvent sous-payés à cause d'une feuille perdue."
              : "Across Mauritius, owners and managers still track attendance in notebooks and spreadsheets. Every month, someone stays up late matching names to hours, hoping the numbers are right. Sometimes they're not. Sometimes people get paid for hours they never worked. Sometimes honest workers get underpaid because a page went missing."}
          </p>

          <p>
            {isFr
              ? "Chronix résout ce problème."
              : "Chronix fixes that."}
          </p>

          <p>
            {isFr
              ? "C'est une plateforme simple où vos employés pointent directement depuis leur téléphone, avec la position GPS enregistrée à chaque pointage. Vous voyez qui travaille en direct, de n'importe où. Les congés, notes de frais et chiffres de paie vivent tous au même endroit. Pas de papier. Pas de nuits blanches. Pas d'erreur."
              : "It's one simple platform where your team clocks in with their phone, with the GPS location captured at every check-in. You see who's working, right now, from anywhere. Leave requests, expense claims, and payroll numbers all live in the same place. No paper. No late nights. No guessing."}
          </p>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--chronix-navy)', marginTop: '2rem', marginBottom: '0.5rem' }}>
            {isFr ? 'Construit ici, pour ici.' : 'Built here, for here.'}
          </h2>

          <p>
            {isFr
              ? "Chronix est un produit 100% mauricien. Nous connaissons les hôtels du Nord, les chantiers de construction, les usines, les commerces de Port-Louis. Nous avons conçu Chronix pour correspondre au fonctionnement réel des entreprises mauriciennes — en français et en anglais, avec des tarifs pensés pour les PME, et une simplicité telle que toute votre équipe saura s'en servir dès le premier jour."
              : "Chronix is a Mauritian product. We know the hotels in the north, the construction sites, the factories, the shops in Port Louis. We built Chronix for the way Mauritian businesses actually work — in English and French, priced for SMEs, and simple enough that your whole team can use it on day one."}
          </p>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--chronix-navy)', marginTop: '2rem', marginBottom: '0.5rem' }}>
            {isFr ? 'Ce que nous croyons' : 'What we believe'}
          </h2>

          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
            <li>
              <strong>{isFr ? "Aucun gérant ne devrait passer ses nuits à vérifier des feuilles de pointage." : "No owner should spend their nights auditing attendance sheets."}</strong>
            </li>
            <li>
              <strong>{isFr ? "Chaque travailleur mérite d'être payé exactement pour les heures qu'il a effectuées." : "Every worker deserves to be paid exactly for the hours they worked."}</strong>
            </li>
            <li>
              <strong>{isFr ? "Un logiciel doit rester simple. Si votre équipe a besoin d'une formation pour pointer, c'est que c'est trop compliqué." : "Software should be simple. If your team needs training to clock in, it's too complicated."}</strong>
            </li>
          </ul>

          <p style={{ marginTop: '2rem', fontStyle: 'italic', fontWeight: 500, color: 'var(--chronix-navy)' }}>
            {isFr 
              ? "Chronix. Sachez qui travaille. Anticipez chaque absence. Gérez votre équipe en toute confiance."
              : "Chronix. Know who's working. Catch every absence. Manage your team with total confidence."}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
