export const presets: Preset[] = [
    {title: "Crowdsource Token", details: ["1% Options allocation to Team", "99% Options allocation to AllStars",
    "DAO governed by holders"], price: 2, link: "Crowdsource Token.md",
    voteDuration: 129600, council: false, minToVote: 1, quorum: 2, allocation: [1,99,0,0]},

    {title: "Investment DAO", details: ["2% allocation to Team", "98% allocation to DAO treasury",
    "DAO governed by investors"], price: 2, link: "Investment DAO Preset.md",
    voteDuration: 172800, council: false, minToVote: 1, quorum: 1, allocation: [2,0,98,0]},

    {title: "Early Stage DAO", details: ["100% allocation to Team", "Team decides the DAO's direction",
    "Team issues further tokens"], price: 2, link: "Early Stage DAO Preset - Documentation.md",
    voteDuration: 129600, council: false, minToVote: 1, quorum: 1, allocation: [100,0,0,0]},

    {title: "Memecoin", details: ["89% allocation to the Allstar list", "10% allocation to liquidity pool",
    "1% allocation to Team"], price: 2, link: "Memecoin Preset.md",
    voteDuration: 129600, council: false, minToVote: 1, quorum: 12, allocation: [1,99,0,0]},

    {title: "Common Interest DAO", details: ["Fixed supply of 100 tokens", "1 token to each address",
    "DAO governed by the holders"], price: 2, link: "Common Interest DAO Preset.md",
    voteDuration: 129600, council: false, minToVote: 1, quorum: 1, allocation: [0,100,0,0]},

    {title: "Protocol DAO", details: ["60% allocation to the team", "40% allocation to DAO", 
    "Team issues further tokens"], price: 2, link: "Protocol DAO.md",
    voteDuration: 259200, council: true, minToVote: 1, quorum: 30, allocation: [60,0,40,0]},
    
    {title: "Generic", details: [], price: 2, link: '',
    voteDuration: 216000, council: true, minToVote: 1, quorum: 10, allocation: [5,15,80,0]},
]