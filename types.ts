import { Timestamp } from 'firebase/firestore';

export interface DocumentData {
  id: string;
  nomeCompleto: string;
  filiacao1: string;
  filiacao2: string;
  numeroInfluenciador: string;
  cpf: string;
  dataEmissao: string;
  rgUf: string;
  imagemAssinatura: string;
  dataNascimento: string;
  naturalidade: string;
  nacionalidade: string;
  localDataExpedicao: string;
  assinaturaPresidente: string;
  imagemFace: string;
  createdAt: Timestamp;
  rawData: object;
}


// --- Real Certfy API Response Structure ---

interface OcrDocumentReport {
  documentName?: string;
  filiacao1?: string;
  filiacao2?: string;
  cpf?: string;
  data_de_nascimento?: string;
  rg?: string;
  orgao_emissor_do_RG?: string;
  naturalidade_Cidade?: string;
}

interface CaptureFormItem {
  key: string;
  value: string;
}

interface CaptureItemReport {
  ocrDocumentReport?: OcrDocumentReport;
  captureFormItens?: CaptureFormItem[];
  url?: string;
  type?: string;
}

interface CaptureReport {
  name: string;
  captureItemReport?: CaptureItemReport[];
}

export interface RawCertfyApiResponse {
  scheduleId: string;
  employee?: string;
  dateCompleted?: string; // ISO 8601 date string
  capturesReport?: CaptureReport[];
}
