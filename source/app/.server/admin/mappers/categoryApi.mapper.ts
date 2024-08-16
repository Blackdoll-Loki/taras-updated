import {Category} from '@prisma/client';
import {TCategoryDto} from '~/.server/admin/dto/category.dto';

type ExcludedFields = 'description' | 'image' | 'slug' | 'createdAt' | 'updatedAt' | 'deletedAt'
type categoryApiDTO = Omit<TCategoryDto, ExcludedFields>


export const categoryApiMapper = (category: Category): categoryApiDTO => {
  return {
    id: String(category.id),
    title: category.title,
  };
};
