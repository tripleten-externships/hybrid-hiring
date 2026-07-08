import type { Job } from '/imports/api/jobs/collection';
import type { JobType } from '/imports/types';
import { getDescriptionText } from '/imports/api/jobs/description';

export interface JobFormState {
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  payUnit: 'hourly' | 'salary';
  basePay: string;
  payMax: string;
  tags: string;
  benefits: string;
  description: string;
  companyLogo: string;
}

export const EMPTY_JOB_FORM: JobFormState = {
  title: '',
  company: '',
  location: '',
  jobType: 'full-time',
  payUnit: 'hourly',
  basePay: '',
  payMax: '',
  tags: '',
  benefits: '',
  description: '',
  companyLogo: '',
};

export function splitList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function formatFieldList(fields: string[]): string {
  if (fields.length === 1) {
    return fields[0];
  }

  if (fields.length === 2) {
    return `${fields[0]} and ${fields[1]}`;
  }

  return `${fields.slice(0, -1).join(', ')}, and ${fields[fields.length - 1]}`;
}

export function jobToFormState(job: Job): JobFormState {
  return {
    title: job.title,
    company: job.company,
    location: job.location,
    jobType: job.jobType,
    payUnit: job.payUnit,
    basePay: String(job.basePay),
    payMax: job.payMax != null ? String(job.payMax) : '',
    tags: (job.tags ?? []).join(', '),
    benefits: (job.benefits ?? []).join(', '),
    description: job.description,
    companyLogo: job.companyLogo ?? '',
  };
}

export interface ParsedJobForm {
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  payUnit: 'hourly' | 'salary';
  basePay: number;
  payMax?: number;
  clearPayMax: boolean;
  tags: string[];
  benefits: string[];
  description: string;
  companyLogo: string;
  clearCompanyLogo: boolean;
}

export function parseJobForm(form: JobFormState): { error: string } | { data: ParsedJobForm } {
  const {
    title,
    company,
    location,
    basePay: basePayRaw,
    payMax: payMaxRaw,
    description,
  } = Object.entries(form).reduce(
    (acc, [key, value]) => {
      acc[key as keyof JobFormState] = value.trim();
      return acc;
    },
    {} as Record<keyof JobFormState, string>
  );

  const missingFields = [
    !title && 'Job title',
    !company && 'Company',
    !location && 'Location',
    !basePayRaw && 'Base pay',
    !getDescriptionText(description) && 'Description',
  ].filter(Boolean) as string[];

  if (missingFields.length > 0) {
    const fields = formatFieldList(missingFields);
    return { error: `${fields} ${missingFields.length === 1 ? 'is' : 'are'} required.` };
  }

  const basePay = parseFloat(basePayRaw);
  if (isNaN(basePay) || basePay < 0) {
    return { error: 'Please enter a valid base pay amount.' };
  }

  const payMax = payMaxRaw ? parseFloat(payMaxRaw) : undefined;
  if (payMaxRaw && (payMax == null || isNaN(payMax) || payMax < basePay)) {
    return { error: 'Maximum pay must be a number greater than or equal to base pay.' };
  }

  return {
    data: {
      title,
      company,
      location,
      jobType: form.jobType,
      payUnit: form.payUnit,
      basePay,
      payMax,
      clearPayMax: !payMaxRaw,
      tags: splitList(form.tags),
      benefits: splitList(form.benefits),
      description: form.description,
      companyLogo: form.companyLogo,
      clearCompanyLogo: !form.companyLogo,
    },
  };
}
