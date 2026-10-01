import { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Gallery from './Gallery'

const NAME = 'John Arthur'
const FOLDER_ID = '1sg5ttrJI8iWJ8j4kdHLDv8sDI99pUK4b'
const DRIVE_URL = `https://drive.google.com/drive/folders/${FOLDER_ID}`
const KOFI_USERNAME = 'alexlenng'
// Link preview (WhatsApp, Messenger etc.), Drive photo cropped to 1200x630
const PREVIEW_IMAGE = 'https://lh3.googleusercontent.com/d/1WLurPB6VO8s5VptP3UsF1Pl_vj-46e6X=w1200-h630-c'
const TITLE = `Bilder på lilla ${NAME}`
const DESCRIPTION = 'Bilder från dopet i Tolånga kyrka. Bläddra och ladda ner i full upplösning.'

// openGraph/twitter replace the site-wide defaults (Latent Capital title, banner, url)
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: PREVIEW_IMAGE, width: 1200, height: 630 }],
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, images: [PREVIEW_IMAGE] },
  alternates: { canonical: null },
}

// Re-read folder contents at most hourly, so new photos show up without a redeploy
export const revalidate = 3600

async function getPhotoIds() {
  const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}`)
  const html = await res.text()
  return [...html.matchAll(/id="entry-([\w-]+)"/g)].map((m) => m[1])
}

export default async function Dop() {
  const ids = await getPhotoIds()
  return (
    <div className="mx-auto max-w-xl space-y-8 py-12 text-center">
      <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 dark:text-gray-100">
        Bilder på lilla {NAME}
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Foto: Alexander Lenngren ·{' '}
        <a href="#kofi" className="text-primary-500 hover:text-primary-600">
          ☕ Ko-fi
        </a>
      </p>
      <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
        Här är bilderna! Tryck på en bild för att se den i stort format och ladda ner de du gillar i
        full upplösning.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Vill du ha alla på en gång?{' '}
        <a
          href={DRIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-600 underline"
        >
          Ladda ner hela mappen i Google Drive
        </a>
      </p>
      <Gallery ids={ids}>
        <p
          id="kofi"
          className="scroll-mt-8 pt-8 text-lg leading-7 text-gray-500 dark:text-gray-400"
        >
          Fotografering är en hobby jag gärna lägger tid på. Om du gillar bilderna får du jättegärna
          skänka en slant via Ko-fi. Det hjälper mig att utveckla hobbyn och ta ännu bättre bilder
          nästa gång!
        </p>
        <iframe
          src={`https://ko-fi.com/${KOFI_USERNAME}/?hidefeed=true&widget=true&embed=true&preview=true`}
          title="Ko-fi"
          className="h-[712px] w-full rounded-md border-none bg-gray-50 p-1"
        />
      </Gallery>
      <Analytics />
    </div>
  )
}
