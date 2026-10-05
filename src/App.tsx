import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Check, Copy, MapPin, Phone, QrCode, UserRoundPlus, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const siteUrl = 'https://socials.krvvko.me';
const socials = [
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/kostya-krauchanka-458288441/' },
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/krvvko/' },
  { name: 'GitHub', icon: 'github', href: 'https://github.com/krvvko' },
  { name: 'X', icon: 'twitter-x', href: 'https://x.com/KKrevvetka' },
];
const projects = [
  { name: 'quolly.app', href: 'https://quolly.app/', mark: 'q', className: 'quolly' },
  { name: 'techscreen.app', href: 'https://techscreen.app/', mark: 't', className: 'techscreen' },
  { name: 'mrris.land', href: 'https://mrris.land/', mark: 'm', className: 'mrris' },
];

export default function App() {
  const dialog = useRef<HTMLDialogElement>(null);
  const qrTrigger = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText('krvvko');
      setCopied(true);
      setCopyFailed(false);
    } catch { setCopyFailed(true); }
  }

  function closeQr() {
    dialog.current?.close();
    qrTrigger.current?.focus();
  }

  function downloadQr() {
    const svg = dialog.current?.querySelector('svg.qr-image');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kostya-krauchanka-qr.svg';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="page">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="page-header">
        <a className="wordmark" href="https://krvvko.me" target="_blank" rel="noopener noreferrer" aria-label="krvvko — open portfolio">krvvko<span>.</span></a>
        <button ref={qrTrigger} className="qr-trigger" onClick={() => dialog.current?.showModal()} aria-label="Show QR code" aria-haspopup="dialog"><QrCode size={17} /><span>Share my card</span></button>
      </header>

      <main className="card" aria-labelledby="name">
        <section className="intro">
          <div className="portrait-wrap"><img className="portrait" src="/profile.png" alt="Kostya on a snowy mountain" width="92" height="92" /><span className="portrait-dot" aria-hidden="true" /></div>
          <div className="location"><MapPin size={12} strokeWidth={1.7} /> Westford, MA</div>
          <h1 id="name">Kostya Krauchanka<span className="name-period">.</span></h1>
          <p className="bio">Software engineer &amp; founder.<br /><span>6 years of turning ideas into products.</span></p>
          <div className="availability"><span />Available for work</div>
          <div className="actions">
            <a className="button button-primary" href="/kostya-krauchanka.vcf"><UserRoundPlus size={17} />Add to contacts</a>
            <a className="button button-secondary" href="https://krvvko.me" target="_blank" rel="noopener noreferrer">My portfolio<ArrowUpRight size={16} /></a>
          </div>
        </section>

        <section className="connect" aria-labelledby="connect-title">
          <div className="section-label" id="connect-title"><span>LET’S CONNECT</span><span className="label-line" /></div>
          <div className="socials">
            {socials.map(social => <a key={social.name} className="social" href={social.href} target="_blank" rel="noopener noreferrer"><span className="social-icon"><img src={`/icons/${social.icon}.svg`} width="21" height="21" alt="" /></span><span>{social.name}</span></a>)}
          </div>
          <div className="contact-row">
            <button className="contact-link discord" onClick={copyDiscord} aria-label="Copy Discord username krvvko"><img src="/icons/discord.svg" width="16" height="16" alt="" /><span>krvvko</span>{copied ? <Check size={13} /> : <Copy size={12} />}</button>
            <span className="contact-divider" aria-hidden="true" />
            <a className="contact-link" href="tel:+19787273287"><Phone size={14} /><span>+1 (978) 727-3287</span></a>
          </div>
          <div className="copy-status" role="status">{copied ? 'Discord username copied' : copyFailed ? 'Discord username: krvvko — select and copy' : ''}</div>
        </section>

        <section className="ventures" aria-labelledby="founder-title">
          <div className="section-label" id="founder-title"><span>THINGS I’M BUILDING</span><span className="founder-label">FOUNDER</span></div>
          <div className="projects">{projects.map(project => <a key={project.name} href={project.href} target="_blank" rel="noopener noreferrer" className="project"><span className={`project-mark ${project.className}`} aria-hidden="true">{project.mark}</span><span>{project.name}</span><ArrowUpRight size={13} /></a>)}</div>
        </section>
      </main>

      <footer className="page-footer"><span>Good things start with a conversation.</span><span className="footer-note">Let’s build something.</span></footer>

      <dialog ref={dialog} className="qr-dialog" aria-labelledby="qr-title" onClick={event => { if (event.target === dialog.current) closeQr(); }} onClose={() => qrTrigger.current?.focus()}>
        <button className="dialog-close" onClick={closeQr} aria-label="Close QR code"><X size={19} /></button>
        <span className="dialog-eyebrow">NICE TO MEET YOU</span>
        <h2 id="qr-title">Let’s stay in touch.</h2>
        <p>Scan to open my contact card.</p>
        <div className="qr-frame"><QRCodeSVG className="qr-image" value={siteUrl} size={224} level="M" marginSize={4} bgColor="#ffffff" fgColor="#242723" title="QR code for Kostya’s contact page" /></div>
        <span className="qr-url">socials.krvvko.me</span>
        <button className="button button-secondary qr-download" onClick={downloadQr}><ArrowDownToLine size={16} />Save QR code</button>
      </dialog>
    </div>
  );
}
