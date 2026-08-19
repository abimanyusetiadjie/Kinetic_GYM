export type CalendarEvent = {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
};

const formatDateForGoogle = (date: Date) => {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
};

const formatDateForICS = (date: Date) => {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
};

export const generateGoogleCalendarLink = (event: CalendarEvent) => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${formatDateForGoogle(event.startTime)}/${formatDateForGoogle(event.endTime)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const downloadICSFile = (event: CalendarEvent) => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${formatDateForICS(event.startTime)}`,
    `DTEND:${formatDateForICS(event.endTime)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
