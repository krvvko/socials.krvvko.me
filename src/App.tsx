import { useRef } from 'react';
import { ArrowUpRight, MapPin, Phone, QrCode, UserRoundPlus, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { downloadContact } from './contact';

const siteUrl = 'https://socials.krvvko.me';
const socials = [
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/kostya-krauchanka-458288441/' },
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/krvvko/' },
  { name: 'GitHub', icon: 'github', href: 'https://github.com/krvvko' },
  { name: 'X', icon: 'twitter-x', href: 'https://x.com/KKrevvetka' },
  { name: 'Discord', icon: 'discord', href: 'https://discord.com/users/552151232358252563' },
];
const projects = [
  { name: 'quolly.app', href: 'https://quolly.app/', icon: '/projects/quolly.ico' },
  { name: 'techscreen.app', href: 'https://techscreen.app/', icon: '/projects/techscreen.ico' },
  { name: 'mrris.land', href: 'https://mrris.land/', icon: '/projects/mrris.svg' },
];

export default function App() {
  const dialog = useRef<HTMLDialogElement>(null);
  const qrTrigger = useRef<HTMLButtonElement>(null);

  function closeQr() {
    dialog.current?.close();
    qrTrigger.current?.focus();
  }

  return (
    <div className="page">
      <header className="page-header">
        <a className="wordmark" href="https://krvvko.me" target="_blank" rel="noopener noreferrer" aria-label="krvvko — open portfolio">krvvko<span>.</span></a>
        <button ref={qrTrigger} className="qr-trigger" onClick={() => dialog.current?.showModal()} aria-label="Show QR code" aria-haspopup="dialog"><QrCode size={18} /><span>QR code</span></button>
      </header>

      <main className="profile" aria-labelledby="name">
        <section className="intro">
          <div className="profile-top">
            <img className="portrait" src="/profile.png" alt="Kostya on a snowy mountain" width="80" height="80" />
            <div className="profile-meta"><div className="availability"><span />Available for work</div><div className="location"><MapPin size={13} strokeWidth={1.7} />Westford, MA</div></div>
          </div>
          <h1 id="name">Kostya{' '}<span>Krauchanka<span className="name-period">.</span></span></h1>
          <p className="bio">Software engineer <span className="bio-divider">/</span> 6 years of experience</p>
          <div className="actions">
            <a className="button button-primary" href="/kostya-krauchanka.vcf" onClick={event => { event.preventDefault(); downloadContact(); }}><UserRoundPlus size={17} />Add to contacts</a>
            <a className="button button-secondary" href="https://krvvko.me" target="_blank" rel="noopener noreferrer">My portfolio<ArrowUpRight size={16} /></a>
          </div>
        </section>

        <section className="connect" aria-labelledby="connect-title">
          <div className="section-label" id="connect-title">FIND ME ONLINE</div>
          <div className="socials">
            {socials.map(social => <a key={social.name} className="social" href={social.href} target="_blank" rel="noopener noreferrer"><span className="social-icon"><img src={`/icons/${social.icon}.svg`} width="22" height="22" alt="" /></span><span>{social.name}</span><ArrowUpRight className="social-arrow" size={16} /></a>)}
          </div>
          <div className="contact-row">
            <a className="contact-link" href="tel:+19787273287"><Phone size={14} /><span>+1 (978) 727-3287</span></a>
          </div>
        </section>

        <section className="ventures" aria-labelledby="founder-title">
          <div className="section-label" id="founder-title">FOUNDER OF</div>
          <div className="projects">{projects.map(project => <a key={project.name} href={project.href} target="_blank" rel="noopener noreferrer" className="project"><img src={project.icon} width="19" height="19" alt="" /><span>{project.name}</span><ArrowUpRight size={14} /></a>)}</div>
        </section>
      </main>

      <footer className="page-footer"><span>Kostya Krauchanka</span><a href="https://krvvko.me" target="_blank" rel="noopener noreferrer">krvvko.me<ArrowUpRight size={12} /></a></footer>

      <dialog ref={dialog} className="qr-dialog" aria-labelledby="qr-title" onClick={event => { if (event.target === dialog.current) closeQr(); }} onClose={() => qrTrigger.current?.focus()}>
        <button className="dialog-close" onClick={closeQr} aria-label="Close QR code"><X size={19} /></button>
        <h2 id="qr-title">Let’s stay in touch.</h2>
        <div className="qr-frame"><QRCodeSVG className="qr-image" value={siteUrl} size={224} level="M" marginSize={4} bgColor="#f2f1ed" fgColor="#242723" title="QR code for Kostya’s contact page" /></div>
      </dialog>
    </div>
  );
}
