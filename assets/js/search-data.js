// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Publications by categories in reversed chronological order",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "While not numerous in nature, this site hosts my public GitHub repositories. I am trying to put more personal projects on my GitHub as time goes.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "This is my slightly longer CV that explains my positions in a bit more detail. My professional CV is available for download in the top-right corner.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "dropdown-bookshelf",
              title: "bookshelf",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/books/";
              },
            },{id: "dropdown-blog",
              title: "blog",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/blog/";
              },
            },{id: "post-interest-on-reserve-balances-iorb-what-do-they-do-and-what-that-means-for-us",
        
          title: "Interest on Reserve Balances (IORB) - what do they do and what that...",
        
        description: "What is the interest on reserve balances, how does it affect the economy as a whole and what would a potential removing of it mean.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/IORB/";
          
        },
      },{id: "post-vanna-tailwind-and-the-gamma-volatility-feedback-loop",
        
          title: "Vanna Tailwind and the Gamma-Volatility Feedback Loop",
        
        description: "How falling implied volatility creates structural equity buying demand through option market dynamics",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/vanna-tailwinds/";
          
        },
      },{id: "post-may-2025-non-farm-payrolls-stronger-hiring-boosts-cash-flow-expectations-despite-lower-rate-cut-odds",
        
          title: "May 2025 Non‐Farm Payrolls - Stronger Hiring Boosts Cash Flow Expectations Despite Lower...",
        
        description: "U.S. hiring added 139,000 jobs in May—beating forecasts—keeping rate‐cut odds lower, yet stocks are climbing as cash‐flow forecasts get a lift that outweighs a slightly higher discount rate.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/non-farm-may2025/";
          
        },
      },{id: "post-labor-market-seems-strong-but-with-some-caveats",
        
          title: "Labor market seems strong - but with some caveats",
        
        description: "The labor market appears surprisingly resilient with 137k jobs added - beating expectations. But not all is as good as it seems",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/labor-market-june2025/";
          
        },
      },{id: "post-ada-employment-report-points-to-strongly-weakening-labour-market",
        
          title: "ADA Employment Report points to strongly weakening Labour market",
        
        description: "Slowest job growth in over two years in May 2025 contrasting other indications of a robust job market. Are we going to see a rate cut any time soon?",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/labour-market-weakning/";
          
        },
      },{id: "post-revisiting-bryan-kelly-39-s-garch-model",
        
          title: "Revisiting Bryan Kelly&#39;s GARCH Model",
        
        description: "In this post I revisit some of volatility modeling with GARCH to not forget the theory and coding associated with it. In particular I will be looking at a GARCH model and in the future revisit the DCC GARCH model.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/revisiting-ML/";
          
        },
      },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "books-when-genius-failed",
          title: 'When Genius Failed',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/when_geniuses_failed/";
            },},{id: "news-i-graduated",
          title: 'I graduated!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-looking-for-a-job-is-actually-not-fun-at-all",
          title: 'Looking for a job is actually not fun at all',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_1/";
            },},{id: "projects-fed-funds-rate-cut-probability-estimation",
          title: 'Fed Funds Rate Cut Probability Estimation',
          description: "Code implementation to estimate the probabilities of Fed rate cuts at upcoming FOMC meetings using EFFR futures data in Python, replicating the CME FedWatch Tool and comparing results to official CME data.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/fedwatch/";
            },},{id: "projects-imc-prosperity-algo-trading-competition-journey",
          title: 'IMC Prosperity Algo-Trading Competition Journey',
          description: "A round-by-round breakdown of our team’s participation in the IMC Prosperity algorithmic trading competition, including the evolving marketplace rules, algorithmic strategy adaptations, and performance trajectory.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/imc-trading/";
            },},{id: "projects-merger-arbitrage-amp-valuation",
          title: 'Merger arbitrage &amp;amp; Valuation',
          description: "Insights, tools, and findings from my research assistantship with Prof. Theis Jensen (Yale School of Management),  focused on valuation techniques in M&amp;A—ranging from peer group construction to large-scale data extraction from SEC filings.  The project combines empirical finance, machine learning, and scalable Python infrastructure to improve how firms are valued in practice.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/research-assistant/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%66%72%65%64%65%72%69%6B%63%69%75%70%65%6B@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/frederik-ciupek", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
