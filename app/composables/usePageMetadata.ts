interface PageMetadata {
  title: string
  description: string
  path: string
}

export function usePageMetadata({ title, description, path }: PageMetadata) {
  const config = useRuntimeConfig()
  const canonical = `${String(config.public.siteUrl).replace(/\/$/, '')}${path}`

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    twitterCard: 'summary'
  })

  useHead({ link: [{ rel: 'canonical', href: canonical }] })
}
