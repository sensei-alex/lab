import { BASE_URL } from "@/useLesson";

export function Image({ src, alt }: { src?: string; alt?: string }) {
  return <img src={BASE_URL + src} alt={alt} />;
}
