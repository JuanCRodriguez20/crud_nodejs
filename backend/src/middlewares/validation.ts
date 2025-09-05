import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = plainToClass(dtoClass, req.body);
      const errors: ValidationError[] = await validate(dto);

      if (errors.length > 0) {
        const errorMessages = errors.map(error => {
          return Object.values(error.constraints || {}).join(', ');
        });

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages
        });
        return;
      }

      req.body = dto;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error during validation'
      });
    }
  };
};

export const validateEntity = async (entity: any): Promise<string[]> => {
  const errors: ValidationError[] = await validate(entity);
  return errors.map(error => Object.values(error.constraints || {}).join(', '));
};