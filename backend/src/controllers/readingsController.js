import { ReadingsModel } from "../models/readingsModel.js";

export const ReadingsController = {
  async list(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          error: "Invalid pagination parameters",
        });
      }

      const result = await ReadingsModel.list(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async latest(req, res) {
    try {
      const data = await ReadingsModel.latest();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const created = await ReadingsModel.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
