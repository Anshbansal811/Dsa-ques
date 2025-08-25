import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create topics
  const topics = [
    {
      title: "Arrays",
      description: "Fundamental array operations and problems",
      order: 1,
    },
    {
      title: "Strings",
      description: "String manipulation and algorithms",
      order: 2,
    },
    {
      title: "Linked Lists",
      description: "Singly and doubly linked list problems",
      order: 3,
    },
    {
      title: "Stacks & Queues",
      description: "Stack and queue data structure problems",
      order: 4,
    },
    {
      title: "Trees",
      description: "Binary trees, BST, and tree traversal",
      order: 5,
    },
    {
      title: "Graphs",
      description: "Graph algorithms and traversal",
      order: 6,
    },
    {
      title: "Dynamic Programming",
      description: "DP problems and optimization",
      order: 7,
    },
    {
      title: "Sorting & Searching",
      description: "Sorting algorithms and search techniques",
      order: 8,
    },
  ];

  // Clear existing data
  await prisma.userProgress.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.topic.deleteMany();

  // Create topics
  for (const topic of topics) {
    await prisma.topic.create({
      data: topic,
    });
  }

  console.log("✅ Topics created");

  // Get topic IDs for creating problems
  const arrayTopic = await prisma.topic.findFirst({
    where: { title: "Arrays" },
  });
  const stringTopic = await prisma.topic.findFirst({
    where: { title: "Strings" },
  });
  const linkedListTopic = await prisma.topic.findFirst({
    where: { title: "Linked Lists" },
  });
  const stackQueueTopic = await prisma.topic.findFirst({
    where: { title: "Stacks & Queues" },
  });
  const treeTopic = await prisma.topic.findFirst({
    where: { title: "Trees" },
  });
  const graphTopic = await prisma.topic.findFirst({
    where: { title: "Graphs" },
  });
  const dpTopic = await prisma.topic.findFirst({
    where: { title: "Dynamic Programming" },
  });
  const sortingTopic = await prisma.topic.findFirst({
    where: { title: "Sorting & Searching" },
  });

  // Create problems
  const problems = [
    // Arrays
    {
      title: "Two Sum",
      description: "Find two numbers in an array that add up to a target",
      difficulty: "EASY",
      youtubeLink: "https://www.youtube.com/watch?v=dRUpbt8vHpo",
      leetcodeLink: "https://leetcode.com/problems/two-sum/",
      codeforcesLink: "https://codeforces.com/problemset/problem/1/A",
      articleLink:
        "https://www.geeksforgeeks.org/given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x/",
      order: 1,
      topicId: arrayTopic!.id,
    },
    {
      title: "Maximum Subarray",
      description: "Find the contiguous subarray with the largest sum",
      difficulty: "MEDIUM",
      youtubeLink: "https://www.youtube.com/watch?v=2MmGzdiKR9Y",
      leetcodeLink: "https://leetcode.com/problems/maximum-subarray/",
      codeforcesLink: "https://codeforces.com/problemset/problem/1195/C",
      articleLink:
        "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/",
      order: 2,
      topicId: arrayTopic!.id,
    },
    {
      title: "Container With Most Water",
      description:
        "Find two lines that together with the x-axis forms a container that would hold the maximum amount of water",
      difficulty: "MEDIUM",
      youtubeLink: "https://www.youtube.com/watch?v=UuiTKBwPgAo",
      leetcodeLink: "https://leetcode.com/problems/container-with-most-water/",
      codeforcesLink: "https://codeforces.com/problemset/problem/1195/D",
      articleLink: "https://www.geeksforgeeks.org/container-with-most-water/",
      order: 3,
      topicId: arrayTopic!.id,
    },

    // Strings
    {
      title: "Valid Parentheses",
      description: "Check if a string of parentheses is valid",
      difficulty: "EASY",
      youtubeLink: "https://www.youtube.com/watch?v=WTzjTskDFMg",
      leetcodeLink: "https://leetcode.com/problems/valid-parentheses/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/A",
      articleLink:
        "https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/",
      order: 1,
      topicId: stringTopic!.id,
    },
    {
      title: "Longest Substring Without Repeating Characters",
      description:
        "Find the length of the longest substring without repeating characters",
      difficulty: "MEDIUM",
      youtubeLink: "https://www.youtube.com/watch?v=wiGpQwVHdE0",
      leetcodeLink:
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/B",
      articleLink:
        "https://www.geeksforgeeks.org/length-of-the-longest-substring-without-repeating-characters/",
      order: 2,
      topicId: stringTopic!.id,
    },

    // Linked Lists
    {
      title: "Reverse Linked List",
      description: "Reverse a singly linked list",
      difficulty: "EASY",
      youtubeLink: "https://www.youtube.com/watch?v=G0_I-ZF0S38",
      leetcodeLink: "https://leetcode.com/problems/reverse-linked-list/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/C",
      articleLink: "https://www.geeksforgeeks.org/reverse-a-linked-list/",
      order: 1,
      topicId: linkedListTopic!.id,
    },
    {
      title: "Detect Cycle in Linked List",
      description: "Detect if there is a cycle in a linked list",
      difficulty: "MEDIUM",
      youtubeLink: "https://www.youtube.com/watch?v=354J83hX7RI",
      leetcodeLink: "https://leetcode.com/problems/linked-list-cycle/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/D",
      articleLink:
        "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/",
      order: 2,
      topicId: linkedListTopic!.id,
    },

    // Stacks & Queues
    {
      title: "Implement Stack using Queues",
      description:
        "Implement a last-in-first-out (LIFO) stack using only two queues",
      difficulty: "MEDIUM",
      youtubeLink: "https://www.youtube.com/watch?v=jDZQKzEtbYQ",
      leetcodeLink:
        "https://leetcode.com/problems/implement-stack-using-queues/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/E",
      articleLink: "https://www.geeksforgeeks.org/implement-stack-using-queue/",
      order: 1,
      topicId: stackQueueTopic!.id,
    },

    // Trees
    {
      title: "Maximum Depth of Binary Tree",
      description: "Find the maximum depth (height) of a binary tree",
      difficulty: "EASY",
      youtubeLink: "https://www.youtube.com/watch?v=YT1994beXn0",
      leetcodeLink:
        "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/F",
      articleLink:
        "https://www.geeksforgeeks.org/write-a-c-program-to-find-the-maximum-depth-or-height-of-a-tree/",
      order: 1,
      topicId: treeTopic!.id,
    },
    {
      title: "Binary Tree Level Order Traversal",
      description: "Return the level order traversal of a binary tree",
      difficulty: "MEDIUM",
      youtubeLink: "https://www.youtube.com/watch?v=6ZnyEApgFYg",
      leetcodeLink:
        "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/G",
      articleLink: "https://www.geeksforgeeks.org/level-order-tree-traversal/",
      order: 2,
      topicId: treeTopic!.id,
    },

    // Graphs
    {
      title: "Number of Islands",
      description: "Count the number of islands in a 2D grid",
      difficulty: "MEDIUM",
      youtubeLink: "https://www.youtube.com/watch?v=pV2kpPD66nE",
      leetcodeLink: "https://leetcode.com/problems/number-of-islands/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/H",
      articleLink: "https://www.geeksforgeeks.org/find-number-of-islands/",
      order: 1,
      topicId: graphTopic!.id,
    },

    // Dynamic Programming
    {
      title: "Climbing Stairs",
      description: "Count the number of ways to climb n stairs",
      difficulty: "EASY",
      youtubeLink: "https://www.youtube.com/watch?v=Y0lT9Fck7qI",
      leetcodeLink: "https://leetcode.com/problems/climbing-stairs/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/I",
      articleLink: "https://www.geeksforgeeks.org/count-ways-reach-nth-stair/",
      order: 1,
      topicId: dpTopic!.id,
    },
    {
      title: "House Robber",
      description:
        "Find the maximum amount of money you can rob tonight without alerting the police",
      difficulty: "MEDIUM",
      youtubeLink: "https://www.youtube.com/watch?v=73r3KWiEvyk",
      leetcodeLink: "https://leetcode.com/problems/house-robber/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/J",
      articleLink:
        "https://www.geeksforgeeks.org/find-maximum-possible-stolen-value-houses/",
      order: 2,
      topicId: dpTopic!.id,
    },

    // Sorting & Searching
    {
      title: "Binary Search",
      description: "Implement binary search algorithm",
      difficulty: "EASY",
      youtubeLink: "https://www.youtube.com/watch?v=P3YID7liBug",
      leetcodeLink: "https://leetcode.com/problems/binary-search/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/K",
      articleLink: "https://www.geeksforgeeks.org/binary-search/",
      order: 1,
      topicId: sortingTopic!.id,
    },
    {
      title: "Merge Sort",
      description: "Implement merge sort algorithm",
      difficulty: "MEDIUM",
      youtubeLink: "https://www.youtube.com/watch?v=4VqmGXwpLqc",
      leetcodeLink: "https://leetcode.com/problems/sort-an-array/",
      codeforcesLink: "https://codeforces.com/problemset/problem/26/L",
      articleLink: "https://www.geeksforgeeks.org/merge-sort/",
      order: 2,
      topicId: sortingTopic!.id,
    },
  ];

  for (const problem of problems) {
    await prisma.problem.create({
      data: problem,
    });
  }

  console.log("✅ Problems created");
  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
