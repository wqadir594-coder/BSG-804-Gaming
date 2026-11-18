import heroArenaImg from '../assets/images/hero_esports_arena_1794982528303.jpg';
import jerseyShowcaseImg from '../assets/images/bsg_jersey_showcase_1794982528688.jpg';
import bootcampFacilityImg from '../assets/images/bsg_bootcamp_facility_1794982528264.jpg';
import championshipTrophyImg from '../assets/images/bsg_championship_trophy_1794982529013.jpg';

export type DivisionId = 'all' | 'valorant' | 'cs2' | 'apex' | 'sf6';

export interface Player {
  id: string;
  handle: string;
  fullName: string;
  division: Exclude<DivisionId, 'all'>;
  divisionName: string;
  role: string;
  nationality: string;
  rating: string;
  kdRatio: string;
  winRate: string;
  signatureWeaponOrMain: string;
  hardwareSetup: string;
  bio: string;
  recentAchievement: string;
}

export interface MatchItem {
  id: string;
  division: Exclude<DivisionId, 'all'>;
  divisionName: string;
  tournament: string;
  opponent: string;
  opponentTag: string;
  format: 'BO3' | 'BO5' | 'ALGS Finals';
  status: 'upcoming' | 'completed';
  dateLabel: string;
  timeUtc: string;
  bsgScore?: number;
  opponentScore?: number;
  result?: 'W' | 'L';
  mapSummary: string;
  mvp?: string;
}

export interface TrophyRecord {
  id: string;
  title: string;
  division: string;
  placement: string;
  prizePool: string;
  date: string;
  summary: string;
}

export interface MediaHighlight {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  alt: string;
  description: string;
  specs: string[];
}

export const HERO_MEDIA = {
  image: heroArenaImg,
  alt: 'BSG 804 Gaming competitive players competing under red and gold lights on the championship arena stage',
};

export const DIVISIONS: { id: DivisionId; label: string }[] = [
  { id: 'all', label: 'All Divisions' },
  { id: 'valorant', label: 'Valorant' },
  { id: 'cs2', label: 'Counter-Strike 2' },
  { id: 'apex', label: 'Apex Legends' },
  { id: 'sf6', label: 'Street Fighter 6' },
];

export const PLAYERS: Player[] = [
  {
    id: 'bsg-val-1',
    handle: 'KRONOS',
    fullName: 'Tariq Al-Mansoor',
    division: 'valorant',
    divisionName: 'Valorant',
    role: 'In-Game Leader · Initiator',
    nationality: 'United Kingdom',
    rating: '1.26',
    kdRatio: '1.21',
    winRate: '71.4%',
    signatureWeaponOrMain: 'Sova / Fade',
    hardwareSetup: '240Hz OLED · 800 DPI (0.31 sens) · Custom Hall-Effect Keyboard',
    bio: 'Mid-round tactical anchor for BSG 804 Valorant. Orchestrates late-site executes and anti-eco discipline on LAN.',
    recentAchievement: 'MVP · Challengers Regional Split 2 Finals',
  },
  {
    id: 'bsg-val-2',
    handle: 'VALKYR',
    fullName: 'Elena Novak',
    division: 'valorant',
    divisionName: 'Valorant',
    role: 'Primary Duelist',
    nationality: 'Poland',
    rating: '1.34',
    kdRatio: '1.38',
    winRate: '71.4%',
    signatureWeaponOrMain: 'Jett / Raze',
    hardwareSetup: '360Hz TN · 1600 DPI (0.16 sens) · Superlight Wireless',
    bio: 'Entry fragger holding a 26.8% first-blood rate across 42 official maps in the 2026 competitive calendar.',
    recentAchievement: 'Highest ACS (264) · EMEA Ascension Qualifier',
  },
  {
    id: 'bsg-cs2-1',
    handle: 'REAPER804',
    fullName: 'Marcus Vance',
    division: 'cs2',
    divisionName: 'Counter-Strike 2',
    role: 'AWPer',
    nationality: 'United States',
    rating: '1.29',
    kdRatio: '1.35',
    winRate: '67.8%',
    signatureWeaponOrMain: 'AWP / Desert Eagle',
    hardwareSetup: '360Hz DyAc · 400 DPI (1.85 sens) · 4:3 Stretched',
    bio: 'Aggressive opening-pick sniper anchoring Mirage and Ancient CT setups for BSG 804 Counter-Strike 2.',
    recentAchievement: '1st Place · Redline Masters LAN Dallas',
  },
  {
    id: 'bsg-cs2-2',
    handle: 'DANTE',
    fullName: 'Henrik Lindqvist',
    division: 'cs2',
    divisionName: 'Counter-Strike 2',
    role: 'Rifler · Lurker',
    nationality: 'Sweden',
    rating: '1.19',
    kdRatio: '1.16',
    winRate: '67.8%',
    signatureWeaponOrMain: 'AK-47 / M4A1-S',
    hardwareSetup: '240Hz · 800 DPI (0.95 sens) · Low-Friction Cloth Pad',
    bio: 'Clutch specialist with 18 successful 1vX rounds in ESL Challenger Series play.',
    recentAchievement: '84.2 ADR · Redline Masters LAN Dallas',
  },
  {
    id: 'bsg-apex-1',
    handle: 'SOLARIS',
    fullName: 'Devon Sato',
    division: 'apex',
    divisionName: 'Apex Legends',
    role: 'IGL · Fragger',
    nationality: 'Canada',
    rating: '1.31',
    kdRatio: '2.42',
    winRate: '64.0%',
    signatureWeaponOrMain: 'Bangalore / R-301',
    hardwareSetup: '240Hz IPS · Linear 4-3 No Deadzone · DualSense Edge',
    bio: 'Leads BSG 804 zone rotations and endgame ring holds across Match Point ALGS Pro League lobbies.',
    recentAchievement: 'ALGS Split 1 Regional Kill Leader',
  },
  {
    id: 'bsg-sf6-1',
    handle: 'GOLDSTRIKE',
    fullName: 'Kenji Takahashi',
    division: 'sf6',
    divisionName: 'Street Fighter 6',
    role: 'Solo Competitor',
    nationality: 'Japan',
    rating: '1.41',
    kdRatio: '3.10',
    winRate: '76.5%',
    signatureWeaponOrMain: 'Ken / Akuma',
    hardwareSetup: 'Leverless All-Button Arcade Controller · Sanwa Mechanical Switches',
    bio: 'Top-8 Capcom Pro Tour contender known for flawless drive-rush whiff punishes and corner pressure.',
    recentAchievement: 'Champion · Tokyo Gold Cup Premier',
  },
];

export const MATCHES: MatchItem[] = [
  {
    id: 'm-1',
    division: 'valorant',
    divisionName: 'Valorant',
    tournament: 'EMEA Ascension Playoffs',
    opponent: 'Apex Vanguard',
    opponentTag: 'AV',
    format: 'BO5',
    status: 'upcoming',
    dateLabel: 'Nov 22, 2026',
    timeUtc: '18:00 UTC',
    mapSummary: 'Map Veto Opens 30m Prior · Best of 5 Grand Final',
  },
  {
    id: 'm-2',
    division: 'cs2',
    divisionName: 'Counter-Strike 2',
    tournament: 'ESL Challenger Circuit',
    opponent: 'Nordic Five',
    opponentTag: 'N5',
    format: 'BO3',
    status: 'upcoming',
    dateLabel: 'Nov 24, 2026',
    timeUtc: '20:30 UTC',
    mapSummary: 'Expected Pool: Ancient, Mirage, Anubis',
  },
  {
    id: 'm-3',
    division: 'apex',
    divisionName: 'Apex Legends',
    tournament: 'ALGS Match Point Finals',
    opponent: '19 Pro Lobby Squads',
    opponentTag: 'ALGS',
    format: 'ALGS Finals',
    status: 'upcoming',
    dateLabel: 'Nov 29, 2026',
    timeUtc: '22:00 UTC',
    mapSummary: "World's Edge & Storm Point Rotation · 50-Point Threshold",
  },
  {
    id: 'm-4',
    division: 'cs2',
    divisionName: 'Counter-Strike 2',
    tournament: 'Redline Masters LAN',
    opponent: 'Ironclad Esports',
    opponentTag: 'ICE',
    format: 'BO3',
    status: 'completed',
    dateLabel: 'Nov 10, 2026',
    timeUtc: 'Final',
    bsgScore: 2,
    opponentScore: 0,
    result: 'W',
    mapSummary: 'Mirage (13–7) · Ancient (13–9)',
    mvp: 'REAPER804 (1.44 Rating)',
  },
  {
    id: 'm-5',
    division: 'valorant',
    divisionName: 'Valorant',
    tournament: 'Challengers Split 2',
    opponent: 'Crimson Pulse',
    opponentTag: 'CP',
    format: 'BO3',
    status: 'completed',
    dateLabel: 'Nov 04, 2026',
    timeUtc: 'Final',
    bsgScore: 2,
    opponentScore: 1,
    result: 'W',
    mapSummary: 'Ascent (13–10) · Haven (9–13) · Bind (13–6)',
    mvp: 'VALKYR (278 ACS)',
  },
  {
    id: 'm-6',
    division: 'sf6',
    divisionName: 'Street Fighter 6',
    tournament: 'Tokyo Gold Cup Premier',
    opponent: 'Kurogane_JP',
    opponentTag: 'KRG',
    format: 'BO5',
    status: 'completed',
    dateLabel: 'Oct 28, 2026',
    timeUtc: 'Final',
    bsgScore: 3,
    opponentScore: 1,
    result: 'W',
    mapSummary: 'Grand Finals Reset Defended · Akuma Mirror',
    mvp: 'GOLDSTRIKE (78% Neutral Win)',
  },
];

export const TROPHIES: TrophyRecord[] = [
  {
    id: 't-1',
    title: 'Redline Masters LAN Championship',
    division: 'Counter-Strike 2',
    placement: '1st Place',
    prizePool: '$75,000',
    date: 'November 2026',
    summary:
      'Undefeated 8–0 map run through the upper bracket in Dallas, closing the Grand Final 2–0 without dropping a pistol half.',
  },
  {
    id: 't-2',
    title: 'Tokyo Gold Cup Premier',
    division: 'Street Fighter 6',
    placement: '1st Place',
    prizePool: '$30,000',
    date: 'October 2026',
    summary:
      'GOLDSTRIKE secured direct Capcom Cup seeding after defeating four top-16 seeded finalists from winners bracket.',
  },
];

export const MEDIA_HIGHLIGHTS: MediaHighlight[] = [
  {
    id: 'media-jersey',
    title: 'BSG 804 Pro Kit · Black, Crimson & Gold Edition',
    category: 'Official Team Apparel',
    date: '2026 Championship Season',
    image: jerseyShowcaseImg,
    alt: 'BSG 804 Gaming matte black, crimson red, and gold athletic pro jersey',
    description:
      'Engineered for stage endurance under arena lighting with breathable micro-mesh panels, crimson tactical chest cut, and metallic gold trim.',
    specs: ['165gsm Moisture-Wicking Knit', 'Laser-Bonded Seam Trim', 'Tournament Stage Cut'],
  },
  {
    id: 'media-facility',
    title: 'BSG 804 Tactical Bootcamp & Scrim Studio',
    category: 'Training Facility',
    date: 'Active 24/7 Operations',
    image: bootcampFacilityImg,
    alt: 'BSG 804 Gaming dark esports training bootcamp facility with pro PC stations',
    description:
      'Sound-isolated 10-seat LAN practice hall outfitted with 360Hz tournament displays, fiber redundant routing, and dedicated VOD review bay.',
    specs: ['Dual-Fiber 10Gbps Redundancy', '360Hz Tournament Monitors', 'On-Site Coaching & VOD Room'],
  },
  {
    id: 'media-trophy',
    title: 'Championship Hardware & Silverware Archive',
    category: 'Hall of Champions',
    date: '14 Titles · 2022–2026',
    image: championshipTrophyImg,
    alt: 'BSG 804 Gaming matte black and brushed gold esports championship trophy',
    description:
      'Every regional LAN trophy and MVP plaque earned across FPS, Battle Royale, and Fighting Game divisions.',
    specs: ['14 Sanctioned Titles', '68.4% Overall Match Win Rate', '4 Active Pro Divisions'],
  },
];
