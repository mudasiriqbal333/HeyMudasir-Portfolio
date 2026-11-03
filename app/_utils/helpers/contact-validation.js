export const contactErrors = {
  name: 'Please enter a valid name',
  email: 'Please enter a valid email address',
  message: 'Please enter a text between 3 and 3000 characters',
  company: 'Please keep the company name under 150 characters',
  service: 'Please keep this under 200 characters',
};

//? The longest value each field may hold. The form itself never comes close;
//? the caps are for whoever posts to the API directly.
export const contactLimits = {
  name: 100,
  email: 254,
  company: 150,
  service: 200,
  message: 3000,
};

//? Hidden form field that only bots fill in. Shared by the form and the API
//? route so the two can never drift apart. The name is one no browser or
//? password manager keeps a value for (not a name, phone, address or website
//? field): if autofill filled it for a real visitor, their message would be
//? dropped while the page says "Thank you".
export const HONEYPOT_FIELD = 'topic';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The trimmed text of a field, or null when the value is not text at all
 * (an object, an array, a number: nothing the form can send).
 * @param {unknown} value
 */
const text = value => (typeof value === 'string' ? value.trim() : null);

/**
 * The five fields of a submission as trimmed text and nothing else, ready to
 * be forwarded. Call it after validateContact has passed.
 * @param {Record<string, unknown> | null} [values]
 * @returns {{name: string, email: string, company: string, service: string, message: string}}
 */
export function cleanContact(values) {
  const { name, email, company, service, message } = values ?? {};

  return {
    name: text(name) ?? '',
    email: text(email) ?? '',
    company: text(company) ?? '',
    service: text(service) ?? '',
    message: text(message) ?? '',
  };
}

/**
 * Validates a contact form submission. Company and service are optional.
 * @param {{name?: unknown, email?: unknown, company?: unknown, service?: unknown, message?: unknown} | null} [values]
 * @returns {{ok: boolean, errors: Partial<typeof contactErrors>}}
 */
export function validateContact(values) {
  const {
    name = '',
    email = '',
    company = '',
    service = '',
    message = '',
  } = values ?? {};
  /** @type {Partial<typeof contactErrors>} */
  const errors = {};

  const cleanName = text(name);
  if (
    cleanName === null ||
    cleanName.length < 2 ||
    cleanName.length > contactLimits.name
  ) {
    errors.name = contactErrors.name;
  }

  const cleanEmail = text(email);
  if (
    cleanEmail === null ||
    cleanEmail.length > contactLimits.email ||
    !EMAIL_PATTERN.test(cleanEmail)
  ) {
    errors.email = contactErrors.email;
  }

  const cleanCompany = text(company);
  if (cleanCompany === null || cleanCompany.length > contactLimits.company) {
    errors.company = contactErrors.company;
  }

  const cleanService = text(service);
  if (cleanService === null || cleanService.length > contactLimits.service) {
    errors.service = contactErrors.service;
  }

  const cleanMessage = text(message);
  if (
    cleanMessage === null ||
    cleanMessage.length < 3 ||
    cleanMessage.length > contactLimits.message
  ) {
    errors.message = contactErrors.message;
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
