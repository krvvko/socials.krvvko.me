function escapeVCard(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

export function createContact(date = new Date()) {
  const metOn = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Krauchanka;Kostya;;;',
    'FN:Kostya Krauchanka',
    'TEL;TYPE=CELL:+19787273287',
    'URL:https://krvvko.me',
    'URL:https://socials.krvvko.me',
    'X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/kostya-krauchanka-458288441/',
    'X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/krvvko/',
    'X-SOCIALPROFILE;TYPE=github:https://github.com/krvvko',
    'X-SOCIALPROFILE;TYPE=twitter:https://x.com/KKrevvetka',
    'X-SOCIALPROFILE;TYPE=discord:https://discord.com/users/552151232358252563',
    `NOTE:${escapeVCard(`We met at a meetup on ${metOn}.`)}`,
    'END:VCARD',
    '',
  ].map(line => {
    // Fold long properties according to the vCard 3.0 content-line convention.
    const parts = line.match(/.{1,73}/g);
    return parts ? parts.join('\r\n ') : '';
  }).join('\r\n');
}

export function downloadContact() {
  const url = URL.createObjectURL(new Blob([createContact()], { type: 'text/vcard;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kostya-krauchanka.vcf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
