import type { Company } from "@/lib/types"

// Work history, most recent first, from the LinkedIn profile export (October 2026). Highlights for
// Nvest, EXE Group, Rebrand Digital and Safex Technocom are drafts written from the titles alone.
// The Experience section stays hidden while this is empty.
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
          "Build and maintain web applications with React and TypeScript.",
          "Work across the front end and its GraphQL APIs.",
          "Care about UI and UX detail in everything that ships.",
        ],
        skills: ["React", "TypeScript", "GraphQL"],
      },
    ],
  },
  {
    name: "EXE Group",
    location: "Odisha, India",
    roles: [
      {
        title: "Founder & CEO",
        kind: "founder",
        start: "2017-03",
        end: "2019-07",
        highlights: ["Founded and ran the company.", "Led its strategy, product direction and team."],
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
        highlights: ["Part of the core team running the agency's digital work."],
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
          "Owned the UI/UX of the company's web pages.",
          "Worked on social media marketing and web development for this digital media company.",
        ],
      },
    ],
  },
  {
    name: "Comfort Trims",
    location: "Gurugram, India",
    roles: [
      {
        title: "Designer",
        kind: "design",
        start: "2015-08",
        end: "2016-11",
        highlights: [
          "Design lead at Comfort Trims, a subsidiary of Krishna Maruti (KML).",
          "Designed new products for Maruti Suzuki car interiors in the seat cover division.",
        ],
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
          "One of the founding members.",
          "Headed the user interface and user experience team.",
          "Front-end design and coding, project planning, and social media.",
        ],
      },
    ],
  },
  {
    name: "Typensearch",
    location: "Bhubaneswar, India",
    roles: [
      {
        title: "Co-Founder & Research Analyst",
        kind: "founder",
        start: "2012-08",
        end: "2014-09",
        highlights: [
          "One of the founding members of typensearch, a subsidiary of Odisha24x7.",
          "Requirement analysis, project concept design, and front-end design and coding.",
        ],
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
        highlights: ["Built websites and applications in my first role after graduating."],
      },
    ],
  },
]
