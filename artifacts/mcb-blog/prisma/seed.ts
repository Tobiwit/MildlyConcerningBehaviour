import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "observations" },
      update: {},
      create: { name: "Observations", slug: "observations" },
    }),
    prisma.category.upsert({
      where: { slug: "experiments" },
      update: {},
      create: { name: "Experiments", slug: "experiments" },
    }),
    prisma.category.upsert({
      where: { slug: "incidents" },
      update: {},
      create: { name: "Incidents", slug: "incidents" },
    }),
    prisma.category.upsert({
      where: { slug: "reflections" },
      update: {},
      create: { name: "Reflections", slug: "reflections" },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mcb.dev" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mcb.dev",
      password: adminPassword,
      role: "admin",
      bio: "The one who keeps things mildly concerning.",
    },
  });

  // Author users
  const author1Password = await bcrypt.hash("author123", 12);
  const author1 = await prisma.user.upsert({
    where: { email: "vera@mcb.dev" },
    update: {},
    create: {
      name: "Vera Holloway",
      email: "vera@mcb.dev",
      password: author1Password,
      role: "author",
      bio: "Documenting things that probably shouldn't be documented.",
    },
  });

  const author2Password = await bcrypt.hash("author123", 12);
  const author2 = await prisma.user.upsert({
    where: { email: "marcus@mcb.dev" },
    update: {},
    create: {
      name: "Marcus Finch",
      email: "marcus@mcb.dev",
      password: author2Password,
      role: "author",
      bio: "Retired risk assessor. Currently assessing risks recreationally.",
    },
  });

  console.log("Created users");

  // Posts
  const post1 = await prisma.post.upsert({
    where: { slug: "the-vending-machine-incident" },
    update: {},
    create: {
      title: "The Vending Machine Incident",
      slug: "the-vending-machine-incident",
      excerpt: "What started as a simple snack retrieval operation became something far more complicated.",
      content: `# The Vending Machine Incident

It began, as most things do, with a perfectly reasonable decision.

I inserted $1.75 into the machine. I pressed **B7**. The coil turned. And then — nothing.

The bag of pretzels hung there, suspended between the coil and liberation, mocking me with its stillness.

## What Any Reasonable Person Would Do

I shook the machine. Gently at first. Then with increasing conviction.

The pretzels did not move.

## The Escalation

What followed cannot be fully explained in a single post. Suffice it to say that:

1. Facilities management was called
2. A second vending machine was involved
3. The fire suppression system was not *technically* triggered, but it was consulted

## Lessons Learned

> "The universe does not owe you pretzels. But it also doesn't have to be so smug about it."

I have since switched to bringing my own snacks. The vending machine remains operational. We do not make eye contact.

---

*This incident has been logged in the official record as "User Error." I contest this classification.*`,
      published: true,
      authorId: author1.id,
      categoryId: categories[2].id, // incidents
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: "why-i-started-tracking-the-elevator" },
    update: {},
    create: {
      title: "Why I Started Tracking the Elevator",
      slug: "why-i-started-tracking-the-elevator",
      excerpt: "A data-driven investigation into whether the elevator is avoiding me specifically.",
      content: `# Why I Started Tracking the Elevator

Thirty-seven days ago, I began keeping a log.

The hypothesis: **the elevator on the 4th floor arrives 23% slower when I press the button** compared to when anyone else does.

## Methodology

I installed a small notebook in my jacket pocket. Every interaction with the elevator was recorded:

- Time of button press
- Time of arrival
- Number of other people waiting
- My emotional state (to control for observer bias)
- Whether I had eaten breakfast

\`\`\`
Day 1:  Button pressed 9:04 AM. Elevator arrived 9:07 AM. Wait: 3 min.
Day 2:  Button pressed 9:03 AM. Elevator arrived 9:09 AM. Wait: 6 min.
Day 3:  Took stairs. Elevator arrived at lobby same time I did.
\`\`\`

## Preliminary Findings

After 37 days of data collection, the results are *statistically suggestive* but not yet conclusive. The elevator does appear to take longer when I am the first to press the button. However, this may be explained by:

- Confirmation bias
- The fact that I usually arrive before my colleagues
- The elevator genuinely avoiding me

## Next Steps

I have requested the building's elevator maintenance logs. The building manager said this was "not a normal request." I told him neither was a 6-minute wait on a Tuesday.

The investigation continues.`,
      published: true,
      authorId: author1.id,
      categoryId: categories[0].id, // observations
    },
  });

  const post3 = await prisma.post.upsert({
    where: { slug: "my-risk-assessment-of-the-office-kitchen" },
    update: {},
    create: {
      title: "My Risk Assessment of the Office Kitchen",
      slug: "my-risk-assessment-of-the-office-kitchen",
      excerpt: "A professional evaluation of a space that has become genuinely alarming.",
      content: `# My Risk Assessment of the Office Kitchen

**Classification:** Moderate-High Concern  
**Date of Assessment:** Last Tuesday  
**Assessor:** Formerly Professional

---

## Executive Summary

The office kitchen presents several risk vectors that have been allowed to compound over time. What was once a benign communal space has developed what I can only describe as *a personality*.

## Risk Matrix

| Hazard | Likelihood | Severity | Mitigation |
|--------|-----------|----------|------------|
| The Tuesday Smell | Certain | Moderate | Unknown |
| Unlabeled containers | High | Variable | Don't open them |
| The coffee machine's "special mode" | Rare | Extreme | Accepted |
| Dave's lunch | Weekly | Significant | Diplomacy |

## The Microwave Situation

I will not go into detail about what was found inside the communal microwave. What I will say is that it has been documented, photographed, and submitted to the relevant parties.

The relevant parties have chosen not to act.

This is now a known risk.

## Recommendations

1. Implement a labeling policy for all refrigerator items
2. Establish a "Tuesday Protocol" for ventilation
3. Consider whether the office needs a kitchen *or* a kitchen needs the office
4. Brief all new hires on the microwave situation before their second week

## Conclusion

The kitchen remains operational. I have adjusted my risk tolerance accordingly and now eat at my desk. 

This assessment will be revisited in 90 days or when the situation changes, whichever comes first.`,
      published: true,
      authorId: author2.id,
      categoryId: categories[1].id, // experiments
    },
  });

  await prisma.post.upsert({
    where: { slug: "on-the-nature-of-monday-meetings" },
    update: {},
    create: {
      title: "On the Nature of Monday Meetings",
      slug: "on-the-nature-of-monday-meetings",
      excerpt: "A philosophical inquiry into whether certain calendar invites are a form of time theft.",
      content: `# On the Nature of Monday Meetings

*A reflection.*

---

There is a meeting that recurs every Monday at 9 AM. It has recurred for, by my count, **47 consecutive Mondays**.

In that time, we have:

- Generated 47 sets of action items
- Completed approximately 12 of them
- Discussed the completion of the other 35 across subsequent Mondays

## The Philosophical Question

At what point does a meeting *about work* become indistinguishable from the work itself?

I raised this question once. It was added to the action items. We have not returned to it.

## A Modest Proposal

What if we held the meeting to discuss *whether to hold the meeting*?

I have drafted an agenda. It is one item long:

> 1. Should we be here?

This agenda has not been approved for circulation.

## Closing Thoughts

I do not wish to suggest that the meeting is without value. I am suggesting that its value has never been formally assessed, and that this is, itself, mildly concerning.

Next Monday, I will bring a notebook. I will take notes. The notes will be thorough.

Whether anyone reads them is, at this point, outside the scope of this reflection.`,
      published: true,
      authorId: author2.id,
      categoryId: categories[3].id, // reflections
    },
  });

  // Some likes and comments
  await prisma.like.upsert({
    where: { postId_userId: { postId: post1.id, userId: admin.id } },
    update: {},
    create: { postId: post1.id, userId: admin.id },
  });

  await prisma.like.upsert({
    where: { postId_userId: { postId: post2.id, userId: author2.id } },
    update: {},
    create: { postId: post2.id, userId: author2.id },
  });

  await prisma.like.upsert({
    where: { postId_userId: { postId: post3.id, userId: author1.id } },
    update: {},
    create: { postId: post3.id, userId: author1.id },
  });

  // Comments
  const existingComment = await prisma.comment.findFirst({ where: { postId: post1.id, authorId: admin.id } });
  if (!existingComment) {
    await prisma.comment.create({
      data: {
        content: "I can confirm this is in the incident log. I am the one who put it there.",
        postId: post1.id,
        authorId: admin.id,
      },
    });
  }

  const existingComment2 = await prisma.comment.findFirst({ where: { postId: post2.id, authorId: author2.id } });
  if (!existingComment2) {
    await prisma.comment.create({
      data: {
        content: "From a professional standpoint, this is exactly the kind of data collection that gets flagged as 'not quite what we meant by workplace analytics.'",
        postId: post2.id,
        authorId: author2.id,
      },
    });
  }

  console.log("Seeding complete.");
  console.log("\nDemo accounts:");
  console.log("  Admin:   admin@mcb.dev / admin123");
  console.log("  Author:  vera@mcb.dev / author123");
  console.log("  Author:  marcus@mcb.dev / author123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
