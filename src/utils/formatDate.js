export const formatDate = (date, locale = "ja-JP") => {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  })

  return formatter.format(new Date(date))
}

export const formatRelativeDate = (date, locale = "ja-JP") => {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  const diff = new Date().getTime() - new Date(date).getTime()
  const diffMin = Math.round(diff / 1000 / 60)
  const diffHour = Math.round(diff / 1000 / 60 / 60)
  const diffDay = Math.round(diff / 1000 / 60 / 60 / 24)

  if (-diffDay > 30) {
    return formatDate(date, locale)
  } else if (diffDay > 0) {
    return rtf.format(-diffDay, "day")
  } else if (diffHour > 0) {
    return rtf.format(-diffDay, "hour")
  } else {
    return rtf.format(-diffMin, "minute")
  }
}
