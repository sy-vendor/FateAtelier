const CHINESE_REGIONS = new Set(['CN', 'HK', 'MO', 'TW'])

export default function handler(request, response) {
  const country = String(request.headers['x-vercel-ip-country'] || '').toUpperCase()
  const locale = CHINESE_REGIONS.has(country) ? 'zh-CN' : 'en'

  response.setHeader('Cache-Control', 'private, no-store')
  response.status(200).json({ locale, country: country || null })
}
