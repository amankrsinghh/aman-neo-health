const base_url = import.meta.env.VITE_API_URL || 'https://api.neohealthcard.com:9100'
const client_url = import.meta.env.VITE_CLIENT_URL || 'https://patient.neohealthcard.com'

export default base_url
export { client_url }
