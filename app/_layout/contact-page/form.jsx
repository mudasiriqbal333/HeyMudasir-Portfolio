'use client';

import { useEffect, useRef, useState } from 'react';

import { motion, useScroll, useTransform } from 'framer-motion';

import { MagneticButton } from '@/components';
import { contactOptions } from '@/data';
import { useMediaQuery } from '@/hooks';
import { HONEYPOT_FIELD, validateContact } from '@/utils';

import { Alert, Field, Form, Honeypot, SendWrapper } from './index.styled';

const { fields, submitLabel, successMessage, failureMessage } =
  contactOptions.form;

const emptyValues = Object.fromEntries(
  fields.map(({ name }) => [name, '']).concat([[HONEYPOT_FIELD, '']]),
);

const hasKeys = object => Boolean(object) && Object.keys(object).length > 0;

/**
 * Reference parallax: the button moves 0.2x the distance between its visual
 * centre and the viewport centre. The wrapper is shifted up 60% of its own
 * height by CSS, so the range is corrected for that offset. Reads the range
 * from a ref so the transformer always sees fresh numbers.
 * @param {import('react').MutableRefObject<HTMLDivElement>} ref
 */
function useSendParallax(ref) {
  const range = useRef([0, 0]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const update = () => {
      const height = ref.current?.offsetHeight ?? 0;
      const viewport = window.innerHeight;
      range.current = [
        0.1 * viewport - 0.02 * height,
        -0.1 * viewport - 0.22 * height,
      ];
    };
    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, [ref]);

  return useTransform(scrollYProgress, progress => {
    const [from, to] = range.current;
    return from + (to - from) * progress;
  });
}

export function ContactForm() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  //? Smooth scrolling (Lenis) takes every wheel event unless an ancestor
  //? carries data-lenis-prevent. The message box gets it only while its text
  //? is taller than the box: a long message can then be scrolled with the
  //? wheel, and a short one still lets the page scroll through it.
  const [messageOverflows, setMessageOverflows] = useState(false);

  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const sendRef = useRef(null);
  //? The reference only runs the scroll parallax on desktop smooth scroll.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const parallaxY = useSendParallax(sendRef);

  /** @type {import('react').ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>} */
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setValues(previous => ({ ...previous, [name]: value }));
    if (target instanceof HTMLTextAreaElement) {
      setMessageOverflows(target.scrollHeight > target.clientHeight);
    }
    if (errors[name]) {
      setErrors(({ [name]: _removed, ...rest }) => rest);
    }
  };

  const showFieldErrors = fieldErrors => {
    setErrors(fieldErrors);
    setStatus('idle');
    const first = fields.find(({ name }) => fieldErrors[name]);
    if (first) document.getElementById(`contact-${first.name}`)?.focus();
  };

  /** @type {import('react').FormEventHandler<HTMLFormElement>} */
  const handleSubmit = async event => {
    event.preventDefault();

    const validation = validateContact(values);
    if (!validation.ok) {
      showFieldErrors(validation.errors);
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({ ok: false }));

      if (!response.ok || !data.ok) {
        if (hasKeys(data.errors)) showFieldErrors(data.errors);
        else setStatus('failed');
        return;
      }

      setValues(emptyValues);
      setErrors({});
      setMessageOverflows(false);
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  };

  const inputs = fields.map(
    ({
      number,
      name,
      label,
      placeholder,
      type,
      rows,
      required,
      autoComplete,
    }) => {
      const id = `contact-${name}`;
      const errorId = `${id}-error`;
      const shared = {
        id,
        name,
        placeholder,
        required,
        autoComplete,
        value: values[name],
        onChange: handleChange,
        'aria-invalid': Boolean(errors[name]),
        'aria-describedby': errors[name] ? errorId : undefined,
      };

      return (
        <Field key={name} data-filled={values[name].trim().length > 0}>
          <span data-number aria-hidden='true'>
            {number}
          </span>
          <label htmlFor={id}>{label}</label>
          {type === 'textarea' ? (
            <textarea
              rows={rows}
              data-lenis-prevent={messageOverflows ? '' : undefined}
              {...shared}
            />
          ) : (
            <input type={type} {...shared} />
          )}
          {errors[name] ? (
            <Alert id={errorId} role='alert'>
              <span>{errors[name]}</span>
            </Alert>
          ) : null}
        </Field>
      );
    },
  );

  return (
    <Form noValidate aria-busy={status === 'sending'} onSubmit={handleSubmit}>
      {/* Honeypot: hidden from people, filled by bots */}
      <Honeypot aria-hidden='true'>
        <label htmlFor={`contact-${HONEYPOT_FIELD}`}>
          Leave this field empty
        </label>
        <input
          id={`contact-${HONEYPOT_FIELD}`}
          name={HONEYPOT_FIELD}
          type='text'
          tabIndex={-1}
          autoComplete='off'
          value={values[HONEYPOT_FIELD]}
          onChange={handleChange}
        />
      </Honeypot>

      {inputs}

      {/* Persistent live region so status changes are announced */}
      <div role='status' aria-live='polite'>
        {status === 'sent' ? (
          <Alert data-variant='success'>
            <span>{successMessage}</span>
          </Alert>
        ) : null}
        {status === 'failed' ? (
          <Alert data-variant='failure'>
            <span>{failureMessage}</span>
          </Alert>
        ) : null}
      </div>

      <SendWrapper ref={sendRef}>
        <motion.div style={{ y: isDesktop && !reduceMotion ? parallaxY : 0 }}>
          <MagneticButton
            type='submit'
            variant='primary'
            strength={100}
            disabled={status === 'sending'}
            whileHover={{ scale: 1 }}
            className='size-[clamp(9em,12vw,11em)] p-0 text-[1em] font-normal'
          >
            {submitLabel}
          </MagneticButton>
        </motion.div>
      </SendWrapper>
    </Form>
  );
}
