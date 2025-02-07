function formatTimeNumber(timeString: string | undefined) {
  if (!timeString) return 0
  
  // Check if input is already a number
  const num = Number(timeString)
  if (!isNaN(num)) {
    // Assume that the number is in minutes
    return num / 60;
  }
  
  // Parse h:mm:ss format
  const [hours = '0', minutes = '0', seconds = '0'] = timeString.split(':')
  return parseInt(hours) * 60 + parseInt(minutes) + Math.ceil(parseInt(seconds) / 60)
}

export function formatTime(timeString: string | undefined, variant: 'short' | 'long' = 'short') {
  const totalMinutes = formatTimeNumber(timeString)
  
  if (variant === 'long') {
    if (totalMinutes < 1) return 'less than a minute'
    if (totalMinutes < 60) return `${totalMinutes} minutes`
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    if (m === 0) return `${h} ${h === 1 ? 'hour' : 'hours'}`
    return `${h} ${h === 1 ? 'hour' : 'hours'} and ${m} ${m === 1 ? 'minute' : 'minutes'}`
  }

  if (totalMinutes < 1) return '< 1 min'
  if (totalMinutes < 60) return `${totalMinutes} mins`
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
