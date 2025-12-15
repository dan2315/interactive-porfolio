function timeAgo(timestamp) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = Date.now();
  const secondsDiff = Math.floor((now - timestamp * 1000) / 1000);

  if (secondsDiff < 60) return rtf.format(-secondsDiff, 'seconds');
  const minutes = Math.floor(secondsDiff / 60);
  if (minutes < 60) return rtf.format(-minutes, 'minutes');
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hours');
  const days = Math.floor(hours / 24);
  if (days < 30) return rtf.format(-days, 'days');
  const months = Math.floor(days / 30);
  if (months < 12) return rtf.format(-months, 'months');
  const years = Math.floor(days / 365);
  return rtf.format(-years, 'years');
}

export {timeAgo}