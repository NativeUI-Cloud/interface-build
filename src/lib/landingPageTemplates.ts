
import type { ProjectData, LandingPageTemplate } from './types';
import { v4 as uuidv4 } from 'uuid';
import { FileText, MountainIcon, Star, Users, Zap, LayoutGrid, MessageSquare, ServerIcon, Rocket, ShieldCheck, Coins, Twitter, Send as SendIcon, BarChart3, ShoppingCart, Image as ImageIconLucide, Users2, GitMergeIcon, ClockIcon, ListIcon, Type as TypeIcon } from 'lucide-react';

// --- Template 1: Simple SaaS Product ---
const simpleSaaSTemplate: Omit<ProjectData, 'id' | 'lastModified'> = {
  pageTitle: 'Simple SaaS Product',
  canvasRows: [
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      elements: [
        {
          id: uuidv4(),
          name: 'Header',
          type: 'HeaderElement',
          data: {
            siteTitle: 'SaaSPro',
            navLinks: [
              { id: uuidv4(), text: 'Features', href: '#features' },
              { id: uuidv4(), text: 'Pricing', href: '#pricing' },
              { id: uuidv4(), text: 'Sign Up', href: '#signup', isButton: true },
            ],
            backgroundColor: 'bg-background',
            textColor: 'text-foreground',
            sticky: true,
          },
        },
        {
          id: uuidv4(),
          name: 'Hero Section',
          type: 'Section',
          data: {
            className: 'py-20 text-center',
            backgroundColor: 'bg-muted/30',
            elements: [ // Nested elements for the hero
              {
                id: uuidv4(), name: 'Hero Heading', type: 'Heading',
                data: { text: 'The Future of Productivity is Here', htmlTag: 'h1', textAlign: 'text-center', fontSize: 'text-5xl', },
              },
              {
                id: uuidv4(), name: 'Hero Subtext', type: 'TextBlock',
                data: { text: 'Streamline your workflow and achieve more with our intuitive SaaS platform.', htmlTag: 'p', textAlign: 'text-center', fontSize: 'text-lg', className: 'mt-4 text-muted-foreground max-w-xl mx-auto' },
              },
              {
                id: uuidv4(), name: 'Hero CTA Button', type: 'Button',
                data: { text: 'Get Started Free', variant: 'default', className: 'mt-8 px-8 py-3 text-lg' },
              },
            ],
          },
        },
        {
          id: uuidv4(),
          name: 'Features Section',
          type: 'Section',
          data: {
            className: 'py-16 grid md:grid-cols-3 gap-8', // This section itself will have a grid layout for features
            elements: [
              { id: uuidv4(), name: 'Feature 1', type: 'FeatureItem', data: { iconName: 'Zap', title: 'Lightning Fast', description: 'Experience unparalleled speed and efficiency.', alignment: 'center'} },
              { id: uuidv4(), name: 'Feature 2', type: 'FeatureItem', data: { iconName: 'Users', title: 'Collaborative', description: 'Work seamlessly with your team in real-time.', alignment: 'center'} },
              { id: uuidv4(), name: 'Feature 3', type: 'FeatureItem', data: { iconName: 'Star', title: 'Top Rated', description: 'Loved by thousands of users worldwide.', alignment: 'center'} },
            ]
          },
        },
        {
          id: uuidv4(),
          name: 'Footer',
          type: 'Footer',
          data: {
            copyrightText: `© ${new Date().getFullYear()} SaaSPro. All rights reserved.`,
            backgroundColor: 'bg-secondary',
            textColor: 'text-secondary-foreground',
            columns: [{ id: uuidv4(), title: 'Company', links: [{id: uuidv4(), text: 'About Us', href: '#'}, {id: uuidv4(), text: 'Contact', href: '#'}] }]
          }
        }
      ],
    },
  ],
  fontFamilyName: 'Inter',
  fontFamilyImportUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
  pageFillColor: '#ffffff',
  bodyBackgroundColor: 'bg-background',
};

// --- Template 2: Basic Portfolio ---
const basicPortfolioTemplate: Omit<ProjectData, 'id' | 'lastModified'> = {
  pageTitle: 'My Portfolio',
  canvasRows: [
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      elements: [
        {
          id: uuidv4(),
          name: 'Header',
          type: 'HeaderElement',
          data: {
            siteTitle: 'John Doe',
            navLinks: [
              { id: uuidv4(), text: 'Portfolio', href: '#portfolio' },
              { id: uuidv4(), text: 'About Me', href: '#about' },
              { id: uuidv4(), text: 'Contact', href: '#contact', isButton: true },
            ],
          },
        },
        {
          id: uuidv4(),
          name: 'Intro Section',
          type: 'Section',
          data: {
            className: 'py-16 text-left flex items-center',
            elements: [
              {
                id: uuidv4(), name: 'Profile Image', type: 'Image',
                data: { src: 'https://placehold.co/150x150.png', alt: 'Profile Picture', width: 150, height: 150, className: 'rounded-full mr-8', 'data-ai-hint': 'profile picture' },
              },
              {
                id: uuidv4(), name: 'Intro Group', type: 'Section', // Using Section as a generic container
                data: {
                  elements: [
                    { id: uuidv4(), name: 'Intro Heading', type: 'Heading', data: { text: 'Hi, I\'m John Doe', htmlTag: 'h1', fontSize: 'text-4xl' } },
                    { id: uuidv4(), name: 'Intro Subtext', type: 'TextBlock', data: { text: 'Creative Developer & Designer', htmlTag: 'p', fontSize: 'text-xl', className: 'text-muted-foreground' } },
                  ]
                }
              }
            ]
          },
        },
      ],
    },
  ],
  fontFamilyName: 'Poppins',
  fontFamilyImportUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap',
  pageFillColor: '#f9fafb',
};

// --- Template 3: Web3 Project Launch ---
const web3ProjectTemplate: Omit<ProjectData, 'id' | 'lastModified'> = {
  pageTitle: 'CryptoToken X',
  canvasRows: [
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      elements: [
        {
          id: uuidv4(),
          name: 'Header',
          type: 'HeaderElement',
          data: {
            siteTitle: 'CryptoToken X',
            logoUrl: 'https://placehold.co/40x40/8A2BE2/FFFFFF.png?text=CX',
            'data-ai-hint': 'crypto logo purple',
            navLinks: [
              { id: uuidv4(), text: 'Tokenomics', href: '#tokenomics' },
              { id: uuidv4(), text: 'Roadmap', href: '#roadmap' },
              { id: uuidv4(), text: 'Community', href: '#community' },
              { id: uuidv4(), text: 'Buy Now', href: '#buy', isButton: true },
            ],
            backgroundColor: 'bg-slate-900',
            textColor: 'text-slate-100',
            sticky: true,
          },
        },
        {
          id: uuidv4(),
          name: 'Hero Section',
          type: 'Section',
          data: {
            className: 'py-24 text-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 text-white',
            elements: [
              { id: uuidv4(), name: 'Hero Heading', type: 'Heading', data: { text: 'Decentralizing the Future with CryptoToken X', htmlTag: 'h1', fontSize: 'text-5xl', className: 'font-bold' } },
              { id: uuidv4(), name: 'Hero Subtext', type: 'TextBlock', data: { text: 'Join the revolution. Secure, scalable, and community-driven.', htmlTag: 'p', fontSize: 'text-xl', className: 'mt-4 max-w-2xl mx-auto opacity-90' } },
              {
                id: uuidv4(), name: 'Hero Wallet Button', type: 'ConnectWalletButton',
                data: { text: 'Connect Wallet & Get Started', buttonVariant: 'secondary', className: 'mt-10 px-10 py-4 text-lg', walletType: 'generic' },
              },
            ],
          },
        },
        {
          id: uuidv4(),
          name: 'Token Info Display',
          type: 'Section',
          data: {
            className: 'py-12',
            elements: [
              { id: uuidv4(), name: 'Token Display', type: 'TokenInfoDisplay', data: { tokenSymbol: 'CTX', price: '$0.75', marketCap: '$75,000,000' } },
            ]
          }
        },
        {
          id: uuidv4(),
          name: 'Roadmap Section',
          type: 'Section',
          data: {
            className: 'py-12 bg-muted',
            elements: [
                { id: uuidv4(), name: 'Roadmap Title', type: 'Heading', data: { text: 'Our Roadmap', htmlTag: 'h2', textAlign: 'text-center', fontSize: 'text-3xl', className: 'mb-8' } },
                { id: uuidv4(), name: 'Roadmap Timeline', type: 'RoadmapTimeline', data: {
                    phases: [
                        { id: uuidv4(), title: 'Q3 2024: Mainnet Launch', description: 'Successful launch of CryptoToken X on the mainnet.' },
                        { id: uuidv4(), title: 'Q4 2024: DEX Listings', description: 'Listing on major decentralized exchanges.' },
                        { id: uuidv4(), title: 'Q1 2025: Governance V1', description: 'Introduction of community governance portal.' },
                    ]
                }},
            ]
          }
        },
      ],
    },
  ],
  fontFamilyName: 'Space Grotesk',
  fontFamilyImportUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap',
  pageFillColor: '#0f172a',
  bodyBackgroundColor: 'bg-slate-900',
};

// --- Template 4: Solana Meme Token (Based on provided JSX) ---
const solanaMemeTokenTemplate: Omit<ProjectData, 'id' | 'lastModified'> = {
  pageTitle: 'Solana Catnip ($CATNIP)',
  fontFamilyName: 'Fredoka One',
  fontFamilyImportUrl: 'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap',
  pageFillColor: '#0D1117', // Main dark background for the page canvas itself
  bodyBackgroundColor: 'bg-gray-900', // For the outer body, consistent with JSX example
  propPageCursor: 'auto', // Explicitly set default
  canvasRows: [
    // Header Row
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      elements: [
        {
          id: uuidv4(),
          name: 'Header',
          type: 'HeaderElement',
          data: {
            siteTitle: 'Solana Catnip',
            logoUrl: 'https://placehold.co/32x32/FFA500/0D1117.png?text=SC&font=fredoka-one',
            'data-ai-hint': 'cat logo orange',
            navLinks: [
              { id: uuidv4(), text: 'About', href: '#about', className: 'text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors' },
              { id: uuidv4(), text: 'Tokenomics', href: '#tokenomics', className: 'text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors' },
              { id: uuidv4(), text: 'How to Buy', href: '#how-to-buy', className: 'text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors' },
              { id: uuidv4(), text: 'Roadmap', href: '#roadmap', className: 'text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors' },
              { id: uuidv4(), text: 'Buy on Raydium', href: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=YOUR_SOLANA_CONTRACT_ADDRESS_HERE&fixed=in`, isButton: false, className: 'text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors' },
            ],
            backgroundColor: 'bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60',
            textColor: 'text-gray-100',
            sticky: true,
            layout: 'logo-left-nav-right',
            className: "sticky top-0 z-50 w-full border-b border-gray-700/40"
          }
        }
      ]
    },
    // Hero Section Row
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      backgroundColor: 'bg-gradient-to-br from-orange-500/20 via-gray-900 to-gray-900', // Approximating gradient
      elements: [
        {
          id: uuidv4(),
          name: 'Hero Section',
          type: 'Section',
          data: {
            className: 'w-full py-12 md:py-24 lg:py-32 xl:py-48',
            elements: [
              {
                id: uuidv4(),
                name: 'Hero Container',
                type: 'Section',
                data: {
                  className: 'container px-4 md:px-6',
                  elements: [
                    {
                      id: uuidv4(),
                      name: 'Hero Grid',
                      type: 'Section',
                      data: {
                        className: 'grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]',
                        elements: [
                          {
                            id: uuidv4(),
                            name: 'Hero Text Content',
                            type: 'Section',
                            data: {
                              className: 'flex flex-col justify-center space-y-4',
                              elements: [
                                {
                                  id: uuidv4(),
                                  name: 'Hero Heading Group',
                                  type: 'Section',
                                  data: {
                                    className: 'space-y-2',
                                    elements: [
                                      { id: uuidv4(), name: 'Hero Title', type: 'Heading', data: { text: 'Solana Catnip ($CATNIP): The Purrfect Meme Coin on Solana!', htmlTag: 'h1', fontSize: 'text-6xl', className: 'text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600', textAlign: 'text-left' } },
                                      { id: uuidv4(), name: 'Hero Subtitle', type: 'TextBlock', data: { text: "Tired of rug pulls and dog coins? $CATNIP is here to bring fun, felines, and financial freedom (maybe) to the Solana blockchain. Get your paws on some $CATNIP now!", htmlTag: 'p', fontSize: 'text-xl', className: 'max-w-[600px] text-gray-300 md:text-xl', textAlign: 'text-left' } },
                                    ]
                                  }
                                },
                                {
                                  id: uuidv4(),
                                  name: 'Hero Buttons Group',
                                  type: 'Section',
                                  data: {
                                    className: 'flex flex-col gap-2 min-[400px]:flex-row',
                                    elements: [
                                      { id: uuidv4(), name: 'Raydium Button', type: 'Button', data: { text: '(Icon: ShoppingCart) Buy on Raydium', size: 'lg', className: 'bg-orange-500 hover:bg-orange-600 text-white', href: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=YOUR_SOLANA_CONTRACT_ADDRESS_HERE&fixed=in` } },
                                      { id: uuidv4(), name: 'Jupiter Button', type: 'Button', data: { text: '(Icon: ShoppingCart) Buy on Jupiter', size: 'lg', variant: 'outline', className: 'border-orange-500 text-orange-500 hover:bg-orange-500/10', href: `https://jup.ag/swap/SOL-$CATNIP_YOUR_SOLANA_CONTRACT_ADDRESS_HERE` } },
                                      { id: uuidv4(), name: 'Telegram Button', type: 'Button', data: { text: '(Icon: Send) Join Telegram', size: 'lg', variant: 'secondary', className: 'bg-gray-700 hover:bg-gray-600 text-gray-100', href: "https://t.me/yourtelegramgroup" } },
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            id: uuidv4(), name: 'Hero Image', type: 'Image',
                            data: { src: 'https://placehold.co/600x600/1A202C/FFA500.png?text=CATNIP+HERO&font=fredoka-one', alt: 'Hero Catnip', width: 600, height: 600, className: 'mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last animate-pulse', 'data-ai-hint': 'orange cat crypto' },
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    },
    // About Section Row
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      backgroundColor: 'bg-gray-800/40',
      elements: [
        {
          id: uuidv4(),
          name: 'About Section',
          type: 'Section',
          data: {
            className: 'w-full py-12 md:py-24 lg:py-32',
            elements: [
              {
                id: uuidv4(),
                name: 'About Container',
                type: 'Section',
                data: {
                  className: 'container px-4 md:px-6',
                  elements: [
                    {
                      id: uuidv4(),
                      name: 'About Content Wrapper',
                      type: 'Section',
                      data: {
                        className: 'flex flex-col items-center justify-center space-y-4 text-center',
                        elements: [
                          {
                            id: uuidv4(),
                            name: 'About Text Group',
                            type: 'Section',
                            data: {
                              className: 'space-y-2',
                              elements: [
                                { id: uuidv4(), name: 'About Badge', type: 'BadgeElement', data: { text: 'About Us', variant: 'secondary', className: 'inline-block rounded-lg bg-orange-400/20 px-3 py-1 text-sm text-orange-300' } },
                                { id: uuidv4(), name: 'About Title', type: 'Heading', data: { text: 'Why $CATNIP?', htmlTag: 'h2', fontSize: 'text-5xl', className: 'text-3xl font-bold tracking-tighter sm:text-5xl text-orange-500', textAlign: 'text-center' } },
                                { id: uuidv4(), name: 'About Description', type: 'TextBlock', data: { text: "$CATNIP isn't just another meme coin. It's a movement. A revolution. A... well, it's a really cute cat-themed token on the super-fast Solana network. We believe in the power of memes, community, and low transaction fees. Our mission is to create a fun and engaging ecosystem for cat lovers and crypto enthusiasts alike.", htmlTag: 'p', fontSize: 'text-xl', className: 'max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed', textAlign: 'text-center' } },
                              ]
                            }
                          }
                        ]
                      }
                    },
                    {
                      id: uuidv4(),
                      name: 'Feature Grid',
                      type: 'Section',
                      data: {
                        className: 'mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:mt-12',
                        elements: [
                          { id: uuidv4(), name: 'Feature Card 1', type: 'Section', data: { className: 'bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-orange-500/20 transition-shadow', elements: [ { id: uuidv4(), type: 'Heading', data: { text: '(Icon: Zap) Lightning Fast', htmlTag: 'h3', fontSize: 'text-lg', className: 'text-orange-500 mt-2 flex items-center' } }, { id: uuidv4(), type: 'TextBlock', data: { text: 'Built on Solana for near-instant transactions and ridiculously low fees. Say goodbye to gas wars!', className: 'text-sm text-gray-400' } } ] } },
                          { id: uuidv4(), name: 'Feature Card 2', type: 'Section', data: { className: 'bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-orange-500/20 transition-shadow', elements: [ { id: uuidv4(), type: 'Heading', data: { text: '(Icon: Users) Community Driven', htmlTag: 'h3', fontSize: 'text-lg', className: 'text-orange-500 mt-2 flex items-center' } }, { id: uuidv4(), type: 'TextBlock', data: { text: "Our community is the cat's pajamas! Join us for memes, events, and shaping the future of $CATNIP.", className: 'text-sm text-gray-400' } } ] } },
                          { id: uuidv4(), name: 'Feature Card 3', type: 'Section', data: { className: 'bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-orange-500/20 transition-shadow', elements: [ { id: uuidv4(), type: 'Heading', data: { text: '(Icon: ShieldCheck) Fair & Transparent', htmlTag: 'h3', fontSize: 'text-lg', className: 'text-orange-500 mt-2 flex items-center' } }, { id: uuidv4(), type: 'TextBlock', data: { text: 'No sneaky business here. Fair launch, locked liquidity (eventually!), and clear communication.', className: 'text-sm text-gray-400' } } ] } },
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    },
    // Tokenomics Section Row
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      backgroundColor: '#0D1117',
      elements: [
        {
          id: uuidv4(),
          name: 'Tokenomics Section',
          type: 'Section',
          data: {
            className: 'w-full py-12 md:py-24 lg:py-32',
            elements: [
              {
                id: uuidv4(),
                name: 'Tokenomics Container',
                type: 'Section',
                data: {
                  className: 'container grid items-center justify-center gap-4 px-4 text-center md:px-6',
                  elements: [
                    {
                      id: uuidv4(),
                      name: 'Tokenomics Text Group',
                      type: 'Section',
                      data: {
                        className: 'space-y-3',
                        elements: [
                          { id: uuidv4(), name: 'Tokenomics Badge', type: 'BadgeElement', data: { text: 'Tokenomics', variant: 'secondary', className: 'inline-block rounded-lg bg-orange-400/20 px-3 py-1 text-sm text-orange-300' } },
                          { id: uuidv4(), name: 'Tokenomics Title', type: 'Heading', data: { text: 'The $CATNIP Breakdown', htmlTag: 'h2', fontSize: 'text-4xl', className: 'text-3xl font-bold tracking-tighter md:text-4xl/tight text-orange-500', textAlign: 'text-center' } },
                          { id: uuidv4(), name: 'Tokenomics Subtitle', type: 'TextBlock', data: { text: 'Simple, straightforward, and designed for maximum meme-ability.', htmlTag: 'p', fontSize: 'text-xl', className: 'mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed', textAlign: 'text-center' } },
                        ]
                      }
                    },
                    {
                      id: uuidv4(),
                      name: 'Tokenomics Grid',
                      type: 'Section',
                      data: {
                        className: 'mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-8',
                        elements: [
                          { id: uuidv4(), name: 'Supply Card', type: 'Section', data: { className: 'bg-gray-800 p-6 rounded-lg shadow-md', elements: [ { id: uuidv4(), type: 'Heading', data: { text: 'Total Supply', htmlTag: 'h3', className: 'text-orange-500', childrenText: "(Icon: BarChart3)" } }, { id: uuidv4(), type: 'TextBlock', data: { text: '1,000,000,000 $CATNIP', className: 'text-3xl font-bold text-white' } }, { id: uuidv4(), type: 'TextBlock', data: { text: 'One billion cool cats.', className: 'text-xs text-gray-400' } } ] } },
                          { id: uuidv4(), name: 'Liquidity Card', type: 'Section', data: { className: 'bg-gray-800 p-6 rounded-lg shadow-md', elements: [ { id: uuidv4(), type: 'Heading', data: { text: 'Liquidity', htmlTag: 'h3', className: 'text-orange-500', childrenText: "(Icon: BarChart3)" } }, { id: uuidv4(), type: 'TextBlock', data: { text: '90% To Liquidity Pool', className: 'text-3xl font-bold text-white' } }, { id: uuidv4(), type: 'TextBlock', data: { text: 'Locked and burned (soon™).', className: 'text-xs text-gray-400' } } ] } },
                          { id: uuidv4(), name: 'Team Card', type: 'Section', data: { className: 'bg-gray-800 p-6 rounded-lg shadow-md', elements: [ { id: uuidv4(), type: 'Heading', data: { text: 'Team & Marketing', htmlTag: 'h3', className: 'text-orange-500', childrenText: "(Icon: BarChart3)" } }, { id: uuidv4(), type: 'TextBlock', data: { text: '10% For CEX, Marketing & Catnip', className: 'text-3xl font-bold text-white' } }, { id: uuidv4(), type: 'TextBlock', data: { text: 'To spread the meow-ssage.', className: 'text-xs text-gray-400' } } ] } },
                        ]
                      }
                    },
                    {
                      id: uuidv4(),
                      name: 'Contract Address Section',
                      type: 'Section',
                      data: {
                        className: 'mt-4 text-sm text-gray-400 text-center', // Added text-center
                        elements: [
                          { id: uuidv4(), name: 'Contract Address Label', type: 'TextBlock', data: { text: 'Contract Address: ', htmlTag: 'p', className: 'inline', textAlign: 'text-center' } },
                          { id: uuidv4(), name: 'Contract Address Value', type: 'TextBlock', data: { text: 'YOUR_SOLANA_CONTRACT_ADDRESS_HERE', htmlTag: 'p', className: 'break-all text-orange-500 hover:underline ml-1 inline', href: "https://solscan.io/token/YOUR_SOLANA_CONTRACT_ADDRESS_HERE", textAlign: 'text-center' } },
                        ],
                      },
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    },
    // How to Buy Section Row
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      backgroundColor: 'bg-gray-800/40',
      elements: [
        {
          id: uuidv4(),
          name: 'How to Buy Section',
          type: 'Section',
          data: {
            className: 'w-full py-12 md:py-24 lg:py-32',
            elements: [
              {
                id: uuidv4(),
                name: 'HowToBuy Container',
                type: 'Section',
                data: {
                  className: 'container px-4 md:px-6',
                  elements: [
                    {
                      id: uuidv4(),
                      name: 'HowToBuy Text Content',
                      type: 'Section',
                      data: {
                        className: 'flex flex-col items-center justify-center space-y-4 text-center',
                        elements: [
                          {
                            id: uuidv4(),
                            name: 'HowToBuy Text Group',
                            type: 'Section',
                            data: {
                              className: 'space-y-2',
                              elements: [
                                { id: uuidv4(), name: 'HowToBuy Badge', type: 'BadgeElement', data: { text: 'Get Yours', variant: 'secondary', className: 'inline-block rounded-lg bg-orange-400/20 px-3 py-1 text-sm text-orange-300' } },
                                { id: uuidv4(), name: 'HowToBuy Title', type: 'Heading', data: { text: 'How to Buy $CATNIP', htmlTag: 'h2', fontSize: 'text-5xl', className: 'text-3xl font-bold tracking-tighter sm:text-5xl text-orange-500', textAlign: 'text-center' } },
                                { id: uuidv4(), name: 'HowToBuy Subtitle', type: 'TextBlock', data: { text: 'Getting your paws on $CATNIP is easy. Follow these simple steps:', htmlTag: 'p', fontSize: 'text-xl', className: 'max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed', textAlign: 'text-center' } },
                              ]
                            }
                          }
                        ]
                      }
                    },
                    {
                      id: uuidv4(),
                      name: 'HowToBuy Steps Grid',
                      type: 'Section',
                      data: {
                        className: 'mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:mt-12',
                        elements: [
                          { id: uuidv4(), name: 'Step 1 Wallet', type: 'Section', data: { className: 'bg-gray-800 p-6 rounded-lg shadow-md text-center', elements: [ { id: uuidv4(), type: 'Heading', data: { text: '1. Get a Solana Wallet', htmlTag: 'h3', fontSize: 'text-lg', className: 'text-orange-500' } }, { id: uuidv4(), type: 'TextBlock', data: { text: 'Download Phantom, Solflare, or your favorite Solana wallet.', className: 'text-sm text-gray-400' } }, { id: uuidv4(), name: 'Wallet Icon Image', type: 'Image', data: { src: 'https://placehold.co/100x100/374151/FFA500.png?text=Wallet', alt: 'Wallet Icon', width: 64, height: 64, className: 'mt-4 mx-auto', 'data-ai-hint': 'wallet crypto' } } ] } },
                          { id: uuidv4(), name: 'Step 2 Fund', type: 'Section', data: { className: 'bg-gray-800 p-6 rounded-lg shadow-md text-center', elements: [ { id: uuidv4(), type: 'Heading', data: { text: '2. Fund with SOL', htmlTag: 'h3', fontSize: 'text-lg', className: 'text-orange-500' } }, { id: uuidv4(), type: 'TextBlock', data: { text: 'Buy SOL on an exchange (like Coinbase, Binance, Kraken) and send it to your wallet.', className: 'text-sm text-gray-400' } }, { id: uuidv4(), name: 'SOL Coin Image', type: 'Image', data: { src: 'https://placehold.co/100x100/374151/FFA500.png?text=SOL', alt: 'SOL Coin', width: 64, height: 64, className: 'mt-4 mx-auto', 'data-ai-hint': 'solana coin' } } ] } },
                          { id: uuidv4(), name: 'Step 3 Swap', type: 'Section', data: { className: 'bg-gray-800 p-6 rounded-lg shadow-md text-center', elements: [ { id: uuidv4(), type: 'Heading', data: { text: '3. Swap for $CATNIP', htmlTag: 'h3', fontSize: 'text-lg', className: 'text-orange-500' } }, { id: uuidv4(), type: 'TextBlock', data: { text: 'Go to Raydium or Jupiter, connect your wallet, paste our contract address, and swap SOL for $CATNIP.', className: 'text-sm text-gray-400' } }, { id: uuidv4(), name: 'Swap Button', type: 'Button', data: { text: 'Swap on Raydium', size: 'sm', className: 'mt-4 bg-orange-500 hover:bg-orange-600 text-white w-full', href: `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=YOUR_SOLANA_CONTRACT_ADDRESS_HERE&fixed=in` } } ] } },
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    },
    // Roadmap Section Row
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      backgroundColor: '#0D1117',
      elements: [
        {
          id: uuidv4(),
          name: 'Roadmap Section',
          type: 'Section',
          data: {
            className: 'w-full py-12 md:py-24 lg:py-32',
            elements: [
              {
                id: uuidv4(),
                name: 'Roadmap Container',
                type: 'Section',
                data: {
                  className: 'container px-4 md:px-6',
                  elements: [
                    {
                      id: uuidv4(),
                      name: 'Roadmap Text Content',
                      type: 'Section',
                      data: {
                        className: 'flex flex-col items-center justify-center space-y-4 text-center',
                        elements: [
                          {
                            id: uuidv4(),
                            name: 'Roadmap Text Group',
                            type: 'Section',
                            data: {
                              className: 'space-y-2',
                              elements: [
                                { id: uuidv4(), name: 'Roadmap Badge', type: 'BadgeElement', data: { text: 'Future Plans', variant: 'secondary', className: 'inline-block rounded-lg bg-orange-400/20 px-3 py-1 text-sm text-orange-300' } },
                                { id: uuidv4(), name: 'Roadmap Title', type: 'Heading', data: { text: 'Our Pawsome Roadmap', htmlTag: 'h2', fontSize: 'text-5xl', className: 'text-3xl font-bold tracking-tighter sm:text-5xl text-orange-500', textAlign: 'text-center' } },
                                { id: uuidv4(), name: 'Roadmap Subtitle', type: 'TextBlock', data: { text: "We're not just kitten around. Here's what we're planning:", htmlTag: 'p', fontSize: 'text-xl', className: 'max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed', textAlign: 'text-center' } },
                              ]
                            }
                          }
                        ]
                      }
                    },
                    {
                      id: uuidv4(),
                      name: 'Roadmap Phases Grid',
                      type: 'Section',
                      data: {
                        className: 'mx-auto grid max-w-3xl gap-8 pt-12',
                        elements: [
                          { id: uuidv4(), name: 'Roadmap Phase 1 Card', type: 'Section', data: { className: 'grid gap-1 bg-gray-800 p-4 rounded-lg shadow-md', elements: [ { id: uuidv4(), type: 'Heading', data: { text: '(Icon: Rocket) Phase 1: Launch & Listeriosis', htmlTag: 'h3', className: 'flex items-center text-orange-500 text-lg' } }, { id: uuidv4(), type: 'TextBlock', data: { text: '• Fair Launch on Raydium\n• Website & Socials Launch\n• Community Building (Telegram & Twitter Raids)\n• CoinGecko & CoinMarketCap Listings', className: 'list-disc space-y-1 text-sm text-gray-400 pl-10 whitespace-pre-line text-left' } } ] } },
                          { id: uuidv4(), name: 'Roadmap Phase 2 Card', type: 'Section', data: { className: 'grid gap-1 bg-gray-800/80 p-4 rounded-lg shadow-md', elements: [ { id: uuidv4(), type: 'Heading', data: { text: '(Icon: Rocket) Phase 2: Meme Domination', htmlTag: 'h3', className: 'flex items-center text-orange-500/80 text-lg' } }, { id: uuidv4(), type: 'TextBlock', data: { text: "• Influencer Marketing Campaign\n• First CEX Listing (Maybe a small one, we're humble cats)\n• NFT Collection Teaser\n• Community Contests & Giveaways", className: 'list-disc space-y-1 text-sm text-gray-400 pl-10 whitespace-pre-line text-left' } } ] } },
                          { id: uuidv4(), name: 'Roadmap Phase 3 Card', type: 'Section', data: { className: 'grid gap-1 bg-gray-800/60 p-4 rounded-lg shadow-md', elements: [ { id: uuidv4(), type: 'Heading', data: { text: '(Icon: Rocket) Phase 3: To The Moon (and beyond the litter box!)', htmlTag: 'h3', className: 'flex items-center text-orange-500/60 text-lg' } }, { id: uuidv4(), type: 'TextBlock', data: { text: "• Major CEX Listings\n• $CATNIP Staking & Utility\n• Merch Store (Catnip-themed, of course)\n• World Purr-domination (TBD)", className: 'list-disc space-y-1 text-sm text-gray-400 pl-10 whitespace-pre-line text-left' } } ] } },
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    },
    // Community/Socials Section Row
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      backgroundColor: 'bg-orange-500/10',
      elements: [
        {
          id: uuidv4(),
          name: 'Community Section',
          type: 'Section',
          data: {
            className: 'w-full py-12 md:py-24 lg:py-32',
            elements: [
              {
                id: uuidv4(),
                name: 'Community Container',
                type: 'Section',
                data: {
                  className: 'container grid items-center justify-center gap-4 px-4 text-center md:px-6',
                  elements: [
                    {
                      id: uuidv4(),
                      name: 'Community Text Content',
                      type: 'Section',
                      data: {
                        className: 'space-y-3',
                        elements: [
                          { id: uuidv4(), name: 'Community Title', type: 'Heading', data: { text: 'Join Our Cat Pack!', htmlTag: 'h2', fontSize: 'text-4xl', className: 'text-3xl font-bold tracking-tighter md:text-4xl/tight text-orange-500', textAlign: 'text-center' } },
                          { id: uuidv4(), name: 'Community Subtitle', type: 'TextBlock', data: { text: "Follow us, chat with us, meme with us. Let's make $CATNIP the biggest cat on the blockchain!", htmlTag: 'p', fontSize: 'text-xl', className: 'mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed', textAlign: 'text-center' } },
                        ]
                      }
                    },
                    {
                      id: uuidv4(),
                      name: 'Social Buttons Group',
                      type: 'Section',
                      data: {
                        className: 'flex justify-center space-x-4 mt-4',
                        elements: [
                          { id: uuidv4(), name: 'Twitter Button', type: 'Button', data: { text: '(Icon: Twitter) Twitter', variant: 'outline', size: 'lg', className: 'text-orange-500 border-orange-500 hover:bg-orange-500/10', href: "https://twitter.com/yourtwitterhandle" } },
                          { id: uuidv4(), name: 'Telegram Button', type: 'Button', data: { text: '(Icon: Send) Telegram', variant: 'outline', size: 'lg', className: 'text-orange-500 border-orange-500 hover:bg-orange-500/10', href: "https://t.me/yourtelegramgroup" } },
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    },
    // Footer Row
    {
      id: uuidv4(),
      layout: 'grid-cols-1',
      backgroundColor: '#0D1117',
      elements: [
        {
          id: uuidv4(),
          name: 'Footer',
          type: 'Footer',
          data: {
            copyrightText: `© ${new Date().getFullYear()} Solana Catnip ($CATNIP). All rights reserved (probably).`,
            columns: [
              {
                id: uuidv4(),
                title: '', // No title in JSX for this column
                links: [{ id: uuidv4(), text: "Disclaimer: $CATNIP is a meme coin with no intrinsic value or expectation of financial return. Invest responsibly. This is not financial advice. We just like cats.", href: "#" }],
              },
            ],
            backgroundColor: 'bg-gray-900',
            textColor: 'text-gray-400',
            className: "py-6 md:py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700/40",
            socialLinks: [],
          },
        },
      ]
    }
  ]
};

export const landingPageTemplates: LandingPageTemplate[] = [
  {
    id: 'saas-simple',
    name: 'Simple SaaS',
    description: 'A clean and minimal template for a SaaS product landing page. Features a hero, features, and footer.',
    icon: ServerIcon,
    previewImageUrl: 'https://placehold.co/400x300/E2E8F0/4A5568.png?text=SaaS+Preview',
    'data-ai-hint': "saas dashboard",
    projectData: simpleSaaSTemplate,
  },
  {
    id: 'portfolio-basic',
    name: 'Basic Portfolio',
    description: 'A straightforward template to showcase your work and introduce yourself.',
    icon: FileText,
    previewImageUrl: 'https://placehold.co/400x300/F3F4F6/4B5563.png?text=Portfolio+Preview',
    'data-ai-hint': "portfolio design",
    projectData: basicPortfolioTemplate,
  },
  {
    id: 'web3-project',
    name: 'Web3 Project Launch',
    description: 'A template for launching a new Web3 token or project, including wallet connect and roadmap sections.',
    icon: Zap,
    previewImageUrl: 'https://placehold.co/400x300/6D28D9/E0E7FF.png?text=Web3+Preview',
    'data-ai-hint': "crypto dashboard",
    projectData: web3ProjectTemplate,
  },
  {
    id: 'solana-meme-token',
    name: 'Solana Meme Token',
    description: 'A fun and engaging template for a Solana-based meme token, with a dark theme and orange accents, closely matching the provided JSX.',
    icon: Rocket,
    previewImageUrl: 'https://placehold.co/400x300/0D1117/FFA500.png?text=CATNIP',
    'data-ai-hint': 'cat crypto meme',
    projectData: solanaMemeTokenTemplate,
  }
];
