import { useState, useEffect } from 'react';

const ScrollingCompanies = () => {
  const [isHovered, setIsHovered] = useState(false);

  const companies = [
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
    },
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
    },
    // {
    //   name: "Adobe",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo.svg"
    // },
    {
      name: "Tesla",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg"
    },
    // {
    //   name: "Netflix",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/7/77/Netflix_2015_logo.svg"
    // },
    {
      name: "Spotify",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
    },
    {
      name: "OpenAI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
    },
    {
      name: "Stripe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
    }
  ];

  // Duplicate companies for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-muted/10 via-muted/20 to-muted/10 relative overflow-hidden">
      {/* Background depth elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/15 rounded-full blur-2xl opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-secondary/15 rounded-full blur-2xl opacity-40 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10">
        <h2 className="text-xl font-bold text-foreground uppercase tracking-wider drop-shadow-lg">
          Trusted by <span className="text-primary">Top Companies</span> Worldwide
        </h2>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-16 overflow-hidden">
            <div 
              className={`flex items-center gap-16 whitespace-nowrap ${
                isHovered ? 'animate-pause' : 'animate-scroll'
              }`}
              style={{
                animationDuration: '25s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite'
              }}
            >
              {duplicatedCompanies.map((company, index) => (
                <div 
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 transition-all duration-300 opacity-70 hover:opacity-100 group"
                >
                  <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                    <img 
                      src={company.logo} 
                      alt={`${company.name} logo`}
                      className="h-12 w-auto mx-auto object-contain drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300 filter brightness-110 contrast-110 saturate-110 group-hover:brightness-125 group-hover:contrast-125 group-hover:saturate-125 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Enhanced gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background via-background/50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background via-background/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ScrollingCompanies;
