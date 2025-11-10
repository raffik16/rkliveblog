interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Nu Context',
    description: `Nu Context is a dynamic creative production company known for innovative solutions and radical collaboration since 2006. Specializing in turning challenging concepts into reality, their diverse roster of directors and proactive production team excel at elevating campaigns. Explore their portfolio featuring high-profile work for The Oscars, Volvo, The Kardashians, and Dancing with the Stars, showcasing their versatility in producing groundbreaking content.`,
    imgSrc: '/static/images/work/nucontext.jpg',
    href: 'https://nucontext.com',
  },
  {
    title: 'Tapfolio',
    description: `Tapfolio revolutionizes the bio link concept by enhancing visual appeal and functionality. The website, a testament to this commitment, features a clean, user-friendly design highlighting the service's features. Users can create custom URLs with visually appealing links, showcasing important pages, products, and socials with added images and visuals.`,
    imgSrc: '/static/images/work/tapfolio.jpg',
    href: 'https://tapfol.io',
  },
  {
    title: 'Ember',
    description: `Discover Ember's innovative temperature control solutions with ease using our custom-designed mega menu. Optimized for both desktop and mobile devices, this intuitive navigation system provides a seamless user experience. Effortlessly browse our product lines, from the iconic Ember Mug to the advanced Baby Bottle System. Reflecting Ember's dedication to precision engineering and elegant design, our mega menu helps you quickly find the perfect temperature technology for your life.`,
    imgSrc: '/static/images/work/ember3.png',
    href: 'https://ember.com',
  },
  {
    title: 'Picture North',
    description: `Picture North is an International Boutique Production and Post Production Company transcending borders to tell unique, beautiful stories. The website mirrors the company's global reach and artistic commitment, showcasing projects highlighting both production and post-production expertise. Showcased works, including campaigns for Jack Daniel's and American Express, demonstrate diverse narrative and style handling. The site's clean, intuitive design ensures easy navigation, making every story stand out, reflecting Picture North's dedication to project detail.`,
    imgSrc: '/static/images/work/picturenorth.jpg',
    href: 'https://picturenorth.com',
  },
  {
    title: 'Resolve Media Group',
    description: `Resolve Media Group, a beacon of creativity and innovation in Atlanta, is dedicated to serving creatives with unmatched expertise. Built by directors, the company has evolved from music video production to a diverse portfolio including television, movies, and commercial work. The website, a testament to the company's commitment to excellence and growth, showcases a rich collection of works and offers a seamless, visually engaging browsing experience.`,
    imgSrc: '/static/images/work/resolve.jpg',
    href: 'https://resolvemediagroup.com',
  },
  {
    title: 'SixTwentySix',
    description: `At the crossroads of music, culture, and the digital generation, SixTwentySix is committed to producing resonant content. The website vividly encapsulates this mission, presenting a portfolio echoing with impactful narratives and innovative storytelling. Showcased projects like campaigns for Turo, Wendy's, and Squarespace highlight diverse capabilities in creating content that fosters growth and connection.`,
    imgSrc: '/static/images/work/sixtwosix.jpg',
    href: 'https://sixtwentysix.co',
  },
  {
    title: 'Torment Magazine',
    description: `Torment Magazine, a genuine connection between snowboarding and its enthusiasts, celebrates the sport's passion. The website, reflecting this commitment, showcases the latest in snowboarding cinema and culture. Features like the first look at Brown Cinema's Knights of the Brown Table keep the audience engaged and informed. The website's design complements snowboarding's thrilling spirit, immersing visitors in the experience.`,
    imgSrc: '/static/images/work/torment.jpg',
    href: 'https://tormentmag.com',
  },
  {
    title: 'Ampersand INC',
    description: `Ampersand symbolizes collaboration and addition's collective power. The website, showcasing projects like 'The Regretaverse' and 'Google – Magic Eraser,' offers a diverse project glimpse. It keeps the audience updated with the latest news, team additions, and awards, ensuring a seamless, engaging user experience with its clean and modern design.`,
    imgSrc: '/static/images/work/ampersand.jpg',
    href: 'https://ampersandinc.com',
  },
  {
    title: "What's Up SCV",
    description: `What's Up SCV is the ultimate platform for all things Santa Clarita Valley. The comprehensive hub offers breaking news, local city updates, exciting events, and exclusive deals, keeping the community connected and informed. The website also enables local businesses to offer exclusive discounts to followers, fostering a supportive local community.`,
    imgSrc: '/static/images/work/whatup.jpg',
    href: 'https://www.whatsupscv.com',
  },
  {
    title: 'MoreMedia',
    description: `More Media, a global multimedia production and content creation powerhouse, showcases diverse and innovative content, commercials, and music videos for a global client array. The sleek, modern website design ensures easy navigation, allowing the impressive portfolio to shine, demonstrating More Media's commitment to excellence and innovation.`,
    imgSrc: '/static/images/work/moremedia.png',
    href: 'https://moremedia.tv',
  },
  {
    title: 'Revolution Pictures',
    description: `Revolution Pictures, with over 24 years of experience, connects brands and artists with audiences through compelling visual content. The website showcases award-winning projects, highlighting expertise in creating impactful narratives. Featuring a diverse portfolio with brands like Taylor Swift and The Home Depot, the website's clean design allows easy exploration of various projects.`,
    imgSrc: '/static/images/work/rev.png',
    href: 'https://revolutionpictures.com',
  },
  {
    title: 'Burch Creative Capital',
    description: `Burch Creative Capital, an innovative investment beacon, uniquely centers on creativity. The website outlines the firm's investment philosophy and diverse investment portfolio, including empowering women with high-end aesthetics at accessible price points with Staud. It also showcases the firm's commitment to sustainability and a return to a life well-lived with Nihi Sumba.`,
    imgSrc: '/static/images/work/burch.png',
    href: 'https://www.burchcreativecapital.com',
  },
  {
    title: 'Hous',
    description: `HOUS, a premier platform for buying and selling modern homes in Los Angeles, offers a curated property selection with exceptional architecture. The website, providing a seamless potential buyer experience, showcases featured homes and offers insights into the competitive Los Angeles real estate market, emphasizing the importance of experienced real estate agents.`,
    imgSrc: '/static/images/work/hous.png',
    href: 'https://www.hous.com',
  },
  {
    title: 'Ali Sarrow',
    description: `Ali Sarrow delivers professional and creative hair services, ensuring clients achieve their desired look with precision and care. The website mirrors Ali Sarrow's commitment to excellence, offering detailed service information and an effortless booking process. Clients can learn more about Ali and contact her for personalized consultations. The website's minimalist design ensures easy navigation, allowing the service quality to shine and offering clients a seamless online exploration of Ali Sarrow's hair services.`,
    imgSrc: '/static/images/work/ali.png',
    href: 'https://www.alisarrow.com',
  },
  {
    title: 'Exile Edit',
    description: `Exile Edit, an acclaimed editorial company, is renowned for its award-winning editing contributions. Founded by notable figures like CL Kumpata and Kirk Baxter, the company stands as a creativity and excellence beacon. With offices in New York and Los Angeles, Exile Edit offers top-level editorial talent and comprehensive services including flame, after effects, and visual effects in-house on both coasts. The website, showcasing a portfolio of edited music videos for brands like Reebok and Nike, highlights the company's diverse expertise and quality commitment. The sleek, modern website design ensures a seamless, engaging user experience, allowing easy exploration of Exile Edit's extensive portfolio.`,
    imgSrc: '/static/images/work/exile.jpg',
    href: 'https://exileedit.com',
  },
]

export default projectsData
