import { CvReferenceEntry, RenderableCv } from "./types";

type CandidateProfile = {
  basics?: {
    full_name?: string;
    current_title?: string;
    email?: string;
    url?: string;
    links?: string[];
  };
  summary?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    dates?: string;
    url?: string;
    descriptions?: string[];
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    field_of_study?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    expiration_date?: string;
  }>;
  skills?: string[];
  references?: Array<{
    name?: string;
    title?: string;
    contact?: string;
    testimonial?: string;
  }>;
};

function nonEmpty(value: string | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function uniqueNonEmpty(values: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (!nonEmpty(value)) {
      continue;
    }
    if (seen.has(value)) {
      continue;
    }
    seen.add(value);
    result.push(value);
  }

  return result;
}

export function createRenderableCv(profile: unknown): RenderableCv {
  const candidate = (profile ?? {}) as CandidateProfile;

  const references: CvReferenceEntry[] = Array.isArray(candidate.references)
    ? candidate.references.map((reference) => ({
        name: reference.name ?? "",
        title: reference.title ?? "",
        contact: reference.contact ?? "",
        testimonial: reference.testimonial ?? ""
      }))
    : [];

  return {
    fullName: candidate.basics?.full_name ?? "",
    headline: candidate.basics?.current_title ?? "",
    contact: {
      email: candidate.basics?.email ?? "",
      url: candidate.basics?.url ?? "",
      links: uniqueNonEmpty([
        candidate.basics?.url,
        ...(Array.isArray(candidate.basics?.links) ? candidate.basics?.links : [])
      ])
    },
    summary: candidate.summary ?? "",
    experience: Array.isArray(candidate.experience)
      ? candidate.experience.map((item) => ({
          title: item.title ?? "",
          company: item.company ?? "",
          dates: item.dates ?? "",
          url: item.url ?? "",
          descriptions: Array.isArray(item.descriptions) ? item.descriptions : []
        }))
      : [],
    projects: [],
    education: Array.isArray(candidate.education)
      ? candidate.education.map((item) => ({
          institution: item.institution ?? "",
          degree: item.degree ?? "",
          dates: "",
          details: nonEmpty(item.field_of_study) ? [item.field_of_study] : []
        }))
      : [],
    certifications: Array.isArray(candidate.certifications)
      ? candidate.certifications.map((item) => ({
          name: item.name ?? "",
          issuer: item.issuer ?? "",
          date: item.expiration_date ?? "",
          details: []
        }))
      : [],
    skills: Array.isArray(candidate.skills) ? candidate.skills : [],
    references,
    extras: []
  };
}
