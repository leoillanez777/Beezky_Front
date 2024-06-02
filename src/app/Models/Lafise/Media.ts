export interface MediaLafise {
  type: string
  file: string
}

export function CompletarMedia(t: string, f: string): MediaLafise {
  const mediaLafise: MediaLafise = {
    type: t || "",
    file: f || ""
  };
 
  return mediaLafise
 }