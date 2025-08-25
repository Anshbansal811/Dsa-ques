import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get all topics with problems and user progress
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const topics = await prisma.topic.findMany({
      include: {
        problems: {
          orderBy: { order: "asc" },
          include: {
            progress: userId
              ? {
                  where: { userId },
                }
              : false,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    // Transform data to include progress information
    const topicsWithProgress = topics.map((topic) => ({
      ...topic,
      problems: topic.problems.map((problem) => ({
        ...problem,
        isCompleted: userId
          ? problem.progress.length > 0 && problem.progress[0].completed
          : false,
      })),
    }));

    res.json({ topics: topicsWithProgress });
  } catch (error) {
    console.error("Get topics error:", error);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

// Get single topic with problems
router.get("/:id", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        problems: {
          orderBy: { order: "asc" },
          include: {
            progress: userId
              ? {
                  where: { userId },
                }
              : false,
          },
        },
      },
    });

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // Transform data to include progress information
    const topicWithProgress = {
      ...topic,
      problems: topic.problems.map((problem) => ({
        ...problem,
        isCompleted: userId
          ? problem.progress.length > 0 && problem.progress[0].completed
          : false,
      })),
    };

    res.json({ topic: topicWithProgress });
  } catch (error) {
    console.error("Get topic error:", error);
    res.status(500).json({ error: "Failed to fetch topic" });
  }
});

// Create topic (admin only)
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, description, order } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        description,
        order: order || 0,
      },
    });

    res.status(201).json({ topic });
  } catch (error) {
    console.error("Create topic error:", error);
    res.status(500).json({ error: "Failed to create topic" });
  }
});

// Update topic (admin only)
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;

    const topic = await prisma.topic.update({
      where: { id },
      data: {
        title,
        description,
        order,
      },
    });

    res.json({ topic });
  } catch (error) {
    console.error("Update topic error:", error);
    res.status(500).json({ error: "Failed to update topic" });
  }
});

// Delete topic (admin only)
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.topic.delete({
        where: { id },
      });

      res.json({ message: "Topic deleted successfully" });
    } catch (error) {
      console.error("Delete topic error:", error);
      res.status(500).json({ error: "Failed to delete topic" });
    }
  }
);

export default router;
