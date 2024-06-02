import { MediaLafise } from "./Media"
import { DocumentLafise } from "./Document"

export interface KYCLafise {
  type: string
  customerName: string
  document: DocumentLafise
  media: MediaLafise[]
}

export function CompletarKyc(t: string, c: string, d: DocumentLafise, m: MediaLafise[]): KYCLafise {
  const kyc: KYCLafise = {
    type: t || "",
    customerName: c || "",
    document: d || null,
    media: m || []
  };
 
  return kyc
 }