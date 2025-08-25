import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get user progress
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        problem: {
          include: {
            topic: true,
          },
        },
      },
      orderBy: [
        { problem: { topic: { order: "asc" } } },
        { problem: { order: "asc" } },
      ],
    });

    res.json({ progress });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// Get user progress summary
router.get(
  "/summary",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      // Get total problems count
      const totalProblems = await prisma.problem.count();

      // Get completed problems count
      const completedProblems = await prisma.userProgress.count({
        where: {
          userId,
          completed: true,
        },
      });

      // Get progress by difficulty
      const progressByDifficulty = await prisma.userProgress.groupBy({
        by: ["completed"],
        where: {
          userId,
          problem: {
            difficulty: "EASY",
          },
        },
        _count: true,
      });

      const mediumProgress = await prisma.userProgress.groupBy({
        by: ["completed"],
        where: {
          userId,
          problem: {
            difficulty: "MEDIUM",
          },
        },
        _count: true,
      });

      const hardProgress = await prisma.userProgress.groupBy({
        by: ["completed"],
        where: {
          userId,
          problem: {
            difficulty: "HARD",
          },
        },
        _count: true,
      });

      // Get progress by topic
      const progressByTopic = await prisma.userProgress.groupBy({
        by: ["completed"],
        where: {
          userId,
        },
        _count: {
          problemId: true,
        },
      });

      const summary = {
        totalProblems,
        completedProblems,
        completionPercentage:
          totalProblems > 0
            ? Math.round((completedProblems / totalProblems) * 100)
            : 0,
        byDifficulty: {
          easy: {
            completed:
              progressByDifficulty.find((p: any) => p.completed)?._count || 0,
            total: progressByDifficulty.reduce(
              (sum: number, p: any) => sum + p._count,
              0
            ),
          },
          medium: {
            completed:
              mediumProgress.find((p: any) => p.completed)?._count || 0,
            total: mediumProgress.reduce(
              (sum: number, p: any) => sum + p._count,
              0
            ),
          },
          hard: {
            completed: hardProgress.find((p: any) => p.completed)?._count || 0,
            total: hardProgress.reduce(
              (sum: number, p: any) => sum + p._count,
              0
            ),
          },
        },
      };

      res.json({ summary });
    } catch (error) {
      console.error("Get progress summary error:", error);
      res.status(500).json({ error: "Failed to fetch progress summary" });
    }
  }
);

// Toggle problem completion
router.post(
  "/toggle/:problemId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { problemId } = req.params;

      // Check if problem exists
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
      });

      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }

      // Check if progress record exists
      const existingProgress = await prisma.userProgress.findUnique({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
      });

      let progress;
      if (existingProgress) {
        // Toggle completion status
        progress = await prisma.userProgress.update({
          where: {
            userId_problemId: {
              userId,
              problemId,
            },
          },
          data: {
            completed: !existingProgress.completed,
          },
          include: {
            problem: {
              include: {
                topic: true,
              },
            },
          },
        });
      } else {
        // Create new progress record
        progress = await prisma.userProgress.create({
          data: {
            userId,
            problemId,
            completed: true,
          },
          include: {
            problem: {
              include: {
                topic: true,
              },
            },
          },
        });
      }

      res.json({ progress });
    } catch (error) {
      console.error("Toggle progress error:", error);
      res.status(500).json({ error: "Failed to toggle progress" });
    }
  }
);

// Mark problem as completed
router.post(
  "/:problemId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { problemId } = req.params;

      // Check if problem exists
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
      });

      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }

      // Upsert progress record
      const progress = await prisma.userProgress.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {
          completed: true,
        },
        create: {
          userId,
          problemId,
          completed: true,
        },
        include: {
          problem: {
            include: {
              topic: true,
            },
          },
        },
      });

      res.json({ progress });
    } catch (error) {
      console.error("Mark progress error:", error);
      res.status(500).json({ error: "Failed to mark progress" });
    }
  }
);

// Reset all progress
router.delete("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    await prisma.userProgress.deleteMany({
      where: { userId },
    });

    res.json({ message: "Progress reset successfully" });
  } catch (error) {
    console.error("Reset progress error:", error);
    res.status(500).json({ error: "Failed to reset progress" });
  }
});

export default router;
