import { formatInTimeZone } from 'date-fns-tz'

const TIMEZONE = 'Asia/Amman'

export function formatAmmanDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatInTimeZone(dateObj, TIMEZONE, 'yyyy-MM-dd HH:mm:ss')
}

export function formatAmmanDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatInTimeZone(dateObj, TIMEZONE, 'yyyy-MM-dd')
}

export function formatAmmanTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatInTimeZone(dateObj, TIMEZONE, 'HH:mm:ss')
}
