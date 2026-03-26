import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateData = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      // ⚠️ ÉP KIỂU TUYỆT ĐỐI: Báo cho TypeScript biết đây là ZodError chứa mọi loại dữ liệu (any)
      const errorData = result.error as z.ZodError<any>;

      res.status(400).json({
        status: "error",
        message: "Dữ liệu đầu vào không hợp lệ",
        // Giờ thì TypeScript đã cho phép bạn gọi .issues thoải mái
        errors: errorData.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    next();
  };
};
