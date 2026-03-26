import base64 from 'base-64'

export const getId = () => {
    const token = localStorage.getItem("FM_Access")
    const payload = token?.split('.')[1]
    if (!payload) return 
    
    const json = JSON.parse(base64.decode(payload))
    return json.id
}
