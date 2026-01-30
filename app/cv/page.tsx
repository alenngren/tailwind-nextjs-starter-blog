import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'CV' })

export default function CV() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            CV
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Download or view my curriculum vitae
          </p>
        </div>
        <div className="py-12">
          <div className="mb-8">
            <a
              href="/static/cv.pdf"
              download
              className="bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-400 inline-flex items-center rounded-md px-4 py-2 text-white"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </a>
          </div>
          <div className="w-full">
            <object
              data="/static/cv.pdf"
              type="application/pdf"
              className="h-[80vh] w-full rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-400">
                PDF viewer not available.{' '}
                <a
                  href="/static/cv.pdf"
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Download the PDF
                </a>{' '}
                instead.
              </p>
            </object>
          </div>
        </div>
      </div>
    </>
  )
}
