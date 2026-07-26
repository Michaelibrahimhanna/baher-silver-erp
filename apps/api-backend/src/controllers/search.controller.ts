import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';

export class SearchController {
  static async universalSearch(req: Request, res: Response) {
    try {
      const q = (req.query.q || req.query.query || '') as string;
      const data = await SearchService.universalSearch(q);
      res.json({ success: true, query: q, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
