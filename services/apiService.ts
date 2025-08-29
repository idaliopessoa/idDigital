import { DocumentData, RawCertfyApiResponse } from '../types';
import { generateInfluencerId } from '../utils/influencerIdGenerator';

const API_BASE_URL = 'https://api.certfy.tech/onboarding/api';

/**
 * Fetches an authentication token from the Certfy API using the native fetch API.
 * @returns The access token.
 */
export const getAuthToken = async (): Promise<string> => {
  console.log("SVC: getAuthToken - Attempting to get auth token using fetch()...");
  const url = `${API_BASE_URL}/Authentication/Token`;
  
  const requestData = {
    "companyId": "9ba48552-666f-41a7-b12e-ba24ae4613a7",
    "secretKey": "qlcoO1RJd2dvgjQyR0qT19FddVqkdZoKVIRfq/a2umU="
  };

  const requestBody = JSON.stringify(requestData);
  console.log(`SVC: getAuthToken - Posting to URL: ${url}`);
  console.log("SVC: getAuthToken - Request Body:", requestBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: requestBody
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage = `HTTP error! status: ${response.status}. Response: ${errorBody}`;
      console.error(`SVC: getAuthToken - Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (data && data.accessToken) {
      console.log("SVC: getAuthToken - Successfully received access token via fetch().");
      return data.accessToken;
    }
    
    console.error("SVC: getAuthToken - Error: Access token not found in response data.", data);
    throw new Error("Access token not found in API response.");

  } catch (error) {
    console.error("SVC: getAuthToken - CATCH BLOCK: Error getting auth token:", error);
    // Rethrow the original error to be handled by the caller
    throw error;
  }
};

/**
 * Fetches document data from the Certfy API using the native fetch API.
 * @param documentId The ID of the document to fetch.
 * @param token The authentication token.
 * @returns The complete document data from the API.
 */
export const getDocumentData = async (documentId: string, token: string): Promise<RawCertfyApiResponse> => {
  const url = `${API_BASE_URL}/Admin/Schedule/${documentId}`;
  console.log(`SVC: getDocumentData - Fetching data for document ID: ${documentId}`);
  console.log(`SVC: getDocumentData - Requesting URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Document not found in the source system.");
        }
        const errorBody = await response.text();
        const errorMessage = `Failed to fetch document data. Status: ${response.status}, Body: ${errorBody}`;
        console.error(`SVC: getDocumentData - Error: ${errorMessage}`);
        throw new Error("Failed to fetch document data from Certfy API.");
    }

    const data: RawCertfyApiResponse = await response.json();
    console.log(`SVC: getDocumentData - Successfully fetched data for document ID: ${documentId}`);
    return data;
  } catch (error) {
    console.error(`SVC: getDocumentData - CATCH BLOCK: Error getting document data for ID ${documentId}:`, error);
    // Re-throw the error to be handled by the caller.
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unexpected error occurred while fetching the document.");
  }
};


// --- Helper Functions for Data Transformation ---

/**
 * Formats a CPF string from raw numbers to XXX.XXX.XXX-XX.
 */
const formatCPF = (cpf: string | undefined): string => {
    if (!cpf) return "";
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return cpf; // Return original if not a valid CPF length
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formats a date string into DD/MM/YYYY.
 * Handles YYYY-MM-DD input.
 */
const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const [year, month, day] = dateStr.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    }
    return dateStr;
};


/**
 * Transforms the raw data from the Certfy API into the format expected by Firestore.
 * @param apiData The raw data from the Certfy API.
 * @param documentId The original document ID.
 * @returns The transformed data.
 */
export const transformApiData = (apiData: RawCertfyApiResponse, documentId: string): Omit<DocumentData, 'createdAt'> => {
    console.log('SVC: transformApiData - Starting data transformation. Raw API data:', apiData);

    const docCapture = apiData.capturesReport?.find(r => r.name.trim() === "Documento de Identificação");
    console.log("SVC: transformApiData - Found 'Documento de Identificação' capture:", docCapture);
    const ocrData = docCapture?.captureItemReport?.[0]?.ocrDocumentReport ?? {};
    console.log("SVC: transformApiData - Extracted OCR data:", ocrData);

    const formCapture = apiData.capturesReport?.find(r => r.name.trim() === "Dados pessoais");
    console.log("SVC: transformApiData - Found 'Dados pessoais' capture:", formCapture);
    const formData = formCapture?.captureItemReport?.[0]?.captureFormItens ?? [];
    console.log("SVC: transformApiData - Extracted Form data:", formData);

    const faceCapture = apiData.capturesReport?.find(r => r.name.trim() === "Prova de vida");
    const faceUrl = faceCapture?.captureItemReport?.[0]?.url ?? "";
    console.log("SVC: transformApiData - Extracted face URL:", faceUrl);

    const signatureCapture = apiData.capturesReport?.find(r => r.name.trim() === "Assinatura");
    const signatureUrl = signatureCapture?.captureItemReport?.find(item => item.type === "Png")?.url ?? "";
    console.log("SVC: transformApiData - Extracted signature URL:", signatureUrl);
    
    const getFormValue = (key: string): string => {
        const item = formData.find(f => f.key === key);
        return item?.value ?? "";
    };

    const emissionDate = formatDate(apiData.dateCompleted);
    
    // Get raw CPF, generate Influencer ID from it, then format the CPF for display.
    const rawCpf = getFormValue("CPF") || ocrData.cpf || "";
    const influencerId = generateInfluencerId(rawCpf);
    const formattedCpf = formatCPF(rawCpf);

    const transformed = {
        id: documentId,
        nomeCompleto: getFormValue("Nome") || ocrData.documentName || apiData.employee || "",
        filiacao1: ocrData.filiacao1 || "",
        filiacao2: ocrData.filiacao2 || "",
        numeroInfluenciador: influencerId,
        cpf: formattedCpf,
        dataEmissao: emissionDate,
        rgUf: ocrData.rg ? `${ocrData.rg}/${ocrData.orgao_emissor_do_RG || 'SSP'}` : "",
        imagemAssinatura: signatureUrl,
        dataNascimento: formatDate(getFormValue("Data de nascimento") || ocrData.data_de_nascimento),
        naturalidade: ocrData.naturalidade_Cidade || "São Paulo",
        nacionalidade: "Brasileira",
        localDataExpedicao: `Brasília/DF ${emissionDate}`,
        assinaturaPresidente: "",
        imagemFace: faceUrl,
        rawData: apiData,
    };

    console.log("SVC: transformApiData - Final transformed data:", transformed);
    return transformed;
};