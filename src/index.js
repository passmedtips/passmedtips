import { useState, useEffect, useRef } from “react”;
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from “recharts”;

const MATIERES = [
{ id: “bio-cell”, label: “Biologie Cellulaire”, icon: “🔬”, color: “#00C9A7” },
{ id: “anatomie”, label: “Anatomie”, icon: “🦴”, color: “#FF6B6B” },
{ id: “histologie”, label: “Histologie”, icon: “🧫”, color: “#4ECDC4” },
{ id: “biochimie”, label: “Biochimie”, icon: “⚗️”, color: “#FFE66D” },
{ id: “physio”, label: “Physiologie”, icon: “❤️”, color: “#FF8B94” },
{ id: “embryo”, label: “Embryologie”, icon: “🧬”, color: “#A8E6CF” },
{ id: “biophy”, label: “Biophysique”, icon: “⚡”, color: “#88D8B0” },
{ id: “stats”, label: “Statistiques”, icon: “📊”, color: “#FFEAA7” },
];

const COURS_DATA = {
“bio-cell”: [
{ id: 1, titre: “Structure de la cellule eucaryote”, date: “Sem. 1”, pages: 24, resume: “La cellule eucaryote est délimitée par une membrane plasmique bicouche lipidique. Elle contient un noyau avec l’ADN, des mitochondries pour la production d’ATP, le réticulum endoplasmique rugueux (REG) portant les ribosomes, et l’appareil de Golgi pour le tri et l’adressage des protéines.” },
{ id: 2, titre: “Le noyau et la chromatine”, date: “Sem. 2”, pages: 18, resume: “Le noyau est délimité par une enveloppe nucléaire à double membrane percée de pores. La chromatine est formée d’ADN enroulé autour des histones. L’euchromatine est active transcriptionnellement, l’hétérochromatine est condensée et silencieuse.” },
{ id: 3, titre: “Cycle cellulaire et mitose”, date: “Sem. 3”, pages: 22, resume: “Le cycle cellulaire comprend l’interphase (G1, S, G2) et la mitose (PMAT). Les points de contrôle (checkpoints) régulent la progression du cycle. La mitose assure la répartition équitable du matériel génétique entre les deux cellules filles.” },
{ id: 4, titre: “Méiose et gametogénèse”, date: “Sem. 4”, pages: 20, resume: “La méiose comprend deux divisions successives produisant 4 cellules haploïdes. La méiose I est réductionnelle (séparation des homologues), la méiose II est équationnelle. Le crossing-over en prophase I assure la diversité génétique.” },
],
“anatomie”: [
{ id: 1, titre: “Introduction à l’anatomie - Plan du corps”, date: “Sem. 1”, pages: 16, resume: “L’anatomie descriptive utilise des plans de référence (sagittal, frontal, transversal) et des termes de position (médial/latéral, proximal/distal, antérieur/postérieur). La nomenclature anatomique internationale (Terminologia Anatomica) est universelle.” },
{ id: 2, titre: “Ostéologie du membre supérieur”, date: “Sem. 2”, pages: 28, resume: “Le membre supérieur comprend la ceinture scapulaire (clavicule, scapula), le bras (humérus), l’avant-bras (radius, ulna) et la main (8 os du carpe, 5 métacarpiens, 14 phalanges). L’articulation gléno-humérale est une énarrhrose très mobile.” },
{ id: 3, titre: “Ostéologie du membre inférieur”, date: “Sem. 3”, pages: 30, resume: “Le membre inférieur comprend la ceinture pelvienne (os coxal = ilium + ischium + pubis), la cuisse (fémur), la jambe (tibia, fibula), la cheville et le pied. L’articulation coxo-fémorale est une énarrhrose stable, le genou est une bicondylaire complexe.” },
{ id: 4, titre: “Anatomie du thorax”, date: “Sem. 5”, pages: 35, resume: “La cage thoracique est formée du sternum, des côtes (12 paires) et des vertèbres thoraciques. Elle protège le cœur et les poumons. Les espaces intercostaux contiennent les muscles intercostaux et le paquet vasculo-nerveux (artère, veine, nerf - de haut en bas sous la côte).” },
],
“biochimie”: [
{ id: 1, titre: “Acides aminés et protéines”, date: “Sem. 1”, pages: 26, resume: “Les 20 acides aminés standards ont un groupement amine, carboxyle et une chaîne latérale R. 9 sont essentiels (non synthétisés par l’organisme). Les protéines ont 4 niveaux de structure : primaire (séquence), secondaire (hélice α, feuillet β), tertiaire (repliement 3D), quaternaire (assemblage).” },
{ id: 2, titre: “Enzymologie”, date: “Sem. 3”, pages: 22, resume: “Les enzymes sont des biocatalyseurs protéiques qui abaissent l’énergie d’activation. Cinétique de Michaelis-Menten : v = Vmax[S]/(Km+[S]). Le Km mesure l’affinité enzyme-substrat. Les inhibiteurs peuvent être compétitifs (augmentent Km apparent) ou non compétitifs (diminuent Vmax).” },
{ id: 3, titre: “Métabolisme glucidique”, date: “Sem. 4”, pages: 30, resume: “La glycolyse dégrade le glucose en pyruvate (10 réactions, cytoplasme, gain net de 2 ATP). Le pyruvate entre dans le cycle de Krebs via l’acétyl-CoA (mitochondrie). La chaîne respiratoire produit 32-34 ATP par glucose. La néoglucogenèse est la voie inverse de la glycolyse (foie, rein).” },
],
“physio”: [
{ id: 1, titre: “Physiologie cardiaque”, date: “Sem. 2”, pages: 32, resume: “Le cœur est une pompe musculaire à 4 cavités. Le potentiel d’action cardiaque a 5 phases (0 à 4). La loi de Starling stipule que la force de contraction est proportionnelle à l’allongement initial des fibres. Le débit cardiaque = volume systolique × fréquence cardiaque.” },
{ id: 2, titre: “Physiologie respiratoire”, date: “Sem. 3”, pages: 28, resume: “La ventilation alvéolaire assure les échanges gazeux. La capacité pulmonaire totale (CPT) = volume courant + volumes de réserve + volume résiduel. La compliance pulmonaire est réduite par la fibrose. L’équation de Henderson-Hasselbalch régit l’équilibre acido-basique.” },
{ id: 3, titre: “Physiologie rénale”, date: “Sem. 5”, pages: 34, resume: “Le néphron filtre ~180L/j de plasma. La filtration glomérulaire dépend de la pression hydrostatique et oncotique. La réabsorption tubulaire récupère glucose, Na+, eau, acides aminés. L’hormone ADH contrôle la réabsorption d’eau, l’aldostérone celle du sodium.” },
],
};

const EXAMENS = [
{ id: 1, matiere: “bio-cell”, titre: “QCM Biologie Cellulaire - UE1”, date: “2025-01-15”, heure: “08h00”, salle: “Amphithéâtre A”, duree: “2h”, type: “partiel” },
{ id: 2, matiere: “anatomie”, titre: “Examen Anatomie - UE4”, date: “2025-01-22”, heure: “14h00”, salle: “Grand Amphi”, duree: “2h”, type: “partiel” },
{ id: 3, matiere: “biochimie”, titre: “QCM Biochimie - UE1”, date: “2025-02-05”, heure: “08h00”, salle: “Amphithéâtre B”, duree: “2h”, type: “partiel” },
{ id: 4, matiere: “physio”, titre: “Examen Physiologie - UE2”, date: “2025-03-12”, heure: “10h00”, salle: “Grand Amphi”, duree: “2h”, type: “concours” },
{ id: 5, matiere: “histologie”, titre: “Histologie - UE2”, date: “2025-04-08”, heure: “08h00”, salle: “Amphithéâtre A”, duree: “2h”, type: “concours” },
{ id: 6, matiere: “biophy”, titre: “Biophysique - UE3”, date: “2025-05-14”, heure: “14h00”, salle: “Grand Amphi”, duree: “2h”, type: “concours” },
];

const QCM_DATA = [
{
id: 1, matiere: “bio-cell”, titre: “Structure cellulaire - Niveau 1”,
questions: [
{ q: “Quelle organite est responsable de la production d’ATP ?”, options: [“Noyau”, “Mitochondrie”, “Réticulum endoplasmique”, “Appareil de Golgi”], correct: 1, explication: “Les mitochondries sont le ‘powerhouse’ de la cellule, productrices d’ATP via la phosphorylation oxydative.” },
{ q: “La membrane plasmique est constituée de :”, options: [“Protéines uniquement”, “Glucides uniquement”, “Bicouche lipidique + protéines”, “ADN et protéines”], correct: 2, explication: “La membrane plasmique est une bicouche de phospholipides avec des protéines intégrées (modèle mosaïque fluide de Singer et Nicolson).” },
{ q: “L’euchromatine est caractérisée par :”, options: [“Une transcription inactive”, “Une condensation maximale”, “Une transcription active”, “L’absence d’histones”], correct: 2, explication: “L’euchromatine est décondensée et transcriptionnellement active, contrairement à l’hétérochromatine condensée et silencieuse.” },
]
},
{
id: 2, matiere: “biochimie”, titre: “Enzymologie - Niveau 1”,
questions: [
{ q: “Que mesure le Km dans la cinétique enzymatique ?”, options: [“La vitesse maximale”, “L’affinité enzyme-substrat”, “La concentration en enzyme”, “La température optimale”], correct: 1, explication: “Le Km (constante de Michaelis) est la concentration en substrat pour laquelle v = Vmax/2. Un faible Km indique une forte affinité.” },
{ q: “Un inhibiteur compétitif :”, options: [“Diminue Vmax”, “Augmente Km apparent”, “Bloque irréversiblement l’enzyme”, “Modifie le site allostérique”], correct: 1, explication: “L’inhibiteur compétitif entre en compétition avec le substrat pour le site actif, augmentant le Km apparent mais sans modifier Vmax (effet réversible par excès de substrat).” },
]
},
{
id: 3, matiere: “anatomie”, titre: “Anatomie générale - Niveau 1”,
questions: [
{ q: “Le plan sagittal divise le corps en :”, options: [“Avant et arrière”, “Haut et bas”, “Gauche et droite”, “Intérieur et extérieur”], correct: 2, explication: “Le plan sagittal (ou médian) divise le corps en parties gauche et droite. Le plan frontal divise en avant/arrière, le plan transversal en haut/bas.” },
{ q: “L’articulation gléno-humérale est :”, options: [“Une ginglyme (charnière)”, “Une énarrhrose (sphéroïde)”, “Une trochléenne”, “Une arthrodie (plane)”], correct: 1, explication: “L’articulation gléno-humérale (épaule) est une énarrhrose permettant des mouvements dans les 3 plans de l’espace (flexion/extension, abduction/adduction, rotation).” },
]
},
];

const VIDEOS_DATA = [
{ id: 1, matiere: “bio-cell”, titre: “La mitose en 3D”, url: “”, thumbnail: “🔬”, duree: “12:34”, auteur: “Prof. Martin”, vues: 1240 },
{ id: 2, matiere: “anatomie”, titre: “Dissection virtuelle du membre supérieur”, url: “”, thumbnail: “🦴”, duree: “28:10”, auteur: “Dr. Leblanc”, vues: 890 },
{ id: 3, matiere: “physio”, titre: “Le cycle cardiaque expliqué”, url: “”, thumbnail: “❤️”, duree: “18:45”, auteur: “Prof. Dumas”, vues: 2100 },
{ id: 4, matiere: “biochimie”, titre: “Glycolyse et cycle de Krebs”, url: “”, thumbnail: “⚗️”, duree: “22:00”, auteur: “Dr. Petit”, vues: 1560 },
{ id: 5, matiere: “histologie”, titre: “Lecture de lames histologiques”, url: “”, thumbnail: “🧫”, duree: “35:20”, auteur: “Prof. Bernard”, vues: 740 },
];

const SCORES_HISTORY = [
{ semaine: “S1”, “bio-cell”: 55, anatomie: 60, biochimie: 45, physio: 50 },
{ semaine: “S2”, “bio-cell”: 62, anatomie: 65, biochimie: 55, physio: 58 },
{ semaine: “S3”, “bio-cell”: 70, anatomie: 68, biochimie: 62, physio: 65 },
{ semaine: “S4”, “bio-cell”: 75, anatomie: 72, biochimie: 70, physio: 70 },
{ semaine: “S5”, “bio-cell”: 80, anatomie: 78, biochimie: 75, physio: 74 },
];

const RADAR_DATA = [
{ matiere: “Bio Cell.”, score: 80 },
{ matiere: “Anatomie”, score: 78 },
{ matiere: “Histologie”, score: 60 },
{ matiere: “Biochimie”, score: 75 },
{ matiere: “Physiologie”, score: 74 },
{ matiere: “Embryologie”, score: 55 },
{ matiere: “Biophysique”, score: 68 },
{ matiere: “Stats”, score: 72 },
];

export default function MedApp() {
const [activeTab, setActiveTab] = useState(“home”);
const [selectedMatiere, setSelectedMatiere] = useState(null);
const [selectedCours, setSelectedCours] = useState(null);
const [selectedQCM, setSelectedQCM] = useState(null);
const [qcmState, setQcmState] = useState({ step: “list”, currentQ: 0, answers: [], score: 0 });
const [searchQuery, setSearchQuery] = useState(””);
const [notification, setNotification] = useState(null);
const [videoFilter, setVideoFilter] = useState(“all”);

const showNotif = (msg) => {
setNotification(msg);
setTimeout(() => setNotification(null), 3000);
};

const daysUntil = (dateStr) => {
const today = new Date();
const exam = new Date(dateStr);
const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
return diff;
};

const getMatiereInfo = (id) => MATIERES.find(m => m.id === id);

// QCM Logic
const startQCM = (qcm) => {
setSelectedQCM(qcm);
setQcmState({ step: “quiz”, currentQ: 0, answers: [], score: 0, chosen: null, showExpl: false });
};

const answerQCM = (idx) => {
if (qcmState.showExpl) return;
const q = selectedQCM.questions[qcmState.currentQ];
const correct = idx === q.correct;
setQcmState(s => ({ …s, chosen: idx, showExpl: true, score: correct ? s.score + 1 : s.score }));
};

const nextQCM = () => {
const next = qcmState.currentQ + 1;
if (next >= selectedQCM.questions.length) {
setQcmState(s => ({ …s, step: “result” }));
} else {
setQcmState(s => ({ …s, currentQ: next, chosen: null, showExpl: false }));
}
};

const navItems = [
{ id: “home”, icon: “🏠”, label: “Accueil” },
{ id: “cours”, icon: “📚”, label: “Cours” },
{ id: “qcm”, icon: “✏️”, label: “QCM” },
{ id: “videos”, icon: “🎥”, label: “Vidéos” },
{ id: “suivi”, icon: “📈”, label: “Suivi” },
{ id: “examens”, icon: “📅”, label: “Examens” },
];

const nextExam = EXAMENS
.filter(e => daysUntil(e.date) >= 0)
.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

return (
<div style={{
minHeight: “100vh”,
background: “#0A0E1A”,
color: “#E8EAF6”,
fontFamily: “‘Outfit’, ‘Segoe UI’, sans-serif”,
display: “flex”,
flexDirection: “column”,
maxWidth: “480px”,
margin: “0 auto”,
position: “relative”,
overflow: “hidden”,
}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0A0E1A; } ::-webkit-scrollbar-thumb { background: #2D3561; border-radius: 2px; } .card { background: #131929; border: 1px solid #1E2D4A; border-radius: 16px; padding: 16px; cursor: pointer; transition: all 0.2s; } .card:hover { border-color: #00C9A7; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,201,167,0.15); } .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; } .btn-primary { background: linear-gradient(135deg, #00C9A7, #0096FF); border: none; color: white; padding: 12px 24px; border-radius: 12px; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.2s; width: 100%; } .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); } .tab-active { background: linear-gradient(135deg, #00C9A7, #0096FF); color: white; } .scroll-area { overflow-y: auto; flex: 1; padding-bottom: 80px; } input, textarea { background: #131929; border: 1px solid #1E2D4A; color: #E8EAF6; border-radius: 10px; padding: 10px 14px; font-family: 'Outfit', sans-serif; font-size: 14px; outline: none; width: 100%; } input:focus, textarea:focus { border-color: #00C9A7; } .anim-in { animation: fadeUp 0.3s ease forwards; } @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } .pulse { animation: pulse 2s infinite; } @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } } .glow { box-shadow: 0 0 20px rgba(0,201,167,0.3); }`}</style>

```
  {/* Notification */}
  {notification && (
    <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: "#00C9A7", color: "#0A0E1A", padding: "10px 20px", borderRadius: 12, fontWeight: 700, zIndex: 9999, fontSize: 14 }}>
      ✓ {notification}
    </div>
  )}

  {/* Header */}
  <div style={{ padding: "16px 20px 12px", background: "linear-gradient(180deg, #0D1220 0%, transparent 100%)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 11, color: "#00C9A7", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>🇬🇵 Antilles-Guyane</div>
        <div style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(90deg, #fff, #00C9A7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PASS Médecine</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, color: "#8892B0", fontWeight: 500 }}>Promo 2024-2025</div>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #00C9A7, #0096FF)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginLeft: "auto" }}>👤</div>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="scroll-area" style={{ padding: "0 16px" }}>

    {/* HOME */}
    {activeTab === "home" && (
      <div className="anim-in">
        {/* Next exam banner */}
        {nextExam && (
          <div style={{ background: "linear-gradient(135deg, #1a0533, #0d1f3c)", border: "1px solid #FF6B6B55", borderRadius: 16, padding: 16, marginBottom: 16, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.1 }}>⏰</div>
            <div style={{ fontSize: 11, color: "#FF6B6B", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Prochain examen</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{nextExam.titre}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: daysUntil(nextExam.date) < 7 ? "#FF6B6B" : "#00C9A7", fontFamily: "'Space Mono', monospace" }} className={daysUntil(nextExam.date) < 7 ? "pulse" : ""}>
                J-{daysUntil(nextExam.date)}
              </span>
              <div>
                <div style={{ fontSize: 13, color: "#8892B0" }}>{nextExam.date} • {nextExam.heure}</div>
                <div style={{ fontSize: 12, color: "#8892B0" }}>{nextExam.salle}</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Cours disponibles", value: Object.values(COURS_DATA).flat().length, icon: "📚", color: "#00C9A7" },
            { label: "QCM complétés", value: "12/32", icon: "✅", color: "#0096FF" },
            { label: "Vidéos vues", value: "8/24", icon: "🎥", color: "#FF6B6B" },
            { label: "Score moyen", value: "72%", icon: "⭐", color: "#FFE66D" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#131929", border: "1px solid #1E2D4A", borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Space Mono', monospace" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#8892B0", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Matières */}
        <div style={{ fontSize: 14, fontWeight: 700, color: "#8892B0", marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase", fontSize: 11 }}>Matières</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {MATIERES.map(m => (
            <div key={m.id} className="card" onClick={() => { setActiveTab("cours"); setSelectedMatiere(m.id); }}
              style={{ borderLeft: `3px solid ${m.color}` }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: "#8892B0", marginTop: 4 }}>
                {(COURS_DATA[m.id] || []).length} cours
              </div>
            </div>
          ))}
        </div>

        {/* Radar preview */}
        <div style={{ background: "#131929", border: "1px solid #1E2D4A", borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>📊 Votre profil de compétences</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#1E2D4A" />
              <PolarAngleAxis dataKey="matiere" tick={{ fill: "#8892B0", fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="#00C9A7" fill="#00C9A7" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

    {/* COURS */}
    {activeTab === "cours" && (
      <div className="anim-in">
        {selectedCours ? (
          // Cours detail
          <div>
            <button onClick={() => setSelectedCours(null)} style={{ background: "none", border: "none", color: "#00C9A7", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 12, padding: 0 }}>← Retour</button>
            <div style={{ background: "linear-gradient(135deg, #131929, #0d1f3c)", border: "1px solid #1E2D4A", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div className="badge" style={{ background: getMatiereInfo(selectedMatiere)?.color + "22", color: getMatiereInfo(selectedMatiere)?.color, marginBottom: 10 }}>
                {getMatiereInfo(selectedMatiere)?.icon} {getMatiereInfo(selectedMatiere)?.label}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>{selectedCours.titre}</h2>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#8892B0" }}>
                <span>📅 {selectedCours.date}</span>
                <span>📄 {selectedCours.pages} pages</span>
              </div>
            </div>
            <div style={{ background: "#131929", border: "1px solid #1E2D4A", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#00C9A7", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>📝 Résumé essentiel</div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#C8D0E0" }}>{selectedCours.resume}</p>
            </div>
            <button className="btn-primary" onClick={() => { showNotif("Cours ajouté aux favoris !"); }}>⭐ Ajouter aux favoris</button>
          </div>
        ) : selectedMatiere ? (
          // Cours list for matiere
          <div>
            <button onClick={() => setSelectedMatiere(null)} style={{ background: "none", border: "none", color: "#00C9A7", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 12, padding: 0 }}>← Toutes les matières</button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 30 }}>{getMatiereInfo(selectedMatiere)?.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{getMatiereInfo(selectedMatiere)?.label}</div>
                <div style={{ fontSize: 12, color: "#8892B0" }}>{(COURS_DATA[selectedMatiere] || []).length} cours disponibles</div>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <input placeholder="🔍 Rechercher un cours..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {(COURS_DATA[selectedMatiere] || []).filter(c => c.titre.toLowerCase().includes(searchQuery.toLowerCase())).map(cours => (
              <div key={cours.id} className="card" onClick={() => setSelectedCours(cours)} style={{ marginBottom: 10, borderLeft: `3px solid ${getMatiereInfo(selectedMatiere)?.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, lineHeight: 1.4 }}>{cours.titre}</div>
                    <div style={{ fontSize: 12, color: "#8892B0" }}>📅 {cours.date} • 📄 {cours.pages} pages</div>
                  </div>
                  <span style={{ color: "#00C9A7", fontSize: 18 }}>›</span>
                </div>
              </div>
            ))}
            {(COURS_DATA[selectedMatiere] || []).length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#8892B0" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📂</div>
                <p>Aucun cours disponible pour cette matière.<br />Ajoutez vos premiers cours !</p>
              </div>
            )}
          </div>
        ) : (
          // All matieres
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>📚 Cours</div>
            <div style={{ fontSize: 13, color: "#8892B0", marginBottom: 16 }}>Sélectionnez une matière</div>
            <div style={{ marginBottom: 16 }}>
              <input placeholder="🔍 Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {MATIERES.map(m => {
              const cours = COURS_DATA[m.id] || [];
              const filtered = cours.filter(c => c.titre.toLowerCase().includes(searchQuery.toLowerCase()));
              if (searchQuery && filtered.length === 0) return null;
              return (
                <div key={m.id} className="card" onClick={() => { setSelectedMatiere(m.id); setSearchQuery(""); }} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 14, borderLeft: `3px solid ${m.color}` }}>
                  <span style={{ fontSize: 28 }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{m.label}</div>
                    <div style={{ fontSize: 12, color: "#8892B0" }}>{cours.length} cours • {cours.reduce((a, c) => a + c.pages, 0)} pages</div>
                  </div>
                  <span style={{ color: "#00C9A7" }}>›</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}

    {/* QCM */}
    {activeTab === "qcm" && (
      <div className="anim-in">
        {qcmState.step === "quiz" && selectedQCM ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <button onClick={() => { setQcmState({ step: "list" }); setSelectedQCM(null); }} style={{ background: "none", border: "none", color: "#00C9A7", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0 }}>✕ Quitter</button>
              <span style={{ fontFamily: "'Space Mono'", fontSize: 14, color: "#8892B0" }}>{qcmState.currentQ + 1}/{selectedQCM.questions.length}</span>
            </div>
            {/* Progress */}
            <div style={{ background: "#1E2D4A", borderRadius: 4, height: 4, marginBottom: 20 }}>
              <div style={{ background: "linear-gradient(90deg, #00C9A7, #0096FF)", height: "100%", borderRadius: 4, width: `${((qcmState.currentQ) / selectedQCM.questions.length) * 100}%`, transition: "width 0.3s" }} />
            </div>
            <div style={{ background: "#131929", border: "1px solid #1E2D4A", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.5 }}>{selectedQCM.questions[qcmState.currentQ].q}</div>
            </div>
            {selectedQCM.questions[qcmState.currentQ].options.map((opt, i) => {
              const isChosen = qcmState.chosen === i;
              const isCorrect = i === selectedQCM.questions[qcmState.currentQ].correct;
              let bg = "#131929", border = "#1E2D4A", color = "#E8EAF6";
              if (qcmState.showExpl) {
                if (isCorrect) { bg = "#00C9A722"; border = "#00C9A7"; color = "#00C9A7"; }
                else if (isChosen) { bg = "#FF6B6B22"; border = "#FF6B6B"; color = "#FF6B6B"; }
              }
              return (
                <div key={i} onClick={() => answerQCM(i)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 8, cursor: "pointer", color, fontWeight: 500, fontSize: 14, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontFamily: "'Space Mono'" }}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                  {qcmState.showExpl && isCorrect && <span style={{ marginLeft: "auto" }}>✓</span>}
                  {qcmState.showExpl && isChosen && !isCorrect && <span style={{ marginLeft: "auto" }}>✗</span>}
                </div>
              );
            })}
            {qcmState.showExpl && (
              <div>
                <div style={{ background: "#0d1f3c", border: "1px solid #0096FF44", borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 13, color: "#C8D0E0", lineHeight: 1.6 }}>
                  💡 {selectedQCM.questions[qcmState.currentQ].explication}
                </div>
                <button className="btn-primary" onClick={nextQCM}>
                  {qcmState.currentQ + 1 >= selectedQCM.questions.length ? "Voir les résultats →" : "Question suivante →"}
                </button>
              </div>
            )}
          </div>
        ) : qcmState.step === "result" && selectedQCM ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>{qcmState.score / selectedQCM.questions.length >= 0.7 ? "🎉" : "💪"}</div>
            <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "'Space Mono'", background: "linear-gradient(90deg, #00C9A7, #0096FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {Math.round((qcmState.score / selectedQCM.questions.length) * 100)}%
            </div>
            <div style={{ color: "#8892B0", marginBottom: 4 }}>{qcmState.score}/{selectedQCM.questions.length} bonnes réponses</div>
            <div style={{ color: "#E8EAF6", fontWeight: 600, marginBottom: 24, fontSize: 18 }}>{selectedQCM.titre}</div>
            <button className="btn-primary" onClick={() => { startQCM(selectedQCM); }}>🔄 Recommencer</button>
            <button style={{ background: "none", border: "1px solid #1E2D4A", color: "#8892B0", width: "100%", padding: "12px", borderRadius: 12, marginTop: 10, cursor: "pointer", fontFamily: "Outfit", fontSize: 14 }} onClick={() => { setQcmState({ step: "list" }); setSelectedQCM(null); }}>← Retour aux QCM</button>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>✏️ QCM d'entraînement</div>
            <div style={{ fontSize: 13, color: "#8892B0", marginBottom: 20 }}>{QCM_DATA.length} séries disponibles</div>
            {QCM_DATA.map(qcm => {
              const m = getMatiereInfo(qcm.matiere);
              return (
                <div key={qcm.id} className="card" onClick={() => startQCM(qcm)} style={{ marginBottom: 12, borderLeft: `3px solid ${m?.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div className="badge" style={{ background: m?.color + "22", color: m?.color, marginBottom: 8 }}>{m?.icon} {m?.label}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{qcm.titre}</div>
                      <div style={{ fontSize: 12, color: "#8892B0" }}>📋 {qcm.questions.length} questions</div>
                    </div>
                    <button style={{ background: "linear-gradient(135deg, #00C9A7, #0096FF)", border: "none", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "Outfit", fontWeight: 600, fontSize: 13 }}>Start</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}

    {/* VIDEOS */}
    {activeTab === "videos" && (
      <div className="anim-in">
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>🎥 Vidéos de cours</div>
        <div style={{ fontSize: 13, color: "#8892B0", marginBottom: 16 }}>{VIDEOS_DATA.length} vidéos disponibles</div>
        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
          <button onClick={() => setVideoFilter("all")} style={{ background: videoFilter === "all" ? "#00C9A7" : "#131929", border: "1px solid #1E2D4A", color: videoFilter === "all" ? "#0A0E1A" : "#8892B0", padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontFamily: "Outfit", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Toutes</button>
          {MATIERES.filter(m => VIDEOS_DATA.some(v => v.matiere === m.id)).map(m => (
            <button key={m.id} onClick={() => setVideoFilter(m.id)} style={{ background: videoFilter === m.id ? m.color : "#131929", border: `1px solid ${videoFilter === m.id ? m.color : "#1E2D4A"}`, color: videoFilter === m.id ? "#0A0E1A" : "#8892B0", padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontFamily: "Outfit", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Upload area */}
        <div style={{ background: "#131929", border: "2px dashed #1E2D4A", borderRadius: 16, padding: 20, textAlign: "center", marginBottom: 16, cursor: "pointer" }} onClick={() => showNotif("Fonctionnalité d'ajout de vidéo disponible dans la version admin")}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>➕</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Ajouter une vidéo</div>
          <div style={{ fontSize: 12, color: "#8892B0" }}>URL YouTube, Vimeo ou fichier local</div>
        </div>

        {VIDEOS_DATA.filter(v => videoFilter === "all" || v.matiere === videoFilter).map(video => {
          const m = getMatiereInfo(video.matiere);
          return (
            <div key={video.id} className="card" onClick={() => showNotif("Lecteur vidéo en cours de chargement...")} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 64, height: 64, background: m?.color + "22", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>
                  {video.thumbnail}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="badge" style={{ background: m?.color + "22", color: m?.color, marginBottom: 6, fontSize: 10 }}>{m?.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginBottom: 4 }}>{video.titre}</div>
                  <div style={{ fontSize: 12, color: "#8892B0" }}>▶ {video.duree} • {video.auteur}</div>
                  <div style={{ fontSize: 11, color: "#8892B0" }}>👁 {video.vues.toLocaleString()} vues</div>
                </div>
                <div style={{ color: "#00C9A7", fontSize: 22 }}>▶</div>
              </div>
            </div>
          );
        })}
      </div>
    )}

    {/* SUIVI */}
    {activeTab === "suivi" && (
      <div className="anim-in">
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>📈 Suivi de progression</div>
        <div style={{ fontSize: 13, color: "#8892B0", marginBottom: 20 }}>Analysez vos points faibles</div>

        {/* Radar chart */}
        <div style={{ background: "#131929", border: "1px solid #1E2D4A", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>🕸️ Profil de compétences</div>
          <div style={{ fontSize: 12, color: "#8892B0", marginBottom: 12 }}>Score global sur 100</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#1E2D4A" />
              <PolarAngleAxis dataKey="matiere" tick={{ fill: "#8892B0", fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="#00C9A7" fill="#00C9A7" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Points faibles */}
        <div style={{ background: "#131929", border: "1px solid #FF6B6B33", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14, color: "#FF6B6B" }}>⚠️ Points à renforcer</div>
          {RADAR_DATA.filter(d => d.score < 70).sort((a, b) => a.score - b.score).map((item, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{item.matiere}</span>
                <span style={{ fontFamily: "'Space Mono'", color: item.score < 60 ? "#FF6B6B" : "#FFE66D" }}>{item.score}%</span>
              </div>
              <div style={{ background: "#1E2D4A", borderRadius: 4, height: 6 }}>
                <div style={{ background: item.score < 60 ? "#FF6B6B" : "#FFE66D", height: "100%", borderRadius: 4, width: `${item.score}%`, transition: "width 1s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Line chart */}
        <div style={{ background: "#131929", border: "1px solid #1E2D4A", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>📉 Évolution par semaine</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SCORES_HISTORY}>
              <CartesianGrid stroke="#1E2D4A" strokeDasharray="3 3" />
              <XAxis dataKey="semaine" tick={{ fill: "#8892B0", fontSize: 11 }} />
              <YAxis domain={[40, 100]} tick={{ fill: "#8892B0", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#131929", border: "1px solid #1E2D4A", borderRadius: 8, color: "#E8EAF6", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="bio-cell" stroke="#00C9A7" strokeWidth={2} dot={{ r: 3 }} name="Bio Cell." />
              <Line type="monotone" dataKey="anatomie" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 3 }} name="Anatomie" />
              <Line type="monotone" dataKey="biochimie" stroke="#FFE66D" strokeWidth={2} dot={{ r: 3 }} name="Biochimie" />
              <Line type="monotone" dataKey="physio" stroke="#0096FF" strokeWidth={2} dot={{ r: 3 }} name="Physiologie" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* All scores bar */}
        <div style={{ background: "#131929", border: "1px solid #1E2D4A", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>🏆 Classement des matières</div>
          {RADAR_DATA.sort((a, b) => b.score - a.score).map((item, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontFamily: "'Space Mono'", fontSize: 11, color: "#8892B0", width: 16 }}>{i + 1}.</span>
                  {item.matiere}
                </span>
                <span style={{ fontFamily: "'Space Mono'", color: item.score >= 70 ? "#00C9A7" : item.score >= 60 ? "#FFE66D" : "#FF6B6B" }}>{item.score}%</span>
              </div>
              <div style={{ background: "#1E2D4A", borderRadius: 4, height: 6 }}>
                <div style={{ background: item.score >= 70 ? "#00C9A7" : item.score >= 60 ? "#FFE66D" : "#FF6B6B", height: "100%", borderRadius: 4, width: `${item.score}%`, transition: "width 1s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* EXAMENS */}
    {activeTab === "examens" && (
      <div className="anim-in">
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>📅 Calendrier des examens</div>
        <div style={{ fontSize: 13, color: "#8892B0", marginBottom: 20 }}>{EXAMENS.length} épreuves planifiées</div>

        {EXAMENS.sort((a, b) => new Date(a.date) - new Date(b.date)).map(exam => {
          const m = getMatiereInfo(exam.matiere);
          const days = daysUntil(exam.date);
          const isPast = days < 0;
          const isUrgent = days >= 0 && days < 14;
          return (
            <div key={exam.id} style={{ background: "#131929", border: `1px solid ${isPast ? "#1E2D4A" : isUrgent ? "#FF6B6B44" : "#1E2D4A"}`, borderRadius: 16, padding: 16, marginBottom: 12, opacity: isPast ? 0.6 : 1, borderLeft: `4px solid ${isPast ? "#1E2D4A" : m?.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <span className="badge" style={{ background: m?.color + "22", color: m?.color }}>{m?.icon} {m?.label}</span>
                    <span className="badge" style={{ background: exam.type === "concours" ? "#0096FF22" : "#FFE66D22", color: exam.type === "concours" ? "#0096FF" : "#FFE66D" }}>
                      {exam.type === "concours" ? "🏆 Concours" : "📝 Partiel"}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, marginBottom: 4 }}>{exam.titre}</div>
                </div>
                {!isPast && (
                  <div style={{ textAlign: "center", background: isUrgent ? "#FF6B6B22" : "#131929", border: `1px solid ${isUrgent ? "#FF6B6B" : "#1E2D4A"}`, borderRadius: 10, padding: "6px 10px", minWidth: 52 }}>
                    <div style={{ fontFamily: "'Space Mono'", fontWeight: 700, fontSize: 20, color: isUrgent ? "#FF6B6B" : "#00C9A7" }} className={isUrgent ? "pulse" : ""}>J-{days}</div>
                  </div>
                )}
                {isPast && <span className="badge" style={{ background: "#1E2D4A", color: "#8892B0" }}>Passé</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 12, color: "#8892B0" }}>
                <span>📅 {exam.date}</span>
                <span>🕐 {exam.heure}</span>
                <span>⏱ {exam.duree}</span>
                <span style={{ gridColumn: "1 / -1" }}>🏛 {exam.salle}</span>
              </div>
            </div>
          );
        })}
      </div>
    )}

  </div>

  {/* Bottom Nav */}
  <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#0D1220", borderTop: "1px solid #1E2D4A", display: "flex", justifyContent: "space-around", padding: "8px 4px 16px", backdropFilter: "blur(12px)", zIndex: 200 }}>
    {navItems.map(item => (
      <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedMatiere(null); setSelectedCours(null); setSelectedQCM(null); setQcmState({ step: "list" }); setSearchQuery(""); }}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 8px", borderRadius: 10, transition: "all 0.2s" }}>
        <span style={{ fontSize: 20, filter: activeTab === item.id ? "none" : "grayscale(1) opacity(0.5)" }}>{item.icon}</span>
        <span style={{ fontSize: 10, fontFamily: "'Outfit'", fontWeight: 600, color: activeTab === item.id ? "#00C9A7" : "#8892B0" }}>{item.label}</span>
      </button>
    ))}
  </div>
</div>
```

);
}
