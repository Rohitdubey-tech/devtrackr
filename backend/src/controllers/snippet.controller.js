import Snippet from "../models/Snippet.js";
import { AppError } from "../middleware/errorHandler.js";

// @desc    Get all snippets for current user
// @route   GET /api/v1/snippets
export const getSnippets = async (req, res, next) => {
  try {
    const { search, language, tag, favorite, sort = "-createdAt" } = req.query;

    const query = { user: req.user._id };

    // Full-text search
    if (search) {
      query.$text = { $search: search };
    }

    // Language filter
    if (language) {
      query.language = language.toLowerCase();
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    // Favorites filter
    if (favorite === "true") {
      query.isFavorite = true;
    }

    const snippets = await Snippet.find(query).sort(sort);

    // Get aggregated stats
    const stats = await Snippet.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalSnippets: { $sum: 1 },
          totalFavorites: { $sum: { $cond: ["$isFavorite", 1, 0] } },
          languages: { $addToSet: "$language" },
          allTags: { $push: "$tags" },
        },
      },
    ]);

    const aggregatedStats = stats[0] || {
      totalSnippets: 0,
      totalFavorites: 0,
      languages: [],
      allTags: [],
    };

    // Flatten and deduplicate tags
    const uniqueTags = [...new Set((aggregatedStats.allTags || []).flat())].sort();

    res.json({
      success: true,
      data: {
        snippets,
        stats: {
          total: aggregatedStats.totalSnippets,
          favorites: aggregatedStats.totalFavorites,
          languages: aggregatedStats.languages.sort(),
          tags: uniqueTags,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a snippet
// @route   POST /api/v1/snippets
export const createSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.create({
      ...req.validatedBody,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { snippet },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a snippet
// @route   PUT /api/v1/snippets/:id
export const updateSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.validatedBody,
      { new: true, runValidators: true }
    );

    if (!snippet) {
      throw new AppError("Snippet not found.", 404);
    }

    res.json({
      success: true,
      data: { snippet },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle snippet favorite
// @route   PATCH /api/v1/snippets/:id/favorite
export const toggleFavorite = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!snippet) {
      throw new AppError("Snippet not found.", 404);
    }

    snippet.isFavorite = !snippet.isFavorite;
    await snippet.save();

    res.json({
      success: true,
      data: { snippet },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a snippet
// @route   DELETE /api/v1/snippets/:id
export const deleteSnippet = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!snippet) {
      throw new AppError("Snippet not found.", 404);
    }

    res.json({
      success: true,
      message: "Snippet deleted",
    });
  } catch (error) {
    next(error);
  }
};
