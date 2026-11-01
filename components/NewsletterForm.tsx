'use client'

import { useRef, useState } from 'react'

interface NewsletterFormProps {
  title?: string
}

const NewsletterForm = ({ title = 'Subscribe to the newsletter' }: NewsletterFormProps) => {
  const inputEl = useRef<HTMLInputElement>(null)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <div>
      <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</div>
      <form className="flex flex-col sm:flex-row" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email-input">
            <span className="sr-only">Email address</span>
            <input
              autoComplete="email"
              className="focus:ring-primary-600 w-72 rounded-md px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none dark:bg-black"
              id="email-input"
              name="email"
              placeholder={subscribed ? "You're subscribed! 🎉" : 'Enter your email'}
              ref={inputEl}
              required
              type="email"
              disabled={subscribed || loading}
              aria-describedby={error ? 'newsletter-error' : undefined}
            />
          </label>
        </div>
        <div className="mt-2 flex w-full rounded-md shadow-sm sm:mt-0 sm:ml-3">
          <button
            className={`bg-primary-700 w-full rounded-md px-4 py-2 font-medium text-white sm:py-0 ${
              subscribed || loading ? 'cursor-default' : 'hover:bg-primary-800'
            } focus:ring-primary-600 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:ring-offset-black`}
            type="submit"
            disabled={subscribed || loading}
          >
            {loading ? 'Subscribing...' : subscribed ? 'Thank you!' : 'Sign up'}
          </button>
        </div>
      </form>
      {error && (
        <p
          id="newsletter-error"
          role="alert"
          className="mt-2 max-w-md text-sm text-red-700 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default NewsletterForm
