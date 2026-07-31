/** Abstra Space project narration slides — same copy as dot-science-ai platforms.abstra-space. */

export const PROJECT_SLIDE_ACCENT = '#FF6868'

export type ProjectSlideKind =
  | 'overview'
  | 'experience'
  | 'transformation'
  | 'capabilities'

export type ProjectSlideImageKind =
  | 'identity'
  | 'experience'
  | 'transformation'
  | 'capabilities'

export type ProjectSlideMeta = {
  id: ProjectSlideKind
  kind: ProjectSlideKind
  eyebrow: string
  title: string
  body: string
}

export type ProjectEnvironment = {
  name: string
  summary: string
}

export type ProjectSlidesData = {
  name: string
  concept: string
  vision: string
  accent: string
  images: Record<ProjectSlideImageKind, string>
  firstSlide: {
    humanProblem: string
    newPerspective: string
  }
  secondSlide: {
    title: string
    story: string
    feeling: string
  }
  thirdSlide: {
    title: string
    before: string
    through: string
    after: string
  }
  fourthSlide: {
    title: string
    environments: ProjectEnvironment[]
    workspaceConnection: string
  }
}

export const projectSlides: ProjectSlidesData = {
  name: 'Abstra Space',
  concept: "Science's Laboratory",
  vision: 'Explore the concept as a thing.',
  accent: PROJECT_SLIDE_ACCENT,
  images: {
    identity: '/slides/1-abstraspace-identity.png',
    experience: '/slides/2-abstraspace-experience.png',
    transformation: '/slides/3-abstraspace-transformation.png',
    capabilities: '/slides/4-abstraspace-capabilities.png',
  },
  firstSlide: {
    humanProblem:
      'Scientific ideas stay trapped as flat description. Readers look at representations but cannot follow a path, change perspective, or test relations; virtual spectacle often replaces epistemic honesty.',
    newPerspective:
      'Materialize inquiry as space. Concepts become navigable environments where interaction serves understanding: laboratories of presence, not decorative worlds.',
  },
  secondSlide: {
    title: 'Enter the concept as a place',
    story:
      'You step into a model instead of only reading about it. You follow a path, change perspective, test a relation, and save an observation with its assumptions intact. Interaction serves understanding: the world remains honest about what is simulated, what is measured, and what is known.',
    feeling:
      'Exploration feels like inquiry, not spectacle. Space carries knowledge rather than decorating it.',
  },
  thirdSlide: {
    title: 'Knowledge becomes explorable experience',
    before:
      'Concepts remain flat description. Readers look at representations but cannot enter, test, or remember them with honesty about what is known.',
    through:
      'Abstra Space materializes inquiry as a navigable place where perspective, relation, and observation serve understanding.',
    after:
      'Experience continues as epistemic memory. Observations, assumptions, and paths remain available beyond the visit.',
  },
  fourthSlide: {
    title: 'From discovery to derivation',
    environments: [
      {
        name: 'Agora',
        summary:
          'Discover public spaces, exhibitions, simulations, and laboratories.',
      },
      {
        name: 'Studio',
        summary:
          'Create and edit spatial environments whose models express conceptual relationships.',
      },
      {
        name: 'Reviewer',
        summary:
          'Comment on models, interactions, spatial relations, and visitor experience.',
      },
      {
        name: 'Viewer',
        summary:
          'Explore the space and ask the contextual agent about the concepts.',
      },
      {
        name: 'Deriver',
        summary:
          'Derive a VR experience, guided walkthrough, interactive tour, or presentation pathway.',
      },
    ],
    workspaceConnection:
      'Models and observations link back to Workspace concepts, preserving what was simulated and what was known.',
  },
}

export function projectSlidesMeta(data: ProjectSlidesData = projectSlides): ProjectSlideMeta[] {
  return [
    {
      id: 'overview',
      kind: 'overview',
      eyebrow: 'Project Identity',
      title: data.vision,
      body: data.concept,
    },
    {
      id: 'experience',
      kind: 'experience',
      eyebrow: 'The Experience',
      title: data.secondSlide.title,
      body: data.secondSlide.story,
    },
    {
      id: 'transformation',
      kind: 'transformation',
      eyebrow: 'The Core Transformation',
      title: data.thirdSlide.title,
      body: data.thirdSlide.through,
    },
    {
      id: 'capabilities',
      kind: 'capabilities',
      eyebrow: 'What the User Can Do',
      title: data.fourthSlide.title,
      body: data.fourthSlide.workspaceConnection,
    },
  ]
}
