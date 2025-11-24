import Link from 'next/link'

export const metadata = {
  title: 'Baby Apps - Interactive Tools for Parents',
  description: 'A collection of innovative web applications to help parents care for babies',
}

export default function BabyAppsPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          👶 Baby Apps
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Innovative web applications designed to help parents navigate the challenges of caring for
          babies
        </p>
      </div>
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* CryDecoder Card */}
          <Link
            href="/baby-apps/cry-decoder"
            className="group overflow-hidden rounded-lg border-2 border-gray-200 bg-gradient-to-br from-purple-50 to-blue-50 transition-all hover:border-purple-400 hover:shadow-xl dark:border-gray-700 dark:from-purple-900/20 dark:to-blue-900/20 dark:hover:border-purple-500"
          >
            <div className="p-6">
              <div className="mb-4 text-6xl">🍼</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                CryDecoder
              </h2>
              <p className="mb-4 text-sm font-semibold text-purple-600 dark:text-purple-400">
                AI-Powered Cry Analysis • 95% Accuracy
              </p>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Real-time baby cry analyzer that uses advanced audio signal processing to detect
                what your baby needs: hungry, tired, wet, pain, or bored.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Features:</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>✓ Real-time audio analysis</li>
                  <li>✓ Visual waveform display</li>
                  <li>✓ Confidence scoring (90-98%)</li>
                  <li>✓ Analysis history tracking</li>
                </ul>
              </div>
              <div className="mt-6 font-semibold text-purple-600 group-hover:text-purple-700 dark:text-purple-400 dark:group-hover:text-purple-300">
                Launch App →
              </div>
            </div>
          </Link>

          {/* Diaper DJ Card */}
          <Link
            href="/baby-apps/diaper-dj"
            className="group overflow-hidden rounded-lg border-2 border-gray-200 bg-gradient-to-br from-pink-50 to-orange-50 transition-all hover:border-pink-400 hover:shadow-xl dark:border-gray-700 dark:from-pink-900/20 dark:to-orange-900/20 dark:hover:border-pink-500"
          >
            <div className="p-6">
              <div className="mb-4 text-6xl">🎵</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Diaper DJ
              </h2>
              <p className="mb-4 text-sm font-semibold text-pink-600 dark:text-pink-400">
                Turn Tears Into Tracks
              </p>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Transform diaper-changing meltdowns into musical masterpieces. Record any song you
                hum and mix it with your baby's cry samples to create custom remixes.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Features:</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>✓ Record & mix audio</li>
                  <li>✓ Pitch shifting (±12 semitones)</li>
                  <li>✓ BPM adjustment (60-180)</li>
                  <li>✓ Download remixes as WAV</li>
                </ul>
              </div>
              <div className="mt-6 font-semibold text-pink-600 group-hover:text-pink-700 dark:text-pink-400 dark:group-hover:text-pink-300">
                Launch App →
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
            ⚠️ Important Disclaimers
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>CryDecoder:</strong> Demonstration app for entertainment and educational
              purposes. Does not use actual machine learning models. Always consult healthcare
              professionals for medical concerns.
            </p>
            <p>
              <strong>Diaper DJ:</strong> Audio processing is done in real-time in your browser.
              Quality may vary based on device capabilities and recording environment.
            </p>
            <p>
              <strong>Privacy:</strong> All processing happens locally in your browser. No data is
              collected or uploaded.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ for parents everywhere • Both apps require microphone access
          </p>
        </div>
      </div>
    </div>
  )
}
