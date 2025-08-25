import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get all problems with user progress
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { topicId, difficulty } = req.query;

    const whereClause: any = {};
    if (topicId) whereClause.topicId = topicId as string;
    if (difficulty) whereClause.difficulty = difficulty as string;

    const problems = await prisma.problem.findMany({
      where: whereClause,
      include: {
        topic: true,
        progress: userId
          ? {
              where: { userId },
            }
          : false,
      },
      orderBy: [{ topic: { order: "asc" } }, { order: "asc" }],
    });

    // Transform data to include progress information
    const problemsWithProgress = problems.map((problem) => ({
      ...problem,
      isCompleted: userId
        ? problem.progress.length > 0 && problem.progress[0].completed
        : false,
    }));

    res.json({ problems: problemsWithProgress });
  } catch (error) {
    console.error("Get problems error:", error);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

// Get single problem
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        topic: true,
        progress: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Transform data to include progress information
    const problemWithProgress = {
      ...problem,
      isCompleted: userId
        ? problem.progress.length > 0 && problem.progress[0].completed
        : false,
    };

    res.json({ problem: problemWithProgress });
  } catch (error) {
    console.error("Get problem error:", error);
    res.status(500).json({ error: "Failed to fetch problem" });
  }
});

// Create problem (admin only)
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      difficulty,
      youtubeLink,
      leetcodeLink,
      codeforcesLink,
      articleLink,
      order,
      topicId,
    } = req.body;

    if (!title || !topicId) {
      return res.status(400).json({ error: "Title and topicId are required" });
    }

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        youtubeLink,
        leetcodeLink,
        codeforcesLink,
        articleLink,
        order: order || 0,
        topicId,
      },
      include: {
        topic: true,
      },
    });

    res.status(201).json({ problem });
  } catch (error) {
    console.error("Create problem error:", error);
    res.status(500).json({ error: "Failed to create problem" });
  }
});

// Update problem (admin only)
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      difficulty,
      youtubeLink,
      leetcodeLink,
      codeforcesLink,
      articleLink,
      order,
      topicId,
    } = req.body;

    const problem = await prisma.problem.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        youtubeLink,
        leetcodeLink,
        codeforcesLink,
        articleLink,
        order,
        topicId,
      },
      include: {
        topic: true,
      },
    });

    res.json({ problem });
  } catch (error) {
    console.error("Update problem error:", error);
    res.status(500).json({ error: "Failed to update problem" });
  }
});

// Delete problem (admin only)
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.problem.delete({
        where: { id },
      });

      res.json({ message: "Problem deleted successfully" });
    } catch (error) {
      console.error("Delete problem error:", error);
      res.status(500).json({ error: "Failed to delete problem" });
    }
  }
);

export default router;
