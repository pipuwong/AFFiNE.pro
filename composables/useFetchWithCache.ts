import { Cacheables } from 'cacheables'

const cache = new Cacheables({
  logTiming: true,
  log: true
})

const FOUR_HOHURS = 1000 * 3600 * 4

export default async <T>(url: string) => {
  const store = useStore()

  const getCacheData = () =>
    // @TODO: Support xhr cache
    cache.cacheable(() => useFetch<T>(url), url, {
      cachePolicy: 'max-age',
      maxAge: FOUR_HOHURS,
    })

  const cached = cache.isCached(url) || store.context.lastFetched[url]

  if (cached) {
    console.log(`Getting value from cache for ${url}`)
  }

  const lastCache = store.context.lastFetched[url]
  const isValid = lastCache && lastCache.date + FOUR_HOHURS > Date.now()

  if (process.client) {
    if (lastCache && isValid) {
      console.log(`Getting value from client cache for ${url}`)
      return ref(lastCache.data)
    }
  }

  const { data, error } = await getCacheData()

  if (!lastCache || !isValid) {
    store.context.lastFetched[url] = {
      date: Date.now(),
      data
    }
  }

  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch data from ${url}`
    })
  }

  return data
}
