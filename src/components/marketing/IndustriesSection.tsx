import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

import hospitality2 from '../../assets/industries/hospitality-2.jpg';
import construction1 from '../../assets/industries/construction-1.jpg';
import retail1 from '../../assets/industries/retail-1.jpg';
import manufacturing1 from '../../assets/industries/manufacturing-1.jpg';
import logistics1 from '../../assets/industries/logistics-1.jpg';
import agriculture1 from '../../assets/industries/agriculture-1.jpg';
import healthcare1 from '../../assets/industries/healthcare-1.jpg';
import education1 from '../../assets/industries/education-1.jpg';
import bpo1 from '../../assets/industries/bpo-1.jpg';
import financial1 from '../../assets/industries/financial-1.jpg';
import foodbeverage1 from '../../assets/industries/foodbeverage-1.jpg';
import security1 from '../../assets/industries/security-1.jpg';

const INDUSTRIES = [
  {
    name: 'Hospitality',
    description: "Hotels and restaurants run on shifts. See who showed up for breakfast service before the first guest sits down.",
    photo: hospitality2,
  },
  {
    name: 'Construction',
    description: "Your sites are spread across the island. GPS clock-in means you know who's on which site, without driving there.",
    photo: construction1,
  },
  {
    name: 'Retail',
    description: "Multiple shops, rotating staff, weekend rushes. One dashboard shows every store at once.",
    photo: retail1,
  },
  {
    name: 'Manufacturing',
    description: "Shift changeovers, overtime, night teams. Chronix tracks every hour so payroll matches reality.",
    photo: manufacturing1,
  },
  {
    name: 'Logistics',
    description: "Drivers and warehouse teams start early and finish late. Clock-ins from the road, records you can trust.",
    photo: logistics1,
  },
  {
    name: 'Agriculture',
    description: "From field crews to harvesting teams. GPS clock-ins verify attendance across large farms and estates.",
    photo: agriculture1,
  },
  {
    name: 'Healthcare',
    description: "Clinics and care teams can't afford gaps in coverage. Know instantly when a shift isn't filled.",
    photo: healthcare1,
  },
  {
    name: 'Education',
    description: "Teaching and support staff across campuses. Simple attendance, clean records for administration.",
    photo: education1,
  },
  {
    name: 'BPO & ICT',
    description: "Night shifts, split shifts, and 24/7 campaigns. See every seat filled and every hour tracked accurately.",
    photo: bpo1,
  },
  {
    name: 'Financial Services',
    description: "Compliance needs clean records. Every clock-in is timestamped, verified, and export-ready.",
    photo: financial1,
  },
  {
    name: 'Food & Beverage',
    description: "From prep cooks to front-of-house staff. Know who is on shift at every outlet in real time.",
    photo: foodbeverage1,
  },
  {
    name: 'Security Services',
    description: "Guards rotating across different posts. GPS verification confirms that every site is covered.",
    photo: security1,
  },
];

const INDUSTRY_DETAILS = {
  en: {
    Hospitality: {
      gdp: '8% of Mauritius GDP',
      workforce: '40,000+ employees',
      heading: '24/7 Shift Coverage & Multi-Property Audits',
      details: [
        'Tourism and hospitality drive the island\'s economy, but managing housekeeping, culinary, and front desk rotations across resort properties is complex.',
        'Chronix gives resort managers a live overview of active shifts across all properties in real time. Staff clock in from their smartphones in seconds, eliminating timecard inflation and ensuring key departments are fully staffed for breakfast and night shifts.'
      ],
      points: ['Multi-property attendance lists', 'Direct overtime calculation', 'No specialized hardware required']
    },
    Construction: {
      gdp: '5% of Mauritius GDP',
      workforce: '50,000+ field workers',
      heading: 'GPS Site Logins & Precision Tracking',
      details: [
        'With chantiers spread from Grand Baie to Bel Ombre, managing contractors and ensuring site presence is a massive challenge for builders.',
        'Chronix tags every clock-in with a GPS location, so supervisors can see exactly which site a crew checked in from without leaving the main office, cutting down timesheet disputes immediately.'
      ],
      points: ['GPS-tagged clock-ins', 'Offline-resilient logs', 'Detailed contractor reports']
    },
    Retail: {
      gdp: '12% of Mauritius GDP',
      workforce: 'Over 60,000 workers in retail/wholesale',
      heading: 'Multi-Store Scheduling & Holiday Rotations',
      details: [
        'Managing cashiers, floor staff, and storeroom crews across multiple retail branches or shopping malls requires high coordination.',
        'Chronix connects all stores to a single dashboard. Managers see who is at the till in Bagatelle, Grand Baie La Croisette, or Port Louis instantly. Easily coordinate split shifts and weekend rotations to maintain full store coverage.'
      ],
      points: ['Multi-store live dashboard', 'Automatic public holiday multipliers', 'Store manager approvals']
    },
    Manufacturing: {
      gdp: '10% of Mauritius GDP',
      workforce: '45,000+ factory floor workers',
      heading: 'Workers\' Rights Act Compliance & Overtime Audits',
      details: [
        'Freezone factories and textile plants run around the clock. Ensuring payroll matches precise attendance records is critical for compliance.',
        'Chronix tracks every shift changeover, break duration, and overtime hour down to the minute. Ensure calculations strictly adhere to the Mauritian Workers\' Rights Act 2019 without manual timesheet calculations.'
      ],
      points: ['Workers\' Rights Act compliance', 'Overtime shift audit logs', 'Direct CSV payroll export']
    },
    Logistics: {
      gdp: '5.5% of Mauritius GDP',
      workforce: '25,000+ transport & warehouse workers',
      heading: 'Mobile GPS Pointing for Road and Hub Crews',
      details: [
        'Drivers, dispatchers, and warehouse handlers start early and finish late, moving across the island continuously.',
        'Chronix lets mobile drivers clock in from the road at authorized delivery points, verifying their location in milliseconds. Synced timesheet registers keep transport managers in control of payroll-ready records.'
      ],
      points: ['On-the-road mobile check-in', 'Warehouse hub tracking', 'Transport allowance audits']
    },
    Agriculture: {
      gdp: '3.5% of Mauritius GDP',
      workforce: '18,000+ agricultural workers',
      heading: 'Wide-Area Field Logs & Estate Monitoring',
      details: [
        'Sugar cane fields, tea estates, and local farms cover much of Mauritius. Traditional biometric machines cannot be installed in fields.',
        'Chronix enables field-level pointages via mobile GPS. Staff clock in directly at their assigned fields, providing instant presence proof to agricultural admins.'
      ],
      points: ['Field-level GPS logins', 'No mains power needed', 'Outdoor work confirmation']
    },
    Healthcare: {
      gdp: '4.5% of Mauritius GDP',
      workforce: '22,000+ medical and clinic staff',
      heading: 'Critical Attendance Alerts & Shift Safety',
      details: [
        'Clinics, pharmacies, and care homes run 24/7. Gaps in shifts directly affect patient safety and service delivery.',
        'Chronix gives clinic admins instant alerts if a scheduled nurse or pharmacist fails to check in. Keep essential departments covered and coordinate replacements with zero delay.'
      ],
      points: ['No-show supervisor alerts', '24/7 nursing shift support', 'Audit trail compliance']
    },
    Education: {
      gdp: '4.8% of Mauritius GDP',
      workforce: '15,000+ educators & support staff',
      heading: 'Campus-Wide Staff Tracking & Clean Records',
      details: [
        'Schools and colleges manage teachers, administrative support, and campus safety staff spread across classrooms.',
        'Chronix replaces paper registers with a centralized portal. Staff point in their respective department from any browser, generating transparent records for administration.'
      ],
      points: ['Browser-based campus pointage', 'Administrative summary sheets', 'Department logs']
    },
    'BPO & ICT': {
      gdp: '6.5% of Mauritius GDP',
      workforce: '30,000+ tech and call center experts',
      heading: 'Multi-Shift Campaign Logs & Night Shift Audits',
      details: [
        'Ebène Cybercity call centers serve global timezones. Managing split shifts and evening bonuses is crucial for HR operations.',
        'Chronix tracks night shifts and calculates exact premium rates. Managers see seat occupancy rates and verify attendance for every campaign.'
      ],
      points: ['Premium night shift tracking', 'Campaign occupancy logs', 'Split shift configuration']
    },
    'Financial Services': {
      gdp: '13% of Mauritius GDP',
      workforce: '15,000+ sector professionals',
      heading: 'Strict Regulatory Compliance & Audit Records',
      details: [
        'Banks, insurance firms, and offshore management companies operate in a highly regulated environment.',
        'Chronix logs every clock-in with tamper-proof timestamps and location coordinates. Generate clean, auditable records to satisfy compliance departments and internal audits.'
      ],
      points: ['Regulatory audit trails', 'Secure verification logs', 'Ebène headquarter support']
    },
    'Food & Beverage': {
      gdp: '4% of Mauritius GDP',
      workforce: '20,000+ restaurant and kitchen staff',
      heading: 'Outlet-Level Management & Fast Pointing',
      details: [
        'From kitchen prep teams starting at 5 AM to front-of-house staff leaving at midnight, F&B operations require tight scheduling.',
        'Chronix lets restaurant managers track attendance at each kitchen or restaurant outlet. Verify staffing level to ensure guests receive excellent service.'
      ],
      points: ['Kitchen shift handovers', 'Outlet-specific schedules', 'Phone GPS check-ins']
    },
    'Security Services': {
      gdp: '3% of Mauritius GDP',
      workforce: '12,000+ patrol guards',
      heading: 'Patrol Verification & Verifiable Client Logs',
      details: [
        'Security guard agencies deploy personnel across residential smart cities, banks, and office buildings.',
        'Chronix gives agency managers GPS proof that guards are physically present at their assigned posts, providing transparent billing records to clients.'
      ],
      points: ['Manned post GPS proof', 'Verifiable billing logs', 'Incident photo attachments']
    }
  },
  fr: {
    Hospitality: {
      gdp: '8% du PIB mauricien',
      workforce: '40 000+ salariés',
      heading: 'Couverture Horaire 24/7 et Suivi Hôtelier',
      details: [
        'Le tourisme et l\'hôtellerie animent l\'île, mais la gestion des plannings de réception, cuisine et ménage sur plusieurs sites est complexe.',
        'Chronix offre aux directeurs d\'hôtel une vue en temps réel de tous les effectifs actifs. Le pointage mobile en quelques secondes évite les erreurs de cartes d\'heures et assure la couverture des services.'
      ],
      points: ['Listes de présence multi-hôtels', 'Calcul direct des heures supplémentaires', 'Aucun équipement spécial requis']
    },
    Construction: {
      gdp: '5% du PIB mauricien',
      workforce: '50 000+ ouvriers',
      heading: 'Pointage Géolocalisé et Suivi de Chantiers',
      details: [
        'Avec des chantiers répartis de Grand Baie à Bel Ombre, s\'assurer de la présence des équipes sur site est un défi quotidien.',
        'Chronix associe chaque pointage à une position GPS, permettant aux superviseurs de voir précisément de quel chantier une équipe a pointé, sans avoir à se déplacer.'
      ],
      points: ['Pointages géolocalisés', 'Fonctionnement hors-ligne', 'Rapports de chantiers précis']
    },
    Retail: {
      gdp: '12% du PIB mauricien',
      workforce: '60 000+ employés de commerce',
      heading: 'Gestion Multi-Boutiques et Horaires de Malls',
      details: [
        'La gestion des caissiers et conseillers de vente dans les centres commerciaux (Bagatelle, La Croisette) requiert une coordination continue.',
        'Chronix centralise toutes vos boutiques sur un tableau de bord. Visualisez qui est en caisse à Port Louis ou Grand Baie et organisez facilement les shifts de week-end.'
      ],
      points: ['Tableau de bord multi-boutiques', 'Calcul automatique des heures fériées', 'Validation par chef de rayon']
    },
    Manufacturing: {
      gdp: '10% du PIB mauricien',
      workforce: '45 000+ ouvriers d\'usine',
      heading: 'Conformité Workers\' Rights Act 2019',
      details: [
        'Les usines des zones industrielles (Coromandel, Plaine Lauzun) fonctionnent sans interruption. Ajuster la paie selon les heures réelles est indispensable.',
        'Chronix calcule précisément les heures travaillées et supplémentaires, garantissant la conformité stricte avec la législation du travail mauricienne.'
      ],
      points: ['Conformité avec le Workers\' Rights Act', 'Historique d\'heures supplémentaires', 'Exports CSV de paie en 1 clic']
    },
    Logistics: {
      gdp: '5,5% du PIB mauricien',
      workforce: '25 000+ transporteurs & magasiniers',
      heading: 'Pointage GPS Mobile pour Livreurs et Dépôts',
      details: [
        'Les chauffeurs-livreurs et équipes logistiques se déplacent constamment à travers l\'île dès l\'aube.',
        'Chronix permet aux livreurs de pointer directement sur la route dans des zones autorisées, fournissant aux gérants des données d\'heures fiables.'
      ],
      points: ['Pointage mobile sur la route', 'Suivi des dépôts logistiques', 'Calcul des indemnités de transport']
    },
    Agriculture: {
      gdp: '3,5% du PIB mauricien',
      workforce: '18 000+ agriculteurs',
      heading: 'Pointages en Plein Air et Suivi de Champs',
      details: [
        'Les champs de canne, plantations de thé et fermes couvrent Maurice. Les bornes physiques y sont inutilisables.',
        'Chronix permet un pointage mobile en extérieur via GPS. Les employés s\'enregistrent sur leur parcelle, validant leur présence pour l\'administration.'
      ],
      points: ['Pointage GPS en plein champ', 'Sans alimentation électrique', 'Preuve de présence extérieure']
    },
    Healthcare: {
      gdp: '4,5% du PIB mauricien',
      workforce: '22 000+ soignants et pharmaciens',
      heading: 'Alertes d\'Absences et Sécurité des Services',
      details: [
        'Les cliniques et pharmacies fonctionnent en permanence. Les retards de personnel affectent directement la qualité des soins.',
        'Chronix envoie une notification immédiate au superviseur si un infirmier ou pharmacien manque son pointage, évitant les manques d\'effectifs.'
      ],
      points: ['Alerte absence en temps réel', 'Support des shifts de garde h24', 'Historique de présence sécurisé']
    },
    Education: {
      gdp: '4,8% du PIB mauricien',
      workforce: '15 000+ enseignants et administratifs',
      heading: 'Suivi de Campus et Transparence des Données',
      details: [
        'Les écoles et collèges gèrent des professeurs et personnels administratifs répartis sur plusieurs bâtiments.',
        'Chronix remplace les cahiers d\'émargement par un portail unique. Les enseignants pointent sur leur ordinateur ou mobile, simplifiant le suivi RH.'
      ],
      points: ['Pointage par navigateur sur campus', 'Tableaux de bord administratifs', 'Performance par faculté']
    },
    'BPO & ICT': {
      gdp: '6,5% du PIB mauricien',
      workforce: '30 000+ téléconseillers et techniciens',
      heading: 'Shifts de Nuit et Primes de Campagnes',
      details: [
        'Les centres d\'appels d\'Ebène opèrent sur plusieurs fuseaux horaires. Gérer les rotations nocturnes et indemnités associées est complexe.',
        'Chronix automatise le décompte des heures de nuit et calcule les primes de shifts pour chaque campagne internationale.'
      ],
      points: ['Calcul précis des heures de nuit', 'Taux d\'occupation de campagne', 'Shifts rotatifs complexes']
    },
    'Financial Services': {
      gdp: '13% du PIB mauricien',
      workforce: '15 000+ professionnels de la finance',
      heading: 'Conformité Réglementaire et Pistes d\'Audit',
      details: [
        'Les banques et sociétés fiduciaires d\'Ebène opèrent dans un cadre réglementaire strict nécessitant des relevés fiables.',
        'Chronix fournit des feuilles de présence inviolables avec coordonnées GPS et horodatage certifié pour vos audits de conformité.'
      ],
      points: ['Relevés certifiés pour conformité', 'Accès sécurisé par rôle', 'Assistance dédiée à Ebène']
    },
    'Food & Beverage': {
      gdp: '4% du PIB mauricien',
      workforce: '20 000+ cuisiniers et serveurs',
      heading: 'Gestion Multi-Points de Vente et Restauration',
      details: [
        'Des cuisiniers du matin aux serveurs du soir, la restauration demande des horaires de travail précis.',
        'Chronix aide à suivre les présences par restaurant ou cuisine. Assurez-vous d\'avoir le bon nombre d\'employés pour chaque service.'
      ],
      points: ['Rotation des brigades de cuisine', 'Horaires par point de vente', 'Contrôles GPS d\'outlet']
    },
    'Security Services': {
      gdp: '3% du PIB mauricien',
      workforce: '12 000+ agents de sécurité',
      heading: 'Rapports de Poste GPS et Facturation Clients',
      details: [
        'Les agences de sécurité déploient des gardes sur des sites résidentiels ou commerciaux à travers Maurice.',
        'Chronix certifie la présence réelle de chaque agent à son poste par GPS, vous donnant des preuves irréfutables pour la facturation client.'
      ],
      points: ['Preuve GPS de garde posté', 'Historique de facturation transparent', 'Rapports d\'incidents en ligne']
    }
  }
} as const;

export function IndustriesSection() {
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const revealRef = useScrollReveal<HTMLElement>();
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scrollTrack = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  // Carousel smooth auto-scrolling effect
  useEffect(() => {
    if (isHovered || selectedIndustry) return;

    const interval = setInterval(() => {
      if (trackRef.current) {
        const track = trackRef.current;
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        // Loop back to start if at the end, otherwise advance by 320px
        if (track.scrollLeft >= maxScroll - 15) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isHovered, selectedIndustry]);

  // Listen to industry search query changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const indParam = searchParams.get('industry');
    if (indParam) {
      const decodedParam = decodeURIComponent(indParam);
      const matched = INDUSTRIES.find(
        (ind) => ind.name.toLowerCase() === decodedParam.toLowerCase()
      );
      if (matched) {
        const idx = INDUSTRIES.indexOf(matched);

        // Deferred rather than called directly in the effect body — avoids
        // a same-tick cascading re-render, and lines up with the scroll
        // below anyway (150ms is imperceptible).
        setTimeout(() => {
          setSelectedIndustry(matched.name);

          const sectionElement = document.getElementById('industries');
          if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          
          if (trackRef.current) {
            const cards = trackRef.current.children;
            if (cards && cards[idx]) {
              const card = cards[idx] as HTMLElement;
              const trackWidth = trackRef.current.clientWidth;
              const cardWidth = card.clientWidth;
              const cardLeft = card.offsetLeft;
              const targetScroll = cardLeft - (trackWidth / 2) + (cardWidth / 2);
              trackRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
            }
          }
        }, 150);

        // Clear query param so refreshes don't auto-open
        navigate('/', { replace: true });
      }
    }
  }, [location.search, navigate]);

  return (
    <section className="section reveal" id="industries" ref={revealRef}>
      <div className="industries-header">
        <div>
          <h2 className="section-title">Industries We Serve</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 560 }}>
            Chronix is built for teams that clock in on their feet, not at a desk. Click on any card below to see custom sector details in Mauritius.
          </p>
        </div>
        <div className="industries-carousel-nav">
          <button type="button" className="icon-btn" aria-label="Scroll industries left" onClick={() => scrollTrack(-1)}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="icon-btn" aria-label="Scroll industries right" onClick={() => scrollTrack(1)}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div 
        className="industries-carousel-track" 
        ref={trackRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {INDUSTRIES.map((industry, index) => (
          <div 
            className="industry-card-compact" 
            key={industry.name} 
            onClick={() => setSelectedIndustry(industry.name)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={industry.photo}
              alt={`${industry.name} workers`}
              loading={index < 3 ? 'eager' : 'lazy'}
            />
            <div className="industry-card-body">
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--chronix-navy)', fontWeight: 650 }}>
                {industry.name}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.4 }}>
                {industry.description}
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--chronix-amber)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{lang === 'fr' ? 'Voir les détails' : 'View details'}</span>
                <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Detailed Modal */}
      {selectedIndustry && (
        <div className="industry-modal-overlay" onClick={() => setSelectedIndustry(null)}>
          <div className="industry-modal" onClick={(e) => e.stopPropagation()}>
            <div className="industry-modal-header">
              <h3 className="industry-modal-title">
                <span style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>💼</span> 
                {selectedIndustry}
              </h3>
              <button
                type="button"
                aria-label="Close details modal"
                onClick={() => setSelectedIndustry(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.6rem',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            <div className="industry-modal-body">
              {INDUSTRY_DETAILS[lang === 'fr' ? 'fr' : 'en'][selectedIndustry as keyof typeof INDUSTRY_DETAILS['en']] && (
                <>
                  {(() => {
                    const details = INDUSTRY_DETAILS[lang === 'fr' ? 'fr' : 'en'][selectedIndustry as keyof typeof INDUSTRY_DETAILS['en']];
                    return (
                      <>
                        <div className="industry-modal-stat-box">
                          <div className="industry-modal-stat-label">
                            {lang === 'fr' ? 'CONTEXTE MAURICIEN' : 'MAURITIAN CONTEXT'}
                          </div>
                          <div className="industry-modal-stat-value">
                            {details.gdp} &bull; {details.workforce}
                          </div>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', color: 'var(--chronix-navy)', fontWeight: 700, margin: '0.5rem 0 0.25rem 0', lineHeight: 1.35 }}>
                          {details.heading}
                        </h4>

                        {details.details.map((p, index) => (
                          <p key={index} style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                            {p}
                          </p>
                        ))}

                        <ul style={{ 
                          listStyle: 'none', 
                          padding: 0, 
                          margin: '0.5rem 0 0 0', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '0.5rem',
                          borderTop: '1px solid var(--border)',
                          paddingTop: '1rem'
                        }}>
                          {details.points.map((pt, idx) => (
                            <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </>
                    );
                  })()}
                </>
              )}
            </div>

            <div className="industry-modal-footer">
              <button className="btn btn-outline" type="button" onClick={() => setSelectedIndustry(null)}>
                {lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
              <button 
                className="btn btn-primary-amber" 
                type="button"
                onClick={() => {
                  setSelectedIndustry(null);
                  navigate('/signup');
                }}
              >
                {lang === 'fr' ? 'Démarrer l\'essai gratuit' : 'Start Free Trial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
