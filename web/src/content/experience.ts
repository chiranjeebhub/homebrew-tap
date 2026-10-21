import type { Company } from "@/lib/types"

// Work history, most recent first, from the LinkedIn profile export (October 2026). The export has
// no descriptions for Nvest, Rebrand Digital or Safex Technocom, so their highlights are written from
// the titles and the profile summary and should be checked. The Experience section stays hidden
// while this is empty.
export const EXPERIENCE: Company[] = [
  {
    name: "Nvest",
    location: "Bengaluru, India",
    roles: [
      {
        title: "Senior Software Developer",
        kind: "engineering",
        start: "2019-07",
        highlights: [
          "Build and maintain the company's web applications in React and TypeScript.",
          "Develop features end to end, from UI components to the GraphQL APIs that feed them.",
          "Bring a UI/UX eye to the product, refining layouts, interactions and the small details.",
          "Work in a shared, version-controlled codebase with the rest of the engineering team.",
        ],
        skills: ["React", "TypeScript", "GraphQL", "Version control", "UI/UX"],
      },
    ],
  },
  {
    name: "Rebrand Digital",
    roles: [
      {
        title: "Core Team Member",
        kind: "lead",
        start: "2017-02",
        end: "2019-06",
        highlights: [
          "Part of the core team behind Rebrand Digital's work for over two years.",
          "Contributed design and web development to the team's digital projects.",
        ],
      },
    ],
  },
  {
    name: "FNY Digital",
    location: "Delhi, India",
    roles: [
      {
        title: "UI/UX Designer, Web Developer",
        kind: "design",
        start: "2016-11",
        end: "2017-12",
        highlights: [
          "Responsible for the UI/UX of the company's web pages.",
          "Took designs through to working pages as the team's web developer.",
          "Handled social media marketing for this digital media company alongside the web work.",
        ],
        skills: ["UI/UX", "Web development", "Social media marketing"],
      },
    ],
  },
  {
    name: "Odisha24x7",
    location: "Bhubaneswar, India",
    roles: [
      {
        title: "Research Analyst",
        kind: "design",
        start: "2012-10",
        end: "2014-09",
        highlights: [
          "One of the founding members of Odisha24x7.",
          "Headed the user interface and user experience team, responsible for making the product easier to use.",
          "Designed and coded the front end.",
          "Ran the social media accounts and marketing.",
          "Planned the team's projects.",
        ],
        skills: ["UI/UX", "Front-end", "Social media", "Project planning"],
      },
    ],
  },
  {
    name: "Safex Technocom",
    location: "Bhubaneswar, India",
    roles: [
      {
        title: "Web Developer, Application Developer",
        kind: "engineering",
        start: "2012-01",
        end: "2012-11",
        highlights: [
          "First role after a B.Tech in Computer Science from Biju Patnaik University of Technology (2011).",
          "Built and maintained websites and applications as a web and application developer.",
        ],
        skills: ["Web development", "Application development"],
      },
    ],
  },
]
