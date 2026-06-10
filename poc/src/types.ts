export type ActorId = 'user' | 'isp' | 'bca' | 'platform';

export type Subscriber = {
  id: string;
  fullName: string;
  nationalIdMasked: string;
  phone: string;
  contactEmail: string;
  carrier: 'KT' | 'SKT' | 'KB';
};

export type Certificate = {
  jti: string;
  bmailId: string;
  subscriberId: string;
  mode: 'real' | 'anon';
  issuedAt: string;
  validUntil: string;
};

export type BmailId = {
  address: string;
  displayName: string;
  mode: 'real' | 'anon';
  bcaId: string;
  certificateJti: string;
  status: 'active' | 'suspended';
  registeredAt: string;
};

export type Domain = {
  domain: string;
  baseProvider: string;
  caPartners: string[];
  dkimStatus: 'pass' | 'fail';
  portalListed: boolean;
  status: 'certified' | 'fake' | 'unknown';
};

export type BackupChannel = {
  type: 'messenger' | 'phone' | 'email';
  value: string;
  validatedAt: string;
};

export type ChangeToken = {
  jti: string;
  oldId: string;
  newId: string;
  issuedAt: string;
};

export type IdentificationRequest = {
  id: string;
  requester: string;
  target: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
};

export type PhishingReport = {
  id: string;
  reporter: string;
  suspectBmailId: string;
  status: 'verifying' | 'phishing-confirmed' | 'sender-confirmed';
  createdAt: string;
};

export type Member = {
  platformMemberId: string;
  bmailId: string;
  joinedAt: string;
  reviewCount: number;
  purchaseCount: number;
};

export type Review = {
  id: string;
  memberId: string;
  content: string;
  identifiable: boolean;
  postedAt: string;
};

export type LogEntry = {
  ts: string;
  actor: ActorId;
  message: string;
};

export type ScenarioId = 'S1' | 'S2' | 'S3' | 'S4';

export type TrustLabel = 'pending' | 'certified' | 'fake' | 'unknown';

export type Email = {
  id: string;
  from: string;
  fromDisplay: string;
  subject: string;
  preview: string;
  receivedAt: string;
  trustLabel: TrustLabel;
};

export type ScenarioStep = {
  num: number;
  actor: ActorId;
  message: string;
  apply: (s: DemoState) => void;
};

export type DemoState = {
  bca: {
    subscribers: Subscriber[];
    issuedCertificates: Certificate[];
  };
  isp: {
    bmailIds: BmailId[];
    domains: Domain[];
    changeTokens: ChangeToken[];
    identificationRequests: IdentificationRequest[];
    phishingReports: PhishingReport[];
    backupChannels: BackupChannel[];
  };
  platform: {
    members: Member[];
    reviews: Review[];
  };
  user: {
    activeBmailId: string | null;
    expiringExternalId: string | null;
    inbox: Email[];
  };
  scenario: {
    current: ScenarioId | null;
    step: number;
    completed: ScenarioId[];
  };
  log: LogEntry[];
};
