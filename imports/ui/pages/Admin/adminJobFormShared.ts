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
  if (!form.title.trim() || !form.company.trim() || !form.location.trim()) {
    return { error: 'Title, company, and location are required.' };
  }
  if (!getDescriptionText(form.description)) {
    return { error: 'Please add a job description.' };
  }

  const basePay = parseFloat(form.basePay);
  if (isNaN(basePay) || basePay < 0) {
    return { error: 'Please enter a valid base pay amount.' };
  }

  const payMaxRaw = form.payMax.trim();
  let payMax: number | undefined;
  if (payMaxRaw) {
    payMax = parseFloat(payMaxRaw);
    if (isNaN(payMax) || payMax < basePay) {
      return { error: 'Maximum pay must be a number greater than or equal to base pay.' };
    }
  }

  return {
    data: {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
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
