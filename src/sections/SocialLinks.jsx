import gmailLogo from '../assets/logos/Gmail_icon_(2026).svg.webp'
import githubLogo from '../assets/logos/github_logo_icon_229278.webp'
import instagramLogo from '../assets/logos/Instagram_logo_2022.svg.webp'

const socialLinks = [
  {
    name: 'Gmail',
    icon: gmailLogo,
    href: 'mailto:ckncmm@gmail.com',
  },
  {
    name: 'GitHub',
    icon: githubLogo,
    href: 'https://github.com/Ckncm',
  },
  {
    name: 'Instagram',
    icon: instagramLogo,
    href: 'https://instagram.com/erickcua_19',
  },
]

function SocialLinks() {
  return (
    <section className="relative z-10 w-full bg-[#050505] pb-16 pt-8">
      <div className="mx-auto flex max-w-[500px] items-center justify-center gap-10 px-6">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={link.name}
            className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-110"
          >
            <img
              src={link.icon}
              alt={link.name}
              className="h-10 w-10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
            />
            <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase transition-colors duration-300 group-hover:text-zinc-200">
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default SocialLinks
