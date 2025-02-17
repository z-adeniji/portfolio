export const bio: string = `👋 Hi there, I'm Zainab,
a freelance Full Stack Developer & First Year Computer Science Student.
I'm well versed in frameworks like Sveltekit, Nextjs + I can 3d model whatever my macbook can handle.

Outside of coding, I'm deeply into design, illustration, and animation—anything that lets me flex my creative muscles.
I believe the intersection of technology and creativity is where the most exciting innovations happen, and I'm always eager to explore that space.`;

export const packageManagerDesc: string = `Zainab's Portfolio Command Line Interface (1.0.0)

Usage: zainab <command> [...flags] [...args]

Commands:
  run       dev --open       Start the development server and open portfolio in browser

Examples:
  zainab run dev --open      Open Zainab's portfolio in default browser

Flags:
  --open                     Automatically open browser

Learn more about Zainab:     https://your-portfolio-url.com
  Contact:                   zainabnadeniji@gmail.com
  LinkedIn:                  https://www.linkedin.com/in/z-adeniji/
  GitHub:                    https://github.com/z-adeniji
`

interface projects {
    name: string,
    desc: string,
    img: string,
    url: string
}
export const idk: projects[] = []