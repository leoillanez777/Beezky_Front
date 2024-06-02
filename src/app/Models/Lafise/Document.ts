export interface DocumentLafise {
  number: string
  documentType: string
  expiryDate: string
}

export function CompletarDocument(n: string, d: string, e: string): DocumentLafise {
  const documentLafise: DocumentLafise = {
    number: n || "",
    documentType: d || "",
    expiryDate: e || ""
  };
 
  return documentLafise
 }