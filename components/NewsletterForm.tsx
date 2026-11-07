'use client'

import { useId, useRef, useState } from 'react'

interface NewsletterFormProps {
  title?: string
}

// Email signup (posts to Formspree). Hairline field + lime button, in the raffi.website style.
const NewsletterForm = ({ title }: NewsletterFormProps) => {
  const inputEl = useRef<HTMLInputElement>(null)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const id = useId()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/mpwpneya', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        setSubscribed(true)
        if (inputEl.current) {
          inputEl.current.value = ''
        }
      } else {
        setError("Sorry, that didn't go through. Please check your email address and try again.")
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setError("Couldn't reach the signup service. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ed-signup">
      {title && <p className="ed-signup__title">{title}</p>}
      <form className="ed-signup__form" onSubmit={handleSubmit}>
        <label htmlFor={`${id}-email`} className="ed-signup__label">
          Email address
        </label>
        <div className="ed-signup__row">
          <input
            autoComplete="email"
            className="ed-signup__input"
            id={`${id}-email`}
            name="email"
            placeholder={subscribed ? "You're subscribed" : 'you@example.com'}
            ref={inputEl}
            required
            type="email"
            disabled={subscribed || loading}
            aria-describedby={error ? `${id}-error` : `${id}-hint`}
          />
          <button className="ed-signup__button" type="submit" disabled={subscribed || loading}>
            {loading ? 'Subscribing…' : subscribed ? 'Thank you' : 'Subscribe'}
            {!loading && !subscribed && <span aria-hidden="true">→</span>}
          </button>
        </div>
        {error ? (
          <p id={`${id}-error`} role="alert" className="ed-signup__error">
            {error}
          </p>
        ) : (
          <p id={`${id}-hint`} className="ed-signup__hint" role="status">
            {subscribed ? "Thanks, you're on the list." : ''}
          </p>
        )}
      </form>
    </div>
  )
}

export default NewsletterForm
