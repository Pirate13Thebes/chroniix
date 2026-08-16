import { Clock, CalendarDays, Receipt, BarChart3, MapPin, QrCode } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const FEATURES_DATA = {
  en: [
    {
      icon: Clock,
      title: 'Real-time Attendance Tracking',
      description: 'Monitor clock-ins and clock-outs instantly across all branches. Verify who is currently on shift, see live department headcounts, and reduce supervisor overhead with real-time audit logs.',
      points: ['Live headcount stats', 'Automatic overtime logs', 'Supervisor dashboards']
    },
    {
      icon: MapPin,
      title: 'GPS Check-In',
      description: 'See exactly where your team clocked in from. Every check-in is tagged with a GPS location captured from the employee\'s phone, so you have a clear record for every retail branch, hotel, or construction zone.',
      points: ['GPS-tagged clock-ins', 'Mobile browser location', 'Per-site attendance history']
    },
    {
      icon: QrCode,
      title: 'Contactless QR Code Scanning',
      description: 'Turn any tablet or terminal into a secure, shared kiosk. Employees simply scan their personal QR codes from their phone to clock in and out within milliseconds.',
      points: ['High-speed scanning', 'No app downloads required', 'Shared entrance hardware']
    },
    {
      icon: CalendarDays,
      title: 'Leave & Absence Management',
      description: 'Review and approve leave requests without paper delays. Staff submit annual, sick, or personal leave requests from their profile, updating the schedule instantly.',
      points: ['Real-time balance tracking', 'Flexible approval flows', 'Calendar sync integration']
    },
    {
      icon: Receipt,
      title: 'Digital Reimbursement Claims',
      description: 'Review travel, meals, or supply expenses with complete receipts. Staff upload photos of invoices, and HR can easily review, approve, and track payouts in MUR.',
      points: ['Receipt photo uploads', 'MUR currency standard', 'Decided status audit trail']
    },
    {
      icon: BarChart3,
      title: 'Automated Reports & CSV Exports',
      description: 'Export clean, payroll-ready CSV worksheets. Gather summary sheets on overtime, late arrivals, absences, and location reports in one click to sync with your payroll tools.',
      points: ['Payroll-ready CSV files', 'Overtime summaries', 'Department metrics reports']
    }
  ],
  fr: [
    {
      icon: Clock,
      title: 'Suivi de Présence en Temps Réel',
      description: 'Supervisez instantanément les entrées et sorties dans toutes vos succursales. Vérifiez qui est en service et réduisez la paperasse administrative grâce aux journaux automatisés.',
      points: ['Effectifs en temps réel', 'Heures supplémentaires auto', 'Tableaux de bord superviseurs']
    },
    {
      icon: MapPin,
      title: 'Pointage GPS',
      description: 'Sachez exactement d\'où votre équipe a pointé. Chaque pointage est associé à une position GPS captée depuis le téléphone de l\'employé, pour un historique clair par magasin, hôtel ou chantier.',
      points: ['Pointages géolocalisés', 'Localisation sur navigateur mobile', 'Historique de présence par site']
    },
    {
      icon: QrCode,
      title: 'Lecture de Code QR Sans Contact',
      description: 'Transformez n\'importe quelle tablette en borne de pointage partagée. Les employés scannent leur code QR personnel depuis leur téléphone pour s\'enregistrer en quelques millisecondes.',
      points: ['Lecture ultra-rapide', 'Aucun téléchargement requis', 'Matériel d\'entrée partagé']
    },
    {
      icon: CalendarDays,
      title: 'Gestion des Congés & Absences',
      description: 'Examinez et approuvez les demandes de congé sans délai. Les employés soumettent des congés annuels, maladie ou personnels depuis leur téléphone, mettant à jour le planning en direct.',
      points: ['Soldes de congés en direct', 'Flux d\'approbation flexibles', 'Mise à jour immédiate du calendrier']
    },
    {
      icon: Receipt,
      title: 'Notes de Frais et Remboursements',
      description: 'Gérez les frais de transport, repas ou fournitures avec reçus. Les employés photographient leurs justificatifs, et les RH peuvent approuver les paiements en roupies mauriciennes.',
      points: ['Importation de reçus', 'Monnaie MUR standardisée', 'Historique des approbations']
    },
    {
      icon: BarChart3,
      title: 'Rapports Automatisés & Exports CSV',
      description: 'Exportez des feuilles de calcul CSV propres et prêtes pour la paie. Générez des résumés sur les heures supplémentaires, retards et absences pour vos outils comptables.',
      points: ['Fichiers CSV prêts pour la paie', 'Détails des heures sup', 'Performance par département']
    }
  ]
} as const;

export function FeaturesSection() {
  const { t, lang } = useLanguage();
  const revealRef = useScrollReveal<HTMLElement>();

  const activeFeatures = FEATURES_DATA[lang === 'fr' ? 'fr' : 'en'];

  return (
    <section className="section reveal" id="features" ref={revealRef}>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>{t('featuresTitle')}</h2>
      <div className="features-grid">
        {activeFeatures.map((f) => (
          <div className="card" key={f.title} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="stat-card-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)', marginBottom: '1rem' }}>
              <f.icon size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, flexGrow: 1, margin: 0 }}>
              {f.description}
            </p>
            
            {/* Sub points list */}
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: '1.25rem 0 0 0', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem'
            }}>
              {f.points.map((point) => (
                <li key={point} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
